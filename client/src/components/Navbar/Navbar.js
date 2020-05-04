import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useHistory,
  Link,
} from 'react-router-dom';
import styled from 'styled-components';

import {
  useSelector,
} from 'react-redux';

import { AuthContext } from '../../components/AuthContext/AuthContext';

import {
  PLAYER_COLORS,
  CARD_IN_HAND_WIDTH,
} from '../../constants';

const Navbar = () => {

  const {
    signInWithGoogle,
    handleSignOut,
  } = useContext(AuthContext);

  const gameData = useSelector(state=>state.gameData)
  const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const history = useHistory();

  const [navbarColor, setNavbarColor] = useState('grey');
  const [dropdownFlag, setDropdownFlag] = useState(false);

  const getInitial = () =>{
    const name = currentUser.info.displayName
    const nameArr = name.split(' ');
    const initials = nameArr.map(string=>string.charAt(0).toUpperCase()).join(' ')
    return initials
  }
  useEffect(()=>{
    console.log('roundData.status',roundData.status)
    console.log('gameData.turnNumber',gameData.turnNumber)
    if(roundData.status!=='waiting' && gameData.turnNumber!==null)setNavbarColor(PLAYER_COLORS[gameData.turnNumber])
  },[roundData.status])

  useEffect(()=>{
    if(!currentUser.info.email)history.push('/')
  },[currentUser])
  console.log('navbarColor',navbarColor)
  return (
    <Wrapper color={navbarColor}>
      <Title
        onClick={()=>setDropdownFlag(true)}
      >Dixit!</Title>
      <GameInfo>
      {gameData.gameId ? <GameId>game id: {gameData.gameId}</GameId>: null}
      {roundData.titledCard.title ? <div>card Title: {roundData.titledCard.title}</div>: null}
      </GameInfo>
      <UserInfoBox>
        {currentUser.info.email 
          ? (<>
            <button
              onClick={()=>handleSignOut()}
            >Sign Out</button>
            {currentUser.info.photoURL 
              ? <Link to='/user-profile'><UserAvatar src={currentUser.info.photoURL} /></Link>
              : <Initials><p>{getInitial()}</p></Initials>}
          </>)
          : (<>
            <SignOutBtn
              onClick={()=>signInWithGoogle()}
            >Sign In</SignOutBtn>
          </>)}
      </UserInfoBox>
    </Wrapper>
    );
}

export default Navbar;

const Wrapper = styled.div`
  height: 60px;
  background-color: ${props=>props.color};
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const Title = styled.div`
  /* flex:3; */
  color: lightgrey;
  width: fit-content;
  margin-left: 10px;
  /* width: 50%; */
  font-size: 2rem;
`;

const GameId = styled.div`
  padding-top:5px;
`;

const GameInfo = styled.div`
  flex:1;
`;

const UserInfoBox = styled.div`
  /* flex:1; */
  width: fit-content;
  display: flex;
  justify-content: space-around;
  position: relative;
  right:0;
`;

const SignOutBtn = styled.button`
  margin:0;
  padding: 0;
  margin-right: 80px;
  border:0;
`;

const Initials = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color:pink;
  color: white;
  text-align: center;
  /* align-items:center; */
  font-size: large;
  font-weight: bold;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  padding: 10px;
  border-radius: 50%;
  object-fit: cover;
`;