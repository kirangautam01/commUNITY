const Community = require('../models/communityModel');
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

// ------------------------------------------------------------------------------------------------------- TO JOIN COMMUNITY
const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user.id;

        const community = await Community.findById(communityId);

        //check if the user is already the members of community
        if (community.members.includes(userId)) {
            return res.status(400).json({ message: "user is already a member of this community" });
        }

        community.members.push(userId);
        await community.save();

        res.status(200).json({ message: "Successfully joined the community", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// -------------------------------------------------------------------------------------------------- DISPLAY OWN CREATED COMMUNITY
const getCommunitiesByCreater = async (req, res) => {
    console.log("authenticate user id:", req.user?._id);

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
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({"message": "Sorry! community not available user might have deleted or something"});
        }

        res.status(200).json(community);
        console.log("community fetch successfully!");
    } catch (error) {
        console.log("error fetching community: ", error);
        res.status(500).json({"message":"internal server error"}); 
    }
}

module.exports = { createCommunity, joinCommunity, getCommunitiesByCreater, getCommunitiesByMember, exploreCommunity };