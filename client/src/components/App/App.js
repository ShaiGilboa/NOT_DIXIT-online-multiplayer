import React, {
  useState,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,useHistory
} from 'react-router-dom';
import {
  useSelector,
} from 'react-redux';
// import {
//   useHistory,
// } from 'react-router';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
// import { AuthContext } from '../AuthContext';

import Navbar from '../Navbar';
import Homepage from '../../pages/Homepage';
import Game from '../../pages/Game';
import WaitingForOtherUsers from '../../pages/WaitingForOtherUsers';
import UserProfile from '../../pages/UserProfile';

import Board from '../Board';
const App = () => {
  return (
    <Router>
      {/*global components*/}
      <GlobalStyles />
      <Navbar />
      {/*different pages*/}
      <Board />
      <Switch>
        <Route path='/' exact>
          <Homepage />
        </Route>
        <Route path='/game' >
          <Game />
        </Route>
        <Route path='/waiting' >
          <WaitingForOtherUsers />
        </Route>
        <Route path='/user-profile' >
          <UserProfile />
        </Route>
      </Switch>
    </Router>
    );
}

export default App;
