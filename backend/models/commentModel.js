const mongoose = require('mongoose');
const Community = require('./communityModel');

const commentSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentText: {
        type: String,
        required: true,
        trim: true
    },
    communityId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
