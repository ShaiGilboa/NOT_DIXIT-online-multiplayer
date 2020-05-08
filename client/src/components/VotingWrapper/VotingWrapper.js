import React, {
  useEffect,
  useState,
} from 'react';
import styled, {keyframes} from 'styled-components';

import CardToVoteOn from '../CardToVoteOn';
import UnstyledButton from '../UnstyledButton';
import PlayerToken from '../PlayerToken';
import {PLAYER_COLORS, CARD_IN_HAND_HEIGHT, CARD_IN_HAND_WIDTH} from '../../constants';

const VotingWrapper = ({submissionsArr, gameStatus, roundStatus, nextPrepRound, clickOnCardToVote}) => {
  console.log('submissionsArr',submissionsArr)
  return (
    <Wrapper>
          {submissionsArr.map(card=>(
          <Section key={card.id}>
            <CardToVoteOn
            key={card.id}
            id={card.id}
            img={card.imgSrc}
            onClick={clickOnCardToVote}
            showBorderFlag={gameStatus==='end-of-round'}
            color={PLAYER_COLORS[card.submittedBy]}
            />
            <TokensWrapper data-css="tokensWrapper">
              {gameStatus==='end-of-round' && card.votesByPlayerTurn.map(voter => <PlayerToken key={voter} data-css='token' color={PLAYER_COLORS[voter]} />)}
            </TokensWrapper>
          {(gameStatus==='end-of-round' && roundStatus!=='starting-new-round') && <ContinueBtn
              onClick={()=>nextPrepRound()}
            >continue?</ContinueBtn>}
          </Section>
          )
          )}
        </Wrapper>
    );
}

export default VotingWrapper;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  top:2vh;
  margin: auto;
  width: 80%;
  justify-content: space-around;
  height: ${2.5* CARD_IN_HAND_HEIGHT}px;
`;

const zoom = keyframes`
  from {
    transform: translateY(0) scale(1);
  }
  to {
    transform: translateY(70%) scale(2.5);
    z-index: 10;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction:column;
  position:relative;
  &:hover{
    animation: ${zoom} 500ms ease-in forwards;
  }
`;

const TokensWrapper = styled.div`
  height: 120px;
  width: ${CARD_IN_HAND_WIDTH};
  display: flex;
  flex-direction: row;
  justify-content:center;
  position:absolute;
`;

const GameBtns = styled(UnstyledButton)`
  background:#add5e1;
  border-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  padding: 5px;
  font-size: 10px;
`;

const ContinueBtn = styled(GameBtns)`
  position: relative;
  bottom: 23px;
`;