import React, {
  useEffect,
  useState,
} from 'react';
import * as firebase from 'firebase';

import styled from 'styled-components';
import BoardImg from '../../assets/Dixitboard.png';
import Grass from '../../assets/grass.png'
// import BackgroundImg from '../../assets/background.jpg';

import {
  useSelector,
  useDispatch,
} from 'react-redux'

import {
  CARD_IN_HAND_WIDTH,
  CARD_IN_HAND_HEIGHT,
  PLAYER_COLORS_FILTERS,
  PLAYER_COLORS,
} from '../../constants';

import { setScore } from '../../Redux/actions'

import PlayerPiece from '../PlayerPiece';
import ScoreBoard from '../ScoreBoard';

const Board = () => {
  const dispatch = useDispatch()
  const gameData = useSelector(state=>state.gameData)
  const players = gameData.players
  const turnNumber = gameData.turnNumber
  const [playersScores, setPlayersScores] = useState([{}])
  const [votingMessage, setVotingMessage] = useState([])
  
  const extractRelevantChanges = (players) => {
    const newRelevantInfo = []
    players.forEach(player => newRelevantInfo.push({score: player.score}))
    return newRelevantInfo
  }
  useEffect(()=>{
    const votingMessageRef = firebase.database().ref(`currentGames/${gameData.gameId}/round/votingMessage`)
    votingMessageRef.once('value', votingMessageSnapshot => {
      setVotingMessage(votingMessageSnapshot.val())
    })
    return () => {
      const votingMessageRef = firebase.database().ref(`currentGames/${gameData.gameId}/round/votingMessage`)
        votingMessageRef.off()
    }
  },[gameData.status])
  // makes sure that any change in the player pieces is just in case
  // of acore or amount change
  useEffect(()=>{
    if(players.length!==playersScores.length){
      setPlayersScores(extractRelevantChanges(players))
    }else {
      let change=false
      if(players)players.forEach((player, index)=>{
          if(player.score !== playersScores[index].score){
            change=true
          }
      })
      if(change){
        dispatch(setScore(players[turnNumber].score))
        setPlayersScores(extractRelevantChanges(players))
        }
    }
  },[players])

  return (
    <Wrapper data-css='board'>
      <Boards
        data-css='grid'
      >
        {gameData.stauts !== 'waiting' && gameData !== 'creating-game' && gameData !== 'waiting-to-start' && playersScores.map((player, index)=><PlayerPiece key={index} filter={PLAYER_COLORS_FILTERS[index]} score={player.score} playerTurn={index} fill={PLAYER_COLORS[index]}/>) }
        {gameData.status!=='waiting' && <ScoreBoard players={players} votingMessage={gameData.votingMessage} />}
      </Boards>

    </Wrapper> 
    );
}

export default Board;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  z-index:-1;
  height: 100%;
  background-image: url(${Grass});
  background-position: 0px 100%;
  background-color:#add5e1;
`;

const Boards = styled.div`
  background-image: url(${BoardImg});
  background-position: center;
  background-size: cover;
  width: calc(100vh - 140px);
  height: calc(100vh - 140px);
  position:relative;;
  padding: 0 auto;
  box-shadow:  0 0 5px 3px #282a2d , inset 0 0 5px 3px #282a2d;
  border-radius: 10px;
`;