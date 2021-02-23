import React from 'react';

import './App.css';

/* --- Import des modules et des composants liés à la navigation --- */
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './01-signin-signup';
import CommunityScreen from './02-CommunityScreen';
import Profil from './03-Profil';
import BonPlans from './05-BonPlans';
import AddBonPlan from './06-AddBonPlan';
import Favoris from './07-Favoris';
import ListConversation from './08-ListConversation';
import DirectConversation from './09-DirectConversation';


/* --- Import des modules relatifs au Store redux --- */
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'

/* --- Import des réduceurs --- */
import token from './reducers/token.reducer'
import CommunitySelected from './reducers/community.reducer'
import tokenInterlocuteur from './reducers/tokenInterlocuteur.reduceur'

/* --- Enregistrement des états dans le store --- */
const store = createStore(combineReducers({ token, CommunitySelected, tokenInterlocuteur }))


function App() {
  console.log('A01', token)
  return (

    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={Home} path="/" exact />
          <Route component={CommunityScreen} path="/02-CommunityScreen" exact />
          <Route component={Profil} path="/03-Profil" exact />
          <Route component={BonPlans} path="/05-BonPlans" exact />
          <Route component={AddBonPlan} path="/06-AddBonPlan" exact />
          <Route component={Favoris} path="/07-Favoris" exact />
          <Route component={ListConversation} path="/08-ListConversation" exact />
          <Route component={DirectConversation} path="/09-DirectConversation" exact />
        </Switch>
      </Router>
    </Provider>
    

  );
}

export default App;
