var express = require('express');
var router = express.Router();
/* --- import des Models DB --- */
var userModel = require('../models/users');

/* --- sécurisation du password et token --- */
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* --- sign-up --- */
router.post('/sign-up', async function(req, res, next) {

  var error = []
  if(req.body.lastName == '') {
    error.push('Manque LastName')
  }
  if(req.body.firstName == '') {
    error.push('Manque FirstName')
  }
  if(req.body.email1 == '') {
    error.push('Manque E-mail')
  }
  if(req.body.password1 == '') {
    error.push('Manque Password')
  }
  if (await userModel.findOne({email:req.body.email1})) {
    error.push('Utilisateur déja inscrit')
  }
 
  if (error[0] != undefined) {
    res.json({result:false, error});
  } else {
    
    var salt = uid2(32)

    var user = new userModel({		
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email1,
      salt: salt,
      password: SHA256(req.body.password1 + salt).toString(encBase64),
      token: uid2(32),      
    });		
        
    user = await user.save();		

    res.json({result:true,user});
   }
});


/* --- sign-in --- */
router.post('/sign-in', async function(req, res, next) {
console.log('arrivée sign-up')
  var error = []
  
  if(req.body.email2 == '') {
    error.push('Manque E-mail')
  }
  if(req.body.password2 == '') {
    error.push('Manque Password')
  }
  console.log('b10', )
  
  if (error[0] == undefined) {
    var user = await userModel.findOne({email:req.body.email2})
  }

  if(user == null){
    error.push('E-mail incorrect')
  } else 
  if (user.password != SHA256(req.body.password2 + user.salt).toString(encBase64)) {
    error.push('Mot de passe incorrect');
  }


  if (error[0] != undefined) {
    res.json({result:false, error});
  } else {
    console.log('B12 pas d\'erreur')
     
      res.json({result:true,user});
   }

});


module.exports = router;
