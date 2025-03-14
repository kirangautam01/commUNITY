const express = require('express');
const router = express.Router();
const { createUser, checkEmailExists,otpVerify } = require('../controllers/userController');
const upload = require('../config/multerConfig')

// User routes
router.post('/register', upload.single('profilePic'), createUser);
router.post('/email_exist', checkEmailExists);
router.post('/otp_verify',otpVerify);

module.exports = router;
