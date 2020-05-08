import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const Loser = ({children}) => {

  return (
    <Wrapper>
      {/* <div>Loser</div> */}
      {children}
    </Wrapper>
    );
}

export default Loser;

const Wrapper = styled.div`

`;