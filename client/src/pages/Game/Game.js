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
  setIsMyTurn,
} from '../../Redux/actions';

import CardInHand from '../../components/CardInHand';
import ChosenCardModal from '../../components/ChosenCardModal';
import AllPlayedCards from '../../components/AllPlayedCards';

const Game = () => {
  const dispatch = useDispatch()

  const {
    hand,
    titledCard,
    isMyTurn,
    gameId,
  } = useSelector(state=>state.gameData)
  const email = useSelector(state=>state.currentUserInfo.info.email)
  // const hand = useSelector(state=>state.gameData.hand)
  // const titledCard = useSelector(state=>state.gameData.titledCard)
  // const isMyTurn = useSelector(state=>state.gameData.isMyTurn)
  const [chosenTitle, setChosenTitle] = useState(false)
  const [chosenCardModalFlag, setChosenCardModalFlag] = useState(false)
  const [chosenCard, setChosenCard] = useState({
    id: null,
    img: null,
  })

  useEffect(()=> {
    const currentRoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    currentRoundRef.child('activePlayer').on('value', (snapshot) => {
      console.log('snapshot.val()',snapshot.val())
      if(email === snapshot.val()){
        console.log("active player");
        dispatch(setIsMyTurn(true))
      } else {
        console.log('not active player')
        dispatch(setIsMyTurn(false))
      }
    })

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const currentRoundRef = firebase.database().ref(`currentGames/`+gameId);
      currentRoundRef.off();
    };
  },[isMyTurn])

  useEffect(()=>{
    const currentRoundRef = firebase.database().ref(`currentGames/`+gameId+'/round');
    console.log('gameId',gameId)
    currentRoundRef.child('titledCard').on('value', (snapshot) => {
      console.log('snapshot.val()',snapshot.val())
      // if(email === snapshot.val()){
      //   console.log("active player");
      //   dispatch(setIsMyTurn(true))
      // } else {
      //   console.log('not active player')
        // dispatch(setIsMyTurn(false))
      // }
    })

    return () => {
      // this is where we need to turn off the connection. It's always good to clean up after oursleves.
      const currentRoundRef = firebase.database().ref(`currentGames/`+gameId);
      currentRoundRef.off();
    };
  },[titledCard])

  return (
    <Wrapper data-css='cards in hand'>
      {chosenCardModalFlag && <ChosenCardModal
        chosenCard={chosenCard}
        setChosenCardModalFlag={setChosenCardModalFlag}
      />}
      {titledCard.title && (<AllPlayedCards/>)}
      <p>isMyTurn: {isMyTurn}</p>
      <CardsInHand>
        {hand && hand.map((card, index)=><CardInHand
          key={card.id}
          id={card.id}
          img={card.imgSrc}
          index={index}
          setChosenCardModalFlag={setChosenCardModalFlag}
          setChosenCard={setChosenCard}
          isMyTurn={isMyTurn}
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