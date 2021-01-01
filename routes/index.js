var express = require('express');
var router = express.Router();
/* --- import des Models DB --- */
var userModel = require('../models/users');
var communauteModel = require('../models/communities');
var adhesionModel = require('../models/adhesions')
var bonPlanModel = require('../models/bonplan')
var messageModel = require('../models/messages')


/* --- sécurisation du password et token --- */
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

/* --- variable fs pour supprimer le fichier 'temporaire' in fine --- */
const fs = require('fs')

/* --- variable uniqid pour rendre unique le nom d'un fichier --- */
var uniqid = require('uniqid');

/* --- variable cloudinary pour utiliser le stockage des images --- */
var cloudinary = require('cloudinary').v2;

/* --- Identifiants de Cloudinary --- */
cloudinary.config({
  cloud_name: 'dype',
  api_key: '948115188828327',
  api_secret: 'i8O8tZ2Q1aHQM-zPQv9jJpVjKB4'
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
  console.log('B00', error)

  if (error[0] != undefined) {
    res.json({result:false, error});
  } else {
    console.log('B02 pas d\'erreur')
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
      console.log('b01', user)

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
  
console.log('B04', error)
console.log('B08', req.body.email2)
console.log('B08s', error[0])

  if (error[0] == undefined) {
    var user = await userModel.findOne({email:req.body.email2})
  }
  console.log('B09', user)

  if(user == null){
    error.push('E-mail incorrect')
  } else 
  if (user.password != SHA256(req.body.password2 + user.salt).toString(encBase64)) {
    error.push('Mot de passe incorrect');
  }
  
  console.log('B11', error)

  if (error[0] != undefined) {
    res.json({result:false, error});
  } else {
    console.log('B12 pas d\'erreur')
     
      res.json({result:true,user});
   }

});

/* --- afficher les communautés --- */
router.get('/get-community', async function(req, res, next) {
  var community00 = await communauteModel.find({})
  console.log('B13', community00)
  var community = [];
  for (var i=0 ; i<community00.length ; i++) {
    var members = await adhesionModel.find({idCommunaute:community00[i]._id});
    community.push({communityId:community00[i]._id, name:community00[i].name, urlLogo:community00[i].urlLogo, colorLogo:community00[i].colorLogo, count:members.length})
  };
  console.log('B14', community)
  res.json({community});
});


/* --- adhérer au(x) commnauté(s) --- */

router.post('/adhesion', async function(req, res, next) {
console.log('BE Adhesion', req.body)
var user = await userModel.findOne({token:req.body.token})
date = new Date ()
      var adhesion = new adhesionModel({		
        idUser: user._id,
        idCommunaute: req.body.communityId,
        date: date,
        });		
          
      adhesion = await adhesion.save();		
      

      res.json({adhesion});
   
});


/* --- afficher le profil --- */
router.get('/get-profil', async function(req, res, next) {
  var user = await userModel.findOne({token:req.query.token})
  var myadhesion = await adhesionModel.find({idUser:user._id})
  console.log('B13', user, myadhesion)

  var myCommunity = []
  for (var i=0 ; i<myadhesion.length ; i++) {
    var community = await communauteModel.findOne({_id:myadhesion[i].idCommunaute});
    console.log('b14', community)
    var members = await adhesionModel.find({idCommunaute:community._id});
    myCommunity.push({communityId:community._id, name:community.name, urlLogo:community.urlLogo, colorLogo:community.colorLogo, count:members.length})
  }
  

  res.json({user, myCommunity});
});

/* --- modifier le profil --- */
router.post('/change-profil', async function(req, res, next) {
  console.log('BE changeP', req.body)

  var user = await userModel.findOne({token:req.body.token})

  if (req.body.key == 'first') {
      user.firstName = req.body.firstName;
      user = await user.save();
  }
  if (req.body.key == 'last') {
      user.lastName = req.body.lastName;
      user = await user.save();
  }
            
	
  res.json({user});
});

/* --- test photo --- */
router.post('/avatar', async function(req, res, next) {
  console.log('BE avatar', req.body.avatar)
  console.log('BE2 avatar', req.body)

  // var imagePath = './tmp/avatar'+ uniqid()+'.jpg';
  // var resultCopy = await req.body.avatar.mv(imagePath);
  var resultCloudinary = await cloudinary.uploader.upload(req.body.avatar);
  console.log('be4', resultCloudinary.secure_url)
  //console.log('be5', resultCopy)

  // if(!resultCopy) {
  // res.json({result: true, avatar: resultCloudinary.url} );
  // } else {
  // res.json({result: false, message: 'error'} );
  // }
  // fs.unlinkSync(imagePath);
  // }
	
  res.json({avatar: resultCloudinary.url});
});

/* --- récupérer les bons plans--- */
router.get('/get-bonplan', async function(req, res, next) {
  console.log('b30 arrivee BE bonplan', req.query)

  if (req.query.key == 1) {
    var bonplan00 = await bonPlanModel.find()
    var user = await userModel.findOne({token:req.query.token})
    var bonplan = []
    for (i=0 ; i<bonplan00.length ; i++) {
      var posteur = await userModel.findOne({_id:bonplan00[i].idUserPosteur})
      if (user.idBonPlan.indexOf(bonplan00[i]._id) == -1) {
       bonplan.push({_id:bonplan00[i]._id, urlphoto:bonplan00[i].urlphoto, token:posteur.token, titre:bonplan00[i].titre, categorie:bonplan00[i].categorie , description:bonplan00[i].description, isliked:false, posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlavatar})
      } else { bonplan.push({_id:bonplan00[i]._id, urlphoto:bonplan00[i].urlphoto, token:posteur.token, titre:bonplan00[i].titre, categorie:bonplan00[i].categorie , description:bonplan00[i].description, isliked:true, posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlavatar})
      }
    }
  } else {
  
    if (req.query.key == 2) {
      console.log('get favorite', req.query)
      var user = await userModel.findOne({token:req.query.token})
      var bonplan = []
      console.log('dede',user.idBonPlan.length )
      if (user.idBonPlan.length != 0){
        for (var i=0 ; i<user.idBonPlan.length ; i++) {
          var bonPlan00 = await bonPlanModel.findOne({_id:user.idBonPlan[i]});
          console.log('bonplan00', bonPlan00)
          var posteur = await userModel.findOne({_id:bonPlan00.idUserPosteur});
          bonplan.push({_id:bonPlan00._id, urlphoto:bonPlan00.urlphoto, tokenposteur:posteur.token, titre:bonPlan00.titre,  categorie:bonPlan00.categorie, description:bonPlan00.description,posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlavatar
          })
        }
      }      
    } else {
      if(req.query.key == 3){
        console.log('get favorite 1234', req.query)
        var user = await userModel.findOne({token:req.query.token})
        var myBonPlan = await bonPlanModel.find({idUserPosteur:user._id})
        var bonplan = []
        console.log('dede',myBonPlan.length )
        if (myBonPlan.length != 0){
          for (var i=0 ; i<myBonPlan.length ; i++) {
            bonplan.push({_id:myBonPlan[i]._id, urlphoto:myBonPlan[i].urlphoto, tokenposteur:user.token, titre:myBonPlan[i].titre,  categorie:myBonPlan[i].categorie, description:myBonPlan[i].description,posteurFirstName:user.firstName, posteurAvatar:user.urlavatar
            })
          }
        }      
      }
    }
  }
  console.log('be50', bonplan)
  res.json({bonplan});
});

/* --- gérer les favoris --- */
router.post('/favorite', async function(req, res, next) {
  console.log('BE addfavorite', req.body)

  var user = await userModel.findOne({token:req.body.token})
  if (user.idBonPlan.indexOf(req.body.idBonPlan) == -1) {
    user.idBonPlan.push(req.body.idBonPlan)
  } else {
    user.idBonPlan.splice(user.idBonPlan.indexOf(req.body.idBonPlan),1)
  }  
  user = await user.save()
  
  res.json({user});
});


/* --- afficher les conversations --- */
router.get('/get-conversation', async function(req, res, next) {
  console.log('rere', req.query)
  // s'il y a un tokenInterlocuteur dans le req.query, la route comprend qu'ils s'agit d'une conversation en 1to1,
  // récupère les messages avec l'interlocuteur uniquement et les renvoie au FE
  if (req.query.tokenInterlocuteur){
    var me = await userModel.findOne({token:req.query.token})
    var interlocuteur = await userModel.findOne({token:req.query.tokenInterlocuteur})
    var messagesenv = await messageModel.find({idUserEmetteur:me._id , idUserDestinataire:interlocuteur._id})
    var messagesrecu = await messageModel.find({idUserEmetteur:interlocuteur._id , idUserDestinataire:me._id})
    var conversation = []

console.log('messages 1to1', messagesenv, messagesrecu)

    for (var i=0 ; i<messagesenv.length ; i++){
      conversation.push({emetteur:me.token, firstName:me.firstName , contenu:messagesenv[i].contenu , date:messagesenv[i].date})
      console.log ('messages envoyés', conversation)
    }

    for (var i=0 ; i<messagesrecu.length ; i++){
      conversation.push({emetteur:interlocuteur.token, firstName:interlocuteur.firstName , contenu:messagesrecu[i].contenu , date:messagesrecu[i].date})
      console.log ('messages recu + env', conversation)
    }

    conversation.sort (function compare(a,b) {
      if (a.date < b.date)
       return -1;
      if (a.date > b.date)
       return 1;
      return 0;
    });

   
console.log('2eme messages 1to1', conversation)

  } else {


   // Récupération de mes infos à partir de mon token
   // Récupération des mes messages émis et envoyés
   // Création d'un tableau de contact00 qui servira à créer et vérifier une liste d'interlocuteur unique
   // Création d'un tableau de contact qui contiendra les info de mes interlocuteurs + les infos du dernier message échangé
  console.log('get-conversation 01')
  var me = await userModel.findOne({token:req.query.token})
  var messagesenv = await messageModel.find({idUserEmetteur:me._id})
  var messagesrecu = await messageModel.find({idUserDestinataire:me._id})
  var contact00 = []
  var contact = []
  
   // Boucle sur mes messages envoyés pour ajouter ou mettre à jour le tableau contact
  for (var i=0 ; i<messagesenv.length ; i++) {
    var interlocuteur = await userModel.findOne({_id:messagesenv[i].idUserDestinataire})
    if (contact00.indexOf(interlocuteur.token) == -1) {
      contact00.push(interlocuteur.token);
      contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesenv[i].contenu , isRead:messagesenv[i].isRead , date:messagesenv[i].date})
    } else {
      var lastmessage = contact.filter(message => message.tokenInterlocuteur == interlocuteur.token)
      if (messagesenv[i].date > lastmessage[0].date) {
        contact = contact.filter(message => message.tokenInterlocuteur != interlocuteur.token)
        contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesenv[i].contenu , isRead:messagesenv[i].isRead , date:messagesenv[i].date})
      }
    }
  }

  for (var i=0 ; i<messagesrecu.length ; i++) {
    var interlocuteur = await userModel.findOne({_id:messagesrecu[i].idUserEmetteur})
    if (contact00.indexOf(interlocuteur.token) == -1) {
      contact00.push(interlocuteur.token);
      contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesrecu[i].contenu , isRead:messagesrecu[i].isRead , date:messagesrecu[i].date})
    } else {
      var lastmessage = contact.filter(message => message.tokenInterlocuteur == interlocuteur.token)
      console.log('lastmessage', lastmessage)
      console.log('date', messagesrecu[i].date ,lastmessage[0].date)
      if (messagesrecu[i].date > lastmessage[0].date) {
        console.log('dd1', contact)
        contact = contact.filter(message => message.tokenInterlocuteur != interlocuteur.token)
        console.log('dd2', contact)
        contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesrecu[i].contenu , isRead:messagesrecu[i].isRead , date:messagesrecu[i].date})
      }
    }
  }
}

  console.log('get-conversation 01', contact)
  res.json({contact, interlocuteur, conversation});
});


