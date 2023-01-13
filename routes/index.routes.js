const { Router } = require('express')

const postRouter = require('./post.routes')
const authRouter = require('./auth.routes')
const profileRouter = require('./profile.routes')
const tagRouter = require('./tags.routes')

const { HomeController } = require('../controllers/index.controller')
const router = Router()

router.get('/', HomeController.home)
router.use(authRouter)

router.use((req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect(401, '/login')
  }
})

router.use('/post', postRouter)
router.use('/profile', profileRouter)
router.use('/tags', tagRouter)

module.exports = router
