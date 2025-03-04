const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaBase64: { type: String, required: false },
});

postSchema.virtual('authorUsername').get(function() {
    return this.author ? this.author.username : '';
});
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
