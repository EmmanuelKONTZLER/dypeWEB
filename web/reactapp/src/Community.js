import './App.css';
import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, CardImg, CardText, CardBody,  CardTitle, Button, Col} from 'reactstrap';
import {connect} from 'react-redux';


function Community(props) {

  // le logo de React servira d'image à chaque fois que l'utilisateur n'a pas personnalisé ses publications avec une photo
  var logo = `./logo192.png`

  // l'état selected est un booléen.
  // Il est défini avec la valeur d'une propriété.
  // Cette propriété est évidemment false lors de l'inscription de l'utilisateur
  // le développement d'une prochaine fonctionnalité permettra à l'utilisateur de revenir sur l'adhésion à une communauté, il verra alors à quelles communautés il aura déja adhéré
  const [selected, setSelected] = useState(props.isSelected)


  return (
    <Col xs='12' sm='6' md="4" ld='3' xl='2' >
      <Card  style={{backgroundColor:props.colorLogo , borderRadius:10, marginTop:'15%'}}>
        <CardImg top width="100%" height='100%' src={logo} alt="Card image cap" />
        <CardBody>

          <CardTitle style={{color:'white'}} tag="h5">{props.name}</CardTitle>
          <CardText style={{color:'white'}}>{props.count} adhérents</CardText>

        {selected?
          <Button  style={{width:"100%",  backgroundColor:'green', border:'none' }}
                   onClick={()=>{setSelected(!selected); props.removeCommunity(props.id)}}>
                   Déselectionner</Button>
        :
          <Button  style={{width:"100%", backgroundColor:'#333367', border:'none'}} 
                   onClick={()=>{setSelected(!selected); props.addCommunity(props.communityId)}}>
                   Choisir</Button>
        }
        </CardBody>
      </Card>
    </Col>
    
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addCommunity: function(communityId) {dispatch( {type: 'addCommunity', communityId })},
    removeCommunity: function(communityId) {dispatch( {type: 'removeCommunity', communityId })}
   
  }
}


export default connect(
null,
mapDispatchToProps
)(Community);


