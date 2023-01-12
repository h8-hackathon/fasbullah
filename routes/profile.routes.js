const { Router } = require('express')

const { ProfileController } = require('../controllers/index.controller')

const router = Router()

router.get('/', ProfileController.profile)

router.get('/:id', ProfileController.profileDetail)

router.get('/:id/edit', ProfileController.profileEditForm)
router.post('/:id/edit', ProfileController.profileEdit)

router.get('/:id/friends', ProfileController.friends)
router.get('/:id/friends/request', ProfileController.friendsRequest)



module.exports = router
