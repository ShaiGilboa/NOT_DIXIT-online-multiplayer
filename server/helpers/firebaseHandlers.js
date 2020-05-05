const {
  getNewGameIdBasedOnDate,
  getHandFromDeck,
  getOneCardFromDeck,
} = require('./utils');

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

const getNewHand = async (gameRef) => {
  let hand =null;
  try {//get he state state of the gameDeck
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
    const appUsersRef = db.ref('appUsers');
    if (returningUser) {
      let data = null
      await appUsersRef.orderByChild("email").equalTo(req.body.email).once("child_added", function(snapshot) { // changed .on to .once
        db.ref('appUsers/'+snapshot.key).update({ // deleted: const ref = 
          isActive: true,
        })
        .then(data=snapshot.val())
      });
      res.status(200).json({
        status: 200,
        data,
        message: 'returning user',
      });
      return;
    } else {    
      const newUserId = await appUsersRef.push().key
      console.log('newUserId',newUserId)
      await db.ref('appUsers/' + newUserId).set({
        ...req.body,
        isActive:true,
        id: newUserId,
        })
      res.status(200).json({
        status: 200,
        data: {
          ...req.body,
          id: newUserId,
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
const createNewGameOnFirebase = async (creatorEmail, displayName, id, newGameDeck) => {
  const gamesRef = db.ref('currentGames')
  const appUsersRef = db.ref('appUsers')
  try {
    const newGameId = getNewGameIdBasedOnDate() ///Date.now() % 1000000000
    await gamesRef.child(`${newGameId}`).set({
      creatorEmail,
      status: 'playing',
      gameDeck: newGameDeck,
      isOpen:true,
      currentRound: 1,
      round: {
        status: 'waiting',
        activePlayer: 0,
      },
      players: {
        0: {
          email: creatorEmail,
          displayName,
          score: 0,
          id,
          status: 'playing',
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
const joinFirebaseGame = async (email, displayName, id, gameId) => {
  const gameRef = db.ref('currentGames/'+gameId)
  const appUsersRef = db.ref('appUsers')
  try {
    let turnNumber = null
    await appUsersRef.orderByChild("email").equalTo(email).once('child_added', snapshot => { // changed .on to .once
      db.ref('appUsers/'+snapshot.key).update({
        currentGame: gameId,
      })
    })
    // set the player and their turn.
    await gameRef.child('players').once('value', snapshot => {
      turnNumber = snapshot.numChildren()
      gameRef.child(`players/${turnNumber}`).set({
        email,
        displayName,
        score: 0,
        id,
        status: 'playing',
      })
    })
    let hand = await getNewHand(gameRef);
    return {hand, turnNumber};
  } catch (err) {
    console.log('err',err)
  }
}

// -- sets the titled card in the DB
//return true/false for success
const placeCardInFirebaseDB = async (id, /*img,*/ title, gameId, turnNumber) => {
  const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
  try {
    await cardsInPlayRef.once("value", snapshot => {
      snapshot.ref.update({
          [id]: {
            id,
            imgSrc: ''+id,
            title,
            status: 'titledCard',
            submittedBy: turnNumber,
          }
        })
    })
    return true
  } catch (err) {
    console.log('err',err)
  }
}

// adds the guess to a guesses endpoint
const matchCardToTitleFirebaseDB = async (playerEmail, cardId, /*cardImg,*/ gameId, turnNumber) => {
  const roundRef = db.ref(`currentGames/${gameId}/round`)
  const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
  try {
    await cardsInPlayRef.once('value', cardsInPlaySnapshot => {
      cardsInPlaySnapshot.ref.update({
        [cardId]: {
          id: cardId,
          imgSrc: ''+cardId,
          status: 'submission',
          submittedBy: turnNumber,
        }
      })
    })
  } catch (err) {
    console.log('err',err)
  }
}

// send vote to DB
const sendVoteToDB = async (gameId, cardId, playerVoting) => {
  const cardIdRef = db.ref(`currentGames/${gameId}/round/cardsInPlay/${cardId}`)
  try {
    cardIdRef.once('value', cardVotesSnapshot => {
      if(cardVotesSnapshot.val().votesByPlayerTurn) {
        cardVotesSnapshot.ref.update({
          votesByPlayerTurn: cardVotesSnapshot.val().votesByPlayerTurn.concat(playerVoting)
        })
      } else {
        cardVotesSnapshot.ref.update({
          votesByPlayerTurn: [playerVoting]
        })
      }
    })
  } catch (err) {
    console.log('err',err)
  }
}

// - updates the scores and the game status in db
// gameId, playersArr 
//
const updateScoresInDB = async (gameId, players) => {
  try {
    await db.ref(`currentGames/${gameId}`).update({
      players
    })
    db.ref(`currentGames/${gameId}`).update({
      status: 'scores'
    })
  } catch (err) {
    console.log('err',err)
  }
}

let deck = require('../data/deck')
const getNewDeck = () => {
  const newDeck = deck.map(card=>{
    return {
      ...card,
      isAvailable: true,
    }
  }) // this will be a function call to get a deck from the server
  return newDeck;
}

const getPlayersSnapshot = async (gameId) => {
  try {
    return await db.ref(`currentGames/${gameId}/players`).once('value')
  } catch (err) {
    console.log('err',err)
  }
}

const drawOneCardFromDeckFirebase = async (gameId) => {
  try {
    const gameDeckSnapshot = await db.ref(`currentGames/${gameId}/gameDeck`).once('value')
    const gameDeck =gameDeckSnapshot.val()
    const card = await getOneCardFromDeck(gameDeck)
    await db.ref(`currentGames/${gameId}/gameDeck/${card.id}`).update({
      isAvailable: false,
    })
    await db.ref(`currentGames/${gameId}/round`).update({
      status: 'starting-new-round'
    })
    return card;
  } catch (err) {
    console.log('err',err)
  }
}

const updateRoundStatus = async (gameId, newStatus) => {
  try {
    const roundRef = await db.ref(`currentGames/${gameId}/round`);
    await roundRef.update({
      status: newStatus
    })
  } catch (err) {
    console.log('err',err)
  }
}

const setPlayerStatus = async (gameId, playerTurn, newStatus) => {
  try {
    const playerRef = await db.ref(`currentGames/${gameId}/players/${playerTurn}`);
    playerRef.update({
      status: newStatus
    })
  } catch (err) {
    console.log('err',err)
  }
}

const changeActivePlayer = async (gameId) => {
  try {
    const currentActivePlayerRef = await db.ref(`currentGames/${gameId}/round/activePlayer`).once('value')
    // console.log('currentActivePlayerRef',currentActivePlayerRef)
    const currentActivePlayer = currentActivePlayerRef.val();
    db.ref(`currentGames/${gameId}/players`).once('value', playersSnapshot => {
      let newActivePlayer = 0;
      if (currentActivePlayer === (playersSnapshot.numChildren() - 1)) {
        db.ref(`currentGames/${gameId}/round`).update({
          activePlayer: newActivePlayer,
        })
      } else {
        db.ref(`currentGames/${gameId}/round`).update({
          activePlayer: currentActivePlayer + 1,
        })
      }
    })
  } catch (err) {
    console.log('err',err)
  }
}

const resetRound = async (gameId) => {
  try {
    const pastCardsInPlayRef = await db.ref(`currentGames/${gameId}/round/cardsInPlay`)
    pastCardsInPlayRef.remove()
    const roundCounterSnapshot = await db.ref(`currentGames/${gameId}/round/currentRound`).once('value')
    const roundCounter = roundCounterSnapshot.val()
    db.ref(`currentGames/${gameId}/round`).update({
      status: 'playing',
      currentRound: roundCounter + 1,
    })
  } catch (err) {
    console.log('err',err)
  }
}

const setVotingMessage = async (gameId, votingMessage) => {
  try {
    await db.ref(`currentGames/${gameId}/round`).update({
      votingMessage,
    })
  } catch (err) {
    console.log('err',err)
  }
}

const getCardsInPlayDB = async (gameId) => {
  try {
    const cardsInPlaySnapshot = await db.ref(`currentGames/${gameId}/round/cardsInPlay`).once('value')
    const cardsInPlay = await cardsInPlaySnapshot.val()
    return cardsInPlay;
  } catch (err) {
    console.log('err',err)
  }
}

module.exports = {
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
}