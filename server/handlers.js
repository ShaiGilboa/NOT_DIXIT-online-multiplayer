'use strict';

let deck = require('./data/deck')

//---------------------------
// firebase stuff
//---------------------------
const admin = require('firebase-admin');

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT,
  }),
  databaseURL: process.env.FB_DATABASE_URL,
});
const db = admin.database();


//---------------------------
//utils
//---------------------------

const getUser = async (email) => {
  const data = (await queryDB('appUsers')) || {};
  const dataValue= Object.keys(data)
    .map(item => data[item])
    .find(obj => obj.email === email)

  return dataValue || false;
};

const queryDB = async (key) => {
  const ref = db.ref(key)
  let data = false;
  await ref.once(
    'value',
    (snapshot) => {
      data = snapshot.val();
    },
    (err) => {
      console.log('err',err)
    }
  )

  return data;
}

const newId = () => {
  return Date.now()
}

const getNewDeck = () => {
  const newDeck = deck.map(card=>{
    return {
      ...card,
      isAvailable: true,
    }
  }) // this will be a function call to get a deck from the server
  return newDeck;
}

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

//---------------------------
//endpoints handlers
//---------------------------

//-----firebase /start

// -- deals with new VS returning users, changes status
// post: req.body{}
// returns: 
const signInHandler = async (req, res) => {
  try {
    const returningUser = (await getUser(req.body.email));
    const data = {
      ...req.body,
      isActive: true,
    }
    if (returningUser) {
      var ref = db.ref("appUsers");
      ref.orderByChild("email").equalTo(req.body.email).once("child_added", function(snapshot) { // changed .on to .once
        const ref = db.ref('appUsers/'+snapshot.key).update({
          isActive: true,
        })
      });
      res.status(200).json({
        status: 200,
        data: req.body,
        message: 'returning user',
      });
      return;
    } else {    
      const appUsersRef= db.ref('appUsers');
      const newPostKey = await appUsersRef.push({
        ...req.body,
        isActive:true,
        }).key
      res.status(200).json({
        status: 200,
        data: {
          ...req.body,
          userId: newPostKey,
          },
        message: 'new user',
      });
      return;
    };
  } catch (err) {
    console.log('err',err)
  }
}

// removes the 'currentGame' from the useNode, and added the game to the 'past games' node.
const GameOverHandle = async (userId, gameId) => {
  // push the last game to 'pastGames'
  db.ref('currentGames/' + gameId).once('value', currentGameSnapshot => { // changed .on to .once
    db.ref('appUsers/'+userId+'/pastGames').update({
      [gameId]:currentGameSnapshot.val(),
    })
  })
  // removing the 'currentGame'
  db.ref('appUsers/'+userId+'/currentGame').remove()
}
// -- changes status of a user
// put: req.body{}
// returns: 
const signOutHandler = async (req, res) => {
  const {email} = req.body
  const ref = db.ref("appUsers");
  try {
    await  ref.orderByChild("email").equalTo(email).once("child_added", async function(snapshot) { // changed .on to .once
      // register that the user has logged out
      db.ref('appUsers/'+snapshot.key).update({
        isActive: false,
      })
      const currentGameId = snapshot.val().currentGame
      await GameOverHandle(snapshot.key, currentGameId)
    })
    res.status(204).json({status:204})
  } catch (err) {
    console.log('err',err)
  }
}

// -- creates a 'game' in the DB
// post: creatorEmail, deck?
// returns: gameId
const createNewGameOnFirebase = async (creatorEmail, displayName, newGameDeck) => {
  const gamesRef = db.ref('currentGames')
  const appUsersRef = db.ref('appUsers')
  try {
    const newGameId = Date.now()
    await gamesRef.child(`${newGameId}`).set({
      creatorEmail,
      gameStatus: 'playing',
      gameDeck: newGameDeck,
      isOpen:true,
      round: {
        status: 'waiting',
        activePlayer: 1,
      },
      players: {
        1: {
          email: creatorEmail,
          displayName,
        }
      }
    })
    await appUsersRef.orderByChild("email").equalTo(creatorEmail).once('child_added', snapshot => {
      db.ref('appUsers/'+snapshot.key).update({
        currentGame: newGameId,
      })
    })
    return newGameId;
  } catch (err) {
    console.log('err',err)
  }
}


//return: hand
const joinFirebaseGame = async (userEmail, displayName, gameId) => {
  const gameRef = db.ref('currentGames/'+gameId)
  const appUsersRef = db.ref('appUsers')
  try {
    let turnNumber = null
    await appUsersRef.orderByChild("email").equalTo(userEmail).once('child_added', snapshot => { // changed .on to .once
      db.ref('appUsers/'+snapshot.key).update({
        currentGame: gameId,
      })
    })
    // set the player and their turn.
    await gameRef.child('players').once('value', snapshot => {
      turnNumber = snapshot.numChildren()+1
      gameRef.child(`players/${turnNumber}`).set({
        userEmail,
        displayName,
      })
    })
    let hand = null;
    await gameRef.child('gameDeck').once('value', snapshot => {
      hand = getHandFromDeck(snapshot.val())
    })
    // update deck
    await hand.forEach(cardInHand=> {
      gameRef.child('gameDeck').orderByKey().equalTo(`${cardInHand.id}`).once('child_added', snapshot => {
        snapshot.ref.update({
          isAvailable:false
        })
      })
    })
    return {hand, turnNumber};
  } catch (err) {
    console.log('err',err)
  }
}

