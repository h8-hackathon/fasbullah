const { Router } = require('express')
const { PostController } = require('../controllers/index.controller')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = Router()

router.get('/', PostController.toHome)
router.get('/new', PostController.newPostForm)
router.post('/new', upload.single('image'), PostController.newPost)

router.get('/:id', PostController.postDetail)
router.post('/:id', PostController.postComment) 

router.get('/:id/edit', PostController.postEditForm)
router.post('/:id/edit', PostController.postEdit)

router.post('/:id/delete', PostController.postEdit)

module.exports = router
