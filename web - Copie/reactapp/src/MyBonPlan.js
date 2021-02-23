import React, { useState } from 'react';											
import { Card,Row, Col , CardText, CardBody, CardTitle, Button, } from 'reactstrap';				
import 'bootstrap/dist/css/bootstrap.min.css';				
import {connect} from 'react-redux';	
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import {Modal} from 'react-bootstrap'



				
function Bonplanliked (props) {				
  
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
 

  var photobonplan = props.urlphoto.map((photo, i) => {
    return (<img style={{width:'15%', marginLeft:'1%'}} src={photo} onClick={() => setVisible2(true)} />)
  })
  
  var deleteBonPlan = async (id) => {
    var data = await fetch(`/delete-bonplan?id=${id}&token=${props.token}`,{
      method: 'DELETE',
      });
      props.clicparent()
  }

 

  
  return (				
    <Col xs="12" sm='6' md="3"  style={{marginTop:'2%'}} >				
        <Card style={{height:"70vh"}}>

          <CardBody style={{padding:0, height:'10%'}} >
            <CardTitle  tag="h5">{props.titre}</CardTitle>
          </CardBody>

          {props.urlphoto[0]==undefined?
            <CardBody style={{padding:0,  display:'flex', justifyContent:'space-around'}} >
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
            <FaPlus  style={{width:'20%', height:'50%', color:'#333367' , }} onClick={() => setVisible(true)}/>
            <FaTrashAlt  style={{width:'20%', height:'50%', color:'red' , }} onClick={() => deleteBonPlan(props._id)}/>
          </CardBody>
          
        </Card>		

        <Modal show={visible} size='sm' centered={true} >
          <Card >

            <div style={{display:'flex', justifyContent:'space-around'}}>
              <p>Bon Plan posté par </p>
              <p style={{fontWeight:'bold'}}>{props.posteurFirstName}</p>
              <img src='./logo192.png' style={{width:'16%', marginLeft:'2%'}} />
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

export default connect(
mapStateToProps,
null
)(Bonplanliked);