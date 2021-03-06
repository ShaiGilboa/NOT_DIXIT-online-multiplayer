// //---------------------------
// // firebase stuff
// //---------------------------
// const admin = require('firebase-admin');

// require('dotenv').config();

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: 'service_account',
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri: 'https://oauth2.googleapis.com/token',
//     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT,
//   }),
//   databaseURL: process.env.FB_DATABASE_URL,
// });
// const db = admin.database();


// //---------------------------
// //utils
// //---------------------------

// const getUser = async (email) => {
//   const data = (await queryDB('appUsers')) || {};
//   const dataValue= Object.keys(data)
//     .map(item => data[item])
//     .find(obj => obj.email === email)

//   return dataValue || false;
// };

// const queryDB = async (key) => {
//   const ref = db.ref(key)
//   let data = false;
//   await ref.once(
//     'value',
//     (snapshot) => {
//       data = snapshot.val();
//     },
//     (err) => {
//       console.log('err',err)
//     }
//   )

//   return data;
// }

// const newId = () => {
//   return Date.now()
// }

// const getNewDeck = () => {
//   const newDeck = deck.map(card=>{
//     return {
//       ...card,
//       isAvailable: true,
//     }
//   }) // this will be a function call to get a deck from the server
//   return newDeck;
// }

// const randInRange = (min, max) => {
//   return Math.floor(Math.random() * (max - min) + min);
// }

// const randFromArr = (amount, arr) => {
//   if (amount > arr.length) return false;
//   if (amount === arr.length) return arr;
//   const chosenObjects = [];
//   const chosenIndexes = [];
//   while (chosenObjects.length < amount) {
//     let randomIndex = randInRange(0, arr.length);
//     if(!chosenIndexes.includes(randomIndex)) {
//       chosenIndexes.push(randomIndex);
//       chosenObjects.push(arr[randomIndex])
//     }
//   }
//   return chosenObjects;
// }

// const getHandFromDeck = (deck) => {
//   const options = deck.filter(card=>card.isAvailable)
//   const hand = randFromArr(7, options);
//   hand.forEach(cardInHand => {
//     cardInHand.isAvailable = false
//   })

//   return hand;
// }

// const getNewGameIdBasedOnDate = () => {
//   const new10DigitId = Date.now() % 10000000000;
//   const Id = new10DigitId// convert to XXX-XXXX-XXX
//   return Id
// }

// const twoPointsToRest = (activePlyerByTurn, players) => {
//   players.forEach((player, index)=>{
//     if(index!==activePlyerByTurn)player.score += 2
//   })
// }

// const onePointPerGuess = (submissions, players) => {
//   submissions.forEach(submission => {
//     const playerToGetPoints = submission.submittedBy;
//     let pointsGainedFromVotes = 0;
//     if(submission.votesByPlayerTurn){
//       pointsGainedFromVotes = submission.votesByPlayerTurn.length
//     }
//     players[playerToGetPoints].score += pointsGainedFromVotes;
//   })
// }

// const threePointsToTitledCardGuessersAndActivePlayer = (titledCard, activePlayerByTurn, players) => {
//   titledCard.votesByPlayerTurn.forEach(turnOfPlayerThatGuessedRight => {
//     players[turnOfPlayerThatGuessedRight].score += 3
//   })
//   players[activePlayerByTurn].score += 3;
// }

// // utils end
// //---------------------------
// //endpoints handlers
// //---------------------------

// //-----firebase /start

// // - updates the scores and the game status in db
// // gameId, playersArr 
// //
// const updateScoresInDB = async (gameId, players) => {
//   try {
//     await db.ref(`currentGames/${gameId}`).update({
//       players
//     })
//     db.ref(`currentGame/${gameId}`).update({
//       gameStatus: 'scores'
//     })
//   } catch (err) {
//     console.log('err',err)
//   }
// }


