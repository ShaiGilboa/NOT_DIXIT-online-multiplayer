import React from 'react';
import styled, { keyframes } from 'styled-components';
import Loading from '../../assets/Dixit.png';

const LoadingSpinner = () => {
    return (
      <RotatingDiv>
        <Logo src={Loading} alt='loading-spinner' />
      </RotatingDiv>
      )
}

export default LoadingSpinner;

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-359deg);
  }
`;

const Logo = styled.img`
  width: 100px;
  height: 70px;
  border-radius: 30px;
`;

const RotatingDiv = styled.div`
  width:fit-content;
  height:fit-content;
  margin: auto;
  transform: origin(0%);
  animation: ${rotation} 1500ms infinite linear;
`;
