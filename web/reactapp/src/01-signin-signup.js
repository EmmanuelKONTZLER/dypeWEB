import './App.css';
import React, {useState, } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';
import {Redirect} from 'react-router-dom'
import Nav from './10-nav'
import {connect} from 'react-redux';
import Form from 'react-bootstrap/Form'


function Home(props) {

  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email1, setEmail1] = useState('')
  const [password1, setPassword1] = useState('')
  const [email2, setEmail2] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorSignIn, setErrorSignIn] = useState([])
  const [errorSignUp, setErrorSignUp] = useState([])
  const [user, setUser] = useState('')
  

  var inscription = async () => {
    
    var data = await fetch('/sign-up', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `lastName=${lastName}&firstName=${firstName}&email1=${email1}&password1=${password1}`
    })

    data = await data.json()
 
    if (data.result == false) {
      setErrorSignUp(data.error)
    } else {
      setLastName('')
      setFirstName('')
      setEmail1('')
      setPassword1('')
      props.addToken(data.user.token) // envoi du token dans le store redux pour le rendre disponible dans tous les composants
      setUser(1) // Les parcours sign-in et sign-up étant défférents, l'attribution d'un code servira à rediriger l'utilisateur vers la page appropriée - cf ligne 84
    }
  } 
    

  var errorSignUpList = errorSignUp.map((error,i) => {
    return(<p style={{color:'red'}}>{error}</p>)
  })


  var connexion = async () => {
  
    var data = await fetch('/sign-in', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `email2=${email2}&password2=${password2}`
    })

    data = await data.json()

    if (data.result == false) {
      setErrorSignIn(data.error)
    } else {
      setEmail2('')
      setPassword2('')
      props.addToken(data.user.token) // envoi du token dans le store redux pour le rendre disponible dans tous les composants
      setUser(2) // Les parcours sign-in et sign-up étant défférents, l'attribution d'un code servira à rediriger l'utilisateur vers la page appropriée - cf ligne 84
    }
  }

  var errorSignInList = errorSignIn.map((error,i) => {
    return(<p style={{color:'red'}}>{error}</p>)
  })


  if(user == 1 ){
    return <Redirect to='/02-CommunityScreen' />
  } else if (user == 2) {
    return <Redirect to='/05-BonPlans' />
  }

  return (
    <div style={{backgroundColor:'#f1e8da', height:'100vh'}}>
      <Nav/>
      <p style={{alignItems:'center', fontSize: '500%', paddingTop: '10%', color:'#333367', width:'80%', marginLeft:'10%'}}>DYPE</p>
      <div className='signprocess'>

        <Form className='inscription'>
          <p style={{fontSize:20,fontWeight:'bold', marginLeft:'2%', }}>Inscription</p>
          <Form.Control onChange={(e) => setLastName(e.target.value)} value={lastName} type='text' placeholder='Lastname' className='input01'/>
          <Form.Control onChange={(e) => setFirstName(e.target.value)} value={firstName} type='text' placeholder='Firstname'className='input01'/>
          <Form.Control type='email' onChange={(e) => setEmail1(e.target.value)} value={email1}  placeholder='E-mail'className='input01'/>
          <Form.Control onChange={(e) => setPassword1(e.target.value)} value={password1} type='password' placeholder='Password'className='input01'/>
          {/* <br className='input01'/> */}
          <Button style={{backgroundColor:"#333367", width:'50%', marginTop: '5%'}}  type="submit" className='button01' onClick = {() => inscription()}>Inscription</Button>
          <br className='input01'/>
          {errorSignUpList}
        </Form>
      
        <Form.Group className='inscription'>
          <p style={{fontSize:20,fontWeight:'bold', marginLeft:'2%'}}>Connexion</p>
          <Form.Control onChange={(e) => setEmail2(e.target.value)} type='email' placeholder='E-mail'className='input01' />
          <Form.Control onChange={(e) => setPassword2(e.target.value)} type='password' placeholder='Password'className='input01' />
          <br className='input01'/><br className='input01'/><br className='input01'/><br className='input01'/>
          <Button style={{backgroundColor:"#333367", width:'50%'}}  type="submit" className='button01' onClick = {() => connexion()}>Connexion</Button>
          <br className='input01'/>
          {errorSignInList}
        </Form.Group>
        
      </div>
    </div>
  );
}



function mapDispatchToProps(dispatch) {
  return {
    addToken: function(token) {
    dispatch( {type: 'addToken', token })
    }
  }
}

function mapStateToProps(state){
return { token: state.token }
}

export default connect(
mapStateToProps,
mapDispatchToProps
)(Home);