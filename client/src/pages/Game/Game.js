import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  setNewDeck,
} from '../../Redux/actions';

import CardInHand from '../../components/CardInHand';
import ChosenCardModal from '../../components/ChosenCardModal';
import AllPlayedCards from '../../components/AllPlayedCards';

const Game = () => {
  const dispatch = useDispatch()

  const hand = useSelector(state=>state.gameData.hand)
  const titledCard = useSelector(state=>state.gameData.titledCard)
  // console.log('hand',hand)
  const [chosenTitle, setChosenTitle] = useState(false)
  const [chosenCardModalFlag, setChosenCardModalFlag] = useState(false)
  const [chosenCard, setChosenCard] = useState({
    id: null,
    img: null,
  })

  useEffect(()=>{
    fetch('/start-game')
    .then(res=>res.json())
    .then(res=> {
      console.log('res.deck',res.hand)
      if(res.status === 200) {
        dispatch(setNewDeck(res.hand))
      }
    })
  },[])

  return (
    <Wrapper data-css='cards in hand'>
      {chosenCardModalFlag && <ChosenCardModal
        chosenCard={chosenCard}
        setChosenCardModalFlag={setChosenCardModalFlag}
      />}
      {titledCard.title && (<AllPlayedCards/>)}
      <CardsInHand>
        {hand && hand.map((card, index)=><CardInHand
          key={card.id}
          id={card.id}
          img={card.imgSrc}
          index={index}
          setChosenCardModalFlag={setChosenCardModalFlag}
          setChosenCard={setChosenCard}
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