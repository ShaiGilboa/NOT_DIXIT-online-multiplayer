import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  chooseCard,
  changeRoundStatus,
  addSubmissionToSubmissionsArr,
} from '../../Redux/actions';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

const ChosenCardModal = ({
  chosenCard,
  setChosenCardModalFlag,
  }) => {
  const dispatch = useDispatch();
  const {gameId, turnNumber} = useSelector(state=>state.gameData)
  const roundData = useSelector(state=>state.roundData)
  const {
    titledCard,
    isMyTurn,
  } = roundData
  const {
    info,
  } = useSelector(state=>state.currentUser)
  const [title, setTitle] = useState('')

  const valueChange = (event) => {
    setTitle(event.target.value)
  }

  useEffect(()=>{
    setTitle('')
  },[chosenCard])

  const setRoundTitledCard = () => {
    dispatch(chooseCard(chosenCard.id, title));
      const body = {
        id: chosenCard.id,
        img: chosenCard.img,
        title,
        gameId,
        turnNumber,
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
        .then(res=>{
          if (res.status===200) {
            dispatch(changeRoundStatus('waiting-for-other-submissions'))
            // adding the titled card to the submissionsArr
            dispatch(addSubmissionToSubmissionsArr({id: chosenCard.id, img:chosenCard.img}))
            setChosenCardModalFlag(false)
          } else {
            console.log('error in submission');
          }
        })
  }

  const setGuessCardUnderTitle = () => {
    const body = {
        playerEmail: info.email,
        cardId: chosenCard.id,
        cardImg: chosenCard.img,
        gameId,
        turnNumber,
      }
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
      if (res.status===200) {
        dispatch(changeRoundStatus('waiting-for-other-submissions'))
        // closing the Modal
        setChosenCardModalFlag(false)
      } else {
        console.log('error in submission');
      }
    })
  }

  const cardChosen = (event) => {
    event.preventDefault();
    if(title.length>0){
      if(roundData.status==='submitting-titled-card') setRoundTitledCard()
    } else if(roundData.status==='matching-card-to-title'){ 
      setGuessCardUnderTitle()
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
            {roundData.status==='submitting-titled-card'
              ? (<>
              <label htmlFor="title">What title? </label>
              <input type="text" id="title" name="title" placeholder="title" value={title}
                onChange={valueChange}
              />
              </>)
              : (
                <label>does this card match {titledCard.title}?</label>
              )}
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
  background-color: rgba(60,60,60,0.5);
  /* opacity: 0.5; */
`;

const ChosenCardModalContainer = styled.form`
  position: relative;
  width: 400px;
  height: 400px;
  margin: auto;
  border-radius: 10px;
  z-index: 101;
  display: flex;
  flex-direction:row;
  background-color: white;
  /* opacity: 1; */
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