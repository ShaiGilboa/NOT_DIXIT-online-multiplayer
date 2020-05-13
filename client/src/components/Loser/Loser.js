import React from 'react';
import styled from 'styled-components';

const Loser = ({children}) => {

  return (
    <Wrapper>
      {children}
    </Wrapper>
    );
}

export default Loser;

const Wrapper = styled.div`

`;