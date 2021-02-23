export default function(CommunitySelected = [], action) {
    if(action.type == 'addCommunity') {
    var selection = [...CommunitySelected, action.communityId]
    return selection;
    }else if (action.type == 'removeCommunity'){
    var selection = [...CommunitySelected]
    var position = selection.indexOf(action.communityId)
    selection.splice(position,1)
    return selection
    } else {
    return CommunitySelected;
    }
    }