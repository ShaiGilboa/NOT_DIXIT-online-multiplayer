'use strict';
const deck64 = require('./assets/deck64.json')
const {
  updateScoresInDB,
  sendVoteToDB,
  matchCardToTitleFirebaseDB,
  placeCardInFirebaseDB,
  joinFirebaseGame,
  createNewGameOnFirebase,
  signOutHandler,
  GameOverHandle,
  signInHandler,
  getNewDeck,
  getPlayersSnapshot,
  drawOneCardFromDeckFirebase,
  updateRoundStatus,
  setPlayerStatus,
  changeActivePlayer,
  resetRound,
  setVotingMessage,
  getCardsInPlayDB,
} = require('./helpers/firebaseHandlers');

const {
  newId,
  threePointsToTitledCardGuessersAndActivePlayer,
  onePointPerGuess,
  twoPointsToRest,
  getNewGameIdBasedOnDate,
  getHandFromDeck,
  randFromArr,
  randInRange,
} = require('./helpers/utils');

// -- sets the deck, creates a gameId
// get:
// returns: 
const startNewGameHandler = async (req, res) => {
  const { 
    creatorEmail,
    displayName,
    id,
  } = req.body
  try {
    const newGameDeck = getNewDeck() //here there will be some sort of function call to db to get the deck
    const hand = getHandFromDeck(newGameDeck)// this will have to check that we are getting 'available' cards
    const firebaseGameId = await createNewGameOnFirebase(creatorEmail, displayName, id, newGameDeck) // creates the game, and returns the gameId
    const hand64 = hand.map(card=>card = deck64.find(card64 => card64.id===card.id))
    if (newGameDeck.length) res.status(200).json({
      status: 200,
      hand: hand64,
      gameId: firebaseGameId,
    })
  } catch (err) {
    console.log('err',err)
  }
}

// -- joins an existing game
// post: userEmail, gameId
// returns: hand
const joinExistingGameHandler = async (req, res) =>{
  const { email, gameId, displayName, id } = req.body;
  try {
    const {hand, turnNumber} = await joinFirebaseGame(email, displayName, id, gameId)
    const hand64 = hand.map(card=>card = deck64.find(card64 => card64.id===card.id))
    res.status(200).json({
      status: 200,
      hand: hand64,
      gameId,
      turnNumber,
    })
  } catch (err) {
    console.log('err',err)
  }
}


// -- submit a card to the table, under player's title
// post: req.body{the id of card chosen, title, guesserId}
// returns: 
const placeCardForRound = async (req, res) => {
  const { 
    id,
    // img,
    title,
    gameId,
    turnNumber,
  } = req.body
  try {
    // const idImg = '' + id
    await placeCardInFirebaseDB(id, /*idImg,*/ title, gameId, turnNumber)
    res.status(200).json({
      status: 200,
    })
  } catch (err) {
    console.log('err',err)
  }
}


// -- send a card suggestion to match the given title
// post: { playerEmail, cardId, title, gameId}
// return success/fail
const matchCardToTitle = async (req, res) => {
  const {
    playerEmail,
    cardId,
    // cardImg,
    gameId,
    turnNumber,
  } = req.body
  try {
    // const idImg = '' + cardId
    await matchCardToTitleFirebaseDB(playerEmail, cardId, /*idImg,*/ gameId, turnNumber)
    res.status(200).json({
      status: 200,
    })
  } catch (err) {
    console.log('err',err)
  }
}

// puts a vote token on a titled card
// PUT: {gameId} param
// {cardId, playerVoting} body
const votingHandler = async (req, res) =>{
  const {gameId} = req.params
  const {cardId, playerVoting} = req.body
  try {
    await sendVoteToDB(gameId, cardId, playerVoting)
  } catch (err) {
    console.log('err',err)
  }
}

