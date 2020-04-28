// the different actions for the Redux store
// signIn, startGame, chooseCard....

export const setNewHand = (newHand) =>({
  type: "SET_NEW_HAND",
  newHand,
})

export const chooseCard = (chosenCardId, title) => ({
  type: "CHOOSE_CARD",
  chosenCardId,
  title,
})

export const userSignIn = (userInfo) => ({
  type: 'USER_SIGN_IN',
  userInfo,
})

export const userSignOut = () => ({
  type: 'USER_SIGN_OUT',
})

export const changeCurrentUserStatus = (newStatus) => ({
  type: 'CHANGE_CURRENT_USER_STATUS',
  newStatus,
})

export const newGameId = (gameId) => ({
  type: "NEW_GAME_ID",
  gameId,
})

export const setIsMyTurn = (isMyTurn) => ({
  type: "SET_IS_MY_TURN",
  isMyTurn,
})

export const setTitledCard = (title) => ({
  type: 'SET_TITLED_CARD',
  title,
})

export const gameSignOut = () => ({
  type: 'GAME_SIGN_OUT',
})