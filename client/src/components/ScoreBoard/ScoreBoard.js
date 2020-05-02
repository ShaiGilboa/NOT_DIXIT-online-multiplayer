import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

const ScoreBoard = ({players}) => {

  return (
    <Wrapper>
      <div>ScoreBoard</div>
      {players.map(player=>(
        <div key={player.email}>
          <p>{player.displayName}: {player.score} points</p>
        </div>
      ))}
    </Wrapper>
    );
}

export default ScoreBoard;

const Wrapper = styled.div`

`;