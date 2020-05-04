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
      onClick={(event)=>onClick(id)}
    >
    </CardWrapper>
    );
}

export default CardToVoteOn;

const zoom = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.5);
    z-index: 10;
  }
`;

const CardWrapper = styled.img`
  border-radius: 10px;
  border: 1px solid grey;
  background-color: gold;
  width: ${CARD_IN_HAND_WIDTH};
  height: ${CARD_IN_HAND_HEIGHT};
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