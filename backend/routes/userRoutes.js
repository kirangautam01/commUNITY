const express = require('express');
const router = express.Router();
const { createUser,userInfo } = require('../controllers/userController');
const upload = require('../config/multerConfig')
const { sentOtp, otpVerify, loginUser } = require('../controllers/authController')
const { createCommunity, joinCommunity } = require('../controllers/communityController');
const authenticateUser= require('../middleware/myMiddleware');

//auth routes
router.post('/otp_sent', sentOtp);  //send otp
router.post('/otp_verify', otpVerify); //verify otp

// User routes
router.post('/register', upload.single('profilePic'), createUser); //signup
router.post('/login', loginUser); //login

//communities
router.post('/create_community', upload.single('image'), createCommunity); //create community
router.post('/join_community/:communityId', joinCommunity); //join community

//account page routes
router.get('/profile',authenticateUser,userInfo)

module.exports = router;
