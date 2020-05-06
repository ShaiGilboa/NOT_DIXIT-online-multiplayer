import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import * as firebase from 'firebase';
import styled from 'styled-components';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  addMessageToChat,
} from '../../Redux/actions';
import {format} from 'date-fns';

import sendImg from '../../assets/send.png';
import ChatMessage from './ChatMessage';

import {
  PLAYER_COLORS_FILTERS,
  PLAYER_COLORS,
} from '../../constants';

const Chat = () => {
  const dispatch = useDispatch()
  const messagesRef = useRef()
  const {conversation} = useSelector(state=>state.chat)
  const {email, displayName, photoURL, } = useSelector(state=>state.currentUser.info)
  const {gameId, turnNumber} = useSelector(state=>state.gameData)
  const [minFlag, setMinFlag] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const [message, setMessage] = useState('');

  useEffect(()=>{
    const conversationRef = firebase.database().ref(`currentChats/${gameId}/conversation`)
    conversationRef.on('child_added', messageSnapshot => {
      const message = {
        ...messageSnapshot.val(),
        timestamp: format(messageSnapshot.val().timestamp, 'hh:mm'),
      }
      dispatch(addMessageToChat(message))
    })
    return () => {
      const conversationRef = firebase.database().ref(`currentChats/${gameId}/conversation`)
      conversationRef.off()
    }
  },[])

  const sendMessage = () =>{
    const body = {
      gameId,
      userEmail: email,
      displayName,
      playerTurnNumber: turnNumber,
      body: message,
      photoURL,
    }
    console.log('sned')
  fetch('/send-message', {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body),
  })
    .then(setMessage(''))
    .catch(err=>console.log('err in sending message',err))
  }

  // if scrollHeight - scrollTop === clientHeight then we are at the bottom
  const scrollHandler = (event) => {
    if(event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight){
      setAutoScroll(true);
    }else {
      setAutoScroll(false);
    }
  }
  useEffect(()=>{
    if(autoScroll)messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    return () => {
    }
  },[conversation])

  console.log('autoScroll',autoScroll)
  return (
    <Wrapper minFlag={minFlag} color={PLAYER_COLORS[turnNumber]}>
      <Bar color={PLAYER_COLORS[turnNumber]}
        onClick={()=>{
          setMinFlag(!minFlag);
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight + messagesRef.current.scrollHeight;
          }}
      > {minFlag ? '[]' : '_'} </Bar>
      <MessagesContainer
      minFlag={minFlag}
      ref={messagesRef}
      onScroll={scrollHandler}
      >
        {conversation.map(chatMessage=><ChatMessage body={chatMessage.body} photoURL={chatMessage.photoURL} playerTurn={chatMessage.playerTurnNumber} timestamp={chatMessage.timestamp} />)}
      </MessagesContainer>
      <Footer minFlag={minFlag}
        onSubmit={(event)=>{
          event.preventDefault()
          sendMessage()
        }}
      >
        <label for='chat-message'/>
        <MessageInput type="text" id='chat-message' name='chat-message' rows='2'
          onChange={(event)=>setMessage(event.target.value)}
          value={message}
        />
        <SendBtn type='submit'>
          <SendIcon src={sendImg} filter={PLAYER_COLORS_FILTERS[turnNumber]}/>
        </SendBtn>
      </Footer>
    </Wrapper>
    );
}

export default Chat;

const Wrapper = styled.div`
  width: 200px;
  word-break: break-all;
  background-color: white;
  border: 2px ${props=>props.color} solid;
  border-radius: 5px;
  position: absolute;
  z-index: 101;
  bottom:0;
  right:10px;
`;

const Bar = styled.div`
  background-color: ${props=>props.color}80;
  text-align: right;
  padding-right:10px;
  &:hover{
    cursor: pointer;
  }
`;

const MessagesContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-x: auto;
  height: ${props=>props.minFlag ? '0px' : '300px'};
  transition: all linear 0.3s;
  justify-content: flex-end;
`;

const Footer = styled.form`
  display: flex;
  padding: 2px;
  background-color: rgba(0,0,0,0.4);
  display: ${props=>props.minFlag ? 'none' : 'block'};
`;

const SendBtn = styled.button`
  /* height: 10px;
  width: 20px; */
  padding: 4px;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  border: none;
  background-color:transparent;
  margin:0;
  padding: 0;
`;

const MessageInput = styled.textarea`
  resize: none;
  width: calc(100% - 30px);
  overflow-y: auto;
  border-radius: 6px;
`;

const SendIcon = styled.img`
  height: 13px;
  width: 20px;
  margin: auto;
  filter: ${props=>props.filter}
`