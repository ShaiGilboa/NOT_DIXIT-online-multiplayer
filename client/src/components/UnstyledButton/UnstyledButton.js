import React from 'react';
import styled from 'styled-components';

const UnstyledButton = styled.button`
  border: 0;
  margin: 0;
  padding: 0;
  font-family: 'Quicksand', sans-serif;
  background-color: transparent;
  &:hover{
    cursor:pointer;
  }
`;
export default UnstyledButton