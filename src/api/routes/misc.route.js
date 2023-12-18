const express = require('express')
const controller = require('../controllers/misc.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/onwhatsapp').get(keyVerify, loginVerify, controller.onWhatsapp)
router.route('/downProfile').get(keyVerify, loginVerify, controller.downProfile)
router.route('/getStatus').get(keyVerify, loginVerify, controller.getStatus)
router.route('/blockUser').get(keyVerify, loginVerify, controller.blockUser)
router.route('/contacts').get(keyVerify, loginVerify, controller.contacts)
router.route('/chats').get(keyVerify, loginVerify, controller.chats)
router.route('/mystatus').post(keyVerify, loginVerify, controller.mystatus)
router
    .route('/updateProfilePicture')
    .post(keyVerify, loginVerify, controller.updateProfilePicture)
router
    .route('/getuserorgroupbyid')
    .get(keyVerify, loginVerify, controller.getUserOrGroupById)
module.exports = router
