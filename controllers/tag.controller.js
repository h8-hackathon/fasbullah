const { Tag, Post, User } = require('../models')

class TagController {
  static home(req, res) {
    res.redirect('/')
  }

  static getTags(req, res) {
    const { user, role } = req.session
    Tag.findOne({
      where: {
        name: req.params.tags,
      },
      include: { model: Post, include: User },
    }).then((tags) => {
      res.render('profile/tags', { tags, user, role })
    })
  }
}

module.exports = TagController
