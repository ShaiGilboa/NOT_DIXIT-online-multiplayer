import React, {
  useEffect,
  useState,
} from 'react';
import * as firebase from 'firebase';
import {
  useSelector,
} from 'react-redux';
import styled from 'styled-components';

// TODO: 'start game' firebase listener if you are 'joining-game' (userStatus)
// TODO: 'start game' function if you are 'creating-game'

const WaitingForOtherUsers = () => {
  const [playersLoggedOn, setPlayersLoggedOn] = useState([])
  const {gameId} = useSelector(state=>state.gameData)
  const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const {userInfo} = currentUser
  useEffect(()=>{
    const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
    playersLoggedOnRef.on('child_added', playersSnapshot => {
      if(!playersLoggedOn.some(player=>player.email===playersSnapshot.val().email))setPlayersLoggedOn(playersLoggedOn.concat(playersSnapshot.val()))
    })

    return () => {
      const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
      playersLoggedOnRef.off()
    }
  },[playersLoggedOn])
  return (
    <Wrapper>
      <div>Friends that want to play with you:</div>
      <ul>
      {playersLoggedOn.map(player=>userInfo.displayName !== player.displayName && <li key={player.email}>{player.displayName}</li>)}
      </ul>
      {currentUser.status==='creating-game' && <button>Do You Want To start?</button>}
    </Wrapper>
    );
}

export default WaitingForOtherUsers;

const Wrapper = styled.div`

`;