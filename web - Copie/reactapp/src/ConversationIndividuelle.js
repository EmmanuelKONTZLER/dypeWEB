import React from 'react';					
import { Col, CardTitle} from 'reactstrap';									
import 'bootstrap/dist/css/bootstrap.min.css';				
import {connect} from 'react-redux';	

				
function ConversationIndividuelle (props) {				
  
    if (props.emetteur == props.token) {
        var backgroundColor = '#333367';
        var color = 'white';
        var marginLeft = "16.66%"
    } else {
        var backgroundColor = '#ffffff';
        var color = '#000000';
        var marginLeft = "0%"
    }
           
    return (				
        <Col xs="12" md="8" style={{marginTop:'2%', }} >				          
            <CardTitle  style={{backgroundColor:backgroundColor, color:color, marginBottom:0, width:'80%' , borderRadius:10, marginLeft:marginLeft, }} >{props.contenu}</CardTitle>
            <p  style={{ marginBottom:0, marginLeft:marginLeft,  }} >{props.firstName}</p>
        </Col>				
    )				
}				
				
function mapStateToProps(state){
    return { token:state.token }
}
  
export default connect(
mapStateToProps,
null
)(ConversationIndividuelle);

  