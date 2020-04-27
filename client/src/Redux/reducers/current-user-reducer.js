import produce from 'immer';

const initialState = {
  info: {}, /*  firstName,
                LastName,
                email,
                friends,
                stats,
            */
  status: 'not-logged-in' /*  - logged-in
                              - error
                              - creating-game
                              - joining-game
                              - playing
                          */
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_SIGN_IN':
      return produce(state, draftState => {
        draftState.info = action.userInfo;
        draftState.status = 'logged-in';
      })
    case 'USER_SIGN_OUT':
      return produce(state, draftState => {
        draftState.info = {};
        draftState.status = 'not-logged-in';
      })
    case 'CHANGE_CURRENT_USER_STATUS':
      return produce(state, draftState => {
        draftState.status = action.newStatus
      })
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}