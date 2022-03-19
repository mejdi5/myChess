const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const gameSchema = new Schema({
_id: {type: String, default: Math.random().toString()},
whitePlayerId: {type: String},
blackPlayerId: {type: String},
isFinished: {type:Boolean, default:"false"},
winner: {type: String, default: ""},
history: {type: Array, default: []},
}, {timestamp: true});

const GameModel = mongoose.model('Game', gameSchema)

module.exports = GameModel