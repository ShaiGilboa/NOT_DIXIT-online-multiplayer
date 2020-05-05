import React, {
  useEffect,
  useState,
} from 'react';
import * as firebase from 'firebase';

import styled from 'styled-components';
import BoardImg from '../../assets/Dixitboard.png';
// import BackgroundImg from '../../assets/background.jpg';

import {
  useSelector
} from 'react-redux'

import {
  CARD_IN_HAND_WIDTH,
  CARD_IN_HAND_HEIGHT,
  PLAYER_COLORS_FILTERS,
} from '../../constants';

import PlayerPiece from '../PlayerPiece';
import ScoreBoard from '../ScoreBoard';

const Board = () => {
  const gameData = useSelector(state=>state.gameData)
  const players = gameData.players
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
      console.log('lllll')
      setPlayersScores(extractRelevantChanges(players))
    }else {
      let change=false
      // console.log('players',players)
      if(players)players.forEach((player, index)=>{
        // console.log('player',player)
        // console.log('playersScores[index]',playersScores[index])
          if(player.score !== playersScores[index].score){
            change=true
            console.log('change')
          }
      })
      if(change){
        console.log('vc')
        setPlayersScores(extractRelevantChanges(players))
        }
    }
  },[players])
  return (
    <Wrapper data-css='board'>
      <Boards
      data-css='grid'
        onMouseDown={(event)=>{
          console.log('event.clientX',event.clientX)
          console.log('event.clientY',event.clientY)
        }}
      >
      {/* {gameData.status!=='waiting' && <ScoreBoard players={gameData.players} votingMessage={votingMessage}/>} */}
      {gameData.stauts !== 'waiting' && gameData !== 'creating-game' && gameData !== 'waiting-to-start' && playersScores.map((player, index)=><PlayerPiece key={index} filter={PLAYER_COLORS_FILTERS[index]} score={player.score} playerTurn={index}/>) }
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
  /* background-repeat: repeat; */
  /* background-position: center; */
  background-size: cover;
`;

const Boards = styled.div`
  background-image: url(${BoardImg});
  background-position: center;
  background-size: cover;
  /* top: 60px; */
  width: calc(100vh - 140px);
  height: calc(100vh - 140px);
  position:relative;;
  padding: 0 auto;
  /* display:grid; */
`;


  ////////* background-image: url(${BackgroundImg}); */