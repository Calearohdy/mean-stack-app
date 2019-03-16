const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth")
const app = express();

mongoose.connect('mongodb+srv://calebrohdy:bXUHweCAmY4jGU5H@cluster0-nkyap.mongodb.net/test')
    .then(() => {
        console.log('Connected to Database')
    })
    .catch(() => {
        console.log('Connection Failed')
    })

app.use(bodyParser.json());
app.use("/images", express.static(path.join('server/images')));
// handles CORS: Cross Origin Resource Sharing ** communication between 2 different servers i.e. port 3000 and 4000
// Required to allow access in the headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
})

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
// bXUHweCAmY4jGU5H 