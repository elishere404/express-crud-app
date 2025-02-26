require('dotenv').config();
const express = require('express');
const mongo = require('mongoose');
const app = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');

const userSchema = require('../models/userSchema.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/signup', upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const file = req.file;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" });
        }

        const existingUsername = await userSchema.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ msg: "Username is taken" });
        }

        const existingEmail = await userSchema.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "Email is already in use" });
        }

        let profilePictureBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAASwCAQAAABBKHtEAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfoBwgTCCXc6oTWAACAAElEQVR42u3dd2AUZf7H8e8zm0rvTUq2hACxoGCjqCh2ERVRbNix91O8qt6dd5Y7eznrKXaxgx3FAlYQC6FtC0QCSAs9bef5/XHqTyCBZHd2d8r79c/vd2pmZz/P7OxnnpmdEQEAAIClFBEAsI+KQrNARMRsW2eI+HJ0axERo4XO/81uq8bcLCKiNiTqRXJNY52IiFHdawv5AaBgAfCEcJucDvXtjQ7SVgp0K6O1FOjW0koKpbW0kgJpIy2lQNqKT9pY9ILrJSHrpFo2yXrZIptkvVTLRrVBqs0NaqNU6yq91rcmsbZ4PWMDgIIFwMYqChPd6rurDrqDai8dVHvdQdr/7/+X9pJj05Wul7WyRq9Va2StWqN//v/1Gl9lzgrmwgBQsABk1OL2tT2M9qq77iHddQ/VXrpLD+nmsn1JtarUy2StqtTLdKWxzKzMW9ZrhUow+gAoWAAssLCT0Vv1Ub2lSHpLb91DdbHtjFS61euf1FKpkCVSrhfrJeaSklVsHwAoWACaYHH7uoAR0AHVQ3eXgBRbdmWUG9WopTqml6lKHVOxRGzpkhH1hAKAggVARBa3ry/VA1RAAhKQAVJIIkmrUxU6pmI6pubVlxUv5pQiQMEC4KlKVRcwArpUBkhA+klLEkmLWvWjjql5ZpmKJWLFcaWJBKBgAXCZaG89QHYzSvWuUiKtyCPjNshCmavn+b5PzAtVEAdAwQLgWP87+WeU6gGyh3QmD9tYL2E9T5WpecasomXEAVCwANhevEDvbg40dtWlshulygF+kh9UmVmm5hg/+KuJA6BgAbCRWblt+6pBxiA9SAZLPnk4Ur0s0rPVbJld+E2PzcQBULAAZElZq4KBeoBRqgfJ3pJHHq6RkIV6tpotZTmz+6wlDoCCBSATtSqvxV7mfjJY76VKxCAPd1ctvUjNltnGF5u/Ka0lDoCCBcBy5d3NwXqQDJWh3KvKg+rlOzXTnO37xF9OGAAFC0CKpuf0LFFDZZgaJANIAyKyTGbLDJlpfl1cQxgABQtAs0S6yFAZovaXQVJAGmjAF'

        let profilePictureMimeType = 'image/png';

        if (file) {
            profilePictureBase64 = file.buffer.toString('base64');
            profilePictureMimeType = file.mimetype;
            const profilePictureUrl = `data:${profilePictureMimeType};base64,${profilePictureBase64}`;

            // Directly use the provided base64 URL
            profilePictureBase64 = '/9j/4AAQSkZJRgABAQACWAJYAAD/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/CABEIA9QD1AMBIgACEQEDEQH/xAAvAAEAAgMBAQAAAAAAAAAAAAAABgcDBAUCAQEBAQEAAAAAAAAAAAAAAAAAAAEC/9oADAMBAAIQAxAAAAC3BvIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABh4pIEK0CxFZ+Us5W24s9RTsnSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
        }

        const newUser = new userSchema({
            username,
            email,
            password,
            profilePictureBase64,
            profilePictureMimeType
        });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("New user registered:", JSON.stringify(newUser, null, 2));
        res.status(201).json({ msg: "User registered successfully", token, newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ msg: "Login successful", token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = app;