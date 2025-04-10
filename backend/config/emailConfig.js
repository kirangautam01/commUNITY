// Configure Nodemailer transporter
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'romangautam71399@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;
