// the different actions for the Redux store
// signIn, startGame, chooseCard....

export const setNewDeck = (newHand) =>({
  type: "SET_NEW_DECK",
  newHand,
})

export const chooseCard = (chosenCardId, title) => ({
  type: "CHOOSE_CARD",
  chosenCardId,
  title,
})