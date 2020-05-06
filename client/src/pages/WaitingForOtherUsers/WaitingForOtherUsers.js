import React, {
  useEffect,
  useState,
} from 'react';
import * as firebase from 'firebase';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';
import {
  setGameStatus,
} from '../../Redux/actions';
import {
  PLAYER_COLORS,
} from '../../constants';
import Chat from '../../components/Chat';
// TODO: 'start game' firebase listener if you are 'joining-game' (userStatus)
// TODO: 'start game' function if you are 'creating-game'

const WaitingForOtherUsers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [playersLoggedOn, setPlayersLoggedOn] = useState([])
  const gameData= useSelector(state=>state.gameData)
  const gameId = gameData.gameId 
  const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const userInfo = currentUser.info
  useEffect(()=>{
    const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
    playersLoggedOnRef.on('child_added', playerSnapshot => {
      // console.log('playerSnapshot.val()',playerSnapshot.val())
      if(!playersLoggedOn.some(player=>player.email===playerSnapshot.val().email)){
        // console.log('playersLoggedOn',playersLoggedOn.concat(playerSnapshot.val()))
        setPlayersLoggedOn(playersLoggedOn.concat(playerSnapshot.val()))
        }
    })

    return () => {
      const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
      playersLoggedOnRef.off()
    }
  },[playersLoggedOn])
  
  const moveToGame = () => {
    history.push('/game')
    dispatch(setGameStatus('playing'))
  }

  //checking to see if the game has started
  useEffect(()=>{
    const gameStatusRef = firebase.database().ref(`currentGames/${gameId}/status`)
    gameStatusRef.on('value', gameStatusSnapshot => {
      if(gameStatusSnapshot.val()==='playing')moveToGame()
    })
    return () => {
      const gameStatusRef = firebase.database().ref(`currentGames/${gameId}/status`)
      gameStatusRef.off()
    }
  },[gameData.status])

  const startGame = () => {
    fetch('/start-game', {
      method: 'PATCH',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      body: JSON.stringify({gameId}),
    })
    .then(moveToGame())
    .catch(err=>console.log('err in starting game',err))
  }

  return (
    <Wrapper>
      <Info color={PLAYER_COLORS[gameData.turnNumber]}>
        <div>Friends that want to play with you:</div>
        <ul>
        {playersLoggedOn.map(player=>userInfo.displayName 
        !== player.displayName && <li key={player.email}>{player.displayName}</li>)}
        </ul>
        {currentUser.status==='creating-game' 
          ? <button
              onClick={()=>startGame()}
            >Do You Want To start?</button> 
          : <p>waiting for host to start the game</p>}
        <GameId>game Id: {gameId}</GameId>
        </Info>
        <Chat />
    </Wrapper>
    );
}

export default WaitingForOtherUsers;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  position: relative;
  width: 100%;
  z-index: 100;
  background-color: rgba(60,60,60,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  border: 2px solid ${props=>props.color};
  border-radius: 10px;
  background-color: white;
  padding: 10px;

  height: 40vh;
  width: 30vh;
`;

const GameId = styled.h2`
  position: absolute;
  left:15px;
  bottom:25px;
  margin: 0;
  padding: 2px 10px;
  height: fit-content;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: solid 1px grey;
  color: Azure;
  /* width */
`;