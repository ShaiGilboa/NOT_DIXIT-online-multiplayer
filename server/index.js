'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('dotenv').config();

const {
  signInHandler,
  signOutHandler,
  createNewGameHandler,
  placeCardForRound,
  joinExistingGameHandler,
  matchCardToTitle,
  votingHandler,
  scoringHandler,
  drawCardHandler,
  roundPrepHandler,
  startNextRoundHandler,
  getSubmissionArrHandler,
  startGameHandler,
  sendMessageHandler,
} = require('./handlers');

const PORT = process.env.PORT || 4000;

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('./client/build'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // .get('/users', getUser)
  .post('/sign-in', signInHandler)
  .put('/sign-out', signOutHandler)
  .post('/create-new-game', createNewGameHandler)
  .post('/join-existing-game', joinExistingGameHandler)
  .post('/prep-for-next-round', roundPrepHandler)
  .post('/place-card', placeCardForRound)
  .post('/match-card-to-title', matchCardToTitle)
  .put('/vote/:gameId', votingHandler)
  .put('/calculate-and-give-points', scoringHandler)
  .put('/start-next-round', startNextRoundHandler)
  .get('/get-submission-array/:gameId', getSubmissionArrHandler)
  .patch('/start-game', startGameHandler)
  .put('/send-message', sendMessageHandler)

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
