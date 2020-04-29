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
  const currentUserInfo = useSelector(state=>state.currentUserInfo)

  const [gameId, setGameId] = useState('')

  const changeStatusToPlaying = (gameId, hand) =>{
    dispatch(newGameId(gameId));// and status = 'playing'
    dispatch(setNewHand(hand));// and status = 'playing'
    dispatch(changeCurrentUserStatus('playing'))
    history.push('/game')
  }

  const startNewGame = () => {
    dispatch(changeCurrentUserStatus('creating-game'))
    const body= {
      creatorEmail: currentUserInfo.info.email,
      displayName: currentUserInfo.info.displayName,
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
          changeStatusToPlaying(res.gameId, res.hand);
          dispatch(setPlayerTurn(1))
        }
      })
  }

  const joinExistingGame = (event) => {
    event.preventDefault();
    dispatch(changeCurrentUserStatus('joining-game'))
    const body = {
      userEmail: currentUserInfo.info.email,
      displayName: currentUserInfo.info.displayName,
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
        changeStatusToPlaying(res.gameId, res.hand);
          dispatch(setPlayerTurn(res.turnNumber))
      }
    })
  }

  useEffect(()=>{
    // if(currentUserInfo.status==='logged-in')history.push('/game')
  },[currentUserInfo])
  return (
    <Wrapper>
      <div>Homepage</div>
      {currentUserInfo.status==='logged-in'
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