import React, { useState } from 'react';
import { Card,  CardBody, CardTitle, Col} from 'reactstrap';				
import 'bootstrap/dist/css/bootstrap.min.css';				
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';


	
				
function Conversations (props) {				
  
    const [done, setDone] = useState(false)

    var direct =  (tokenInterlocuteur) => {
        props.addTokenInterlocuteur(tokenInterlocuteur); // Lorsque l'utilisateur souhaite entrer en contact avec le posteur d'annonce, le token de l'interlocuteur est envoyé dans le store de redux pour être disponible dans les autres conposants de l'appli - en l'occurence DirectConversation
        setDone(true)
    }

    if (done == true) {
    return <Redirect to='/09-DirectConversation'/>
    }
     
      
  return (				
    <Col xs="12" sm='6' md="3" lg="4" xl="3" style={{marginTop:'2%'}} >				
        <Card onClick={() => direct(props.tokenInterlocuteur)}>
          <CardBody style={{padding:0, display:'flex', justifyContent: 'space-around', alignItems:'center', marginBottom:'2%'}} >
              {props.avatarInterlocuteur?
              <img src={props.avatarInterlocuteur} alt={props.firstNameInterlocuteur} style={{height:'8vh',}} />
              :
              <img src='./logo192.png' alt={props.firstNameInterlocuteur} style={{height:'8vh'}} />
              }            
              <CardTitle  tag="h5">{props.firstNameInterlocuteur}</CardTitle>
          </CardBody>
          <CardBody style={{padding:0, display:'flex', justifyContent: 'space-around', alignItems:'center'}} >
              <p>Dernier message :</p>
              <p>{props.contenu}</p>
          </CardBody>

          
        </Card>		
          
    </Col>				
  )				
}				
				
function mapStateToProps(state){
  return { token:state.token }
  }

  function mapDispatchToProps(dispatch) {
    return {
      addTokenInterlocuteur: function(tokenInterlocuteur) {
      dispatch( {type: 'addTokenInterlocuteur', tokenInterlocuteur })
      }
    }
 }

  export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(Conversations);