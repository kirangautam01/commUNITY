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

// Pre-delete middleware: Remove community reference from users who are members
communitySchema.pre("findOneAndDelete", async function (next) {
    const communityId = this.getQuery()._id;
    
    try {
        // Update all users who are members of this community, and remove the community ID from their `memberOf` array
        await mongoose.model("User").updateMany(
            { memberOf: communityId }, // Find all users who are members of this community
            { $pull: { memberOf: communityId } } // Pull the community ID from their `memberOf` field
        );
        next(); // Continue with the delete operation
    } catch (error) {
        next(error); // Pass the error to next middleware if any
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;