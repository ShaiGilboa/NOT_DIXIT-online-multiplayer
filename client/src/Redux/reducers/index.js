import { combineReducers } from 'redux';

import currentUserReducer from './current-user-reducer';
import gameReducer from './game-reducer';
import authReducer from './auth-reducer';
import roundReducer from './round-reducer';
import chatReducer from './chat-reducer';

export default combineReducers({
  currentUser: currentUserReducer,
  gameData: gameReducer,
  auth: authReducer,
  roundData: roundReducer,
  chat: chatReducer,
});