import './App.css';
import React, {useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import Nav from './10-nav'
import {connect} from 'react-redux';	
import ConversationIndividuelle from './ConversationIndividuelle';
import {Redirect} from 'react-router-dom'


function DirectConversation(props) {
 
  const [contact, setContact] = useState ([])
  const [interlocuteur, setInterlocuteur] = useState()
  const [conversationIndividuelle, setConversationIndividuelle] = useState([])
  const [message, setMessage] = useState('')
  const [clic, setClic] = useState(true) // état booléen pour relancer le useEffect de récupération des conversations

  console.log('listconversation 00', props.tokenInterlocuteur)

  // useEffect pour récupérer les conversations de la base de données via le backend
  useEffect(() => {
    async function getconversation() {
      var data = await fetch(`/get-conversation?token=${props.token}&tokenInterlocuteur=${props.tokenInterlocuteur}`)
      data = await data.json()
      setContact(data.contact)
      setInterlocuteur(data.interlocuteur)
      setConversationIndividuelle(data.conversation)
    }
    getconversation();
  }, [clic]);
   

  var conversationIndividuelleList = conversationIndividuelle.map((data, i) => {
    return (<ConversationIndividuelle emetteur={data.emetteur} firstName={data.firstName} contenu={data.contenu} date={data.date} />)
  })

  var sendmessage = async () => {
    var data = await fetch('/send-message', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `token=${props.token}&tokenInterlocuteur=${props.tokenInterlocuteur}&contenu=${message}`
    })
    setMessage('');
    setClic(!clic)
  }

  if(!props.token){
    return <Redirect to='/' />
  }
  

  return (
    <div style={{ backgroundColor:'#f1e8da', height:'100%', minHeight:'100vh' }}>

      <div style={{position:'fixed', width:'100vw', zIndex:1}}>
       <Nav />
      </div>

      <div style={{display:'flex' , justifyContent:'start'}}>
        <p style={{ fontSize: '400%', color:'#333367',  marginLeft:'1%', marginTop:'2%'}}>Votre discussion avec : {interlocuteur&&interlocuteur.firstName} </p>      
      </div>

    {conversationIndividuelleList?
      <div style={{display:'flex', flexDirection:'column', alignItems:'center',paddingBottom:'3%', }}>
        {conversationIndividuelleList}
      </div>
    :
      <p style={{color:'red'}}>Pas de message à afficher</p>
    }

      <div style={{display:'flex', position:'fixed', bottom:'0%', zIndex:1 , marginLeft:'17.5%'}}>
        <input style={{width:'90vh'}} type='text' placeholder='Message'  onChange = {(e) => setMessage(e.target.value)} value={message}/>
        <Button style={{width:'10vh'}} onClick={() => sendmessage()}>Envoyer</Button>
      </div>
    
    </div>
  );
}



function mapStateToProps(state){
  return { token:state.token, tokenInterlocuteur:state.tokenInterlocuteur }
}

export default connect(
mapStateToProps,
null
)(DirectConversation);