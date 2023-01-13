const { Router } = require('express')
const multer = require('multer')
const { ProfileController } = require('../controllers/index.controller')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = Router()

router.get('/', ProfileController.profile)

router.get('/:id', ProfileController.profileDetail)

router.get('/:id/cancel', ProfileController.friendsRemove)
router.get('/:id/remove', ProfileController.friendsRemove)
router.get('/:id/accept', ProfileController.friendsRequestAccept)

router.get('/:id/add', ProfileController.profileAddFriend)

router.get('/:id/edit', ProfileController.profileEditForm)
router.post('/:id/edit', upload.fields([{ name: 'cover'}, {name: 'profile'}]), ProfileController.profileEdit)

router.get('/:id/friends', ProfileController.friends)
router.get('/:id/friends/request', ProfileController.friendsRequest)




module.exports = router
