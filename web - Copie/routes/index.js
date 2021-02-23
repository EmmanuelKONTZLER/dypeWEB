var express = require('express');
var router = express.Router();
/* --- import des Models DB --- */
var userModel = require('../models/users');
var communauteModel = require('../models/communities');
var adhesionModel = require('../models/adhesions')
var bonPlanModel = require('../models/bonplan')
var messageModel = require('../models/messages')




/* --- variable fs pour supprimer le fichier 'temporaire' in fine --- */
const fs = require('fs')

/* --- variable uniqid pour rendre unique le nom d'un fichier --- */
var uniqid = require('uniqid');

/* --- variable cloudinary pour utiliser le stockage des images --- */
var cloudinary = require('cloudinary').v2;

/* --- Identifiants de Cloudinary --- */
// cloudinary.config({
//   cloud_name: 'dype',
//   api_key: '948115188828327',
//   api_secret: 'i8O8tZ2Q1aHQM-zPQv9jJpVjKB4'
// });

cloudinary.config({
  cloud_name: 'manufaceup',
  api_key: '654887819736177',
  api_secret: 'k-pCl44JblHSSrSsrg852aJrwnM'
  });



/* --- afficher les communautés --- */
router.get('/get-community', async function(req, res, next) {
  var community00 = await communauteModel.find({})
  var community = [];
  for (var i=0 ; i<community00.length ; i++) {
    var members = await adhesionModel.find({idCommunaute:community00[i]._id});
    community.push({communityId:community00[i]._id, name:community00[i].name, urlLogo:community00[i].urlLogo, colorLogo:community00[i].colorLogo, count:members.length})
  };
  res.json({community});
});


/* --- adhérer au(x) commnauté(s) --- */
router.post('/adhesion', async function(req, res, next) {
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

  var myCommunity = []
  for (var i=0 ; i<myadhesion.length ; i++) {
    var community = await communauteModel.findOne({_id:myadhesion[i].idCommunaute});
    var members = await adhesionModel.find({idCommunaute:community._id});
    myCommunity.push({communityId:community._id, name:community.name, urlLogo:community.urlLogo, colorLogo:community.colorLogo, count:members.length})
  }
  
  res.json({user, myCommunity});
});


