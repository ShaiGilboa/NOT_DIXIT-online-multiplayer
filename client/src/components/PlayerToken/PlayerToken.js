import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const PlayerToken = ({ color }) => {

  return (
    <Wrapper style={{backgroundColor: color}}>
    </Wrapper>
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