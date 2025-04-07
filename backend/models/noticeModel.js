const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true, // Author is required
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community', // Reference to the Community model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
