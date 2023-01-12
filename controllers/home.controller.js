const { User, Friendship, Post } = require('../models')
const { Op } = require('sequelize')

class HomeController {
  static home(req, res) {
    const page = req.query.page || 0
    if (!req.session.loggedIn) {
      res.redirect('/login')
      return
    }

    const offset = +page * 10;
    const limit = 10;

    console.log(req.session)
    const { user, role } = req.session
    const { id } = user

    Friendship.findAll({
      where: {
        [Op.or]: [{ RequesterId: id }, { RequestedId: id }],
      },
      attributes: ['RequesterId', 'RequestedId'],
      
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
          include: User,
          order: [['createdAt', 'DESC']],
          offset,
          limit,
        })
      })
      .then((posts) => {
        res.render('post/post', { user, role, posts })
      })
      .catch((err) => {
        console.log(err)
        res.send(err)
      })
  }
}

module.exports = HomeController
