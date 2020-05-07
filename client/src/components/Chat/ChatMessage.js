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
    <div style={{
      display:'flex', flexDirection: 'row-reverse',
      paddingTop: '3px'
      }}>
        <SentWrapper>
            <Content color={color}>
                <p className='message message-received'>{message}</p>
            </Content>
            <Timestamp>{timestamp}</Timestamp>
        </SentWrapper>
    </div>
    )
}

const ReceivedMessage = ({message, photoURL, color, timestamp}) => {
    return (
        <ReceivedWrapper>
          <div style={{display: 'flex', flexDirection:'column', justifyContent:'space-around', padding:'3px 2px'}}>
            <UserPhoto src={photoURL} alt='user-photo'/>
            <Timestamp>{timestamp}</Timestamp>
          </div>
            <Content color={color}>
                <p className='message message-sent'>{message}</p>
            </Content>
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
  text-align: left;
  align-items: center;
  margin-top:3px;
`;

const SentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;
  /* align-items: baseline; */
  /* margin-top:3px; */
  /* margin: 3px 0 0 auto; */
`;

const Timestamp = styled.span`
  color: grey;
  margin: 0;
  padding: 0;
  font-size:8px;
`;

const UserPhoto = styled.img`
  border-radius: 50%;
  width: 20px;
  height: 20px;
`;

const Content = styled.div`
  background-color: ${props=>props.color}80;
  border-radius: 5px;
  padding:2px;
  height: fit-content;
`;