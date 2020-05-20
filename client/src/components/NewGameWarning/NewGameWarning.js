import React from 'react';
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
} from '../../Redux/actions'
import {
  IP,
} from '../../constants';
import styled from 'styled-components';
import UnstyledButton from '../UnstyledButton';

const NewGameWarning = ({toggle}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(state=>state.currentUser);
  const turnNumber = useSelector(state=>state.gameData.turnNumber)
  const pastGameId = useSelector(state=>state.gameData.gameId)
  const waitingToStart = (gameId, hand) =>{
      const body = {
        gameId: pastGameId,
        userEmail: currentUser.info.email,
        displayName: currentUser.info.displayName,
        playerTurnNumber: turnNumber,
        body: `I'm starting a new game, join me with the Id: ${gameId}`,
        photoURL: currentUser.info.photoURL,
      }
      fetch(`${IP}/send-message`, {
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

  const startNewGameForReal = (event) => {
    event.preventDefault();
    dispatch(changeCurrentUserStatus('creating-game'))
    const body= {
      creatorEmail: currentUser.info.email,
      displayName: currentUser.info.displayName,
      photoURL: currentUser.info.photoURL,
      id: currentUser.info.id,
    }
    fetch(`${IP}/create-new-game`, {
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
          dispatch(setPlayerTurn(0))
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
      onSubmit={(event)=>startNewGameForReal(event)}
      onClick={(event)=>event.stopPropagation()}
    >
      <h2>Are You Sure You Want To Leave This Game?</h2>
      <GameBtns type='submit'>
        YES
      </GameBtns>
    </Container>
    </Wrapper>
    );
}

export default NewGameWarning;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  top: 60px;
  position: absolute;
  width: 100%;
  z-index: 100;
  background-color: rgba(60,60,60,0.5);
  /* opacity: 0.5; */
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
  /* object-fit:cover; */
  /* opacity: 1; */
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