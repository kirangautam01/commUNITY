const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const createUser = async (req, res) => {
    try {
        const { username, email, password, memberOf } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user instance without profilePic first
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            memberOf
        });

        // Save the user to the database
        await newUser.save();

        // Upload image to Cloudinary ONLY IF USER IS CREATED
        if (req.file) {
            // console.log("Uploading profile picture...");
            newUser.profilePic = req.file.path; // Multer automatically assigns path
            await newUser.save(); // Save updated user with profilePic URL
            // console.log("Profile picture uploaded successfully");
        }

        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const userInfo = async (req, res) => {
    try {
        // Directly access req.user which was set by the authenticateUser middleware
        const user = req.user;

        // Send the user info in the response
        res.status(200).json({ user });

        // Optionally log user data for debugging
        console.log(user);
    } catch (error) {
        // Handle errors if needed
        console.error("Error in userInfo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createUser, userInfo };
