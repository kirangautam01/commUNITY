const Comment = require('../models/commentModel');

// -------------------------------------------------------------------------------- CREATE A NEW COMMENT
const createComment = async (req, res) => {
  try {
    const { eventId, userId, commentText } = req.body;

    if (!eventId || !userId || !commentText) {
      return res.status(400).json({ message: 'Event ID, User ID, and Comment Text are required' });
    }

    const newComment = new Comment({
      eventId,
      userId,
      commentText
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

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { createComment, getCommentsByEventId, deleteComment }