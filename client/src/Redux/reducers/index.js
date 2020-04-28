import { combineReducers } from 'redux';

import currentUserReducer from './current-user-reducer';
import gameReducer from './game-reducer';
import authReducer from './auth-reducer';
import roundReducer from './round-reducer';

export default combineReducers({
  currentUserInfo: currentUserReducer,
  gameData: gameReducer,
  auth: authReducer,
  roundData: roundReducer,
});