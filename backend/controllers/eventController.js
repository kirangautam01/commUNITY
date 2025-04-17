const EventModel = require('../models/eventsModel');
const Community = require('../models/communityModel');

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { name, body, communityId, author } = req.body;

    const newEvent = new EventModel({
      name,
      body,
      communityId,
      author,
      image: req.file ? req.file.path : null
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

// -------------------------------------------------------------------------------- FETCH EVENTS OF JOINED COMMUNITIES
const getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Find communities where the user is a member
    const joinedCommunities = await Community.find({ members: userId }).select('_id');
    const communityIds = joinedCommunities.map(comm => comm._id);

    // Step 2: Get events from these communities
    const events = await EventModel.find({ communityId: { $in: communityIds } })
      .populate('author', 'username profilePic')
      .populate('communityId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
}


// -------------------------------------------------------------------------------- LIKE OR DISLIKE TOGGLE
const toggleLikeDislike = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, action } = req.body;

    let event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const alreadyLiked = event.likes.includes(userId);
    const alreadyDisliked = event.dislikes.includes(userId);

    if (action === 'like') {
      if (alreadyLiked) {
        event.likes.pull(userId);
      } else {
        if (alreadyDisliked) event.dislikes.pull(userId);
        event.likes.push(userId);
      }
    } else if (action === 'dislike') {
      if (alreadyDisliked) {
        event.dislikes.pull(userId);
      } else {
        if (alreadyLiked) event.likes.pull(userId);
        event.dislikes.push(userId);
      }
    }

    await event.save();

    // Re-fetch with populated fields for frontend
    const populatedEvent = await EventModel.findById(eventId)
      .populate('author', 'username profilePic')
      .populate('communityId', 'name');

    res.status(200).json({
      success: true,
      message: 'Reaction updated successfully',
      event: populatedEvent,
    });
  } catch (error) {
    console.error('Error toggling like/dislike:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reaction',
    });
  }
};


// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await EventModel.findByIdAndDelete(eventId);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
};

module.exports = {
  createEvent,
  getUserEvents,
  toggleLikeDislike,
  deleteEvent
};
