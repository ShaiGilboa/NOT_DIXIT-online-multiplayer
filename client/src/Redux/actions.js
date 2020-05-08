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

export const setPlayerTurn = (turnNumber) => ({
  type: 'SET_PLAYER_TURN',
  turnNumber,
})

export const changeRoundStatus = (newStatus) => ({
  type: 'CHANGE_ROUND_STATUS',
  newStatus,
})

export const addSubmissionToSubmissionsArr = (card) => ({
  type: 'ADD_NEW_SUBMISSION_TO_ARRAY',
  card,
})

export const reShuffleSubmissions = (reShuffledSubmissions) => ({
  type: 'RESHUFFLE_SUBMISSIONS',
  reShuffledSubmissions,
})

export const setPlayersAmount = (newAmount) => ({
  type: 'SET_PLAYERS_AMOUNT',
  newAmount,
})

export const setMySubmission = (id) => ({
  type: 'SET_MY_SUBMISSION',
  id,
})

export const setAmountOfVotes = (newAmount) => ({
  type: 'SET_AMOUNT_OF_VOTES',
  newAmount,
})

export const setGameStatus = (newStatus) => ({
  type: 'SET_GAME_STATUS',
  newStatus,
})

export const addCardToHand = (card) => ({
  type: 'ADD_CARD_TO_HAND',
  card
})

export const updateVotesInSubmission = (updatedSubmissions) => ({
  type: 'UPDATE_VOTES_IN_SUBMISSION',
  updatedSubmissions
})

export const setPlayers = (players) => ({
  type: 'SET_PLAYERS',
  players
})

export const setActivePlayer = (activePlayer) =>({
  type: 'SET_ACTIVE_PLAYER',
  activePlayer,
})

export const clearTitledCard = () => ({
  type: 'CLEAR_TITLED_CARD',
})

export const startChat = (id) => ({
  type: 'START_CHAT',
  id,
})

export const clearChat = () =>({
  type: 'CLEAR_CHAT',
})

export const addMessageToChat = (message) => ({
  type: 'ADD_MESSAGE_TO_CHAT',
  message,
})

export const setVotingMessage = (votingMessage) => ({
  type: 'SET_VOTING_MESSAGE',
  votingMessage,
})

export const setScore = (score) => ({
  type: 'SET_SCORE',
  score,
})