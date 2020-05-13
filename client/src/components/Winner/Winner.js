import React from 'react';
import styled from 'styled-components';

const Winner = ({children}) => {

  return (
    <Wrapper>
      {children}
    </Wrapper>
    );
}

export default Winner;

const Wrapper = styled.div`

`;