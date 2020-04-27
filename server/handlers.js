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
  // console.log('deck',deck)
  const options = deck.filter(card=>card.isAvailable)
  // console.log('options',options)
  const hand = randFromArr(7, options);
  hand.forEach(cardInHand => {
    cardInHand.isAvailable = false
  })
  // console.log('hand in func',hand)
  // console.log('deck',deck)
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
      ref.orderByChild("email").equalTo(req.body.email).on("child_added", function(snapshot) {
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

// -- changes status of a user
// put: req.body{}
// returns: 
const signOutHandler = async (req, res) => {
  const {email} = req.body
  var ref = db.ref("appUsers");
  await  ref.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
      console.log('craigcraig',snapshot.key);
      const ref = db.ref('appUsers/'+snapshot.key).update({
        isActive: false,
      })
    })
  res.status(204).json({status:204})
}

// -- creates a 'game' in the DB
// post: creatorEmail, deck?
// returns: gameId
const createNewGameOnFirebase = async (creatorEmail, newGameDeck) => {
  const gamesRef = db.ref('currentGames')
  const appUsersRef = db.ref('appUsers')
  try {
    const newGameId = await gamesRef.push({
      creatorEmail,
      gameDeck: newGameDeck,
      isOpen:true,
      round: {
        activePlayer: creatorEmail,
      }
    }).key
    await  appUsersRef.orderByChild("email").equalTo(creatorEmail).on('child_added', snapshot => {
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
const joinFirebaseGame = async (userEmail, gameId) => {
  const gameRef = db.ref('currentGames/'+gameId)
  const appUsersRef = db.ref('appUsers')
  console.log('gameId',gameId)
  try {
    let userName= null
    await appUsersRef.orderByChild("email").equalTo(userEmail).on('child_added', snapshot => {
      userName = snapshot.val().displayName
      db.ref('appUsers/'+snapshot.key).update({
        currentGame: gameId,
      })
    })
    await gameRef.child('players/'+userName).set({
      email: userEmail
    })
    // get hand from deck
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
    return hand;
  } catch (err) {
    console.log('err',err)
  }
}

// -- sets the titled card in the DB
//return true/false for success
const placeCardInFirebaseDB = async (id, title, gameId) => {
  console.log('id',id)
  console.log('title',title)
  const roundRef = db.ref('currentGames/'+gameId+'/round')
  try {
    await roundRef.once("value", snapshot => {
      snapshot.ref.update({
          titledCard: {
            id,
            title,
          }
        })
    })
    return true
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
  const { creatorEmail } = req.body
  console.log('creatorEmail',creatorEmail)
  try {
    const newGameDeck = getNewDeck() //here there will be some sort of function call to db to get the deck
    const hand = getHandFromDeck(newGameDeck)// this will have to check that we are getting 'available' cards
    const firebaseGameId = await createNewGameOnFirebase(creatorEmail, newGameDeck) // creates the game, and returns the gameId
    // const id = newId();
    console.log('id',firebaseGameId)
    // console.log('newGameDeck',newGameDeck)
    // console.log('hand',hand)
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
  const { userEmail, gameId } = req.body;
  try {
    const hand = await joinFirebaseGame(userEmail, gameId)
    console.log('hand',hand)
    res.status(200).json({
      status: 200,
      hand,
      gameId,
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
const submitCardUnderTitle = async (req, res) => {
  const { 
    id,
    title,
    gameId,
  } = req.body
  console.log('id',id)
  console.log('title',title)
  try {
    await placeCardInFirebaseDB(id, title, gameId)
    res.status(200).json({
      status: 200,
    })
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
  submitCardUnderTitle,
  joinExistingGameHandler,
}