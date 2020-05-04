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
  randFromArr,
  reshuffleArr,
  stateDifferentThenDB,
} from '../../utils';

import {
  setIsMyTurn,
  setTitledCard,
  changeRoundStatus,
  addSubmissionToSubmissionsArr,
  reShuffleSubmissions,
  setPlayersAmount,
  setAmountOfVotes,
  setMySubmission,
  setGameStatus,
  addCardToHand,
} from '../../Redux/actions';

import CardInHand from '../../components/CardInHand';
import ChosenCardModal from '../../components/ChosenCardModal';
import AllPlayedCards from '../../components/AllPlayedCards';
import CardToVoteOn from '../../components/CardToVoteOn';
import ScoreBoard from '../../components/ScoreBoard'

const Game = () => {
  const dispatch = useDispatch()

  const gameData = useSelector(state=>state.gameData)
  const gameId = gameData.gameId;
  const roundData = useSelector(state=>state.roundData)
  const {submissionsArr} = roundData
  const {hand, titledCard, isMyTurn} = roundData
  const email = useSelector(state=>state.currentUser.info.email)

  const [players, setPlayers] = useState([]);
  const [chosenTitle, setChosenTitle] = useState(false)
  const [chosenCardModalFlag, setChosenCardModalFlag] = useState(false)
  const [chosenCard, setChosenCard] = useState({
    id: null,
    img: null,
  })

  const [submissionsMadeInDB, setSubmissionsMadeInDB] = useState(0);
  const [votingMessage, setVotingMessage] = useState([])
  const [matchCardModalFlag, setMatchCardModalFlag] = useState(false)

  // updates the amount of players logged in to the game
  // and keeps track of the scores
  useEffect(()=>{
      const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
      playersRef.on('value', playersSnapshot => {
        if(playersSnapshot.val())if(stateDifferentThenDB(players, playersSnapshot.val()))setPlayers(playersSnapshot.val())
      })

      return ()=>{
        const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
        playersRef.off()
      }
  },[gameData.status])

  // checks when it is 'myTurn'
  useEffect(()=> {
    const currentRoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    currentRoundRef.child('activePlayer').on('value', (snapshot) => {
      const activePlayerNumber = snapshot.val()
      if(activePlayerNumber === gameData.turnNumber){
        dispatch(setIsMyTurn(true))
      } else {
        dispatch(setIsMyTurn(false))
      }
    })

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const currentRoundRef = firebase.database().ref(`currentGames/`+gameId);
      currentRoundRef.off();
    };
  },[isMyTurn])

  // get the title from the DB
  useEffect(()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    cardsInPlayRef.child('cardsInPlay').orderByChild('status').equalTo('titledCard').on('child_added', (snapshot) => {
      if(snapshot.val() && !isMyTurn && roundData.status === 'waiting-for-title')dispatch(setTitledCard(snapshot.val().title))
    })

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const cardsInPlayRef = firebase.database().ref(`currentGames/`+gameId+'/round');
      cardsInPlayRef.child('cardsInPlay').off();
    };
  },[roundData.status])

