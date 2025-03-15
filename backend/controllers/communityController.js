const Community = require('../models/communityModel');

const createCommunity = async (req, res) => {
    try {
        const { name, subtitle, description, privacy, image, creater } = req.body;

        // const createrId = req.user._id; //assumed the logged-in user Id is in req.user._id

        const newCommunity = new Community({
            name,
            subtitle,
            description,
            privacy,
            image,
            creater: creater,
            members: creater
        });

        await newCommunity.save();

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

module.exports = { createCommunity, joinCommunity };