import produce from 'immer';

const initialState = {
  info: {}, /*  firstName,
                LastName,
                email,
                friends,
                stats,
            */
  status: 'not-logged-on' /*  - logged-on
                              - error
                              - fetching
                          */
  //...
}

export default function  currentUserReducer(state = initialState, action) {
  switch (action.type) {
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
    case '':
      return produce(state, draftState => {
        //change
      })
    default:
      return state;
  }
}