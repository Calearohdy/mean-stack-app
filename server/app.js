const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Post = require('./models/post');
mongoose.connect('mongodb+srv://calebrohdy:bXUHweCAmY4jGU5H@cluster0-nkyap.mongodb.net/test?retryWrites=true')
    .then(() => {
        console.log('Connected to Database')
    })
    .catch(() => {
        console.log('Connection Failed')
    })

app.use(bodyParser.json());
// handles CORS: Cross Origin Resource Sharing ** communication between 2 different servers i.e. port 3000 and 4000
// Required to allow access in the headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(result => {
        res.status(201).json({
            message: 'Post added',
            postId: createdPost._id
        });
    })
})

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        })
        .catch(error => {
            console.log(error)
        })
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
        })
    res.status(200).json({message: "Post deleted"})
});

module.exports = app;
// bXUHweCAmY4jGU5H 