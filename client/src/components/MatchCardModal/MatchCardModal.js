import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  chooseCard,
} from '../../Redux/actions';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

const MatchCardModal = ({
  chosenCard,
  setMatchCardModalFlag,
  }) => {
  const dispatch = useDispatch();
  const {gameId} = useSelector(state=>state.gameData)
  const {
    titledCard,
    isMyTurn,
  }= useSelector(state=>state.roundData)
  const {
    info,
  } = useSelector(state=>state.currentUserInfo)
  const [title, setTitle] = useState('')

  const valueChange = (event) => {
    setTitle(event.target.value)
  }

  useEffect(()=>{
    setTitle('')
  },[chosenCard])

  const setMatchedCard = () => {
    dispatch(chooseCard(chosenCard.id, title));
      const body = {
        id: chosenCard.id,
        title,
        gameId,
      }
      fetch('/place-card', {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      })
        .then(res=>res.json())
        .then(res=>{setChosenCardModalFlag(false)})
  }

  const setGuessCardUnderTitle = () => {
    const body = {
        playerEmail: info.email,
        cardId: chosenCard.id,
        gameId,
      }
      // TODO: not a post, maybe a PUT?
    fetch('/match-card-to-title', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify(body),
    })
    .then(res=>res.json())
    .then(res=>{
    })
  }

  const cardChosen = (event) => {
    event.preventDefault();
    if(title.length>0){
      if(isMyTurn) setRoundTitledCard()
      if(titledCard.title) setGuessCardUnderTitle()
    } else {
      console.log('error in title');// error in title;
    }
  }

  return (
    <Wrapper
      onClick={()=>setChosenCardModalFlag(false)}
    >
      <ChosenCardModalContainer
        onSubmit={cardChosen}
        onClick={(event)=>event.stopPropagation()}
      >
        <CardImg>{chosenCard.img}</CardImg>
        <Info>
          <div>
            <label htmlFor="title">What title? </label>
            <input type="text" id="title" name="title" placeholder="title" value={title}
              onChange={valueChange}
            />
            <button type="submit">submit</button>
          </div>
        </Info>
      </ChosenCardModalContainer>
    </Wrapper>
    );
}

export default ChosenCardModal;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 100;
  background-color: rgb(60,60,60);
  opacity: 0.5;
`;

const ChosenCardModalContainer = styled.form`
  position: absolute;
  width: 400px;
  height: 400px;
  margin: auto;
  border-radius: 10px;
  z-index: 101;
  display: flex;
  flex-direction:row;
  background-color: white;
  opacity: 2;
`;

const CardImg = styled.div`
  flex:1;
`;

const Info = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;