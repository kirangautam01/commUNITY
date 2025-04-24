const mongoose = require('mongoose');
const Comment = require('./commentModel');

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

// Middleware to delete all comments related to this event
eventSchema.pre('findOneAndDelete', async function (next) {
    const eventId = this.getQuery()._id;
  
    try {
      await Comment.deleteMany({ eventId });
      next();
    } catch (err) {
      next(err);
    }
  });

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
