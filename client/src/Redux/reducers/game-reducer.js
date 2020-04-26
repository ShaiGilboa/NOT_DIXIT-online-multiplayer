import produce from 'immer';

const initialState = {
  hand: [], 
  titledCard: {},
  status: 'waiting' /*  - waiting
                        - error
                        - fetching
                        - playing
                    */
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NEW_DECK':
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