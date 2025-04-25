const Comment = require('../models/commentModel');
const Community = require('../models/communityModel');

// -------------------------------------------------------------------------------- CREATE A NEW COMMENT
const createComment = async (req, res) => {
  try {
    const { eventId, userId, commentText, communityId } = req.body;

    if (!eventId || !userId || !commentText || !communityId) {
      return res.status(400).json({ message: 'Event ID, User ID, and Comment Text are required' });
    }

    const newComment = new Comment({
      eventId,
      userId,
      commentText,
      communityId
    });

    await newComment.save();

    // Populate the userId field after saving
    const populatedComment = await newComment.populate('userId', 'username profilePic');

    res.status(201).json(populatedComment); // Send populated data back
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------------------------------------------------------------------- GET COMMENTS BY EVENT ID
const getCommentsByEventId = async (req, res) => {
  const { eventId } = req.params;

  try {
    const comments = await Comment.find({ eventId }).populate('userId', 'username profilePic');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};

// -------------------------------------------------------------------------------- DELETE COMMENTS BY COMMENT ID
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author of the comment
    const isCommentAuthor = comment.userId.toString() === userId.toString();

    // Fetch the community to check if user is the creator
    const community = await Community.findById(comment.communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const isCommunityCreator = community.creater.toString() === userId.toString();

    // Only allow if user is author OR community creator
    if (!isCommentAuthor && !isCommunityCreator) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { createComment, getCommentsByEventId, deleteComment }