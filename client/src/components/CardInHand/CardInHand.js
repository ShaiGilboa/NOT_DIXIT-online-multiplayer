import React, {
  useEffect,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';

import {
  CARD_IN_HAND_WIDTH,
  CARD_IN_HAND_HEIGHT,
} from '../../constants';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

const CardInHand = ({
  img,
  index,
  setChosenCardModalFlag,
  setChosenCard,
  id,
  onClick,
  }) => {

  const dispatch = useDispatch();

  return (
    <CardWrapper
      src={img}
      index={index}
      style={{zIndex:index}}
      onClick={(event)=>onClick(id, img)}
    >
    </CardWrapper>
    );
}

export default CardInHand;

const zoom1 = keyframes`
  from {
    transform: translateY(0) scale(1);
    /* opacity: 1; */
  }
  to {
    transform: translateY(-100px) scale(1.5);
    z-index: 10;
  }
`;

const zoom2 = keyframes`
  /* from {
    transform: scale(1);
  }
  to {  
    transform: scale(2);
  } */
`;

const CardWrapper = styled.img`
  border-radius: 10px;
  border: 1px solid grey;
  background-color: gold;
  width: ${CARD_IN_HAND_WIDTH};
  height: ${CARD_IN_HAND_HEIGHT};
  object-fit: cover;
  position: relative;
  ${props=> `left: calc(${props.index}* -40px);`}
  transition: 5s ease-in-out linear;
  &:hover {
    animation: ${zoom1} 500ms ease-in forwards;
    /* animation: ${zoom2} 500ms ease-in forwards; */
    /* z-index:10; */
    cursor:pointer;
  }
`;

const CardImg = styled.img`
  /* position: relative;
  left: -50px; */
`;