const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, default: 'This was an empty post!'},
    userImagePath: {type: String, required: true}    
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
