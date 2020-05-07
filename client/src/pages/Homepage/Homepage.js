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
import UnstyledButton from '../../components/UnstyledButton';
import LoadingSpinner from '../../components/LoadingSpinner';

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
    history.push('/waiting') // waiting room
    // history.push('/game')
  }

  const startNewGame = () => {
    dispatch(changeCurrentUserStatus('creating-game'))
    const body= {
      creatorEmail: currentUser.info.email,
      displayName: currentUser.info.displayName,
      photoURL: currentUser.info.photoURL,
      id: currentUser.info.id,
    }
    fetch('/create-new-game', {
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
        } else {
          console.log('res.message',res.message)
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
        dispatch(setPlayerTurn(res.turnNumber))
        waitingToStart(res.gameId, res.hand);
      } else {
          console.log('res.message',res.message)
        }
    })
  }

  return (
    <Wrapper>
      <Welcome>
        <Title>Welcome to Not-Dixit!</Title>
        {currentUser.status==='logged-in'
          ? (<StartGame>
                <GameBtns
                  onClick={()=>startNewGame()}
                >start a new game
                </GameBtns>
                <form
                  onSubmit={(event)=>{joinExistingGame(event)}}
                >
                  <GameBtns
                    type='submit'
                  >join a game
                  </GameBtns>
                  <Label htmlFor='gameId'>game id:</Label>
                  <Input type='text' id='gameId' name='gameId' value={gameId} placeholder='game id#'
                    onChange={(event)=>setGameId(event.target.value)}
                  />
                </form>
              </StartGame>
            )
          : (currentUser.status==='joining-game' || currentUser.status==='creating-game') 
            ? <LoadingSpinner/>
            : (<Info>
                <Note>(in order to play you will need to log in)</Note>
                <Instructions>One player is the storyteller for the turn and looks at the images on the 7 cards in her hand. From one of these, she makes up a sentence and submits it.
                Each other player selects the card in their hands which best matches the sentence.</Instructions>

                <Instructions>All pictures are shown face up and every player has to bet upon which picture was the storyteller's.</Instructions>
                <Note>{"don't worry, it's not that complicated once you start :)"}</Note>
                <Scoring>If nobody or everybody finds the correct card, the storyteller scores 0, and each of the other players scores 2. Otherwise the storyteller and whoever found the correct answer score 3. Players score 1 point for every vote for their own card.
                The game ends when the deck is empty or if a player scores 30 points. In either case, the player with the most points wins the game.</Scoring>
              </Info>)}
      </Welcome>
    </Wrapper>
    );
}

export default Homepage;

const Wrapper = styled.div`
  height: calc(100vh - 60px);
  position: relative;
  width: 100%;
  background-color: rgba(60,60,60,0.3);
  display: flex;
  justify-content: space-around;
`;

const Welcome = styled.div`
  width: calc(100vh - 140px);
  height: calc(100vh - 140px);
  max-height: calc(100vh - 80px);
  padding: 4px;
  background-color: rgba(217, 85, 122,0.3);
  border-radius:10px;
  box-shadow:  0 0 5px 4px #d4cfd1 , inset 0 0 5px 4px #f2edef;
  padding: 10px 30px;
`;

const Title = styled.h1`
  text-align: center;
  height: 40px;
  color: #f5e9ec;
  font-size: 36px;
  font-family: 'Limelight', cursive;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: calc(100% - 40px);
  width: 100%;
  border-radius: 10px;
  text-align:center;
  background-color: rgba(200, 200, 200,0.8);
`;

const Instructions = styled.p`
  padding-top: 10px;
  font-size: 20px;
  font-family: 'Muli', sans-serif;
  line-height: 1.3;
`;

const Note = styled.div`
  padding-top: 10px;
  line-height: 1.3;
  font-size:20px;
  font-family: 'Caveat', cursive;
`;

const Scoring = styled.p`
  padding-top: 10px;
  font-size: 20px;
font-family: 'Muli', sans-serif;
  line-height: 1.2;
`;

const GameBtns = styled(UnstyledButton)`
  background:#add5e1;
  border-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  padding: 5px;
  font-size: 20px;
`;

const StartGame = styled.div`
  margin: 22% 26%;
  height: 40%;
  padding: 20px;
  padding-left: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;
const Input = styled.input`
  border-radius: 2px;
`;
const Label = styled.label`
  background-color: rgba(200,200,200,0.5);
  font-size: 20px;
  font-family: 'Muli', sans-serif;
  line-height: 1.3;
  margin-top:3px;
  display:block;
`;