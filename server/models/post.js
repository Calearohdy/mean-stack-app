const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, default: 'This was an empty post!'}    
});

module.exports = mongoose.model('Post', postSchema);