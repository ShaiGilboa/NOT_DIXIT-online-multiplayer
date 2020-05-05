import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useSelector,
  useDispatch,
} from 'react-redux';
import {
  useHistory,
} from 'react-router-dom';

import styled from 'styled-components';

import {
  validateGameIdType,
} from '../../utils';

import {
  changeCurrentUserStatus,
  setNewHand,
  newGameId,
  setPlayerTurn,
} from '../../Redux/actions'

const Homepage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(state=>state.currentUser)

  const [gameId, setGameId] = useState('')
  const [test, setTtest] = useState('')
  const waitingToStart = (gameId, hand) =>{
    dispatch(newGameId(gameId));// and game status = 'waiting-to-start'
    dispatch(setNewHand(hand));// and round status = 'playing'
    // dispatch(changeCurrentUserStatus('playing'))
    // history.push('/waiting') // waiting room
    history.push('/game')
  }

  const startNewGame = () => {
    dispatch(changeCurrentUserStatus('creating-game'))
    const body= {
      creatorEmail: currentUser.info.email,
      displayName: currentUser.info.displayName,
      id: currentUser.info.id,
    }
    fetch('/start-new-game', {
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
          dispatch(setPlayerTurn(0))
          waitingToStart(res.gameId, res.hand);
        }
      })
  }

  const joinExistingGame = (event) => {
    event.preventDefault();
    const parsedGameId = parseInt(gameId);
    if(!validateGameIdType(parsedGameId))
    dispatch(changeCurrentUserStatus('joining-game'))
    //TODO: convert Id to XXX-XXXX-XXX
    const body = {
      email: currentUser.info.email,
      displayName: currentUser.info.displayName,
      gameId: parsedGameId,
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
        dispatch(setPlayerTurn(res.turnNumber))
        waitingToStart(res.gameId, res.hand);
      }
    })
  }

  return (
    <Wrapper>
      <div>Homepage</div>
      <Welcome>
        {currentUser.status==='logged-in'
          ? (<>
            <button
              onClick={()=>startNewGame()}
            >Would you like to start a new game?
            </button>
            <form
              onSubmit={(event)=>{joinExistingGame(event)}}
            >
              <label htmlFor='gameId'>game id:</label>
              <input type='text' id='gameId' name='gameId' value={gameId}
                onChange={(event)=>setGameId(event.target.value)}
              />
              <button
                type='submit'
              >Would you like to join an existing game?
              </button>
            </form>
          </>)
          : (<>
          </>)}
      </Welcome>
    </Wrapper>
    );
}

export default Homepage;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Welcome = styled.div`
  display: grid;
  grid-area:
`;