// // -- deals with new VS returning users, changes status
// // post: req.body{}
// // returns: 
// const signInHandler = async (req, res) => {
//   try {
//     const returningUser = (await getUser(req.body.email));
//     const data = {
//       ...req.body,
//       isActive: true,
//     }
//     if (returningUser) {
//       var ref = db.ref("appUsers");
//       ref.orderByChild("email").equalTo(req.body.email).once("child_added", function(snapshot) { // changed .on to .once
//         const ref = db.ref('appUsers/'+snapshot.key).update({
//           isActive: true,
//         })
//       });
//       res.status(200).json({
//         status: 200,
//         data: req.body,
//         message: 'returning user',
//       });
//       return;
//     } else {    
//       const appUsersRef= db.ref('appUsers');
//       const newPostKey = await appUsersRef.push({
//         ...req.body,
//         isActive:true,
//         }).key
//       res.status(200).json({
//         status: 200,
//         data: {
//           ...req.body,
//           userId: newPostKey,
//           },
//         message: 'new user',
//       });
//       return;
//     };
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // removes the 'currentGame' from the useNode, and added the game to the 'past games' node.
// const GameOverHandle = async (userId, gameId) => {
//   // push the last game to 'pastGames'
//   db.ref('currentGames/' + gameId).once('value', currentGameSnapshot => { // changed .on to .once
//     db.ref('appUsers/'+userId+'/pastGames').update({
//       [gameId]:currentGameSnapshot.val(),
//     })
//   })
//   // removing the 'currentGame'
//   db.ref('appUsers/'+userId+'/currentGame').remove()
// }
// // -- changes status of a user
// // put: req.body{}
// // returns: 
// const signOutHandler = async (req, res) => {
//   const {email} = req.body
//   const ref = db.ref("appUsers");
//   try {
//     await  ref.orderByChild("email").equalTo(email).once("child_added", async function(snapshot) { // changed .on to .once
//       // register that the user has logged out
//       db.ref('appUsers/'+snapshot.key).update({
//         isActive: false,
//       })
//       const currentGameId = snapshot.val().currentGame
//       await GameOverHandle(snapshot.key, currentGameId)
//     })
//     res.status(204).json({status:204})
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // -- creates a 'game' in the DB
// // post: creatorEmail, deck?
// // returns: gameId
// const createNewGameOnFirebase = async (creatorEmail, displayName, newGameDeck) => {
//   const gamesRef = db.ref('currentGames')
//   const appUsersRef = db.ref('appUsers')
//   try {
//     const newGameId = getNewGameIdBasedOnDate() ///Date.now() % 1000000000
//     await gamesRef.child(`${newGameId}`).set({
//       creatorEmail,
//       gameStatus: 'playing',
//       gameDeck: newGameDeck,
//       isOpen:true,
//       round: {
//         status: 'waiting',
//         activePlayer: 0,
//       },
//       players: {
//         0: {
//           email: creatorEmail,
//           displayName,
//           score: 0,
//         }
//       }
//     })
//     await appUsersRef.orderByChild("email").equalTo(creatorEmail).once('child_added', snapshot => {
//       db.ref('appUsers/'+snapshot.key).update({
//         currentGame: newGameId,
//       })
//     })
//     return newGameId;
//   } catch (err) {
//     console.log('err',err)
//   }
// }


// //return: hand
// const joinFirebaseGame = async (email, displayName, gameId) => {
//   const gameRef = db.ref('currentGames/'+gameId)
//   const appUsersRef = db.ref('appUsers')
//   try {
//     let turnNumber = null
//     await appUsersRef.orderByChild("email").equalTo(email).once('child_added', snapshot => { // changed .on to .once
//       db.ref('appUsers/'+snapshot.key).update({
//         currentGame: gameId,
//       })
//     })
//     // set the player and their turn.
//     await gameRef.child('players').once('value', snapshot => {
//       turnNumber = snapshot.numChildren()
//       gameRef.child(`players/${turnNumber}`).set({
//         email,
//         displayName,
//         score: 0,
//       })
//     })
//     let hand = null;
//     await gameRef.child('gameDeck').once('value', snapshot => {
//       hand = getHandFromDeck(snapshot.val())
//     })
//     // update deck
//     await hand.forEach(cardInHand=> {
//       gameRef.child('gameDeck').orderByKey().equalTo(`${cardInHand.id}`).once('child_added', snapshot => {
//         snapshot.ref.update({
//           isAvailable:false
//         })
//       })
//     })
//     console.log('turnNumber',turnNumber)
//     return {hand, turnNumber};
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // -- sets the titled card in the DB
// //return true/false for success
// const placeCardInFirebaseDB = async (id, img, title, gameId, turnNumber) => {
//   const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
//   try {
//     await cardsInPlayRef.once("value", snapshot => {
//       snapshot.ref.update({
//           [id]: {
//             id,
//             img,
//             title,
//             status: 'titledCard',
//             submittedBy: turnNumber,
//           }
//         })
//     })
//     return true
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // adds the guess to a guesses endpoint
// const matchCardToTitleFirebaseDB = async (playerEmail, cardId, cardImg, gameId, turnNumber) => {
//   const roundRef = db.ref(`currentGames/${gameId}/round`)
//   const cardsInPlayRef = db.ref('currentGames/'+gameId+'/round/cardsInPlay')
//   try {
//     // await roundRef.child('submissionsByPlayerTurnNumber').once("value", guessSnapshot => {
//     //   guessSnapshot.ref.update({
//     //     [turnNumber]: {
//     //       id: cardId,
//     //       img: cardImg,
//     //     }
//     //   })
//     // })
//     await cardsInPlayRef.once('value', cardsInPlaySnapshot => {
//       cardsInPlaySnapshot.ref.update({
//         [cardId]: {
//           id: cardId,
//           img: cardImg,
//           status: 'submission',
//           submittedBy: turnNumber,
//         }
//       })
//     })
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // sets the submissionsArray in DB
// const setSubmissionsArrInFirebaseDB = async (submissionsArr, gameId) => {
//   const roundRef = db.ref(`currentGames/${gameId}/round`)
//   try {
//     await roundRef.update({
//       cardsToGuess: submissionsArr
//     })
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// // send vote to DB
// const sendVoteToDB = async (gameId, cardId, playerVoting) => {
//   const cardIdRef = db.ref(`currentGames/${gameId}/round/cardsInPlay/${cardId}`)
//   try {
//     cardIdRef.once('value', cardVotesSnapshot => {
//       if(cardVotesSnapshot.val().votesByPlayerTurn) {
//         cardVotesSnapshot.ref.update({
//           votesByPlayerTurn: cardVotesSnapshot.val().votesByPlayerTurn.concat(playerVoting)
//         })
//       } else {
//         cardVotesSnapshot.ref.update({
//           votesByPlayerTurn: [playerVoting]
//         })
//       }
//     })
//   } catch (err) {
//     console.log('err',err)
//   }
// }

// //-----firebase /end
