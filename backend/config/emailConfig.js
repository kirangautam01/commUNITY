// Configure Nodemailer transporter
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'romangautam71399@gmail.com',
        pass: 'trzh qjfs ysyh ueqn'
    },
});

module.exports = transporter;
