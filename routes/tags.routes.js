const { Router } = require('express')
const { TagController } = require('../controllers/index.controller')
const router = Router()

router.get('/', TagController.home)
router.get('/:tags', TagController.getTags)

module.exports = router