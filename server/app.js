const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
    const post = req.body
    console.log(post);
    res.status(201).json({
        message: 'Post added'
    });
})

app.use('/api/posts', (req, res, next) => {
    const posts = [
        { id: '2342dsf1', title: 'First server-side post', content: 'this is coming from our node middleware'},
        { id: '2342dsf2', title: 'Second server-side post', content: 'this is coming from our node middleware'}        
    ]
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;
// bXUHweCAmY4jGU5H 