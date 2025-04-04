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

        const generateKey = () => {
            const randomString = crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '0').slice(0, 7);
            return `#${randomString}`;
        };
        const newCommunity = new Community({
            name,
            subtitle,
            description,
            privacy,
            genre,
            location,
            communityId: generateKey(),
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
            return res.status(404).json({ message: "Community ID is required!" });
        }

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if the user is the creator (admin) of the community
        if (community.creater.toString() === userId.toString()) {
            return res.status(403).json({ message: "You're the admin of the community. You cannot leave." });
        }

        const updatedCommunity = await Community.findByIdAndUpdate(
            communityId,
            { $pull: { members: userId } },
            { new: true }
        );

        if (!updatedCommunity) {
            return res.status(404).json({ message: "Community update failed" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId,
            { $pull: { memberOf: communityId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Community ID removing failed from user's memberOf array." });
        }

        res.status(200).json({ message: "You have left the community." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Community leave failed!" });
    }
};

// ------------------------------------------------------------------------------------------------------- FIND COMMUNITY
const searchCommunity = async (req, res) => {
    try {
        const { searchValue } = req.query;

        if (!searchValue) {
            return res.status(400).json({ message: "Search value is required!" });
        }

        let query = {
            $or: [
                { communityId: searchValue },
                { name: { $regex: new RegExp(searchValue, "i") } },
                { location: { $regex: new RegExp(searchValue, "i") } },
                { genre: { $regex: new RegExp(searchValue, "i") } }
            ]
        };

        const communities = await Community.find(query);

        if (communities.length === 0) {
            return res.status(404).json({ message: "no community is found" });
        }

        res.status(200).json(communities);
    } catch (error) {
        console.error("searching for community: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ------------------------------------------------------------------------------------------------------- FILTER COMMUNITY
const filterCommunity = async (req, res) => {
    try {
        const { name, location, genre, createdYear, privacy } = req.body;

        if (!name && !location && !genre && !createdYear && !privacy) {
            return res.status(400).json({ message: "Please provide at least one filter field." });
        }

        let query = {};

        // Handle name filter
        if (name && name.trim() !== "") {
            query.name = { $regex: new RegExp(name, "i") };
        }

        // Handle location filter
        if (location && location.trim() !== "") {
            query.location = { $regex: new RegExp(location, "i") };
        }

        // Handle genre filter
        if (genre && genre.trim() !== "") {
            query.genre = { $regex: new RegExp(genre, "i") };
        }

        if (privacy && privacy.trim() !== "") {
            query.privacy = { $regex: new RegExp(privacy, "i") }
        }

        // Handle createdYear filter
        if (createdYear && !isNaN(createdYear)) {
            query.$expr = {
                $eq: [
                    { $year: "$createdAt" }, // Extract the year from createdAt field
                    parseInt(createdYear), // Compare with the user input year
                ]
            };
        }

        const communities = await Community.find(query);

        if (communities.length === 0) {
            return res.status(404).json({ message: "No communities found." });
        }

        res.status(200).json({ message: "community found successfully", data: communities });
    } catch (error) {
        console.error("Error searching community:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

// ------------------------------------------------------------------------------------------------------- DELETE COMMUNITY
const delCommunity = async (req, res) => {
    try {
        const { communityId } = req.body;

        if (!communityId) {
            return res.status(400).json({ message: "Community ID is required" });
        }

        // Delete the community (this will trigger the pre-delete middleware)
        const deletedCommunity = await Community.findOneAndDelete({ _id: communityId });

        if (!deletedCommunity) {
            return res.status(404).json({ message: "Community not found" });
        }

        return res.status(200).json({ message: "Community deleted successfully!" });
    } catch (error) {
        console.error("Community delete error:", error);
        return res.status(500).json({ message: "Could not delete community" });
    }
};


module.exports = { createCommunity, joinCommunity, getCommunitiesByCreater, getCommunitiesByMember, exploreCommunity, top10Communities, leaveCommunity, searchCommunity, filterCommunity,delCommunity };