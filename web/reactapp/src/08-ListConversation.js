import './App.css';
import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'reactstrap';
import {connect} from 'react-redux';
import Nav from './10-nav'
import Conversations from './Conversations'


function ListConversation(props) {

  const [contact, setContact] = useState([])

  // useEffect pour récupérer la liste des conversations de la base de données via le backend
  useEffect(() => {
    async function getconversation() {
      var data = await fetch(`/get-conversation?token=${props.token}`)
      data = await data.json()
      setContact(data.contact)    
    }
    getconversation();
  }, []);

   

  var contactList = contact.map((data, i) => {
    return(<Conversations key={i} avatarInterlocuteur={data.avatarInterlocuteur} firstNameInterlocuteur={data.firstNameInterlocuteur} tokenInterlocuteur={data.tokenInterlocuteur} contenu={data.contenu} isRead={data.isRead} date={data.date}/>)
  })
  

  return (
    <div style={{ backgroundColor:'#f1e8da',width:'100vw' , height:'100vh'}}>

      <div style={{position:'fixed', width:'100vw', zIndex:1}}>
      <Nav />
      </div>

      <div style={{display:'flex' , justifyContent:'center', flexDirection:'column', }}>
        <p style={{ fontSize: '500%', color:'#333367',  marginLeft:'1%', marginTop:'2%'}}>Liste des conversations</p>
        <Row style={{marginLeft:'0.5%', width:'99vw'}}>
          {contactList}
        </Row>
      </div>
      
    </div>
  );
}



function mapStateToProps(state){
  return { token:state.token }
}

export default connect(
mapStateToProps,
null
)(ListConversation);