// -- sets the titled card in the DB
//return true/false for success
const placeCardInFirebaseDB = async (id, img, title, gameId, turnNumber) => {
  const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
  try {
    await cardsInPlayRef.once("value", snapshot => {
      snapshot.ref.update({
          [id]: {
            id,
            img,
            title,
            status: 'titledCard',
          }
        })
    })
    return true
  } catch (err) {
    console.log('err',err)
  }
}

// adds the guess to a guesses endpoint
const matchCardToTitleFirebaseDB = async (playerEmail, cardId, cardImg, gameId, turnNumber) => {
  const roundRef = db.ref(`currentGames/${gameId}/round`)
  const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
  try {
    // await roundRef.child('submissionsByPlayerTurnNumber').once("value", guessSnapshot => {
    //   guessSnapshot.ref.update({
    //     [turnNumber]: {
    //       id: cardId,
    //       img: cardImg,
    //     }
    //   })
    // })
    await cardsInPlayRef.once('value', cardsInPlaySnapshot => {
      cardsInPlaySnapshot.ref.update({
        [cardId]: {
          id: cardId,
          img: cardImg,
          status: 'submission',
          submittedBy: turnNumber,
        }
      })
    })
  } catch (err) {
    console.log('err',err)
  }
}

// sets the submissionsArray in DB
const setSubmissionsArrInFirebaseDB = async (submissionsArr, gameId) => {
  const roundRef = db.ref(`currentGames/${gameId}/round`)
  try {
    await roundRef.update({
      cardsToGuess: submissionsArr
    })
  } catch (err) {
    console.log('err',err)
  }
}

// send vote to DB
const sendVoteToDB = async (gameId, cardId) => {
  const cardIdRef = db.ref(`currentGames/${gameId}/round/cardsInPlay/${cardId}`)
  console.log('gameId',gameId)
  console.log('cardId',cardId)
  try {
    cardIdRef.once('value', cardVotesSnapshot => {
      console.log('cardVotesSnapshot.val()',cardVotesSnapshot.val())
      if(cardVotesSnapshot.val().votes) {
        cardVotesSnapshot.ref.update({
          votes: cardVotesSnapshot.val().votes + 1
        })
      } else {
        cardVotesSnapshot.ref.update({
          votes: 1
        })
      }
    })
  } catch (err) {
    console.log('err',err)
  }
}

//-----firebase /end

//-----game

// -- sets the deck, creates a gameId
// get:
// returns: 
const startNewGameHandler = async (req, res) => {
  const { 
    creatorEmail,
    displayName,
  } = req.body
  try {
    const newGameDeck = getNewDeck() //here there will be some sort of function call to db to get the deck
    const hand = getHandFromDeck(newGameDeck)// this will have to check that we are getting 'available' cards
    const firebaseGameId = await createNewGameOnFirebase(creatorEmail, displayName, newGameDeck) // creates the game, and returns the gameId

    if (newGameDeck.length) res.status(200).json({
      status: 200,
      hand,
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
  const { userEmail, gameId, displayName } = req.body;
  try {
    const {hand, turnNumber} = await joinFirebaseGame(userEmail, displayName, gameId)
    res.status(200).json({
      status: 200,
      hand,
      gameId,
      turnNumber,
    })
  } catch (err) {
    console.log('err',err)
  }
}

// -- calculate score based on guesses
// post: req.body {each player's guess: playerId - cardGuessed}
// does: updates each card's title+score
// returns: {each players score, a new card for each player}
const roundEndHandler = async (req, res) => {

}

// -- puts a card on the table with a title
// post: req.body {the card chosen and title}
// does: gives a round Id, 
// returns: {roundId, card title chosen}
const roundStartHandler = async (req, res) => {

}

// -- submit a guess on player's card under a title ,from a selection of cards
// post: req.body{the card chosen and title}
// does: places a token on a guess for player's card
// returns: {guessedCardId, playerGuessedId}
const submitGuessPlayersCard = async (req, res) => {

}


// -- submit a card to the table, under player's title
// post: req.body{the id of card chosen, title, guesserId}
// returns: 
const placeCardForRound = async (req, res) => {
  const { 
    id,
    img,
    title,
    gameId,
  } = req.body
  try {
    await placeCardInFirebaseDB(id, img, title, gameId)
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
    cardImg,
    gameId,
    turnNumber,
  } = req.body
  try {
    await matchCardToTitleFirebaseDB(playerEmail, cardId, cardImg, gameId, turnNumber)
    res.status(200).json({
      status: 200,
    })
  } catch (err) {
    console.log('err',err)
  }
}

// puts a vote token on a titled card
// PUT: {gameId, cardId}
const votingHandler = async (req, res) =>{
  const {gameId, cardId} = req.params
  try {
    await sendVoteToDB(gameId, cardId)
  } catch (err) {
    console.log('err',err)
  }
}

module.exports = {
  signInHandler,
  signOutHandler,
  startNewGameHandler,
  roundEndHandler,
  roundStartHandler,
  submitGuessPlayersCard,
  placeCardForRound,
  joinExistingGameHandler,
  matchCardToTitle,
  // sendSubmissionsArrHandler,
  votingHandler,
}