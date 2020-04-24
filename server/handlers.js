'use strict';

const deck = require('.data/deck')

//---------------------------
// firebase stuff
//---------------------------
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

//---------------------------
//utils
//---------------------------

//---------------------------
//endpoints handlers
//---------------------------

//-----firebase

// -- deals with new VS returning users, changes status
// post: req.body{}
// returns: 
const signInHandler = async (req, res) => {

}

// -- changes status of a user
// put: req.body{}
// returns: 
const signOutHandler = async (req, res) => {

}

//-----game

// -- sets the deck, creates a gameId
// get:
// returns: 
const startGameHandler = async (req, res) => {

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
// post: req.body{the card chosen, title, guesserId}
// returns: 
const submitCardUnderTitle = async (req, res) => {

}

module.exports = {
  signInHandler,
  signOutHandler,
  startGameHandler,
  roundEndHandler,
  roundStartHandler,
  submitGuessPlayersCard,
  submitCardUnderTitle,
}