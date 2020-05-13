import React from 'react';
import styled, { keyframes } from 'styled-components';

import {
  CARD_IN_HAND_WIDTH,
  CARD_IN_HAND_HEIGHT,
} from '../../constants';

const CardInHand = ({
  img,
  index,
  setChosenCardModalFlag,
  setChosenCard,
  id,
  onClick,
  }) => {

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
  }
  to {
    transform: translateY(-170px) scale(2);
    z-index: 10;
  }
`;

const CardWrapper = styled.img`
  border-radius: 10px;
  border: 1px solid grey;
  background-color: gold;
  width: ${CARD_IN_HAND_WIDTH}px;
  height: ${CARD_IN_HAND_HEIGHT}px;
  object-fit: cover;
  position: relative;
  ${props=> `left: calc(${props.index}* -40px);`}
  transition: 5s ease-in-out linear;
  &:hover {
    animation: ${zoom1} 500ms ease-in forwards;
    cursor:pointer;
  }
`;