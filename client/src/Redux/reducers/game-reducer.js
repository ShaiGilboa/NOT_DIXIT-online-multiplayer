import produce from 'immer';

const initialState = {
  hand: [], 
  gameStatus: 'waiting', /* - waiting
                            - error
                            - playing
                            - creating-game
                            - waiting-to-start
                        */
  gameId: null,
  playersAmount: null,
  turnNumber: null,
  score: null,
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'NEW_GAME_ID':
      return produce(state, draftState => {
        draftState.gameId = action.gameId;
        draftState.status = 'waiting-to-start'
      })
    case 'GAME_SIGN_OUT':
      return produce(state, draftState => {
        draftState.hand=[];
        draftState.titledCard = {};
        draftState.status = 'waiting';
        draftState. gameId = null;
        draftState.isMyTurn = false;
      })
    case 'SET_PLAYERS_AMOUNT':
      return produce(state, draftState => {
        draftState.playersAmount = action.newAmount;
      })
    case 'SET_PLAYER_TURN':
      return produce(state, draftState => {
        draftState.turnNumber = action.turnNumber;
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}