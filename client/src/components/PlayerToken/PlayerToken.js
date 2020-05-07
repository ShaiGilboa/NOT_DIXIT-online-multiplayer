import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const PlayerToken = ({ color }) => {

  return (
    // <Wrapper style={{backgroundColor: color}}>
    // </Wrapper>
    <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" width='30px' height='30px' style={{fill: color}}>
      <defs>
          <filter id="f9" x="0" y="0" width="100%" height="100%">
            <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
            <feColorMatrix result="matrixOut" in="offOut" type="matrix"
            values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
      <circle cx="50%" cy="50%" r="40%" filter="url(#f9)"
         stroke="lightgrey" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
     </svg>
    );
}

export default PlayerToken;

const Wrapper = styled.div`
  margin:0;
  padding:10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;