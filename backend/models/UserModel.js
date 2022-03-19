const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

userName: {type: String,required: true},
picture: {type: Object, default: null},
email: {type: String, required: true, unique: true, lowercase: true},
password: {type: String,required: true},
isAdmin: {type: Boolean, default: false},
}, 
{timestamp: true});

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel