const Notice = require('../models/noticeModel');
const Community = require('../models/communityModel');

// Create Notice Controller
exports.createNotice = async (req, res) => {
    const { heading, body, communityId, author } = req.body;
    const userId = req.user?._id;

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
            authorId: userId,
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


exports.deleteNotice = async (req, res) => {
    try {
        const { communityId, noticeId } = req.body;
        const userId = req.user?._id;

        // console.log("community Id: ", communityId, "noticeId: ", noticeId);
        const community = await Community.findById(communityId);
        // console.log(community);
        if (!community || !community.creater) {
            return res.status(404).json({ message: "Community or creator not found." });
        }

        const notice = await Notice.findById(noticeId);
        // console.log("notice author: ",notice.authorId);
        if (!notice || !notice.authorId) {
            return res.status(404).json({ message: "Notice or author not found." });
        }

        const isAdmin = community.creater?.equals(userId);
        const isAuthor = notice.authorId?.equals(userId);

        if (isAdmin || isAuthor) {
            await Notice.findByIdAndDelete(noticeId);
            return res.status(200).json({ message: "Notice deleted successfully." });
        } else {
            return res.status(401).json({ message: "You must be the community admin or the notice author to delete this notice." });
        }
    } catch (error) {
        console.error("Notice delete error:", error);
        res.status(500).json({ message: "An error occurred while deleting the notice." });
    }
};



