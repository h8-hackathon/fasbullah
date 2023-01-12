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
    .then(post => {
      res.redirect(`/post/${post.id}`)
    })
    .catch(err => {
      res.status(500).send(err)
    })

  }

  static postDetail(req, res) {
    const { id } = req.params
    Post.findByPk(id, {
      include: Comment
    })
    .then(post => {
      res.send(post)
    })
    .catch(err => {
      res.status(500).send(err)
    })
  }


  static postEditForm(req, res) {
    res.send('edit post form')
  }

  static postEdit(req, res) {
    res.send('edit post')
  }



  
}

module.exports = PostController