// calculates and gives the points based on the votes
// PUT:{activeTurn, cardsInPlay, totalVotes} req.body
// changes the DB
// TODO: return how chose which card
const scoringHandler = async (req, res) => {
  const { activePlyerByTurn, cardsInPlay, totalVotes, gameId } = req.body
  try {
    const playersSnapshot = await getPlayersSnapshot(gameId)
    const players = playersSnapshot.val()
    console.log('players pre',players)
    const cardIds = Object.keys(cardsInPlay)
    cardIds.forEach(id=>cardsInPlay[id].imgSrc=''+id)
    // const cards = cards64.map(card64 => card64.imgSrc=''+card64.id)
    const cards = Object.values(cardsInPlay)
    // console.log('cards',cards)
    const titledCard = cards.find(card=>card.status==='titledCard')
    const submissions = cards.filter(card=>card.status!=='titledCard')
    const votingMessage = []
    // some guesses are right
    if(titledCard.votesByPlayerTurn){
      // all guesses are right
      if(titledCard.votesByPlayerTurn.length === totalVotes){
        // 'all guessed right'
        votingMessage.push('Everybody guessed the titled card, 2 point for all the guesser!')
        twoPointsToRest(activePlyerByTurn, players, votingMessage);
      // some right, some wrong
      } else {
        // 'some right some wrong'
        votingMessage.push(`some got it, some didn\'t. Good Job ${players[titledCard.submittedBy].displayName}! you get 3 points`)
        // 'three points to good guess'
        threePointsToTitledCardGuessersAndActivePlayer(titledCard, activePlyerByTurn, players, votingMessage)
        // 'plus one'
        onePointPerGuess(submissions, players, votingMessage)
      }
    // all gusses are wrong
    } else {
      // 'all guessed wrong'
      votingMessage.push('Nobody guessed the titled card, 2 point for all the guesser!')
      twoPointsToRest(activePlyerByTurn, players, votingMessage);
      // 'plus one'
      onePointPerGuess(submissions, players, votingMessage)
    }
    players.forEach(player=>player.status = 'scores')
    console.log('players post',players)
    await setVotingMessage(gameId, votingMessage)
    await updateScoresInDB(gameId, players)
    await updateRoundStatus(gameId, 'scores')
      res.status(204).send()
  } catch (err) {
    console.log('err',err)
  } 
}

// -- draws one card from deck, sets playerStatus = 'ready'
// post: req.body{gameId, playerTurn}
// returns: one new card
const roundPrepHandler = async (req, res) => {
  const {gameId, playerTurn} = req.body;
  try {
    const newCard = await drawOneCardFromDeckFirebase(gameId);
    const newCard64 = deck64.find(card64=>card64.id===newCard.id)
    await setPlayerStatus(gameId, playerTurn, 'ready')
    res.status(200).json({
      status: 200,
      card: newCard64,
    })
  } catch (err) {
    console.log('err',err)
  }
}

// -- changes the active player, clears previous round information
//    changes statuses
// put: {gameId} req.body
const startNextRoundHandler = async (req, res) => {
  const {gameId} = req.body;
  try {
    await changeActivePlayer(gameId)
    await resetRound(gameId)
    // await db.ref(`currentGames/${gameId}`).update({
    //   status: 'playing'
    // })
  } catch (err) {
    console.log('err',err)
  }
}

// -- retrives teh submission array from the db
// get: {gameId, } params
const getSubmissionArrHandler = async (req, res) => {
  const {gameId} = req.params;
  try {
    const submissions = await getCardsInPlayDB(parseInt(gameId))

    Object.keys(submissions).map(cardId=> submissions[cardId].imgSrc = deck64[cardId].imgSrc)
    // const submissionArr64 = submissionArr.map(card=> card.imgSrc = deck64[card.id].imgSrc)
    // console.log('submissions',submissions)
    res.status(200).json({
      status: 200,
      submissions,
    })
  } catch (err) {
    console.log('err',err)
  }
}

module.exports = {
  signInHandler,
  signOutHandler,
  startNewGameHandler,
  placeCardForRound,
  joinExistingGameHandler,
  matchCardToTitle,
  votingHandler,
  scoringHandler,
  roundPrepHandler,
  startNextRoundHandler,
  getSubmissionArrHandler,
}