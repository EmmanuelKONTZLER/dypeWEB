import './App.css';
import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './10-nav'
import Bonplanliked from './Bonplanliked'
import {connect} from 'react-redux';
import {Row } from 'reactstrap';


function Favoris(props) {
  
  const [bonPlan, setBonPlan] = useState([])
  const [change, setChange] = useState(false) // état dont le booleen est modifié par un composant enfant pour relancer le usrEffect du composant parent
  
  // useEffect pour récupérer les bons plans 'likés' de la base de données via le backend
  useEffect(() => {
    async function getbonplan() {      
      var data = await fetch(`/get-bonplan?token=${props.token}&key=2`) // La lecture des bons plans peut être appelée de 3 façons (Page principale, favoris et profil) d'ou la mise en place de key pour conditionner le backend
      data = await data.json()
      setBonPlan(data.bonplan)
    }
    getbonplan();
  }, [change]);

  // Utilisation de reverse data flow - Lorsque l'utilisateur supprime un bon plan qu'il a créé (à partir du composant enfant MyBonPlan), un signal est envoyé dans le composant parent pour 'relancer' le useEffect ligne 16 à 23
  var clic = () => {
    setChange(!change)
  }


  var bonPlanList = bonPlan.map((plan,i)=>{
    return (<Bonplanliked key={i} _id={plan._id} urlphoto={plan.urlphoto} tokenposteur={plan.tokenposteur} titre={plan.titre} categorie={plan.categorie} description={plan.description} posteurAvatar={plan.posteurAvatar} clicParent={clic}/>)
  })


  return (
    <div style={{ backgroundColor:'#f1e8da',width:'100vw' }}>

      <div style={{position:'fixed', width:'100vw', zIndex:1}}>
        <Nav />
      </div>

      <div style={{display:'flex' , flexDirection:'column', height:'100vh'}}>

      <p style={{ fontSize: '500%', color:'#333367',  marginLeft:'1%', marginTop:'2%'}}>Favoris</p>

    {bonPlanList.length==0?
      <p style={{marginLeft:'1%', color:'red'}}>Pas de Favori</p>
    :
      <Row style={{marginLeft:'0.5%', width:'99vw'}}>
       {bonPlanList}
      </Row>
    }

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
)(Favoris);