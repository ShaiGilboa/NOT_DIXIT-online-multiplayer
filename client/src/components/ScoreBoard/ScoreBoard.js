import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const ScoreBoard = ({players, votingMessage}) => {

  return (
    <Wrapper>
      <div>ScoreBoard</div>
      {players.map(player=>(
        <div key={player.email}>
          <p>{player.displayName}: {player.score} points</p>
        </div>
      ))}
      {votingMessage.length>0 && votingMessage.map((message, index) => (
        <div key={index}>
          <p>{message}</p>
        </div>
        ))}
    </Wrapper>
    );
}

export default ScoreBoard;

const Wrapper = styled.div`

`;