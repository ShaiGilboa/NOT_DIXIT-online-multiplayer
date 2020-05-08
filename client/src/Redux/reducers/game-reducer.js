import produce from 'immer';

const initialState = {
  hand: [], 
  status: 'waiting', /* - waiting
                        - error
                        - playing
                        - creating-game
                        - waiting-to-start
                        - end-of-round
                        - starting-new-round
                      */
  gameId: null,
  // playersAmount: null,
  turnNumber: null,
  score: 0,
  currentRound: 0,
  players: [],
  activePlayer: null,
  votingMessage: [],
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
        draftState.gameId = null;
        draftState.isMyTurn = false;
        draftState.turnNumber = null;
        draftState.score = 0;
        draftState.currentRound = 0;
        draftState.players = [];
        draftState.activePlayer = null;
        draftState.votingMessage = [];
      })
    case 'SET_PLAYERS':
      return produce(state, draftState => {
        draftState.players = action.players;
      })
    case 'SET_PLAYER_TURN':
      return produce(state, draftState => {
        draftState.turnNumber = action.turnNumber;
      })
    case 'SET_GAME_STATUS':
      return produce(state, draftState => {
        draftState.status = action.newStatus
      })
    case 'SET_ACTIVE_PLAYER':
      return produce(state, draftState => {
        draftState.activePlayer = action.activePlayer
      })
    case 'SET_VOTING_MESSAGE':
      return produce(state, draftState => {
        draftState.votingMessage = action.votingMessage;
      })
    case 'SET_SCORE':
      return produce(state, draftState => {
        draftState.score = action.score;
      })
    default:
      return state;
  }
}