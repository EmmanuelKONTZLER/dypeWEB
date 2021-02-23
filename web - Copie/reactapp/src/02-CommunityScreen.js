import './App.css';
import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Button } from 'reactstrap';
import {Redirect} from 'react-router-dom';
import Community from './Community'
import {connect} from 'react-redux';



function CommunityScreen(props) {

  const [communityData, setCommunityData] = useState([]);
  const [done, setDone] = useState(false);

  // useEffect pour récupérer les communautés de la base de données via le backend
  useEffect(() => {
    async function communityFromBDD() {
      var data = await fetch(`/get-community`)
      data = await data.json()
      setCommunityData(data.community)
    }
    communityFromBDD();
  }, []);


  var communityList = communityData.map((data, i) => {
    return (<Community key={i} communityId={data.communityId} name={data.name} urlLogo={data.urlLogo} colorLogo={data.colorLogo} count={data.count} isSelected={data.isSelected}/> )
  })


  var rejoindre = async () => {
    if (props.communitySelected.length != 0) {
      for (var i=0 ; i<props.communitySelected.length ; i++) {
        var data = await fetch(`/adhesion`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `token=${props.token}&communityId=${props.communitySelected[i]}`
        });
        console.log('f15', data)
      }
    setDone(true) // Lorsque l'utilisateur a validé ses communautés, un état done est mis à true pour le rediriger vers la page appropriée - cf ligne 45
    }
  }

  if (done == true) {
    return <Redirect to='/05-BonPlans' />
  }
  
  console.log('11', props.token)
  if(!props.token){
    return <Redirect to='/' />
  }

  return (
    <div style={{backgroundColor:'#f1e8da', height:'100vh'}}>
      <p style={{alignItems:'center', fontSize: '500%', paddingTop: '5%', color:'#333367', width:'80%', marginLeft:'10%'}}>Rejoignez vos communautés</p>
      <Row style={{display:'flex' , justifyContent:'center', alignItems:'center', marginTop:'3%', marginBottom:'3%'}}>
        {communityList}
      </Row>
      <Row style={{ display:'flex' , justifyContent:'flex-end', marginRight:"20%"}}>
        <Button style={{width:'10%', backgroundColor:'#ef626c', display:'flex' , justifyContent:'center',}} onClick={() => rejoindre()}>Rejoindre</Button>
      </Row >
    </div>
  );
}



function mapStateToProps(state){
  return { communitySelected: state.CommunitySelected, token:state.token }
}

export default connect(
mapStateToProps,
null
)(CommunityScreen);