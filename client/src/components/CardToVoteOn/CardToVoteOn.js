import React from 'react';
import styled from 'styled-components';

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