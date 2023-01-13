const { imgbox } = require('imgbox')
const { tagsGetter } = require('../helpers')
const { Post, Tag, PostTags, Comment, User } = require('../models')

class PostController {
  static toHome(req, res) {
    res.redirect('/')
  }

  static newPostForm(req, res) {
    const { user } = req.session
    res.render('post/form-add', { user })
  }

  static newPost(req, res) {
    if (!req.session.loggedIn) {
      res.redirect(401, '/login?error=Unauthorized')
      return
    }

    const { post } = req.body
    let data = {}

    Post.uploadImage(req.file)
      .then((imageURL) => {
        return Post.create({
          post,
          imageURL,
          UserId: req.session.user.id,
        })
      })
      .then((result) => {
        data = result

        // making tags
        const tags = tagsGetter(post)
        const tagsPromise = tags.map((name) => {
          return Tag.findOrCreate({ where: { name } })
        })

        return Promise.all(tagsPromise)
      })
      .then((tags) => {
        // add to relation postTags
        const postTagsPromise = tags.map((tag) => {
          return PostTags.create({
            PostId: data.id,
            TagId: tag[0].id,
          })
        })

        return Promise.all(postTagsPromise)
      })
      .then(() => {
        res.redirect(`/post/${data.id}`)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static postDetail(req, res) {
    const { id } = req.params
    const { user } = req.session
    Post.findByPk(id, {
      include: [{model: Comment, include: User}, User],
    })
      .then((post) => {
        res.render('post/postById', { post, user })

        post.increment('views')
        post.save()
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static postEditForm(req, res) {
    res.send('edit post form')
  }

  static postEdit(req, res) {
    const { post, imageURL } = req.body
    const { id } = req.params

    Post.findByPk(id)
      .then((postResult) => {
        return postResult.update({ post, imageURL })
      })
      .then(() => {
        res.redirect(`/post/${id}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }

  static postComment(req, res) {
    const { id } = req.params
    const { comment } = req.body

    Comment.create({
      comment,
      PostId: id,
      UserId: req.session.user.id,
    })
      .then(() => {
        res.redirect(`/post/${id}`)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  }
}

module.exports = PostController
