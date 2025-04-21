const User = require('../models/userModel');

exports.setUserOnline = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (err) {
        console.error('Failed to set user online:', err);
    }
};

exports.setUserOffline = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { isOnline: false });
    } catch (err) {
        console.error('Failed to set user offline:', err); 
    }
};
