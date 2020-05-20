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
  const availableCards = deck.filter(card=>card.isAvailable)
  const hand = randFromArr(7, availableCards);
  hand.forEach(cardInHand => {
    cardInHand.isAvailable = false
  })

  return hand;
}

const getNewGameIdBasedOnDate = () => {
  let new10DigitId = Date.now() % 10000000000;
  if(new10DigitId.length!==10){
    const idString = new10DigitId.toString();
    const gap = new Array(10 - idString.length).fill(1).join('')
    new10DigitId = Number(gap + idString)
  }
  const Id = new10DigitId// convert to XXX-XXXX-XXX
  return Id
}

const twoPointsToRest = (activePlyerByTurn, players) => {
  players.forEach((player, index)=>{
    if(index!==activePlyerByTurn)player.score += 2
  })
}

const onePointPerGuess = (submissions, players, votingMessage) => {
  submissions.forEach(submission => {
    const playerToGetPoints = submission.submittedBy;
    let pointsGainedFromVotes = 0;
    if(submission.votesByPlayerTurn){
      pointsGainedFromVotes = submission.votesByPlayerTurn.length
      submission.votesByPlayerTurn.forEach(voter => {
        votingMessage.push(`${players[playerToGetPoints].displayName} got 1 point from ${players[voter].displayName}`)
      })
    }
    players[playerToGetPoints].score += pointsGainedFromVotes;
  })
}

const threePointsToTitledCardGuessersAndActivePlayer = (titledCard, activePlayerByTurn, players, votingMessage) => {
  titledCard.votesByPlayerTurn.forEach(turnOfPlayerThatGuessedRight => {
    players[turnOfPlayerThatGuessedRight].score += 3
    votingMessage.push(`${players[turnOfPlayerThatGuessedRight].displayName} guessed right! you get 3 points!`)
  })
  players[activePlayerByTurn].score += 3;
}

const getOneCardFromDeck = (deck) => {
  const availableCards = deck.filter(card=>card.isAvailable)
  const card = randFromArr(1, availableCards)
  card[0].isAvailable = false;
  return card[0];
}

module.exports = {
  threePointsToTitledCardGuessersAndActivePlayer,
  onePointPerGuess,
  twoPointsToRest,
  getNewGameIdBasedOnDate,
  getHandFromDeck,
  randFromArr,
  randInRange,
  getOneCardFromDeck,
}