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
  color,
  showBorderFlag,
}) => {
  return (
    <CardWrapper
      src={img}
      onClick={(event)=>{if( typeof onClick )(onClick(id, img))}}
      showBorderFlag={showBorderFlag}
      color={color}
    >
    </CardWrapper>
    );
}

export default CardToVoteOn;

// const zoom = keyframes`
//   from {
//     transform: translateY(0) scale(1);
//   }
//   to {
//     transform: translateY(60px) scale(2.7);
//     z-index: 10;
//   }
// `;

const CardWrapper = styled.img`
  border-radius: 10px;
  border: 1px solid grey;
  background-color: gold;
  width: ${CARD_IN_HAND_WIDTH}px;
  height: ${CARD_IN_HAND_HEIGHT}px;
  object-fit: cover;
  position: relative;
  transition: 5s ease-in-out linear;
  border: 4px solid ${props=>props.showBorderFlag ? props.color : 'transparent'};
  &:hover {
    cursor:pointer;
  }
`;
    // /* animation: ${zoom} 500ms ease-in forwards; */

const CardImg = styled.div`
  /* position: relative;
  left: -50px; */
`;