/* --- envoyer un message en BDD --- */
router.post('/send-message', async function(req, res, next) {
  console.log('sendMessage', req.body)

  var me = await userModel.findOne({token:req.body.token})
  var interlocuteur = await userModel.findOne({token:req.body.tokenInterlocuteur})
  var date = new Date()
  
 
  var message = new messageModel({
    idUserEmetteur:me._id,
    idUserDestinataire:interlocuteur._id,
    contenu:req.body.contenu,
    isRead:false,
    date:date
  })

  message = await message.save()
  
  res.json({});
});

/* --- ajouter un bon plan --- */
router.post('/add-bonplan', async function(req, res, next) {
  console.log('addBonPlan', req.body)

  var me = await userModel.findOne({token:req.body.token})

  var bonplan = new bonPlanModel({
    idUserPosteur: me._id,
    titre: req.body.titre,
    categorie: req.body.categorie,
    description: req.body.description,
      })
      
  bonplan = await bonplan.save()    
	
  res.json({});
});

/* --- supprimer un bon plan --- */
router.delete('/delete-bonplan', async function(req, res, next) {
  console.log('delete', req.body)
  var user = await userModel.find({token:req.query.token})
  var bonplan = await bonPlanModel.deleteOne({_id:req.query.id})
 
	
  res.json({user});
});

module.exports = router;
