import React, {
  useEffect,
  useState,
} from 'react';
import * as firebase from 'firebase';

import styled from 'styled-components';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  useHistory,
} from 'react-router-dom';

import {
  reshuffleArr,
  stateDifferentThenDB,
} from '../../utils';

import {
  PLAYER_COLORS,
  IP,
} from '../../constants';

import {
  setIsMyTurn,
  setTitledCard,
  changeRoundStatus,
  reShuffleSubmissions,
  setGameStatus,
  addCardToHand,
  updateVotesInSubmission,
  setPlayers,
  setActivePlayer,
  clearTitledCard,
  setVotingMessage,
  clearChat,
} from '../../Redux/actions';

import CardInHand from '../../components/CardInHand';
import ChosenCardModal from '../../components/ChosenCardModal';
import Chat from '../../components/Chat';
import Winner from '../../components/Winner';
import Loser from '../../components/Loser';
import VotingWrapper from '../../components/VotingWrapper';

const Game = () => {
  const dispatch = useDispatch()
  const history = useHistory();

  const gameData = useSelector(state=>state.gameData)
  const {gameId, players} = gameData;
  const roundData = useSelector(state=>state.roundData)
  const {submissionsArr} = roundData
  const {hand, isMyTurn} = roundData
  const userId = useSelector(state=>state.currentUser.info.id)
  const [playerColor, setPlayerColor] = useState('')
  const [chosenCardModalFlag, setChosenCardModalFlag] = useState(false)
  const [chosenCard, setChosenCard] = useState({
    id: null,
    img: null,
  })

  useEffect(()=>{
    dispatch(clearChat())
    // eslint-disable-next-line
  },[])

  // set playerColor based on turn number
  useEffect(()=>{
    setPlayerColor(PLAYER_COLORS[gameData.turnNumber])
  }, [gameData.turnNumber])

  useEffect(()=>{
    if(!gameData.gameId)history.push('/')
    // eslint-disable-next-line
  },[gameData.gameId])

  // updates the amount of players logged in to the game
  // and keeps track of the scores
  //AND
  // checks that all players are ready for next round, once ready
  // only the activePlayer is changing the activePlayer to the next one
  useEffect(()=>{
      if(gameData.status === 'end-of-round')dispatch(clearTitledCard())
        // listens to the players that are logged on
        const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
        playersRef.on('value', playersSnapshot => {
        if(playersSnapshot.val())if(stateDifferentThenDB(players, playersSnapshot.val())){
          dispatch(setPlayers(playersSnapshot.val()))
          }
      
        // checks that all players are ready for next round, once ready
        // only the activePlayer is changing the activePlayer to the next one
        let amountOfReadyPlayers = 0;
        if(playersSnapshot.val())playersSnapshot.val().forEach(player=>{
          if(player.status==='ready')amountOfReadyPlayers++;
        })
        // if all are ready, we can start next round
        if (isMyTurn && (amountOfReadyPlayers === playersSnapshot.val().length)) {
          const body = {
            gameId
          }
          fetch(`${IP}/start-next-round`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            },
            body: JSON.stringify(body)
          })
          .catch(err=>console.log('err in starting next round',err))
        }
      }) 

      const gameStatus = firebase.database().ref(`currentGames/${gameId}/status`)
      gameStatus.on('value', gameStatusSnapshot => {
        if(gameStatusSnapshot.val()){
          console.log('gameData.score pre',gameData.score)
            console.log('here pre', gameData.status)
          if(gameStatusSnapshot.val() === 'over'  && gameData.status!=='winner' && gameData.score<30) {
            console.log('gameData.score post',gameData.score)
            console.log('here post', gameData.status)
            dispatch(setGameStatus('loser'))
            fetch(`${IP}/game-over/loser`, {
              method: "PATCH",
              headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
              },
              body: JSON.stringify({gameId, userId})
            })
            .catch(err=>console.log('err in game-over:loser',err))
          }
        }
      })

      return ()=>{
        const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
        playersRef.off()
        const gameStatus = firebase.database().ref(`currentGames/${gameId}/status`)
      gameStatus.off();
      }
      // eslint-disable-next-line
  },[gameData.status])

  // checks when it is 'myTurn'
  useEffect(()=> {
    if(gameData.status!=='waiting'){const currentRoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    currentRoundRef.child('activePlayer').on('value', (snapshot) => {
      const activePlayerNumber = snapshot.val()
      dispatch(setActivePlayer(activePlayerNumber))
      if(activePlayerNumber === gameData.turnNumber){
        dispatch(setIsMyTurn(true))
      } else {
        dispatch(setIsMyTurn(false))
      }
    })}

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const currentRoundRef = firebase.database().ref(`currentGames/`+gameId);
      currentRoundRef.off();
    };
    // eslint-disable-next-line
  },[isMyTurn])

  // get the title from the DB
  // AND check that the all submissions are in
  // AND check if the scores are in
  useEffect(()=>{
  // get the title from the DB
    const RoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    RoundRef.child('cardsInPlay').orderByChild('status').equalTo('titledCard').on('child_added', (snapshot) => {
      if(snapshot.val() && !isMyTurn && roundData.status === 'waiting-for-title')dispatch(setTitledCard(snapshot.val().title))
    })
  // check that the all submissions are in
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.on('value', cardsInPlaySnapshot => {
      const amountOfCardsInPlay = cardsInPlaySnapshot.numChildren()
      // players.length === amount of players in the game
      if(amountOfCardsInPlay === players.length){
        if(amountOfCardsInPlay>0 && roundData.status==='waiting-for-other-submissions') {
          // fetch the submissions throught he db
          fetch(`${IP}/get-submission-array/${gameId}`)
          .then(res=>res.json())
          .then(res=>{
            if(res.status === 200){
              const reshuffled = reshuffleArr(Object.values(res.submissions))
              dispatch(reShuffleSubmissions(reshuffled));
              dispatch(changeRoundStatus('voting'))
            }
          })
        }
      }

    //listens to votes, and when all done calculates the 
      if(cardsInPlaySnapshot.val()){
        const totalNumberOfVotesCast = Object.values(cardsInPlaySnapshot.val()).reduce((temporarySum, card) => temporarySum + (card.votesByPlayerTurn ? card.votesByPlayerTurn.length : 0) , 0)
        // just the active player would still be in 'voting', the rest will be 'waiting-for-other-votes'
        if(totalNumberOfVotesCast === (players.length - 1) && roundData.status==='voting'){ 
          scoring(cardsInPlaySnapshot.val(), totalNumberOfVotesCast, gameData.gameId)
        }
      }
  })
  // check if the scores are in
    const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
    roundStatusRef.on('value', roundStatusSnapshot => {
      if(roundStatusSnapshot.val()==='scores'){
        // repopulate the submissionsArr with the votes
        firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`).once('value', cardsSnapshot => {
          const cards = cardsSnapshot.val()
          dispatch(updateVotesInSubmission(cards))
        })
        // end of round
        firebase.database().ref(`currentGames/${gameId}/round`).once('value', votingMessageSnapshot => {
          if(votingMessageSnapshot.val())dispatch(setVotingMessage(votingMessageSnapshot.val().votingMessage))
        })
        if(gameData.status!=='winner' || gameData.status!=='loser'){
          dispatch(setGameStatus('end-of-round'))
        }
        } else if(roundStatusSnapshot.val()==='over'){
          // repopulate the submissionsArr with the votes
          firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`).once('value', cardsSnapshot => {
            const cards = cardsSnapshot.val()
            dispatch(updateVotesInSubmission(cards))
          })
          // end of round
          firebase.database().ref(`currentGames/${gameId}/round`).once('value', votingMessageSnapshot => {
            dispatch(setVotingMessage(votingMessageSnapshot.val().votingMessage))
          })
        }
    })
    

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const RoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
      RoundRef.off();
      const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
      cardsInPlayRef.off();
      const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
      roundStatusRef.off()
    };
    // eslint-disable-next-line
  },[roundData.status])
  
  useEffect(()=>{
    if(gameData.score>=30){
      dispatch(setGameStatus('winner'))
      fetch(`${IP}/game-over/winner`, {
          method: "PATCH",
          headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
          },
          body: JSON.stringify({gameId, userId})
        })
        .catch(err=>console.log('err in game-over:winner',err))
    }
    // eslint-disable-next-line
  },[gameData.score])

  const scoring = (cardsInPlay, totalVotes, gameId) => {
    const adjustedCards = JSON.parse(JSON.stringify(cardsInPlay))
    Object.keys(adjustedCards).map(cardId=>adjustedCards[cardId].imgSrc = ""+ cardId)
    const body = {
      cardsInPlay: adjustedCards,
      totalVotes,
      gameId,
      activePlyerByTurn: gameData.turnNumber,
    };
    fetch(`${IP}/calculate-and-give-points`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(body)
    })
      .catch(err=>console.log('err in scoring',err))
  }

  const nextPrepRound = () => {
    // all player need to draw a new card
    dispatch(changeRoundStatus('starting-new-round'))
    dispatch(setVotingMessage([]))
    const body = {
      gameId,
      playerTurn: gameData.turnNumber,
    }
    // changes player status to 'ready', and returns a new card
    fetch(`${IP}/prep-for-next-round`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(body)
    })
      .then(res=>res.json())
      .then(res=>{
        if(res.status===200){
          setVotingMessage([])
          dispatch(addCardToHand(res.card))
          dispatch(setGameStatus('starting-new-round'))
        }
      })
      .catch(err=>console.log('err - creating new round',err))
  }

  const clickOnCardInHand = (id, img) => {
    if (roundData.status==='submitting-titled-card' || roundData.status==='matching-card-to-title'){
      // log my submission
      setChosenCardModalFlag(true);
      setChosenCard({
        id,
        img,
      });
    }
  }

  const clickOnCardToVote = (id, img) => {
    if(roundData.status === 'voting'){
      setChosenCardModalFlag(true);
      setChosenCard({
        id,
        img,
      });
    } else if(gameData.status==='end-of-round' && roundData.status!=='starting-new-round'){
      nextPrepRound()
    }
  }

  return (<>
    {gameData.status === "winner"
      ? <Winner>
          <VotingWrapper submissionsArr={roundData.submissionsArr} gameStatus={gameData.status} roundStatus={roundData.status} nextPrepRound={nextPrepRound} clickOnCardToVote={()=>console.log('nothing')}/>
      <Chat/>
        </Winner>
      : (gameData.status === "loser" 
          ? <Loser>
              <VotingWrapper submissionsArr={roundData.submissionsArr} gameStatus={gameData.status} roundStatus={roundData.status} nextPrepRound={nextPrepRound} clickOnCardToVote={()=>console.log('nothing')}/>
      <Chat/>
            </Loser>
          : (<Wrapper data-css='cards in hand'>
      {chosenCardModalFlag && <ChosenCardModal
        chosenCard={chosenCard}
        setChosenCardModalFlag={setChosenCardModalFlag}
      />}
      {(roundData.status === 'voting' || roundData.status === 'waiting-for-other-votes' || roundData.status==='scores') && (
        <VotingWrapper submissionsArr={roundData.submissionsArr} gameStatus={gameData.status} roundStatus={roundData.status} nextPrepRound={nextPrepRound} clickOnCardToVote={clickOnCardToVote}/>
        )}
      {(gameData.status !== 'winner' || gameData.status !== 'loser') && <CardsInHand
          color={playerColor}
          >
            {hand.length && hand.map((card, index)=><CardInHand
              key={card.id}
              id={card.id}
              img={card.imgSrc}
              index={index}
              setChosenCardModalFlag={setChosenCardModalFlag}
              setChosenCard={setChosenCard}
              onClick={clickOnCardInHand}
            />)}
        </CardsInHand>
      }
      <Chat/>
    </Wrapper>))}
    </>);
}

export default Game;

const Wrapper = styled.div`
  height: calc(100vh - 80px);
  width: 100vw;
`;

const CardsInHand = styled.div`
  position: absolute;
  bottom: -80px;
  width: 100%;
  z-index:1;
  border: 3px solid ${props=>props.color}
  height: fit-content;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  justify-self:center;
  background-color: ${props=>props.color};
  box-shadow:  5px 0 5px 2px #8fb11c , inset 0 0 5px 2px #8fb11c;
`;