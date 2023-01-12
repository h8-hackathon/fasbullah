const { Router } = require('express')
const { HomeController } = require('../controllers')
const router = Router()

router.get('/', HomeController.home)

module.exports = router
