const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    genre: {
        type: String,
        enum: ['General','Entertainment', 'Business', 'Education','Sports', 'Technology', 'Others'],
        default: 'General'
    },
    communityId: {
        type: String,
    },
    image: {
        type: String,
        default: 'default_community_img.png'
    },
    privacy: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;