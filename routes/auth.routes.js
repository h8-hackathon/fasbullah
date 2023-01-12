const { Router } = require('express')
const { AuthController } = require('../controllers/index.controller')
const router = Router()

router.get('/login', AuthController.loginForm)
router.post('/login', AuthController.login)

router.get('/register', AuthController.registerForm)
router.post('/register', AuthController.register)

module.exports = router
