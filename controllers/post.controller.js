const { Post } = require('../models')

class PostController {
  static toHome(req, res) {
    res.redirect('/')
  }

  static newPostForm(req, res) {
    res.send('new post form')
  }

  static newPost(req, res) {
    const { UserId } = req.session
    if(!UserId) {
      res.redirect(401, '/login?error=Unauthorized')
      return
    }

    const { post, imageURL } = req.body
    Post.create({
      post,
      imageURL,
      UserId
    })

  }
}

module.exports = PostController