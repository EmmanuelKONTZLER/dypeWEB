var mongoose = require('mongoose');

/* --- La clé étrangère idUser correspond au posteur du Bon Plan --- */

var bonPlanSchema = mongoose.Schema({
idUserPosteur: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
titre: String,
categorie: String,
description: String,
urlphoto: [String],
})

var bonPlanModel = mongoose.model('bonPlans', bonPlanSchema)

module.exports = bonPlanModel;