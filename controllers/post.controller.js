const { tagsGetter } = require('../helpers')
const { Post, Tag, PostTags, Comment } = require('../models')

class PostController {
  static toHome(req, res) {
    res.redirect('/')
  }

  static newPostForm(req, res) {
    res.render('post/form-add')
  }

  static newPost(req, res) {
    
    if (!req.session.loggedIn) {
      res.redirect(401, '/login?error=Unauthorized')
      return
    }

    const { post, imageURL } = req.body
    let data = {}

    Post.create({
      post,
      imageURL,
      UserId: req.session.user.id,
    })
      .then((result) => {
        data = result

        // making tags
        const tags = tagsGetter(post)
        const tagsPromise = tags.map((tag) => {
          return Tag.findOrCreate({ where: { tag } })
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
    Post.findByPk(id, {
      include: Comment,
    })
      .then((post) => {
        res.send(post)
        
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
    const { UserId } = req.session

    Comment.create({
      comment,
      PostId: id,
      UserId,
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
