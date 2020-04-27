import produce from 'immer';

const initialState = {
  hand: [], 
  titledCard: {}, /*- title
                    - id
                  */
  status: 'waiting', /*  - waiting
                        - error
                        - fetching
                        - playing
                    */
  gameId: null,
  isMyTurn: false,
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NEW_HAND':
    // console.log('action',action)
      return produce(state, draftState => {
        draftState.hand = action.newHand;
        draftState.status = 'playing'
      })
    case 'CHOOSE_CARD':
      return produce(state, draftState => {
        draftState.titledCard = {
          ...state.hand.find(card=> card.id === action.chosenCardId),
          title: action.title,
        }
        draftState.hand = state.hand.filter(card => card.id !== action.chosenCardId);
      })
    case 'NEW_GAME_ID':
      return produce(state, draftState => {
        draftState.gameId = action.gameId;
      })
    case 'SET_IS_MY_TURN':
      return produce(state, draftState => {
        draftState.isMyTurn = action.isMyTurn;
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}