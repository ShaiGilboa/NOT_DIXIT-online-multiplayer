import React, {
  useState,
} from 'react';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  useHistory,
} from 'react-router-dom';
import {
  changeCurrentUserStatus,
  setNewHand,
  newGameId,
  setPlayerTurn,
  clearChat,
} from '../../Redux/actions'
import {
  validateGameIdType,
} from '../../utils';


import styled from 'styled-components';
import UnstyledButton from '../UnstyledButton';

const JoinNewGameWarning = ({toggle}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [newGameIdInput, setNewGameIdInput] = useState('')

  const currentUser = useSelector(state=>state.currentUser);
  const turnNumber = useSelector(state=>state.gameData.turnNumber)
  const pastGameId = useSelector(state=>state.gameData.gameId)
  const waitingToStart = (gameId, hand) =>{
      const body = {
        gameId: pastGameId,
        userEmail: currentUser.info.email,
        displayName: currentUser.info.displayName,
        playerTurnNumber: turnNumber,
        body: `join a new game with the Id: \n${gameId}`,
        photoURL: currentUser.info.photoURL,
      }
      fetch('/send-message', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(body),
      })
        .then()
        .catch(err=>console.log('err in sending message',err))
    dispatch(newGameId(gameId));// and game status = 'waiting-to-start'
    dispatch(setNewHand(hand));// and round status = 'playing'
    history.push('/waiting') // waiting room
  }
const joinNewGameForReal = (event) => {
    event.preventDefault();
    const parsedGameId = parseInt(newGameIdInput);
    if(!validateGameIdType(parsedGameId))
    dispatch(changeCurrentUserStatus('joining-game'))
    //TODO: convert Id to XXX-XXXX-XXX
    const body = {
      email: currentUser.info.email,
      displayName: currentUser.info.displayName,
      gameId: parsedGameId,
      photoURL: currentUser.info.photoURL,
      id: currentUser.info.id,
    }
    fetch('/join-existing-game', {
      method: 'POST',
      headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
      body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.status===200) {
        toggle(false);
        dispatch(clearChat())
        dispatch(setPlayerTurn(res.turnNumber))
        waitingToStart(res.gameId, res.hand);
      } else {
          console.log('res.message',res.message)
        }
    })
  }

  return (
    <Wrapper
    onClick={()=>toggle(false)}
    >
    <Container
      onSubmit={(event)=>joinNewGameForReal(event)}
      onClick={(event)=>event.stopPropagation()}
    >
      <GameBtns
        type='submit'
      >join a game
      </GameBtns>
      <div>
      <Label htmlFor='gameId'>game id:</Label>
      <Input type='text' id='gameId' name='gameId' value={newGameIdInput} placeholder='game id#'
        onChange={(event)=>setNewGameIdInput(event.target.value)}
      />
      </div>
    </Container>
    </Wrapper>
    );
}

export default JoinNewGameWarning;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  top: 60px;
  position: absolute;
  width: 100%;
  z-index: 100;
  background-color: rgba(60,60,60,0.5);
  padding: 10px;
`;

const Container = styled.form`
  position: relative;
  width: 300px;
  height: 200px;
  margin: auto;
  border-radius: 10px;
  z-index: 101;
  display: flex;
  flex-direction:column;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
`;

const GameBtns = styled(UnstyledButton)`
  background:#add5e1;
  border-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  padding: 5px 10px;
  font-size: 20px;
  width: fit-content;
  margin: 0 auto;
`;
const Input = styled.input`
  border-radius: 2px;
  margin: 0 auto;
  width: 50%;
`;
const Label = styled.label`
  background-color: rgba(200,200,200,0.5);
  font-size: 20px;
  font-family: 'Muli', sans-serif;
  line-height: 1.3;
  margin-top:3px;
  margin: 0 auto;
  display:block;
  width: 50%;
`;