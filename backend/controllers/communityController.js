const Community = require('../models/communityModel');

const createCommunity = async (req, res) => {
    try {
        const { name, subtitle, description, privacy } = req.body;

        const existingCommunity = await Community.findOne({ name });

        if (existingCommunity) {
            return res.status(400).json({ message: "community name already exists" });
        }

        const newCommunity = new Community({
            name,
            subtitle,
            description, 
            privacy,
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

const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user.id; //assuming user is authenticated and user ID is available in req.user

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

// const myCommunities= async(req,res)=>{

// }

module.exports = { createCommunity, joinCommunity };