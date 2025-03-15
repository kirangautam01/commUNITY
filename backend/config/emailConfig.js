// Configure Nodemailer transporter
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'romangautam71399@gmail.com',
        pass: 'xpeq dxhj wpkh fzou'
    },
});

module.exports = transporter;
