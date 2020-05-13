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
  clearChat,
} from '../../Redux/actions';
import {
  PLAYER_COLORS,
} from '../../constants';
import Chat from '../../components/Chat';
import UnstyledButton from '../../components/UnstyledButton';

const WaitingForOtherUsers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [playersLoggedOn, setPlayersLoggedOn] = useState([])
  const gameData= useSelector(state=>state.gameData)
  const gameId = gameData.gameId 
  // const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const userInfo = currentUser.info;

  useEffect(()=>{
    dispatch(clearChat())
    // eslint-disable-next-line
  },[])

  useEffect(()=>{
    const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
    playersLoggedOnRef.on('child_added', playerSnapshot => {
      if(!playersLoggedOn.some(player=>player.email===playerSnapshot.val().email)){
        setPlayersLoggedOn(playersLoggedOn.concat(playerSnapshot.val()))
        }
    })

    return () => {
      const playersLoggedOnRef = firebase.database().ref(`/currentGames/${gameId}/players`)
      playersLoggedOnRef.off()
    }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
        <Title>Friends that want to play with you:</Title>
        <ul>
        {playersLoggedOn.map(player=>userInfo.displayName 
        !== player.displayName && <PlayerName key={player.email}>{player.displayName}</PlayerName>)}
        </ul>
        {currentUser.status==='creating-game' 
          ? <GameBtns
              onClick={()=>startGame()}
            >Do You Want To start?</GameBtns> 
          : <Note>waiting for host to start the game</Note>}
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
  z-index: 1;
  background-color: rgba(60,60,60,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  border: 2px solid ${props=>props.color};
  border-radius: 10px;
  background-color: rgb(200,200,200);
  position:relative;
  width:50vh;
  height:50vh;
  top: -5vh;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
`;

const GameId = styled.h2`
  position: absolute;
  left:15px;
  bottom:0;
  margin: 0;
  padding: 2px 10px;
  height: fit-content;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: solid 1px grey;
  color: Azure;
  /* width */
`;

const PlayerName = styled.li`
  padding-top: 10px;
  font-size: 20px;
  font-family: 'Muli', sans-serif;
  line-height: 1.3;
`;

const Title = styled.h1`
  text-align: center;
  /* height: 40px; */
  color: #f5e9ec;
  font-size: 20px;
  font-family: 'Limelight', cursive;
`;

const GameBtns = styled(UnstyledButton)`
  background:#add5e1;
  border-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  padding: 5px;
  font-size: 20px;
`;

const Note = styled.div`
  padding-top: 10px;
  line-height: 1.3;
  font-size:20px;
  font-family: 'Caveat', cursive;
`;