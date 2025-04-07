const Notice = require('../models/noticeModel');

// Create Notice Controller
exports.createNotice = async (req, res) => {
    const { heading, body, communityId, author } = req.body;

    // Validation
    if (!heading || !body || !communityId || !author) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new notice
        const newNotice = new Notice({
            heading,
            body,
            communityId,
            author,
        });

        // Save the notice to the database
        await newNotice.save();

        return res.status(201).json({
            message: "Notice created successfully",
            notice: newNotice,
        });
    } catch (error) {
        console.error("Error creating notice:", error);
        return res.status(500).json({
            message: "An error occurred while creating the notice.",
            error: error.message,
        });
    }
};

exports.getNoticesByCommunity = async (req, res) => {
    const { communityId } = req.params;  // Get the communityId from the request parameters

    if (!communityId) {
        return res.status(400).json({ message: "Community ID is required." });
    }

    try {
        // Fetch notices based on the provided communityId
        const notices = await Notice.find({ communityId: communityId });

        if (notices.length === 0) {
            return res.status(404).json({ message: "No notices found for this community." });
        }

        // Return the notices
        res.status(200).json({ notices });
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
