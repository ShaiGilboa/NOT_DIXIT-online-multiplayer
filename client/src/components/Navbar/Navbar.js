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
    if(roundData.status!=='waiting' && gameData.turnNumber!==null)setNavbarColor(PLAYER_COLORS[gameData.turnNumber])
  },[roundData.status])

  useEffect(()=>{
    if(!currentUser.info.email)history.push('/')
  },[currentUser])

  return (
    <Wrapper color={navbarColor}>
      <Title
        onClick={()=>setDropdownFlag(true)}
      >Dixit!</Title>
      <GameInfo>
        {(gameData.status!=='waiting' && gameData.status !== "waiting-to-start") && (roundData.isMyTurn 
          ? (<ActivePlayerIsMe>IT'S YOUR TURN - {roundData.status==="submitting-titled-card"
            ? <p>choose the titled card</p> 
            : (gameData.status==='end-of-round' 
              ? <p>scores</p> 
              : <p>waiting</p>
              )
              }
            </ActivePlayerIsMe>)
          : (<ActivePlayer>
            <PlayerColor color={PLAYER_COLORS[gameData.activePlayer]}/>'s turn - 
            {roundData.status==='waiting-for-title' && <p>waiting for titled card</p>}
            {roundData.status === 'matching-card-to-title' && <p>find the best card for the title</p>}
            {roundData.status === 'waiting-for-other-submissions' && <p>waiting for other players to choose their card</p>}
            {roundData.status === 'voting' && <p>Choose the card that best matches the title</p>}
            {roundData.status === 'waiting-for-other-votes' && (gameData.status==='end-of-round' ? <p>Scores!</p> : <p>Waiting for other votes</p>)}
            </ActivePlayer>))}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const Title = styled.div`
  color: lightgrey;
  width: fit-content;
  margin-left: 10px;
  font-size: 2rem;
`;

const GameId = styled.div`
  padding-top:5px;
`;

const GameInfo = styled.div`
  flex:1;
  padding-left: 20px;
`;

const UserInfoBox = styled.div`
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

const ActivePlayerIsMe = styled.div`
  font-size: 20px;
  width: fit-content;
  color: Azure;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
`

const ActivePlayer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PlayerColor = styled.div`
  width:20px;
  height:20px;
  border-radius: 50%;
  background-color: ${props=>props.color};
`