import React, {
  useEffect,
  useState,
} from 'react';
import {
  useSelector,
} from 'react-redux'

import styled, {keyframes} from 'styled-components';
import Bunny from '../../assets/bunny.png'
import { 
  PLAYER_COLORS_FILTERS
} from '../../constants';

const UserProfile = ({toggle}) => {
  const userProfile = useSelector(state=>state.currentUser.info)
  const {turnNumber} = useSelector(state=>state.gameData)
  const [filter, setFilter] = useState('invert(95%) sepia(10%) saturate(1134%) hue-rotate(212deg) brightness(86%) contrast(93%)')
  /*
    image
    email
    displayName
    w/l ratio
    amount of points gained
    amount of points given
    cards guessed right {
      id, title
    }
    cards titled successfully {
      id, title
    }
  */
  useEffect(()=>{
    setFilter(turnNumber ? PLAYER_COLORS_FILTERS[turnNumber] : 'invert(95%) sepia(10%) saturate(1134%) hue-rotate(212deg) brightness(86%) contrast(93%)')
  },[turnNumber])
  console.log('filter',filter)
  return (
    <Wrapper
      onClick={()=>toggle(false)}
    >
      <Container fill={filter}>
        <BunnyBackground src={Bunny} style={{filter}}/>
        <Info>
          <Name>{userProfile.displayName}</Name>
          <Name>{userProfile.email}</Name>
        </Info>
      </Container>
    </Wrapper>
    );
}

export default UserProfile;

const drawerLeft = keyframes`
  from {
    transform: translateX(300px);
  }
  to {
    transform: translateX(0);
  }
`;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  top: 60px;
  position: absolute;
  width: 100%;
  z-index: 100;
  background-color: rgba(60,60,60,0.5);
  display: flex;
  flex-direction: row-reverse;
`;

const Container = styled.div`
  animation: ${drawerLeft} .5s ease-in;
  width: 300px;
  position: relative;
  height: 300px;
  background-color: white;
  padding: 0 10px 0 10px ;
  border-bottom-left-radius: 46%;
  border-top-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: inset 0 0 5px 3px #282a2d;
`;

const Info = styled.div`
  position: relative;
  top: -128px;
  left: 86px;
`

const BunnyBackground = styled.img`
  width: 100%;
  height: fit-content;
  object-fit: contain;
  transform: scaleX(-1);
  position: relative;
  bottom: -6px;
  `;

const Name = styled.div`
  margin:0;
  padding: 0;
  font-family: 'Muli', sans-serif;
`;