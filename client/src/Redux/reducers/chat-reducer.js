import produce from 'immer';

const initialState = {
  conversation: [], /*  each message object has: {
                        body, photoURL, playerTurnNumber, displayName, email:userEmail, timestamp: Date.now()
                        }
                    */
  status: 'idle', /*  - chatting
                      - idle
                      - error
                  */
  id: null,
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_CHAT':
      return produce(state, draftState => {
        draftState.status = 'chatting';
        draftState.id = action.id;
      })
    case 'CLEAR_CHAT':
      return produce(state, draftState => {
        draftState.conversation = [];
      })
    case 'ADD_MESSAGE_TO_CHAT':
      return produce(state, draftState => {
        draftState.conversation.push(action.message);
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}