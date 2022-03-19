const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitationSchema = new Schema({

senderId: {type: String, default:""},
receiverId: {type: String, default:""}
}, {timestamp: true});

const InvitationModel = mongoose.model('Invitation', invitationSchema)
module.exports = InvitationModel