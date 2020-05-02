const randInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

const randFromArr = (amount, arr) => {
  if (amount > arr.length) return false;
  if (amount === arr.length) return arr;
  const chosenObjects = [];
  const chosenIndexes = [];
  while (chosenObjects.length < amount) {
    let randomIndex = randInRange(0, arr.length);
    if(!chosenIndexes.includes(randomIndex)) {
      chosenIndexes.push(randomIndex);
      chosenObjects.push(arr[randomIndex])
    }
  }
  return chosenObjects;
}

const getHandFromDeck = (deck) => {
  const options = deck.filter(card=>card.isAvailable)
  const hand = randFromArr(7, options);
  hand.forEach(cardInHand => {
    cardInHand.isAvailable = false
  })

  return hand;
}

const getNewGameIdBasedOnDate = () => {
  const new10DigitId = Date.now() % 10000000000;
  const Id = new10DigitId// convert to XXX-XXXX-XXX
  return Id
}

const twoPointsToRest = (activePlyerByTurn, players) => {
  players.forEach((player, index)=>{
    if(index!==activePlyerByTurn)player.score += 2
  })
}

const onePointPerGuess = (submissions, players) => {
  submissions.forEach(submission => {
    const playerToGetPoints = submission.submittedBy;
    let pointsGainedFromVotes = 0;
    if(submission.votesByPlayerTurn){
      pointsGainedFromVotes = submission.votesByPlayerTurn.length
    }
    players[playerToGetPoints].score += pointsGainedFromVotes;
  })
}

const threePointsToTitledCardGuessersAndActivePlayer = (titledCard, activePlayerByTurn, players) => {
  titledCard.votesByPlayerTurn.forEach(turnOfPlayerThatGuessedRight => {
    players[turnOfPlayerThatGuessedRight].score += 3
  })
  players[activePlayerByTurn].score += 3;
}

const newId = () => {
  return Date.now()
}



module.exports = {
  newId,
  threePointsToTitledCardGuessersAndActivePlayer,
  onePointPerGuess,
  twoPointsToRest,
  getNewGameIdBasedOnDate,
  getHandFromDeck,
  randFromArr,
  randInRange,
}