const { Op } = require('sequelize')
const { User, Post, Friendship } = require('../models')

class ProfileController {
  static profile(req, res) {
    const id = req.session.user.id
    res.redirect(`/profile/${id}`)
  }

  static profileDetail(req, res) {
    const { id } = req.params
    User.findByPk(id, {
      include: Post,
    })
      .then((user) => {
        res.render('profile/userProfile', { user, self: req.session.user.id == id })
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static profileEditForm(req, res) {
    const { id } = req.params

    if (id !== req.session.user.id) {
      res.redirect(401, '/profile/' + id)
      return
    }

    User.findByPk(id)
      .then((user) => {
        res.send(user)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static profileEdit(req, res) {
    const { id } = req.params
    if (id !== req.session.user.id) {
      res.redirect(401, '/profile/' + id)
      return
    }
    const { name, profilePicture, coverPhoto, bio } = req.body
    User.update({ name, profilePicture, coverPhoto, bio }, { where: { id } })
      .then(() => {
        res.redirect(`/profile/${id}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static friends(req, res) {
    const { id } = req.params
    Friendship.findAll({
      where: {
        [Op.or]: [{ RequesterId: id }, { RequestedId: id }],
        isConfirmed: true,
      },
      attributes: ['RequesterId', 'RequestedId'],
    })
      .then((friends) => {
        const friendsId = friends.map((friend) => {
          if (friend.RequesterId === +id) {
            return friend.RequestedId
          } else {
            return friend.RequesterId
          }
        })

        return User.findAll({
          where: {
            id: {
              [Op.in]: friendsId,
            },
          },
        })
      })
      .then((friends) => {
        res.send(friends)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static friendsRequest(req, res) {
    const { id } = req.params
    if(req.session.user.id !== +id) {
      res.redirect(401, '/profile/' + id)
      return
    }

    Friendship.findAll({
      where: {
        RequestedId: id,
        isConfirmed: false,
      },
      attributes: ['RequesterId', 'RequestedId'],
    })
      .then((friends) => {
        const friendsId = friends.map((friend) => {
          if (friend.RequesterId === +id) {
            return friend.RequestedId
          } else {
            return friend.RequesterId
          }
        })

        return User.findAll({
          where: {
            id: {
              [Op.in]: friendsId,
            },
          },
        })
      })
      .then((friends) => {
        res.send(friends)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static profileAddFriend(req, res) {
    const { id } = req.params
    const { user } = req.session
    Friendship.create({
      RequesterId: user.id,
      RequestedId: id,
      isConfimed: false,
    })
      .then(() => {
        res.redirect(`/profile/${id}`)
      })
      .catch((err) => {
        if (err.name && err.errors) {
          res.redirect(
            `/profile/${id}?errors=${err.errors.map(({ message }) => message)}`
          )
          return
        }
        res.status(500).send(err)
      })
  }

  static friendsRemove(req, res) {
    const { id, friendsId } = req.params
    Friendship.destroy({
      where: {
        [Op.or]: [
          { RequesterId: id, RequestedId: friendsId },
          { RequesterId: friendsId, RequestedId: id },
        ],
      },
    })
      .then(() => {
        res.redirect(`/profile/${friendsId}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static friendsRequestAccept(req, res) {
    const { id, friendsId } = req.params
    Friendship.update(
      { isConfirmed: true },
      {
        where: {
          RequesterId: friendsId,
          RequestedId: +id,
        },
      }
    )
      .then(() => {
        res.redirect(`/profile/${friendsId}/friends/request`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
    }

   
    static friendsRequestReject(req, res) {
      const { id, friendsId } = req.params
      Friendship.destroy({
        where: {
          RequesterId: friendsId,
          RequestedId: +id,
        },
      })
        .then(() => {
          res.redirect(`/profile/${friendsId}/friends/request`)
        })
        .catch((err) => {
          res.status(500).send(err)
        })
    }

}

module.exports = ProfileController
