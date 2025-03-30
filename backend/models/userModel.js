const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    profilePic: {
        type: String // URL or file path to the profile picture
    },
    memberOf: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community' // References the Community model
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
