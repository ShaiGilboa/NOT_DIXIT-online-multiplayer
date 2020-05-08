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

const ReceivedMessage = ({message, photoURL, color, timestamp, displayName}) => {
    const [imgError, setImgError] = useState(false);

    const getInitial = () =>{
    const name = displayName
    const nameArr = name.split(' ');
    const initials = nameArr.map(string=>string.charAt(0).toUpperCase()).join(' ')
    return initials
  }

    return (
        <ReceivedWrapper>
          <div style={{display: 'flex', flexDirection:'column', justifyContent:'space-around', padding:'3px 2px'}}>
            {imgError
              ? <PlayerTurn color={color}>{getInitial()}</PlayerTurn>
              : <UserPhoto src={photoURL} alt='user-photo' onError={()=>setImgError(true)}/>}
            <Timestamp>{timestamp}</Timestamp>
          </div>
            <Content color={color}>
                <p className='message message-sent'>{message}</p>
            </Content>
        </ReceivedWrapper>
    )
}

const ChatMessage = ({body, playerTurn, photoURL ,timestamp,displayName}) => {

  const userInfo = useSelector(state => state.currentUser.info)
  const gameData = useSelector(state => state.gameData)
  return (<>
    {playerTurn === gameData.turnNumber
      ? <SentMessage message={body} photoURL={photoURL} color={PLAYER_COLORS[playerTurn]} timestamp={timestamp}/>
      : <ReceivedMessage message={body} photoURL={photoURL} color={PLAYER_COLORS[playerTurn]} timestamp={timestamp} displayName={displayName}/>
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

const PlayerTurn = styled.div`
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  text-align: center;
  padding-top: 5px;
  background-color: ${props=>props.color}60;
`;