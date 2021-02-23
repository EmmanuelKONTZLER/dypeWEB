export default function(token = '', action) {
    if(action.type == 'addToken') {
        console.log('R01', action.token)
    return action.token;
    
    } else {
        console.log('R02', action.token)
    return token;
    }
    }