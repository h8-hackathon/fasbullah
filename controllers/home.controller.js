const { User, Friendship, Post } = require('../models')

class HomeController {
  static home(req, res) {
    if (!req.session.loggedIn) {
      res.redirect('/login')
      return
    }

    const { user, role } = req.session
    const { id } = user

    Friendship.findAll({
      where: {
        [Op.or]: [{ RequesterId: id }, { RequestedId: id }],
      },
    })
      .then((friendships) => {
        const otherUserIds = friendships.map((friendship) => {
          if (friendship.RequesterId === id) {
            return friendship.RequestedId
          } else {
            return friendship.RequesterId
          }
        })

        return Post.findAll({
          where: {
            UserId: {
              [Op.in]: otherUserIds,
            },
          },
          order: [['createdAt', 'DESC']],
        })
      })
      .then((posts) => {
        res.send({ user, role, posts })
      })
      .catch((err) => {
        res.send(err)
      })
  }
}

module.exports = HomeController
