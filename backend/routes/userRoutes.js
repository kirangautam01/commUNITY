const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const upload = require('../config/multerConfig')

// User routes
router.post('/register', upload.single('profilePic'), createUser);

module.exports = router;
