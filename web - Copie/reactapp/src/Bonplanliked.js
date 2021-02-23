import React, { useState } from 'react';				
import { Card, Row, Col, CardText, CardBody, CardTitle, Button } from 'reactstrap';										
import 'bootstrap/dist/css/bootstrap.min.css';				
import {connect} from 'react-redux';	
import { FaHeart } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import {Modal} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';


				
function Bonplanliked (props) {				
  
  const [visible, setVisible] = useState(false) // Etat permettant l'affichage du détail d'un bonplan
  const [visible2, setVisible2] = useState(false) // Etat permettant l'affichage des photos d'un bonplan
  const [done, setDone] = useState(false) // état booleen qui conditionne la redirection de l'utilisateur vers la page appropriée

  // Cette fonction appelle la route /favorite en envoyant une idBonPlan. Le backend est conditionné pour surrpimer ce bon plan de la liste des favoris de l'utilisateur
  var favorite = async (id) => {  
      var data = await fetch('/favorite',{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `token=${props.token}&idBonPlan=${id}`
    });
    data = await data.json()
    props.clicParent()
  }

  var photobonplan = props.urlphoto.map((photo, i) => {
    return (<img style={{width:'15%', marginLeft:'1%'}} src={photo} onClick={() => setVisible2(true)} />)
  })
  
  var direct =  (tokenInterlocuteur) => {
    props.addTokenInterlocuteur(tokenInterlocuteur); // Lorsque l'utilisateur souhaite entrer en contact avec le posteur d'annonce, le token de l'interlocuteur est envoyé dans le store de redux pour être disponible dans les autres conposants de l'appli - en l'occurence DirectConversation
    setDone(true)
  }

  if (done == true) {
    return <Redirect to='/09-DirectConversation'/>
  }

  
return (				
<Col xs="12" sm='6' md="3" lg="4" xl="2" style={{marginTop:'2%'}} >		

      <Card style={{height:"70vh"}}>
        <CardBody style={{padding:0, height:'10%'}} >
          <CardTitle  tag="h5">{props.titre}</CardTitle>
        </CardBody>

        {props.urlphoto[0]==undefined?
          <CardBody style={{padding:0, height:'40%', display:'flex', justifyContent:'space-around'}} >
            <img src='./logo192.png' alt={props.titre} />
          </CardBody>
        :
          <CardBody style={{padding:0, height:'40%', display:'flex', justifyContent:'space-around'}} >
          <img width="90%" height="100%" src={props.urlphoto[0]} alt={props.titre} />
          </CardBody>
        }
          
        <CardBody style={{ height:'30%'}}>
            <CardText>{props.description}</CardText>
        </CardBody>

        <CardBody style={{display:'flex', justifyContent:'space-around', padding:0, height:'10%'}}>
          <FaHeart style={{width:'20%', height:'50%', color:'#ef626c' , }} onClick={() => favorite(props._id)}/>
          <FaPlus  style={{width:'20%', height:'50%', color:'#333367' , }} onClick={() => setVisible(true)}/>
          <FaPaperPlane  style={{width:'20%', height:'50%', color:'#333367'}} onClick={() => direct(props.tokenposteur)}/>
        </CardBody>
        
      </Card>	

      <Modal show={visible} size='sm' centered={true} >
        <Card >
          <div style={{display:'flex', justifyContent:'space-around'}}>
          <p>Bon Plan posté par </p>
          <p style={{fontWeight:'bold'}}>{props.posteurFirstName}</p>

        {props.posteurAvatar?
          <img src={props&&props.posteurAvatar} style={{width:'16%', marginLeft:'2%'}} />
        :
          <img src='./logo192.png' style={{width:'16%', marginLeft:'2%'}} />
        }

          </div>
          <p style={{fontWeight:'bold'}}>Catégorie</p>
          <p>{props.categorie}</p>

          <p style={{fontWeight:'bold'}}>titre</p>
          <p>{props.titre}</p>

          <p style={{fontWeight:'bold'}}>Description</p>
          <p>{props.description}</p>

          <p style={{fontWeight:'bold'}}>Plus de photos</p>
          <Row style={{display:'flex' , justifyContent:'center'}}>
            {photobonplan}
          </Row>
          
        </Card>

        <div style={{display:'flex' , justifyContent:'center',}}>
            <Button style={{backgroundColor:'red', width:'30%'}} onClick={() => setVisible(false)}>close</Button>
        </div>
      </Modal>

      <Modal show={visible2} size='xl' centered={true} >
        <Card >          
          <Row style={{display:'flex' , justifyContent:'center'}}>
            {photobonplan}
          </Row>
          <div style={{display:'flex' , justifyContent:'center',}}>
            <Button style={{backgroundColor:'red', width:'10%',}} onClick={() => setVisible2(false)}>close</Button>
          </div>
        </Card>
      </Modal>
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
)(Bonplanliked);