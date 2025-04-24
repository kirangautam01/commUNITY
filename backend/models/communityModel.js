const mongoose = require('mongoose');
const Event = require('./eventsModel');
const Notice = require('./noticeModel');

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
        enum: ['General', 'Entertainment', 'Business', 'Education', 'Sports', 'Technology', 'Others'],
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

// Pre-delete middleware: Remove it from users' memberOf array, related events and notices
communitySchema.pre("findOneAndDelete", async function (next) {
    const communityId = this.getQuery()._id;

    try {
        // Remove community reference from users
        await mongoose.model("User").updateMany(
            { memberOf: communityId },
            { $pull: { memberOf: communityId } }
        );

        // Delete related events
        await Event.deleteMany({ communityId });

        // Delete related notices
        await Notice.deleteMany({ communityId });

        next();
    } catch (error) {
        next(error);
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;