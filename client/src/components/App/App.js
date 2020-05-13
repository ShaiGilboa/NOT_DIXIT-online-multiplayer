import React from 'react';
// import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import GlobalStyles from '../GlobalStyles';
import Navbar from '../Navbar';
import Homepage from '../../pages/Homepage';
import Game from '../../pages/Game';
import WaitingForOtherUsers from '../../pages/WaitingForOtherUsers';
import Board from '../Board';
const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <Navbar />
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
      </Switch>
    </Router>
    );
}

export default App;