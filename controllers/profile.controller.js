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
        res.send({ user, self: user.id === +id })
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
    User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Requester',
          through: { where: { isConfimed: true } },
        },
        {
          model: User,
          as: 'Requested',
          through: { where: { isConfimed: true } },
        },
      ],
    })
      .then((user) => {
        res.send(user)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static friendsRequest(req, res) {

  }
}

module.exports = ProfileController
