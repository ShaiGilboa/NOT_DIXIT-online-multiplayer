import produce from 'immer';

const initialState = {
  hand: [], 
  gameStatus: 'waiting', /* - waiting
                            - error
                            - playing
                        */
  gameId: null,
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'NEW_GAME_ID':
      return produce(state, draftState => {
        draftState.gameId = action.gameId;
        draftState.status = 'playing'
      })
    case 'GAME_SIGN_OUT':
    console.log('action',action)
      return produce(state, draftState => {
        draftState.hand=[];
        draftState.titledCard = {};
        draftState.status = 'waiting';
        draftState. gameId = null;
        draftState.isMyTurn = false;
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}