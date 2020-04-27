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
} from '../../Redux/actions'

const Homepage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUserInfo = useSelector(state=>state.currentUserInfo)

  const [gameId, setGameId] = useState('')

  const startNewGame = () => {
    dispatch(changeCurrentUserStatus('creating-game'))
    const body= {
      creatorEmail: currentUserInfo.info.email,
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
        console.log('res',res)
        if(res.status===200) {
          dispatch(newGameId(res.gameId))
          dispatch(setNewHand(res.hand));
          dispatch(changeCurrentUserStatus('playing'))
          history.push('/game')
        }
      })
  }

  const joinExistingGame = (event) => {
    event.preventDefault();
    console.log('gameId',gameId)
    console.log('currentUserInfo.info',currentUserInfo.info.email)
    dispatch(changeCurrentUserStatus('joining-game'))
    const body = {
      userEmail: currentUserInfo.info.email,
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
        dispatch(newGameId(res.gameId))
        dispatch(setNewHand(res.hand));
        dispatch(changeCurrentUserStatus('playing'))
        history.push('/game')
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
              // onClick={()=>joinExistingGame()}
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