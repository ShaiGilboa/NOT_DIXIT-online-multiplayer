import React from 'react';
import styled from 'styled-components';

import{
  PLAYER_COLORS
} from '../../constants';


const ScoreBoard = ({players, votingMessage}) => {

  const playersScores = players.map((player, index)=>{return {score: player.score, displayName: player.displayName, playerTurnNumber: index, email: player.email}})
  playersScores.sort((a,b) => a.score - b.score);
  return (
    <Wrapper>
      <PlayersWrapper>
      {playersScores.map(player=>(
        <li key={player.email}>
          <PlayerScore color={PLAYER_COLORS[player.playerTurnNumber]}>{player.displayName}: {player.score} points</PlayerScore>
        </li>
      ))}
      </PlayersWrapper>
      <VotingMessageWrapper>
      {votingMessage.length>0 && votingMessage.map((message, index) => (
          <Instructions key={index}>{message}</Instructions>
        ))}
      </VotingMessageWrapper>
    </Wrapper>
    );
}

export default ScoreBoard;

const Wrapper = styled.div`
  position:absolute;
  top:26%;
  left:28%;
  width:45.5%;
  height:46%;
  box-shadow:  0 0 5px 4px #282a2d , inset 0 0 5px 4px #282a2d;
  display: flex;
  flex-direction: column;
`;

const PlayersWrapper = styled.ul`
  flex: 1;
  margin: 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
`;

const PlayerScore = styled.div`
  padding-top: 2px;
  line-height: 1.3;
  font-size:20px;
  font-family: 'Caveat', cursive;
  color: ${props=>props.color};
`;

const Instructions = styled.li`
  /* padding-top: 10px; */
  font-size: 13px;
  font-family: 'Muli', sans-serif;
  line-height: 1.3;
`;

const VotingMessageWrapper = styled.ul`
  flex: 1;
  overflow-y: auto;
  margin: 10px;
  background-color: rgba(220, 200, 200, 0.7);
  border-radius: 10px;
  list-style:none;
  padding: 4px;
`;