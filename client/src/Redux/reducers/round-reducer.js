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
                        - waiting-for-other-votes
                        - scores
                        - submitting
                        - starting-new-round
                      */
  submissionsArr: [],
  guessTheCard: [],
  mySubmission: null,
  amountOfVotesCast: null,
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NEW_HAND':
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
        draftState.status = state.isMyTurn
        ? 'waiting-for-other-submissions'
        : 'matching-card-to-title'
      })
    case 'CHANGE_ROUND_STATUS':
      return produce(state, draftState => {
        draftState.status = action.newStatus;
      })
    case 'ADD_NEW_SUBMISSION_TO_ARRAY':
      return produce(state, draftState => {
        draftState.submissionsArr = state.submissionsArr.concat(action.card);
      })
    case 'RESHUFFLE_SUBMISSIONS':
      return produce(state, draftState => {
        draftState.submissionsArr = action.reShuffledSubmissions;
      })
    case 'SET_MY_SUBMISSION':
      return produce(state, draftState => {
        draftState.mySubmission = action.id;
        draftState.hand = state.hand.filter(card => card.id !== action.id);
      })
    case 'SET_AMOUNT_OF_VOTES':
      return produce(state, draftState => {
        draftState.amountOfVotesCast = action.newAmount;
      })
    case 'ADD_CARD_TO_HAND':
      return produce(state, draftState => {
        draftState.hand.unshift(action.card);
      })
    case 'UPDATE_VOTES_IN_SUBMISSION':
      return produce(state, draftState => {
        draftState.submissionsArr.forEach(submission => {
          if(action.updatedSubmissions[submission.id].votesByPlayerTurn){
            submission.votesByPlayerTurn = action.updatedSubmissions[submission.id].votesByPlayerTurn
          } else {
            submission.votesByPlayerTurn = []
          }
        })
      })
    default:
      return state;
  }
}