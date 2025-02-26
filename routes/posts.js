require('dotenv').config();
const express = require('express');
const mongo = require('mongoose');
const app = express.Router();
const jwt = require('jsonwebtoken');
const postSchema = require('../models/postSchema.js');
const multer = require('multer');
const axios = require('axios');

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function authJWT(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
}

app.post('/new', authJWT, upload.single('media'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Convert file to BASE64
        const mediaBase64 = file.buffer.toString('base64');
        const mediaUrl = `data:${file.mimetype};base64,${mediaBase64}`;

        // Shorten the BASE64 URL using Ulvis.net API
        const response = await axios.post('https://ulvis.net/API/write/get', {
            url: mediaUrl
        });

        const shortUrl = response.data;

        const newPost = new postSchema({
            title,
            description,
            author: req.user.id,
            mediaBase64: shortUrl
        });

        await newPost.save();
        res.status(201).json({ msg: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const posts = await postSchema.find().skip(skip).limit(limit);
        const totalPosts = await postSchema.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.setHeader("Content-Type", "application/json"); 
        res.send(JSON.stringify({
            posts,
            page,
            totalPages,
            totalPosts
        }, null, 2));
    } catch (error) {
        res.status(500).json({ msg: "internal server error" });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.id);
        res.setHeader("Content-Type", "application/json"); 
        res.send(JSON.stringify(post, null, 2));
    } catch (error) {
        res.status(500).json({ msg: "internal server error" });
    }
});

app.delete('/del/:id', authJWT, async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "post does not exist" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "you are not authorized to delete this post" });
        }

        await postSchema.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "post has been successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "internal server error" });
    }
});

app.put('/upd/:id', authJWT, async (req, res) => {
    try {
        const updatedPost = await postSchema.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ msg: "post not found" });
        }

        res.status(200).json({ msg: "post Updated", post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "internal server error" });
    }
});

module.exports = app;