// check that the all submissions are in
  useEffect(()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.on('value', cardsInPlaySnapshot => {
      const amountOfCardsInPlay = cardsInPlaySnapshot.numChildren()
      // players.length === amount of players in the game
      if(amountOfCardsInPlay === players.length){
        if(amountOfCardsInPlay>0 && roundData.status==='waiting-for-other-submissions') {
          // fetch the submissions throught he db
          fetch(`/get-submission-array/${gameId}`)
          .then(res=>res.json())
          .then(res=>{
            if(res.status === 200){
              Object.values(res.submissions).forEach(card=>console.log('card.id',card.id))
              // console.log('submissions',res.submissions[Object.values(res.submissions))[0]].id)
              const reshuffled = reshuffleArr(Object.values(res.submissions))
              // console.log('reshuffled',reshuffled)
              reshuffled.forEach(card2=>console.log('card2.id',card2.id))
              dispatch(reShuffleSubmissions(reshuffled));
              dispatch(changeRoundStatus('voting'))
            }
          })
          // const cardsInPlayArr = Object.values(cardsInPlaySnapshot.val())
          // const newSubmissionsArr = reshuffleArr(cardsInPlayArr)
          // dispatch(reShuffleSubmissions(newSubmissionsArr));
          // dispatch(changeRoundStatus('voting'))
        }
      }
  })
  
  return ()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.off();
  }
},[roundData.status])

  const scoring = (cardsInPlay, totalVotes, gameId) => {
    console.log('fetch - scoring')
    const adjustedCards = JSON.parse(JSON.stringify(cardsInPlay))
    Object.keys(adjustedCards).map(cardId=>adjustedCards[cardId].imgSrc = ""+ cardId)
    const body = {
      cardsInPlay: adjustedCards,
      totalVotes,
      gameId,
      activePlyerByTurn: gameData.turnNumber,
    };
    fetch(`/calculate-and-give-points`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(body)
    })
      .catch(err=>console.log('err in scoring',err))
  }

  // check if the scores are in
  useEffect(()=>{
    const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
    roundStatusRef.on('value', roundStatusSnapshot => {
      if(roundStatusSnapshot.val()==='scores'){
        dispatch(setGameStatus('end-of-round'))
        const votingMessageRef = firebase.database().ref(`currentGames/${gameId}/round/votingMessage`)
        votingMessageRef.once('value', votingMessageSnapshot => {
          setVotingMessage(votingMessageSnapshot.val())
        })
        }
    })

    return () => {
      const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
      roundStatusRef.off()
    }
  },[roundData.status])

  //listens to votes, and when all done calculates the 
  useEffect(()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.on('value', cardsInPlaySnapshot => {
      if(cardsInPlaySnapshot.val()){
        const totalNumberOfVotesCast = Object.values(cardsInPlaySnapshot.val()).reduce((temporarySum, card) => temporarySum + (card.votesByPlayerTurn ? card.votesByPlayerTurn.length : 0) , 0)
        // just the active player would still be in 'voting', the rest will be 'waiting-for-other-votes'
        if(totalNumberOfVotesCast === (players.length - 1) && roundData.status==='voting'){ 
          scoring(cardsInPlaySnapshot.val(), totalNumberOfVotesCast, gameData.gameId)
        }
      }
    })
    
    return () => {
      const craig = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
      craig.off()
    }
  },[roundData.status])

  // checks that all players are ready for next round, once ready
  // only the activePlayer is changing the activePlayer to the next one
  useEffect(()=>{
    const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
    playersRef.on('value', playersSnapshot => {
      let amountOfReadyPlayers = 0;
      if(playersSnapshot.val())playersSnapshot.val().forEach(player=>{
        if(player.status==='ready')amountOfReadyPlayers++;
      })
      // if all are ready, we can start next round
      if (isMyTurn && (amountOfReadyPlayers === playersSnapshot.val().length)) {
        const body = {
          gameId
        }
        fetch('/start-next-round', {
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

    return () =>{
      const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
      playersRef.off()
    }
  },[gameData.status])

  const nextPrepRound = () => {
    // all player need to draw a new card
    dispatch(changeRoundStatus('starting-new-round'))
    const body = {
      gameId,
      playerTurn: gameData.turnNumber,
    }
    // changes player status to 'ready', and returns a new card
    fetch('/prep-for-next-round', {
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

  const clickOnCardToVote = (cardId) => {
    if(cardId === roundData.mySubmission || isMyTurn) {
      //error, cant vote for yourself
    } else if(roundData.status === 'voting'){
      dispatch(changeRoundStatus('submitting'))
      // fetch, put, send vote
      const body = {
        cardId,
        playerVoting: gameData.turnNumber,
      }
      fetch(`/vote/${gameId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
          body: JSON.stringify(body),
        })
        .catch(err=>console.log('err',err))
      // change status to waiting for votes
      dispatch(changeRoundStatus('waiting-for-other-votes'))
    }
  }

  return (
    <Wrapper data-css='cards in hand'>
      {chosenCardModalFlag && <ChosenCardModal
        chosenCard={chosenCard}
        setChosenCardModalFlag={setChosenCardModalFlag}
      />}
      {titledCard.title && (<AllPlayedCards/>)}
      <p>isMyTurn: {`${isMyTurn}`}</p>
      <ScoreBoard players={players} votingMessage={votingMessage}/>
      {roundData.status === 'waiting-for-other-submissions' && <div>waiting-for-other-submissions</div>}
      {(roundData.status === 'voting' || roundData.status === 'waiting-for-other-votes' || roundData.status==='scores') && (
        <VotingWrapper>
          {roundData.submissionsArr.map(card=><CardToVoteOn
          key={card.id}
          id={card.id}
          img={card.imgSrc}
          onClick={clickOnCardToVote}
          />
          )}
        </VotingWrapper>
        )}
      {gameData.status==='end-of-round' && <button
          onClick={()=>nextPrepRound()}
        >continue?</button>}
      <CardsInHand>
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
    </Wrapper>
    );
}

export default Game;

const Wrapper = styled.div`
  height: calc(100vh - 80px);
  width: 100vw;
`;

const CardsInHand = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  /* margin: 0 auto 10px auto; */
  /* width: fit-content; */
  height: fit-content;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  justify-self:center;
`;

const VotingWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 80%;
  justify-content: space-around;
`;