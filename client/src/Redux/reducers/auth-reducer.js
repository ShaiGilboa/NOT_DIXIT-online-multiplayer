import produce from 'immer';

const initialState = {
  status: 'not-authed', /* - not-authed
                          - authed
                        */
  DBid: null,
}

export default function  authReducer(state = initialState, action) {
  switch (action.type) {
    // case '':
    //   return produce(state, draftState => {
    //     //change
    //   })
    // case '':
    //   return produce(state, draftState => {
    //     //change
    //   })
    // case '':
    //   return produce(state, draftState => {
    //     //change
    //   })
    // case '':
    //   return produce(state, draftState => {
    //     //change
    //   })
    default:
      return state;
  }
}