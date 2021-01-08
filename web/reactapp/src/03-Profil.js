import './App.css';
import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardText, CardBody,  CardTitle, Button, Col, Row } from 'reactstrap';
import Nav from './10-nav'
import {connect} from 'react-redux';
import Modal from 'react-bootstrap/Modal'
import MyBonPlan from './MyBonPlan'


function Profil(props) {

  const [lastName, setLastName] = useState('')
  const [modifLast, setModifLast] = useState(false) // etat booléen qui conditionne l'affichage ou la modification du lastName
  const [firstName, setFirstName] = useState('')
  const [modifFirst, setModifFirst] = useState(false) // etat booléen qui conditionne l'affichage ou la modification du firstName
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [password3, setPassword3] = useState('')
  const [modifPassword, setModifPassword] = useState(false)
  const [error, setError] = useState([])
  const [user, setUser] = useState('')
  const [myCommunity, setMyCommunity] = useState([])
  const [visible, setVisible] = useState(false) // etat booléen qui conditionne l'affichage de la fenêtre de modification de l'avatar
  const [avatar, setAvatar] = useState([])
  const [photo, setPhoto] = useState([])
  const [bonPlan, setBonPlan] = useState([])
  const [change, setChange] = useState(false)  // état dont le booleen est modifié par un composant enfant pour relancer le usrEffect du composant parent
  
  // useEffect pour récupérer les info utilisateur via le backend
  useEffect(() => {
    async function getprofil() {
      var data = await fetch(`/get-profil?token=${props.token}`)
      data = await data.json()
      setEmail(data.user.email)
      setLastName(data.user.lastName)
      setFirstName(data.user.firstName)
      setMyCommunity(data.myCommunity)
      setAvatar(data.user.urlAvatar)
      var myBonPlan = await fetch(`/get-bonplan?token=${props.token}&key=3`) // La lecture des bons plans peut être appelée de 3 façons (Page principale, favoris et profil) d'ou la mise en place de key pour conditionner le backend
      myBonPlan = await myBonPlan.json()
      setBonPlan(myBonPlan.bonplan)
    }
    getprofil();
  }, [change]);

  // Utilisation de reverse data flow - Lorsque l'utilisateur supprime un bon plan qu'il a créé (à partir du composant enfant MyBonPlan), un signal est envoyé dans le composant parent pour 'relancer' le useEffect ligne 34 à 48
  var clic = () => {
    setChange(!change)
  }

  var bonPlanList = bonPlan.map((plan,i) => {
    return(<MyBonPlan key={i} _id={plan._id} urlphoto={plan.urlphoto} tokenposteur={plan.tokenposteur} titre={plan.titre} categorie={plan.categorie} description={plan.description} clicparent={clic}/>)
  })

  var modif = async (arg) => {
    var data = await fetch('/change-profil',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `token=${props.token}&key=${arg}&firstName=${firstName}&lastName=${lastName}`
    });

    data = await data.json()
    // setUser(data.user)
    if (arg == 'last') {
      setModifLast(false)
    }
    if (arg == 'first') {
      setModifFirst(false)
    }      
  }

  
  var sendAvatar = async () => {

    // envoi de la photo vers le backend puis vers Cloudinary pour obtenir l'url
    var data = new FormData();
    data.append('picture', photo.target.files[0]);	
    var rawResponse = await fetch("/avatar", {	
      method: 'post',
      body: data
    })	
    var response = await rawResponse.json();

    // envoi de l'url vers le backend pour enregistrement dans la base de données
    var data2 = await fetch('/avatar',{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `token=${props.token}&url=${response.url}`
      });
    data2 = await data2.json() 
    setAvatar(data2.url);
    setVisible(false)
  }
  

  var communityList = myCommunity.map((data,i)=>{
    var logo = `./logo192.png`
    return (    
      <Col xs='12' sm='6' md="4" lg='2' >
        <Card  style={{backgroundColor:data.colorLogo , borderRadius:10, marginTop:'15%'}}>
          <CardImg top  src={logo} alt="Card image cap" />
          <CardBody>
            <CardTitle style={{color:'white'}} tag="h5">{data.name}</CardTitle>
            <CardText style={{color:'white'}}>{data.count} adhérents</CardText>
          </CardBody>
        </Card>
      </Col>)
  })




  return (
    
    <div style={{ backgroundColor:'#f1e8da',height:'100%', minHeight:'100vh' }}>
      <Nav/>
      <div style={{display:'flex', justifyContent:'start', alignItems:'center' }}>
        <p style={{ fontSize: '500%', color:'#333367',  marginLeft:'1%'}}>PROFIL</p>
        <img src={avatar}  style={{width:'6%', height:'12%', marginLeft:'5%'}}  onClick={() => setVisible(true)}/>
      </div>
        {/* Info et Modification des données utilisateur */}
      <div style={{display:'flex' , justifyContent:'space-between', }}>
        <div className='profil'>
          <p style={{fontSize:20,fontWeight:'bold', marginLeft:'2%',marginTop:'2%' }}>Mes info</p>

          <div style={{display:'flex', marginLeft:'2%', marginBottom:'2%'}}>
            <p style={{backgroundColor:'white',width:'90%', height:'100%', marginBottom:0}}>{email}</p>
          </div>

          {modifLast ?
              <div style={{display:'flex', marginLeft:'2%', marginBottom:'2%'}}>
              <input style={{backgroundColor:'white',width:'90%', height:'100%', marginBottom:0}} placeholder={lastName} onChange={(e) => setLastName(e.target.value)}/>
              <Button style={{backgroundColor:'red', marginLeft:'1%',width:'4%', padding:0}} onClick={() => setModifLast(false)}>X</Button>
                <Button style={{backgroundColor:'green', marginLeft:'1%',width:'4%', padding:0}} onClick={() => modif('last')}>V</Button>
              </div>
          :
                <div style={{display:'flex', marginLeft:'2%', marginBottom:'2%'}}>
              <p style={{backgroundColor:'white',width:'90%', height:'100%', marginBottom:0}}>{lastName}</p>
                <Button style={{backgroundColor:'#333367', marginLeft:'1%',width:'9%', padding:0}} onClick={() => setModifLast(true)}>Modifier</Button>
              </div>
          }

          {modifFirst?
            <div style={{display:'flex', marginLeft:'2%', marginBottom:'2%'}}>
              <input style={{backgroundColor:'white',width:'90%', height:'100%', marginBottom:0}} placeholder={firstName} onChange={(e) => setFirstName(e.target.value)}/>
              <Button style={{backgroundColor:'red', marginLeft:'1%',width:'4%', padding:0}} onClick={() => setModifFirst(false)}>X</Button>
                <Button style={{backgroundColor:'green', marginLeft:'1%',width:'4%', padding:0}} onClick={() => modif('first')}>V</Button>
              </div>
          :
              <div style={{display:'flex', marginLeft:'2%', marginBottom:'2%'}}>
                <p style={{backgroundColor:'white',width:'90%', height:'100%', marginBottom:0}}>{firstName}</p>
                <Button style={{backgroundColor:'#333367', marginLeft:'1%',width:'9%', padding:0}} onClick={() => setModifFirst(true)}>Modifier</Button>
              </div>
          }
        </div>
      </div>

      <div style={{display:'flex' , justifyContent:'space-between', marginTop:'2%'}}>
        <div className='profil'>
          <p style={{fontSize:20,fontWeight:'bold', marginLeft:'2%', }}>Mes Communautés</p>
          <div style={{display:'flex'}}>
            {communityList}
          </div>
        </div>      
      </div>

      <div style={{display:'flex' , justifyContent:'space-between', marginTop:'3%',}}>
        
        <div className='profil'>
          <p style={{fontSize:20,fontWeight:'bold', marginLeft:'2%', }}>Mes Bons Plans</p>
          <Row style={{marginLeft:0}}>
          {bonPlanList}
          </Row>
        </div>

      </div>

      <Modal show={visible} size='sm' centered={true} >
          <img src={avatar} style={{width:'80%', marginLeft:'10%'}} />
          <label for="file">Sélectionner le fichier à envoyer</label>
          <form id="userForm" >
            <div>
              <input type="file" name="picture" onChange={(e) => setPhoto(e)}/>
            </div>
            <div style={{display:'flex'}}>
              <Button style={{backgroundColor:'red', width:'50%'}}  onClick={() => setVisible(false)}>close</Button>
              <Button  style={{backgroundColor:'green', width:'50%'}} onClick={() => sendAvatar()} >Valid</Button>
            </div>  
          </form>
      </Modal>

    </div>
    
  );
}


function mapStateToProps(state){
  return { communitySelected: state.CommunitySelected, token:state.token }
}

export default connect(
mapStateToProps,
null
)(Profil);