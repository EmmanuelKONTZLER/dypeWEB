var mongoose = require('mongoose');

/* --- La clé étrangère idBonPlan correspond aux Bons Plans que l'utilisateur a liké --- */

var userSchema = mongoose.Schema({
firstName: String,
lastName: String,
email: String,
salt: String,
password: String,
token: String,
urlAvatar: String,
idBonPlan: [{type: mongoose.Schema.Types.ObjectId, ref: 'bonPlans'}],
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;