const { User, Friendship, Post } = require('../models')
const { Op } = require('sequelize')

class HomeController {
  static home(req, res) {
    if (!req.session.loggedIn) {
      res.redirect('/login')
      return
    }
    
    const page = req.query.page || 0 // /?page=1
    
    const postPerPage = 10

    const offset = +page * postPerPage;
    const limit = postPerPage;

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
        
        return Post.getTimeLinePosts(otherUserIds, offset, limit, User)
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
