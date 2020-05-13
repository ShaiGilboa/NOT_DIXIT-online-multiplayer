import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import styled from 'styled-components';

import {
  chooseCard,
  changeRoundStatus,
  addSubmissionToSubmissionsArr,
  setMySubmission,
} from '../../Redux/actions';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import UnstyledButton from '../../components/UnstyledButton';

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
  const titleInputRef = useRef();
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
            dispatch(setMySubmission(chosenCard.id))
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
        dispatch(setMySubmission(chosenCard.id))
        // closing the Modal
        setChosenCardModalFlag(false)
      } else {
        console.log('error in submission');
      }
    })
  }

  const vote=() => {
    dispatch(changeRoundStatus('submitting'))
      // fetch, put, send vote
      const body = {
        cardId: chosenCard.id,
        playerVoting: turnNumber,
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
        setChosenCardModalFlag(false)
      dispatch(changeRoundStatus('waiting-for-other-votes'))
    }

  useEffect(()=>{
    if(roundData.status==='submitting-titled-card')titleInputRef.current.focus()
  },[roundData.status])

  const cardChosen = (event) => {
    event.preventDefault();
    if(title.length>0){
      if(roundData.status==='submitting-titled-card') setRoundTitledCard()
    } else if(roundData.status==='matching-card-to-title'){ 
      setGuessCardUnderTitle()
    } else if(roundData.status === 'voting'){
      vote()
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
        <Info>
            {roundData.status==='submitting-titled-card'
              ? (<>
              <Label htmlFor="title">What title? </Label>
              <input type="text" id="title" name="title" placeholder="title" value={title}
                onChange={valueChange}
                ref={titleInputRef}
              />
              </>)
              : (
                <Label>does this card match "{titledCard.title}"?</Label>
              )}
            {isMyTurn && roundData.status !== "submitting-titled-card"
            ? <p>your turn, you cannot vote</p>
            : ((chosenCard && roundData.mySubmission && (chosenCard.id === roundData.mySubmission))
              ? <p>this is your card</p>
              : <GameBtns type="submit">submit</GameBtns>)}
        </Info>
        <CardImg src={chosenCard.img} />
      </ChosenCardModalContainer>
    </Wrapper>
    );
}

export default ChosenCardModal;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  position: relative;
  width: 100%;
  z-index: 3;
  background-color: rgba(60,60,60,0.5);
`;

const ChosenCardModalContainer = styled.form`
  position: relative;
  width: fit-content;
  height: fit-content;
  margin: auto;
  border-radius: 10px;
  z-index: 2;
  display: flex;
  flex-direction:column;
  background-color: white;
  object-fit:cover;
`;

const CardImg = styled.img`
  max-height: calc(100vh - 80px);
  object-fit: contain;
  height:fit-content;
  border-radius:10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: fit-content;
  object-fit: cover;
  text-align:center;
  align-items: center;
`;

const GameBtns = styled(UnstyledButton)`
  background:#add5e1;
  border-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  padding: 5px;
  font-size: 20px;
`;

const Label = styled.label`
  max-width: 100%;
  padding: 0 3px;
`;