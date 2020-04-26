import React from 'react';
import styled from 'styled-components';

import {
  useSelector,
} from 'react-redux';

const Navbar = () => {

  const titledCard = useSelector(state=>state.gameData.titledCard)

  return (
    <Wrapper>
      <Title>Dixit!</Title>
      {titledCard.title ? <div>your Title: {titledCard.title}</div>: null}
      <UserInfoBox>
        <button>Sign In / Out</button>
        <div>user logo</div>
      </UserInfoBox>
    </Wrapper>
    );
}

export default Navbar;

const Wrapper = styled.div`
  height: 80px;
  background-color: grey;
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const Title = styled.h1`
  /* flex:3; */
  color: lightgrey;
  width: fit-content;
  margin-left: 10px;
  width: 50%;
  font-size: 2rem;
`

const UserInfoBox = styled.div`
  /* flex:1; */
  width: 40%;
  display: flex;
  justify-content: space-around;
`;