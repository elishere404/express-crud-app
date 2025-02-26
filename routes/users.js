const express = require('express');
const router = express.Router();
const User = require('../models/userSchema.js'); // Updated import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authJWT(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

router.get('/', async (req, res) => {
    try {
        const posts = await User.find().select('-password');
        res.json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const userName = await User.findOne({ username: req.params.username }).select('-password');
        res.json(userName);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/upd/:id', authJWT, async (req, res) => {
    try {
        const updatedFields = {};
        if (req.body.username) updatedFields.username = req.body.username;
        if (req.body.email) updatedFields.email = req.body.email;
        if (req.body.password) updatedFields.password = req.body.password;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/del/:id', authJWT, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
