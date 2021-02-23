var mongoose = require('mongoose');



var messageSchema = mongoose.Schema({
idUserEmetteur: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
idUserDestinataire: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
contenu: String,
isRead: Boolean,
date: Date,
})

var messageModel = mongoose.model('messages', messageSchema)

module.exports = messageModel;