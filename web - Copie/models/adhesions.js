var mongoose = require('mongoose');


var adhesionSchema = mongoose.Schema({
idUser: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
idCommunaute: {type: mongoose.Schema.Types.ObjectId, ref: 'communautes'},
date: Date,
})

var adhesionModel = mongoose.model('adhesions', adhesionSchema)

module.exports = adhesionModel;