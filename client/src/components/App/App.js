import React, {
  useState,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import styled from 'styled-components';

import GlobalStyles from '../GlobalStyles';
// import { AuthContext } from '../AuthContext';

import Navbar from '../Navbar';
import Homepage from '../../pages/Homepage';
import Game from '../../pages/Game';

const App = () => {
  // const {
  //   appUser,
  //   signInWithGoogle,
  //   handleSignOut,
  //   } = useContext(AuthContext);
  
  return (
    <Router>
      {/*global components*/}
      <GlobalStyles />
      <Navbar />
      {/*different pages*/}
      <Switch>
        <Route path='/' exact>
          <Homepage />
        </Route>
        <Route path='/game' >
          <Game />
        </Route>
      </Switch>
    </Router>
    );
}

export default App;