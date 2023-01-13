const { Op } = require('sequelize')
const { User, Post, Friendship } = require('../models')

class ProfileController {
  static profile(req, res) {
    const id = req.session.user.id
    const { search } = req.query
    if (!search) return res.redirect(`/profile/${id}`)

    User.findAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
        id: { [Op.ne]: id },
      },
    })
      .then((users) => {
        // return res.send(users)
        res.render('profile/searchResult', {
          users,
          currentUser: req.session.user,
        })
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }
  static profileDetail(req, res) {
    const { id } = req.params

    const self = req.session.user.id == id
    let data = {}
    User.findByPk(id, {
      include: { model: Post, separate: true, order: [['createdAt', 'DESC']]},
    })
      .then((user) => {
        if (self)
          return res.render('profile/userProfile', {
            user,
            currentUser: req.session.user,
            self,
          })
        data = user
        return Friendship.isMyFriend(req.session.user.id, id)
      })
      .then((status) => {
        res.render('profile/userProfile', {
          user: data,
          currentUser: req.session.user,
          self,
          status,
        })
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static profileEditForm(req, res) {
    const { id } = req.params

    if (+id !== req.session.user.id) {
      res.redirect(401, '/profile/' + id)
      return
    }

    User.findByPk(id)
      .then((user) => {
        res.render('profile/edit-form',{user})
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static profileEdit(req, res) {
    const { id } = req.params
    if (+id !== req.session.user.id) {
      res.redirect(401, '/profile/' + id)
      return
    }
    console.log(req.files)
    const { name, bio } = req.body
    User.upload(req.files)
      .then((result) => {
        let updateData = { name, bio }
        if(result) {
          updateData = { ...updateData, ...result }
        }

        return User.update(updateData, { where: { id } })
      })
      .then(() => {
        res.redirect(`/profile/${id}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static friends(req, res) {
    const { id } = req.params
    const { user } = req.session

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
      .then((users) => {
        res.render('profile/friendList', { user, users })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static friendsRequest(req, res) {
    const { id } = req.params
    if (req.session.user.id !== +id) {
      res.redirect(401, '/profile/' + id)
      return
    }

    const { user } = req.session

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
      .then((users) => {
        res.render('profile/friendRequest', { user, users })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static profileAddFriend(req, res) {
    const { id } = req.params
    const { user } = req.session
    Friendship.create(
      {
        RequesterId: user.id,
        RequestedId: id,
        isConfimed: false,
      },
      {
        returning: false,
      }
    )
      .then(() => {
        res.redirect(`/profile/${id}`)
      })
      .catch((err) => {
        console.log(err)
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
    const friendsId = req.params.id
    const { id } = req.session.user

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
    const friendsId = req.params.id
    const { id } = req.session.user

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
        res.redirect(`/profile/${friendsId}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static friendsRequestReject(req, res) {
    const friendsId = req.params.id
    const { id } = req.session.user

    Friendship.destroy({
      where: {
        RequesterId: friendsId,
        RequestedId: +id,
      },
    })
      .then(() => {
        res.redirect(`/profile/${friendsId}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }
}

module.exports = ProfileController
