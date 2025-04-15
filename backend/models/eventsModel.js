const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
