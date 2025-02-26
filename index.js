require('dotenv').config();
const express = require('express');
const mongo = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');

const usersRoute = require('./routes/users.js');
const postsRoute = require('./routes/posts.js');
const authRoute = require('./routes/auth.js');
// const User = require('./models/userSchema.js');

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongo.connect(process.env.URL);
const db = mongo.connection;
db.on('error', (error) => {
    console.error(error);
});
db.once('open', () => console.log('connected to mongodb'));

app.use('/users', usersRoute);
app.use('/posts', postsRoute);
app.use('/auth', authRoute);

// Remove the /profile/:id route
// app.get('/profile/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }
//         res.render('profile', { profilePictureBase64: user.profilePictureBase64, profilePictureMimeType: user.profilePictureMimeType });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Internal server error' });
//     }
// });

app.get('/', (req, res) => {
    res.status(200).render('index');
});

// Export the app for serverless environment
module.exports = app;

// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });