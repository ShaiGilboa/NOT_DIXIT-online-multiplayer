import React, {
  useContext,
  useEffect,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';

import {
  useSelector,
} from 'react-redux';

import { AuthContext } from '../../components/AuthContext/AuthContext';


const Navbar = () => {

  const {
    signInWithGoogle,
    handleSignOut,
  } = useContext(AuthContext);

  const gameData = useSelector(state=>state.gameData)
  const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const history = useHistory();
  // let initials;

  const getInitial = () =>{
    const name = currentUser.info.displayName
    const nameArr = name.split(' ');
    const initials = nameArr.map(string=>string.charAt(0).toUpperCase()).join(' ')
    return initials
  }

  useEffect(()=>{
    if(!currentUser.info.email)history.push('/')
  },[currentUser])

  return (
    <Wrapper>
      <Title>Dixit!</Title>
      {roundData.titledCard.title ? <div>card Title: {roundData.titledCard.title}</div>: null}
      {gameData.gameId ? <div>your game id: {gameData.gameId}</div>: null}
      
      <UserInfoBox>
        {currentUser.info.email 
          ? (<>
            <button
              onClick={()=>handleSignOut()}
            >Sign Out</button>
            {currentUser.info.photoURL 
              ? <UserAvatar src={currentUser.info.photoURL} />
              : <Initials><p>{getInitial()}</p></Initials>}
          </>)
          : (<>
            <button
              onClick={()=>signInWithGoogle()}
            >Sign In</button>
            <div>user logo</div>
          </>)}
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
  border-radius: 50%;
  object-fit: cover;
`;