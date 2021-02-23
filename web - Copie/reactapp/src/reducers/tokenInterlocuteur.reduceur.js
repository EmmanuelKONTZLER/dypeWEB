export default function(tokenInterlocuteur = '', action) {
    if(action.type == 'addTokenInterlocuteur') {
        console.log('token interlocuteur in reduceur :' , action.tokenInterlocuteur)
     return action.tokenInterlocuteur;
    } else {
     return tokenInterlocuteur;
    }
    }