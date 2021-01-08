import './App.css';
import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Button } from 'reactstrap';
import Nav from './10-nav'
import {connect} from 'react-redux';
import Bonplan from './Bonplan'


function BonPlans(props) {

  const [bonPlan, setBonPlan] = useState ([])
  const [categorieSelected, setCategorieSelected] = useState('')

  var categories = ['Logement', 'Multimédia', 'Textile', 'Emploi', 'Food', 'Divers']
 
  // useEffect pour récupérer les bons plans de la base de données via le backend
  useEffect(() => {
    async function getbonplan() { 
      var data = await fetch(`/get-bonplan?token=${props.token}&key=1&categorie=${categorieSelected}`) // La lecture des bons plans peut être appelée de 3 façons (Page principale, favoris et profil) d'ou la mise en place de key pour conditionner le backend
      data = await data.json()
      setBonPlan(data.bonplan)
      }
    getbonplan();
  }, [categorieSelected]);  

  var bonPlanList = bonPlan.map((plan,i) => {        
    return(<Bonplan key={i} _id={plan._id} categorie={plan.categorie} description={plan.description} tokenPosteur={plan.token} titre={plan.titre} urlphoto={plan.urlphoto} isliked={plan.isliked} posteurFirstName={plan.posteurFirstName} posteurAvatar={plan.posteurAvatar} />)
  })

  // Affichage des bons plans par catégorie
  // S'il n'y a pas de catégorie selectionnée, tous les boutons de selection sont #333367 et attendent une sélection
  if (categorieSelected == ''){
    var categoriesList = categories.map((data, i) => {
      return (
      <Button key={i} style={{marginLeft:'1%', backgroundColor:'#333367'}} onClick={() => setCategorieSelected(data)}>{data}</Button>)       
    })
  } else {
    var categoriesList = categories.map((data, i) => {
      // Si une catégorie est sélectionnée, la bouton de la catégorie sélectionnée sera red et pourra être désélectionné
      if ( categorieSelected == data) { 
      return (
      <Button key={i} style={{marginLeft:'1%', backgroundColor:'red'}} onClick={() => setCategorieSelected('')}>{data}</Button>)
      } else {
        // les autres boutons seront #333367 et attendent une sélection
        return (
        <Button key={i} style={{marginLeft:'1%', backgroundColor:'#333367'}} onClick={() => setCategorieSelected(data)}>{data}</Button>)
      } 
    })
  }
      
  return (
    <div style={{ backgroundColor:'#f1e8da',width:'100vw', height:'100%', minHeight:'100vh' }}>

      <div style={{position:'fixed', width:'100vw', zIndex:1}}>
        <Nav />
      </div>

      <div style={{display:'flex' , justifyContent:'center', flexDirection:'column', }}>
        
        <p style={{ fontSize: '500%', color:'#333367',  marginLeft:'1%', marginTop:'2%'}}>BonPlans</p>

        <Row style={{marginLeft:'0.5%', width:'99vw'}}>
          {categoriesList}
        </Row>

        <Row style={{marginLeft:'0.5%', width:'99vw'}}>
          {bonPlanList}
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
)(BonPlans);