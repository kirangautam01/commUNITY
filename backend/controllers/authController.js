const transporter = require('../config/emailConfig');
const otpStore = {}; // Store OTPs temporarily
const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

const sentOtp = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log(process.env.EMAIL_PASS);

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ exists: true, message: "Email already exists" });
        }

        // Function to generate a 6-digit OTP
        const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in memory (temporary storage)
        otpStore[email] = otp;

        // Email configuration
        const mailOptions = {
            from: 'romangautam71399@gmail.com',
            to: email,
            subject: "Your OTP for Verification",
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
        };

        // Send email using await
        await transporter.sendMail(mailOptions);

        // Send response to frontend
        return res.status(200).json({ exists: false, otpSent: true, message: "OTP sent to email" });
    } catch (error) {
        console.error(error); // Log the error to the server console
        res.status(500).json({ message: "Server error" });
    }
};

const otpVerify = async (req, res) => {
    const { otp, email } = req.body;
    if (otpStore[email] === otp) {
        // if (testOtp === otp) {
        res.json({ message: 'OTP verified successfully' });
        delete otpStore[email];  // Optionally remove OTP after verification
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: "1d" }
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Use true in production (HTTPS)
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: "/",
        });
        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login Error:", error); // Debugging

        res.status(500).json({
            message: "Login failed",
            error: error.message || error.toString(), // Ensure error is readable
        });
    }
}

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: true, // 👈 only for HTTPS
    });

    res.status(200).json({ message: "Logged out successfully" });
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Save token and expiry (15 minutes)
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: 'romangautam71399@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `<p>Click the link below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>This link expires in 15 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Find user by reset token and check if it's still valid
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update password and remove token fields
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        // 4. Send success response
        res.json({ message: 'Password reset successfully. You can now login.' });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        res.status(500).json({ message: 'Server error while resetting password' });
    }
};

module.exports = { sentOtp, otpVerify, loginUser, logout, requestPasswordReset, resetPassword }