const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = new Schema({

path: {type: String, default: ""}
}, 
{timestamp: true}
);

module.exports = Picture = mongoose.model('Picture', pictureSchema)
