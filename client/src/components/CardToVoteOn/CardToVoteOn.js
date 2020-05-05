import React, {
  useEffect,
  useState,
} from 'react';
import styled, {keyframes} from 'styled-components';

import {
  CARD_IN_HAND_WIDTH,
  CARD_IN_HAND_HEIGHT,
} from '../../constants';

const CardToVoteOn = ({
  id,
  img,
  onClick,
}) => {
  return (
    <CardWrapper
      src={img}
      onClick={(event)=>onClick(id, img)}
    >
    </CardWrapper>
    );
}

export default CardToVoteOn;

const zoom = keyframes`
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(20px) scale(2.4);
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
  transition: 5s ease-in-out linear;
  &:hover {
    animation: ${zoom} 500ms ease-in forwards;
    cursor:pointer;
  }
`;

const CardImg = styled.div`
  /* position: relative;
  left: -50px; */
`;