/* --- modifier le profil --- */
router.post('/change-profil', async function(req, res, next) {

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

/* --- Modifier la photo d'avatar --- */
router.post('/avatar', async function(req, res, next) {
  
  if (req.files) {
    
      console.log('BE avatar 1234', req.files)
      var imagePath = './tmp/picture'+ uniqid()+'.jpg';
      var resultCopy = await req.files.picture.mv(imagePath);
      try {var resultCloudinary = await cloudinary.uploader.upload(imagePath)}
      catch(error) { console.log('error', error); var erreur = error}
      console.log('be4', resultCloudinary.secure_url)
      
      if(!erreur) {
      res.json({result: true, url:resultCloudinary.secure_url} );
      } else {
      res.json({result: false, message: erreur} );
      }
      fs.unlinkSync(imagePath);

  } else { 

      if(req.body.url) {
        var me = await userModel.findOne({token:req.body.token});
        me.urlAvatar = req.body.url;
        me = await me.save();
        res.json({result: true, url:me.urlAvatar} );
      }
  }
});


/* --- récupérer les bons plans--- */
router.get('/get-bonplan', async function(req, res, next) {

  if (req.query.key == 1) {
    if (req.query.categorie == '') {
      var bonplan00 = await bonPlanModel.find()
    }else {
      var bonplan00 = await bonPlanModel.find({categorie:req.query.categorie})
    }

    var user = await userModel.findOne({token:req.query.token})
    var userCommunity = await adhesionModel.find({idUser:user._id})
    var bonplan = []
    for (i=0 ; i<bonplan00.length ; i++) {
      var posteur = await userModel.findOne({_id:bonplan00[i].idUserPosteur})
        // Pour chaque bonPlan, controle de l'appartenance à une même communauté entre l'user et le posteur
      var posteurCommunity = await adhesionModel.find({idUser:posteur._id})
      var check = false
        // il est apparu que la fonction qui comparait les communautés d'utilisateur ne reconnaissait pas les formats issus de la requete BDD
        // le fait de passer par le format chaine de caractère JSON haronise et rend lisible les données
      userCommunity = JSON.stringify(userCommunity)
      userCommunity = JSON.parse(userCommunity)
      posteurCommunity = JSON.stringify(posteurCommunity)
      posteurCommunity = JSON.parse(posteurCommunity)
        for (var j=0 ; j<userCommunity.length ; j++) {
          for (var k=0 ; k<posteurCommunity.length ; k++) {
            console.log ('check', userCommunity[j].idCommunaute , posteurCommunity[k].idCommunaute)
            if (userCommunity[j].idCommunaute == posteurCommunity[k].idCommunaute ) {
              check = true
            }
          }
        }
        // si le bonplan est liké par l'user, le bonplan apparait avec ine propriété isliked à true pour afficher le coeur rouge
        if(check == true) {
      if (user.idBonPlan.indexOf(bonplan00[i]._id)) {
       bonplan.push({_id:bonplan00[i]._id, urlphoto:bonplan00[i].urlphoto, token:posteur.token, titre:bonplan00[i].titre, categorie:bonplan00[i].categorie , description:bonplan00[i].description, isliked:false, posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlAvatar})
      } else { bonplan.push({_id:bonplan00[i]._id, urlphoto:bonplan00[i].urlphoto, token:posteur.token, titre:bonplan00[i].titre, categorie:bonplan00[i].categorie , description:bonplan00[i].description, isliked:true, posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlAvatar})
      }
    }
  }
  } else {
  
    if (req.query.key == 2) {
      var user = await userModel.findOne({token:req.query.token})
      var bonplan = []
      if (user.idBonPlan.length != 0){
        for (var i=0 ; i<user.idBonPlan.length ; i++) {
          var bonPlan00 = await bonPlanModel.findOne({_id:user.idBonPlan[i]});
          var posteur = await userModel.findOne({_id:bonPlan00.idUserPosteur});
          bonplan.push({_id:bonPlan00._id, urlphoto:bonPlan00.urlphoto, tokenposteur:posteur.token, titre:bonPlan00.titre,  categorie:bonPlan00.categorie, description:bonPlan00.description,posteurFirstName:posteur.firstName, posteurAvatar:posteur.urlAvatar
          })
        }
      }      
    } else {
      if(req.query.key == 3){
        var user = await userModel.findOne({token:req.query.token})
        var myBonPlan = await bonPlanModel.find({idUserPosteur:user._id})
        var bonplan = []
        if (myBonPlan.length != 0){
          for (var i=0 ; i<myBonPlan.length ; i++) {
            bonplan.push({_id:myBonPlan[i]._id, urlphoto:myBonPlan[i].urlphoto, tokenposteur:user.token, titre:myBonPlan[i].titre,  categorie:myBonPlan[i].categorie, description:myBonPlan[i].description,posteurFirstName:user.firstName, posteurAvatar:user.urlavatar
            })
          }
        }      
      }
    }
  }
  res.json({bonplan});
});

/* --- gérer les favoris --- */
router.post('/favorite', async function(req, res, next) {

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
  // s'il y a un tokenInterlocuteur dans le req.query, la route comprend qu'ils s'agit d'une conversation en 1to1,
  // récupère les messages avec l'interlocuteur uniquement et les renvoie au FE
  if (req.query.tokenInterlocuteur){
    var me = await userModel.findOne({token:req.query.token})
    var interlocuteur = await userModel.findOne({token:req.query.tokenInterlocuteur})
    var messagesenv = await messageModel.find({idUserEmetteur:me._id , idUserDestinataire:interlocuteur._id})
    var messagesrecu = await messageModel.find({idUserEmetteur:interlocuteur._id , idUserDestinataire:me._id})
    var conversation = []

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

  } else {

   // Récupération de mes infos à partir de mon token
   // Récupération des mes messages émis et envoyés
   // Création d'un tableau de contact00 qui servira à créer et vérifier une liste d'interlocuteur unique
   // Création d'un tableau de contact qui contiendra les info de mes interlocuteurs + les infos du dernier message échangé
  var me = await userModel.findOne({token:req.query.token})
  var messagesenv = await messageModel.find({idUserEmetteur:me._id})
  var messagesrecu = await messageModel.find({idUserDestinataire:me._id})
  var contact00 = []
  var contact = []
  
   // Boucle sur mes messages envoyés pour ajouter ou mettre à jour le tableau contact
  for (var i=0 ; i<messagesenv.length ; i++) {
    var interlocuteur = await userModel.findOne({_id:messagesenv[i].idUserDestinataire})
    if (contact00.indexOf(interlocuteur.token) == -1) {
      console.log('01 premier message envoyé')
      contact00.push(interlocuteur.token);
      contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesenv[i].contenu , isRead:messagesenv[i].isRead , date:messagesenv[i].date})
    } else {
      var lastmessage = contact.filter(message => message.tokenInterlocuteur == interlocuteur.token)
      if (messagesenv[i].date > lastmessage[0].date) {
        console.log('02 autres messages envoyés')
        contact = contact.filter(message => message.tokenInterlocuteur != interlocuteur.token)
        contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesenv[i].contenu , isRead:messagesenv[i].isRead , date:messagesenv[i].date})
      }
    }
  }

  for (var i=0 ; i<messagesrecu.length ; i++) {
    var interlocuteur = await userModel.findOne({_id:messagesrecu[i].idUserEmetteur})
    if (contact00.indexOf(interlocuteur.token) == -1) {
      console.log('03 premier message recu')
      contact00.push(interlocuteur.token);
      contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesrecu[i].contenu , isRead:messagesrecu[i].isRead , date:messagesrecu[i].date})
    } else {
      var lastmessage = contact.filter(message => message.tokenInterlocuteur == interlocuteur.token)
      if (messagesrecu[i].date > lastmessage[0].date) {
        console.log('04 autres messages recus')
        contact = contact.filter(message => message.tokenInterlocuteur != interlocuteur.token)
        contact.push({avatarInterlocuteur:interlocuteur.urlAvatar , firstNameInterlocuteur:interlocuteur.firstName , tokenInterlocuteur:interlocuteur.token , contenu:messagesrecu[i].contenu , isRead:messagesrecu[i].isRead , date:messagesrecu[i].date})
      }
    }
  }
}
  res.json({contact, interlocuteur, conversation});
});


