import React from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import {Navbar,} from 'reactstrap';

function NavBar() {

  return (
    
    <Navbar style={{display:'flex', justifyContent:'space-around', backgroundColor:'#333367',}} >
             
        <Link to="/05-BonPlans" style={{color:'white'}}>         
          Bon Plans
        </Link>

        <Link to="/08-ListConversation" style={{color:'white'}}>          
          Conversations
        </Link>

        <Link to="/06-AddBonPlan" style={{color:'white'}}>         
          Ajouter un bon plan
        </Link>

        <Link to="/07-Favoris" style={{color:'white'}}>          
          Favoris
        </Link>

        <Link to="/03-Profil" style={{color:'white'}}>          
          Profil
        </Link>
      
    </Navbar>
  
  );
}

export default NavBar;



