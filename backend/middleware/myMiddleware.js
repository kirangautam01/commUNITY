const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    // console.log("Token from cookies: ", token);
    // console.log("all cookies", req.cookies);

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        req.user = user; //attach user info to the request object
        next(); //continue to the route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token!' }); 
    }
}

module.exports = authenticateUser;