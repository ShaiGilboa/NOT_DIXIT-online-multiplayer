import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const Winner = ({children}) => {

  return (
    <Wrapper>
      {/* <div>Winner</div> */}
      {children}
    </Wrapper>
    );
}

export default Winner;

const Wrapper = styled.div`

`;