/* --- envoyer un message en BDD --- */
router.post('/send-message', async function(req, res, next) {

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

  if (req.files) {

    var imagePath = './tmp/picture'+ uniqid()+'.jpg';
    var resultCopy = await req.files.picture.mv(imagePath);
    try {var resultCloudinary = await cloudinary.uploader.upload(imagePath)}
    catch(error) { console.log('error', error); var erreur = error}
    
    if(!erreur) {
    res.json({result: true, url:resultCloudinary.secure_url} );
    } else {
    res.json({result: false, message: erreur} );
    }
    fs.unlinkSync(imagePath);

  } else {

    if (req.body.url) {

      var bonplan = await bonPlanModel.findOne({_id:req.body.idBonPlan});
      bonplan.urlphoto.push(req.body.url)
      bonplan = await bonplan.save();
      res.json({} );

    } else {
        var me = await userModel.findOne({token:req.body.token})

        var bonplan = new bonPlanModel({
          idUserPosteur: me._id,
          titre: req.body.titre,
          categorie: req.body.categorie,
          description: req.body.description,
       })
            
        bonplan = await bonplan.save()    
        
        res.json({idBonPlan:bonplan._id});
      }
    }
});

/* --- supprimer un bon plan --- */
router.delete('/delete-bonplan', async function(req, res, next) {
  console.log('delete', req.body)
  var user = await userModel.find({token:req.query.token})
  var bonplan = await bonPlanModel.deleteOne({_id:req.query.id})
 	
  res.json({user});
});

module.exports = router;
