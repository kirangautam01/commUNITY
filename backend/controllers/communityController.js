const Community = require('../models/communityModel');
const User = require('../models/userModel');
const crypto = require('crypto');

// ------------------------------------------------------------------------------------------------------- CREATE COMMUNITY
const createCommunity = async (req, res) => {
    try {
        const { name, subtitle, description, privacy, genre, location } = req.body;

        const existingCommunity = await Community.findOne({ name });

        if (existingCommunity) {
            return res.status(400).json({ message: "community name already exists" });
        }

        const code = crypto.randomBytes(8).toString('base64').slice(0, 8).replace(/\+/g, '0').replace(/\//g, '1');
        const newCommunity = new Community({
            name,
            subtitle,
            description,
            privacy,
            genre,
            location,
            communityId: code,
            creater: req.user._id,
            members: [req.user._id]
        });

        await newCommunity.save();

        if (req.file) {
            // console.log("Uploading profile picture...");
            newCommunity.image = req.file.path; // Multer automatically assigns path
            await newCommunity.save();
        }

        res.status(201).json({
            message: 'Community create successfully',
            community: newCommunity
        });
    } catch (err) {
        console.error('Error creating community:', err);
        res.status(500).json({
            message: "Error creating community",
            error: err.message
        });
    }
};

// -------------------------------------------------------------------------------------------------- DISPLAY OWN CREATED COMMUNITY
const getCommunitiesByCreater = async (req, res) => {
    // console.log("authenticate user id:", req.user?._id);

    const user = req.user?._id;

    if (!user) {
        console.log("user id not found");
    }

    try {
        const communities = await Community.find({ creater: user });

        if (communities.length === 0) {
            return res.status(400).json({ message: "No community is found" });
        }

        res.status(200).json(communities);
    } catch (error) {
        consonle.error("error fetching communities: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// -------------------------------------------------------------------------------- DISPLAY COMMUNITIES USER HAVE JOINED
const getCommunitiesByMember = async (req, res) => {
    const userId = req.user?._id;  // Ensure user ID is available

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Please relogin" });
    }

    try {
        // Find communities where the user is in the members array but not the creator
        const communities = await Community.find({
            members: userId,
            creater: { $ne: userId }  // Exclude communities where the user is the creator
        });

        if (communities.length === 0) {
            return res.status(404).json({ message: "You have not joined any communities yet." });
        }

        res.status(200).json(communities);
    } catch (error) {
        console.error("Error fetching communities: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// -------------------------------------------------------------------------------------------------------  VIEW COMMUNITY
const exploreCommunity = async (req, res) => {

    try {
        const { communityId } = req.params;
        const community = await Community.findById(communityId)
            .populate("creater", "username location profilePic")
            .populate("members", "username location profilePic")
            .exec();

        if (!community) {
            return res.status(404).json({ "message": "Sorry! community not available user might have deleted or something" });
        }

        res.status(200).json(community);
        // console.log("community fetch successfully!");
    } catch (error) {
        console.log("error fetching community: ", error);
        res.status(500).json({ "message": "internal server error" });
    }
}

// ------------------------------------------------------------------------------------------------------- TO JOIN COMMUNITY
const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user.id;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if the user is already a member
        if (community.members.includes(userId)) {
            return res.status(400).json({ message: "User is already a member of this community" });
        }

        //check if the user memberOf field have already community Id
        const user = await User.findById(userId);
        if (user.memberOf.includes(communityId)) {
            return res.status(409).json({ message: "user memberOf field already contains this community id" });
        }

        // Add user to members array
        community.members.push(userId);
        await community.save();

        user.memberOf.push(communityId);
        await user.save();


        res.status(200).json({ message: "Successfully joined the community", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------------------------------------------------------------------------------------- DISPLAY TOP 10 COMMUNITIES

const top10Communities = async (req, res) => {
    try {
        const location = req.user.location;
        const userId = req.user?._id;

        const communities = await Community.find({ location: { $regex: location, $options: 'i' }, creater: { $ne: userId }, members: { $ne: userId } }).exec();

        let additionalCommunities = [];

        if (communities.length < 10) {
            const remaining = 10 - communities.length;
            const excludedCommunityIds = communities.map(comm => comm._id);  //collect id of collected communities
            additionalCommunities = await Community.find({ _id: { $nin: excludedCommunityIds }, creater: { $ne: userId }, members: { $ne: userId } }).limit(remaining).exec();
        }

        const data = [...communities, ...additionalCommunities].slice(0, 30);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

// ------------------------------------------------------------------------------------------------------- LEAVE COMMUNITY
const leaveCommunity = async (req, res) => {
    try {
        const { communityId } = req.body;
        const userId = req.user?._id;

        if (!communityId) {
            return res.status(404).json({ message: "community id is required!" });
        }

        const updatedCommunity = await Community.findByIdAndUpdate(
            communityId,
            { $pull: { members: userId } },//remove userId from members array
            { new: true } //returns the updated document
        );
        if (!updatedCommunity) {
            return res.status(404).json({ message: "community not found" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId,
            { $pull: { memberOf: communityId } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "community Id removing failed in membersOf array." });
        }
        res.status(200).json({ message: "You have left the community" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Community leave failed!" });
    }
}

// ------------------------------------------------------------------------------------------------------- FIND COMMUNITY
const findCommunity = async (req, res) => {
    try {
        const { title, location, genre, communityId } = req.query;

        let filter = {}; // Start with an empty filter object

        if (title) {
            filter.name = { $regex: title, $options: "i" }; // Case-insensitive search
        }
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }
        if (genre) {
            filter.genre = { $regex: genre, $options: "i" };
        }
        if (communityId) {
            filter.communityId = communityId; // Exact match for ID
        }

        const communities = await CommunityModel.find(filter);
        res.json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities" });
    }
};

module.exports = { createCommunity, joinCommunity, getCommunitiesByCreater, getCommunitiesByMember, exploreCommunity, top10Communities, leaveCommunity };