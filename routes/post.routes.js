const { Router } = require('express')
const { PostController } = require('../controllers/index.controller')

const router = Router()

router.get('/', PostController.toHome)
router.get('/new', PostController.newPostForm)

module.exports = router
