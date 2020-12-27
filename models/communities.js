var mongoose = require('mongoose');

var communauteSchema = mongoose.Schema({
name: String,
urlLogo: String,
colorLogo: String,
})

var communauteModel = mongoose.model('communautes', communauteSchema)

module.exports = communauteModel;