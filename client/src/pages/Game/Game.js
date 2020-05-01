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
} from '../../utils';

import {
  setIsMyTurn,
  setTitledCard,
  changeRoundStatus,
  addSubmissionToSubmissionsArr,
  reShuffleSubmissions,
  setPlayersAmount,
  setAmountOfVotes,
} from '../../Redux/actions';

import CardInHand from '../../components/CardInHand';
import ChosenCardModal from '../../components/ChosenCardModal';
import AllPlayedCards from '../../components/AllPlayedCards';
import CardToVoteOn from '../../components/CardToVoteOn';

const Game = () => {
  const dispatch = useDispatch()

  const gameData = useSelector(state=>state.gameData)
  const gameId = gameData.gameId;
  const roundData = useSelector(state=>state.roundData)
  const {submissionsArr} = roundData
  const {hand, titledCard, isMyTurn} = roundData
  const email = useSelector(state=>state.currentUser.info.email)

  const [chosenTitle, setChosenTitle] = useState(false)
  const [chosenCardModalFlag, setChosenCardModalFlag] = useState(false)
  const [chosenCard, setChosenCard] = useState({
    id: null,
    img: null,
  })

  const [submissionsMadeInDB, setSubmissionsMadeInDB] = useState(0);

  const [matchCardModalFlag, setMatchCardModalFlag] = useState(false)

  // updates the amount of players logged in to the game
  useEffect(()=>{
      const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
      playersRef.on('value', playersSnapshot => {
        const amountOfPlayersLoggedOn = playersSnapshot.numChildren();
        if(amountOfPlayersLoggedOn !== gameData.playersAmount){
          dispatch(setPlayersAmount(amountOfPlayersLoggedOn))
        }
      })

      return ()=>{
        const playersRef = firebase.database().ref(`currentGames/${gameId}/players`)
        playersRef.off()
      }
  },[gameData.playersAmount])

  // checks when it is 'myTurn'
  useEffect(()=> {
    const currentRoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    currentRoundRef.child('activePlayer').on('value', (snapshot) => {
      const activePlayerNumber = snapshot.val()
      const playersInCurrentGameRef = firebase.database().ref('currentGames/'+gameId+'/players')
      playersInCurrentGameRef.on('value', playersSnapshot => {
        if(playersSnapshot.val()){
          if(playersSnapshot.val()[activePlayerNumber]){
            if(email === playersSnapshot.val()[activePlayerNumber].email){
              console.log("active player");
              dispatch(setIsMyTurn(true))
            } else {
              console.log('not active player')
              dispatch(setIsMyTurn(false))
            }
          }
        }
      })
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
    if(amountOfCardsInPlay === gameData.playersAmount){
      if(amountOfCardsInPlay>0 && roundData.status==='waiting-for-other-submissions') {
        const cardsInPlayArr = Object.values(cardsInPlaySnapshot.val())
        const newSubmissionsArr = reshuffleArr(cardsInPlayArr)
        dispatch(reShuffleSubmissions(newSubmissionsArr));
        dispatch(changeRoundStatus('voting'))
      }
    }
  })
  
  return ()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.off();
  }
},[roundData.status])

// check if a submission was made and push it into the submission array
// the submission array exist in the activePlayer state exclusively
  useEffect(()=>{
    const currentRoundRef = firebase.database().ref(`currentGames/${gameId}/round`)
    currentRoundRef.child('submissionsByPlayerTurnNumber').on('child_added', submissionsSnapshot => {
      const newSubmission = submissionsSnapshot.val()
      if(!submissionsArr.some(submission=>submission.id===newSubmission.id)&&roundData.isMyTurn)dispatch(addSubmissionToSubmissionsArr(newSubmission))
    })

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const currentRoundRef = firebase.database().ref(`currentGames/${gameId}/round`)
      currentRoundRef.child('submissionsByPlayerTurnNumber').off()
    }
  },[roundData.status])

  const scoring = (cardsInPlay, totalVotes, gameId) => {
    // console.log('cardsInPlay',cardsInPlay)
    // console.log('totalVotes',totalVotes)
    console.log('fetch')
    const body = {
      cardsInPlay,
      totalVotes,
      gameId,
      activePlyerByTurn: gameData.turnNumber,
    }
    fetch(`/calculate-and-give-points`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(body)
    }).catch(err=>console.log('err in scoring',err))
    const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
      roundStatusRef.on('value', roundStatusSnapshot => {
        if(roundStatusSnapshot.val()==='scores')getScores(roundStatusRef)
      })
  }

  //listens to votes, and when all done calculates the 
  useEffect(()=>{
    const cardsInPlayRef = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
    cardsInPlayRef.on('value', cardsInPlaySnapshot => {
      if(cardsInPlaySnapshot.val()){
        const totalNumberOfVotesCast = Object.values(cardsInPlaySnapshot.val()).reduce((temporarySum, card) => temporarySum + (card.votesByPlayerTurn ? card.votesByPlayerTurn.length : 0) , 0)
        // console.log('totalNumberOfVotesCast',totalNumberOfVotesCast)
        // console.log('cardsInPlaySnapshot.val()',cardsInPlaySnapshot.val())
// just the active player would still be in 'voting', the rest will be 'waiting-for-other-votes'
        if(totalNumberOfVotesCast === (gameData.playersAmount - 1) && roundData.status==='voting'){ 
          scoring(cardsInPlaySnapshot.val(), totalNumberOfVotesCast, gameData.gameId)
        }
      }
    })
    
    return () => {
      const craig = firebase.database().ref(`currentGames/${gameId}/round/cardsInPlay`)
      craig.off()
    }
  },[roundData.status])

  const clickOnCardInHand = (id, img) => {
    if (roundData.status==='submitting-titled-card' || roundData.status==='matching-card-to-title'){
      setChosenCardModalFlag(true);
      setChosenCard({
        id,
        img,
      });
    }
  }

  const getScores = (listenerRef) => {
    listenerRef.off();
    firebase.database().fer(`currentGames/${gameId}/player/${gameData.turnNumber}`).once('value', scoreSnapshot => {
      console.log('scoreSnapshot.val()',scoreSnapshot.val())
    })
  }

  const clickOnCardToVote = (cardId) => {
    if(cardId === roundData.mySubmission || isMyTurn) {
      //error, cant vote for yourself
    } else if(roundData.status === 'voting'){
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
      const roundStatusRef = firebase.database().ref(`currentGames/${gameId}/round/status`)
      roundStatusRef.on('value', roundStatusSnapshot => {
        if(roundStatusSnapshot.val()==='scores')getScores(roundStatusRef)
      })
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
      {roundData.status === 'waiting-for-other-submissions' && <div>waiting-for-other-submissions</div>}
      {(roundData.status === 'voting' || roundData.status === 'waiting-for-other-votes') && (
        <VotingWrapper>
          {roundData.submissionsArr.map(card=><CardToVoteOn
          key={card.id}
          id={card.id}
          img={card.img}
          onClick={clickOnCardToVote}
          />
          )}
        </VotingWrapper>
        )}
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