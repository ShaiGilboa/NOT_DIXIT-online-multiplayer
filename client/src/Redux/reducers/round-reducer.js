import produce from 'immer';

const initialState = {
  hand: [], 
  titledCard: {}, /*- title
                    - id
                  */
  isMyTurn: false,
  status: 'waiting', /* - waiting
                        - submitting-titled-card
                        - waiting-for-other-submissions
                        - matching-card-to-title
                        - waiting-for-title
                        - voting
                      */
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
    case 'SET_IS_MY_TURN':
      return produce(state, draftState => {
        draftState.isMyTurn = action.isMyTurn;
        draftState.status = action.isMyTurn 
          ? 'submitting-titled-card'
          : 'waiting-for-title'
      })
    case 'SET_TITLED_CARD':
      return produce(state, draftState => {
        draftState.titledCard.title = action.title;
        draftState.status = 'waiting-for-other-submissions';
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}