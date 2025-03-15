const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const upload = require('../config/multerConfig')
const { checkEmailExists, sentOtp, otpVerify, loginUser } = require('../controllers/authController')
const { createCommunity, joinCommunity } = require('../controllers/communityController');

//auth routes
router.post('/email_exist', checkEmailExists);
router.post('/otp_sent', sentOtp);
router.post('/otp_verify', otpVerify);

// User routes
router.post('/register', upload.single('profilePic'), createUser);
router.post('/login', loginUser);

//communities
router.post('/create_community', upload.single('image'), createCommunity);
router.post('/join_community/:communityId', joinCommunity);

module.exports = router;
