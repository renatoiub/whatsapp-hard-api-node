const express = require('express')
const controller = require('../controllers/misc.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/onwhatsapp').post(keyVerify, loginVerify, controller.onWhatsapp)
router.route('/downProfile').post(keyVerify, loginVerify, controller.downProfile)
router.route('/getStatus').post(keyVerify, loginVerify, controller.getStatus)
router.route('/blockUser').post(keyVerify, loginVerify, controller.blockUser)
router.route('/contacts').get(keyVerify, loginVerify, controller.contacts)
router.route('/chats').post(keyVerify, loginVerify, controller.chats)
router.route('/mystatus').post(keyVerify, loginVerify, controller.mystatus)
router
    .route('/updateProfilePicture')
    .post(keyVerify, loginVerify, controller.updateProfilePicture)
router
    .route('/getuserorgroupbyid')
    .get(keyVerify, loginVerify, controller.getUserOrGroupById)
module.exports = router
