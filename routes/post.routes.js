const { Router } = require('express')
const { PostController } = require('../controllers/index.controller')

const router = Router()

router.get('/', PostController.toHome)
router.get('/new', PostController.newPostForm)

router.get('/:id', PostController.postDetail)
router.post('/:id', PostController.postComment) // post a comment

router.get('/:id/edit', PostController.postEditForm)
router.post('/:id/edit', PostController.postEdit)
module.exports = router
