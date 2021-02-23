import './App.css';
import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Row } from 'reactstrap';
import Nav from './10-nav'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'

function AddBonPlan(props) {

  const [categorieSelected, setCategorieSelected] = useState('')
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [picture, setPicture] = useState([])

  var categories = ['Logement', 'Multimédia', 'Textile', 'Emploi', 'Food', 'Divers']
  
 
  var categoriesList = categories.map((data, i) => {
    if ( categorieSelected == data) { var color = 'red'} else {var color = '#333367'}
    return (<Button key={i} style={{marginLeft:'1%', backgroundColor:color}} onClick={() => setCategorieSelected(data)}>{data}</Button>)       
  })

  var publier = async () => {
    // le bon plan est créé sans photo
    var data1 = await fetch('/add-bonplan', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `token=${props.token}&titre=${titre}&description=${description}&categorie=${categorieSelected}`
    })
    setCategorieSelected('');
    setTitre('');
    setDescription('')
    data1 = await data1.json()
    
    // 1 par 1 les photos sont envoyées vers Cloudinary pour obtenir l'url correspondant qui est enregistré en base de données 
    for (var i=0 ; i<picture.length ; i++) {
      var data2 = new FormData();
      data2.append('picture', picture[i]);	
      var rawResponse = await fetch("/add-bonplan", {	
        method: 'post',
        body: data2
      })	
      var response = await rawResponse.json();

      var data = await fetch('/add-bonplan',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `idBonPlan=${data1.idBonPlan}&url=${response.url}`
        });
      data = await data.json() 
    }
  }

  if(!props.token){
    return <Redirect to='/' />
  }

  return (
    <div style={{ backgroundColor:'#f1e8da',width:'100vw' , height:'100vh'}}>

      <div style={{position:'fixed', width:'100vw', zIndex:1}}>
        <Nav />
      </div>

      <div style={{display:'flex' ,}}>
        <p style={{ fontSize: '500%', color:'#333367',  marginLeft:'1%', marginTop:'2%'}}>AddBonPlan</p>
      </div>

      <div style={{marginLeft:'2%'}}>
        
        <p>Choisissez la catégorie :</p>

        <Row>
          {categoriesList}
        </Row>

        <p  style={{marginTop:'2%'}}>Titre de votre Bon Plan :</p>
        
        <input onChange={(e) => setTitre(e.target.value)} value={titre} style={{width:'50vw'}} type='text'/>
        
        <p style={{marginTop:'2%'}}>Description de votre Bon Plan :</p>
        
        <input onChange={(e) => setDescription(e.target.value)} value={description} style={{width:'50vw'}} type='text'/>
        
        <p style={{marginTop:'2%'}}>Ajoutez des photos :</p>
        
        <input style={{width:'50vw'}} type='file' multiple={true} onChange={(e) =>setPicture(e.target.files)} />
        
        <Button  style={{marginLeft:'1%', backgroundColor:'#333367'}} onClick={() => publier()} >Publier</Button>
        
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
)(AddBonPlan);