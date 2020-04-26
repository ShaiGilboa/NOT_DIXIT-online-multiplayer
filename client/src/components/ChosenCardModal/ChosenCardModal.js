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

const ChosenCardModal = ({
  chosenCard,
  setChosenCardModalFlag,
  }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('')

  const valueChange = (event) => {
    setTitle(event.target.value)
  }

  useEffect(()=>{
    setTitle('')
  },[chosenCard])

  const cardChosen = (event) => {
    event.preventDefault();
    // dispatch chosen card
    // close modal
    if(title.length>0){
      dispatch(chooseCard(chosenCard.id, title));
      console.log('title',title)
      console.log('chosenCard.id',chosenCard.id)
      const body = {
        id: chosenCard.id,
        title,
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
          setChosenCardModalFlag(false)
          console.log('res',res)
        }
        )
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
  width: 400px;
  height: 400px;
  margin: auto;
  border-radius: 10px;
  z-index: 101;
  display: flex;
  flex-direction:row;
  background-color: white;
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