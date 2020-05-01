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
          console.log('res',res)
          dispatch(setPlayerTurn(0))
          waitingToStart(res.gameId, res.hand);
        }
      })
  }

  const joinExistingGame = (event) => {
    event.preventDefault();
    dispatch(changeCurrentUserStatus('joining-game'))
    //TODO: convert Id to XXX-XXXX-XXX
    const body = {
      email: currentUser.info.email,
      displayName: currentUser.info.displayName,
      gameId,
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

  useEffect(()=>{
    // if(currentUser.status==='logged-in')history.push('/game')
  },[currentUser])
  return (
    <Wrapper>
      <div>Homepage</div>
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
    </Wrapper>
    );
}

export default Homepage;

const Wrapper = styled.div`

`;