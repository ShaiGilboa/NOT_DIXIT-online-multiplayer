import React, {
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import {
  useSelector,
} from 'react-redux';
import {
  PLAYER_COLORS
} from '../../constants';

const SentMessage = ({message, photoURL, color, timestamp}) => {
    return (
        <SentWrapper>
            <div className={`content`}>
                <p className='message message-received'>{message}</p>
                {/* <TipSent className='tip-sent'/> */}
                {/* <img src={TipSent} alt='tip-sent' className='tip-sent' /> */}
                <Timestamp>{timestamp}</Timestamp>
            </div>
        </SentWrapper>
    )
}

const ReceivedMessage = ({message, photoURL, color, timestamp}) => {
    return (
        <ReceivedWrapper>
            <UserPhoto src={photoURL} alt='user-photo'/>
            <div>
                <p className='message message-sent'>{message}</p>
                {/* <TipReceived className='tip-received '/> */}
                <Timestamp>{timestamp}</Timestamp>
            </div>
        </ReceivedWrapper>
    )
}

const ChatMessage = ({body, playerTurn, photoURL ,timestamp}) => {

  const userInfo = useSelector(state => state.currentUser.info)
  const gameData = useSelector(state => state.gameData)
  return (<>
    {playerTurn === gameData.turnNumber
      ? <SentMessage message={body} photoURL={photoURL} color={PLAYER_COLORS[playerTurn]} timestamp={timestamp}/>
      : <ReceivedMessage message={body} photoURL={photoURL} color={PLAYER_COLORS[playerTurn]} timestamp={timestamp}/>
    }
    </>);
}

export default ChatMessage;

const Wrapper = styled.div`

`;

const ReceivedWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const SentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Timestamp = styled.span`
  color: grey;
  margin: 0;
  padding: 0;
`;

const UserPhoto = styled.img`
  border-radius: 50%;
  width: 20px;
  height: 20px;
`;