import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';

import {
  useSelector,
} from 'react-redux';

import { AuthContext } from '../../components/AuthContext/AuthContext';
import UnstyledButton from '../UnstyledButton';
import UserProfile from '../../pages/UserProfile';
import MenuModal from '../MenuModal';
import NewGameWarning from '../NewGameWarning';
import JoinNewGameWarning from '../JoinNewGameWarning';

import {
  PLAYER_COLORS,
  // CARD_IN_HAND_WIDTH,
} from '../../constants';

const Navbar = () => {

  const {
    signInWithGoogle,
    handleSignOut,
  } = useContext(AuthContext);

  const gameData = useSelector(state=>state.gameData)
  const roundData = useSelector(state=>state.roundData)
  const currentUser = useSelector(state=>state.currentUser)
  const history = useHistory();

  const [navbarColor, setNavbarColor] = useState('grey');
  const [dropdownFlag, setDropdownFlag] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [aboutFlag, setAboutFlag] = useState(false);
  const [instructionsFlag, setInstructionsFlag] = useState(false);
  const [newGameWarning, setNewGameWarning] = useState(false)
  const [joinGameWarning, setJoinNewGameWarning] = useState(false)


  const getInitial = () =>{
    const name = currentUser.info.displayName
    const nameArr = name.split(' ');
    const initials = nameArr.map(string=>string.charAt(0).toUpperCase()).join(' ')
    return initials
  }
  useEffect(()=>{
    if(roundData.status!=='waiting' && gameData.turnNumber!==null)setNavbarColor(PLAYER_COLORS[gameData.turnNumber])
    // eslint-disable-next-line
  },[roundData.status])

  useEffect(()=>{
    if(!currentUser.info.email)history.push('/')
    // eslint-disable-next-line
  },[currentUser])

  const startNewGame = () => {
    setDropdownFlag(false);
    setInstructionsFlag(false);
    setAboutFlag(false);
    setNewGameWarning(true);
  }

  const joinNewGame = () => {
    setDropdownFlag(false);
    setInstructionsFlag(false);
    setAboutFlag(false);
    setJoinNewGameWarning(true);
  }

  return (
    <Wrapper color={navbarColor}>
      <Title
        onMouseEnter={()=>setDropdownFlag(true)}
        onMouseLeave={()=>setDropdownFlag(false)}
      >
        <TitleName>Not-Dixit!</TitleName>
        {/* <MenuModal /> */}
        <Instructions flag={instructionsFlag} data-css='instructions' onMouseLeave={()=>setInstructionsFlag(false)}>
                <InstructionsP>One player is the storyteller for the turn and looks at the images on the 7 cards in her hand. From one of these, she makes up a sentence and submits it.
                Each other player selects the card in their hands which best matches the sentence.</InstructionsP>
                <InstructionsP>All pictures are shown face up and every player has to bet upon which picture was the storyteller's.</InstructionsP>
                <Note>{"don't worry, it's not that complicated once you start :)"}</Note>
                <Scoring>If nobody or everybody finds the correct card, the storyteller scores 0, and each of the other players scores 2. Otherwise the storyteller and whoever found the correct answer score 3. Players score 1 point for every vote for their own card.
                The game ends when the deck is empty or if a player scores 30 points. In either case, the player with the most points wins the game.</Scoring>
          </Instructions>
          <About flag={aboutFlag} onMouseLeave={()=>setAboutFlag(false)}>
            <Note>Go back to a time where you could play with friends, this time, on-line. enjoy :)</Note>
          </About>
        <MenuModal flag={dropdownFlag} toggleInstructions={setInstructionsFlag} toggleAbout={setAboutFlag} toggleDropdown={setDropdownFlag} startNewGame={startNewGame} joinNewGame={joinNewGame}/>
      </Title>
      <GameInfo>
        { gameData.status==="winner"
          ? <EndOfGameMessage>winner</EndOfGameMessage>
          : gameData.status === "loser"
            ? <EndOfGameMessage>Loser</EndOfGameMessage>
            : (gameData.status!=="waiting" && gameData.status !== "waiting-to-start") && (roundData.isMyTurn 
                ? (<ActivePlayerIsMe>IT'S YOUR TURN - {roundData.status==="submitting-titled-card"
                  ? <p>choose the titled card</p> 
                  : (gameData.status==='end-of-round' 
                    ? <p>scores</p> 
                    : <p>waiting</p>
                    )
                    }
                  </ActivePlayerIsMe>)
                : (<ActivePlayer>
                  <PlayerColor color={PLAYER_COLORS[gameData.activePlayer]}/>'s turn - 
                  {roundData.status==='waiting-for-title' && <p>waiting for titled card</p>}
                  {roundData.status === 'matching-card-to-title' && <p>find the best card for the title</p>}
                  {roundData.status === 'waiting-for-other-submissions' && <p>waiting for other players to choose their card</p>}
                  {roundData.status === 'voting' && <p>Choose the card that best matches the title</p>}
                  {roundData.status === 'waiting-for-other-votes' && (gameData.status==='end-of-round' ? <p>Scores!</p> : <p>Waiting for other votes</p>)}
                  </ActivePlayer>))}
              {roundData.titledCard.title ? <CardTitle>card Title: {roundData.titledCard.title}</CardTitle>: null}
      </GameInfo>
      <UserInfoBox data-css='user-info'>
        {currentUser.info.email 
          ? (<>
            <SignOutBtn
              onClick={()=>handleSignOut()}
            >Sign Out</SignOutBtn>
            {currentUser.info.photoURL 
              ? imgError
                ? <Initials>{getInitial()}</Initials>
                : <UserAvatar 
                  onClick={()=>{setUserProfileModal(!userProfileModal)}}
                  src={currentUser.info.photoURL} 
                  onError={()=>setImgError(true)}/>
              : <Initials><p>{getInitial()}</p></Initials>}
          </>)
          : (<>
            <SignInBtn data-css='sign-out-btn'
              onClick={()=>signInWithGoogle()}
            >Sign In</SignInBtn>
          </>)}
      </UserInfoBox>
      {userProfileModal && <UserProfile toggle={setUserProfileModal}/>}
      {newGameWarning && <NewGameWarning toggle={setNewGameWarning}/>}
      {joinGameWarning && <JoinNewGameWarning toggle={setJoinNewGameWarning} />}
    </Wrapper>
    );
}

export default Navbar;

const EndOfGameMessage = styled.div`
  text-align: center;
`;

const Wrapper = styled.div`
  height: 60px;
  background-color: ${props=>props.color};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position:relative;
  z-index:3;
  box-shadow: 0px 0 10px rgba(0, 0, 0, 0.8) inset, 0 0 10px #add5e1;
`;

const Title = styled.div`
  width: fit-content;
  padding-left: 10px;
  z-index:0;
  position:relative;
`;

const TitleName = styled.div`
  color: lightgrey;
  width: fit-content;
  font-size: 2rem;
  font-family: 'Limelight', cursive;
  /* z-index:300; */
  position:relative;
  padding: 13px 0;
`;

const GameInfo = styled.div`
  flex:1;
  padding-left: 20px;
  display:flex;
  justify-content:space-around;
`;

const CardTitle = styled.div`
  background-color:rgba(220,220,220,0.7);
  border-radius:3px;
  padding: 2px;
`

const UserInfoBox = styled.div`
  width: fit-content;
  display: flex;
  justify-content: space-around;
  align-items:center;
  position: relative;
  right:0;
`;

const SignOutBtn = styled(UnstyledButton)`
  width: 60px;
  height: 35px;
  background-color:#add5e1;
  border-radius: 15px;
  color: #e4717a;
  text-shadow: 0px 0px 2px Limegreen;
`;

// const SignInBtn = styled.button`
const SignInBtn = styled(UnstyledButton)`
  width: 60px;
  height: 35px;
  margin-right: 60px;
  background:#add5e1;
  border-radius: 15px;
  color: #e4717a;
  text-shadow: 0px 0px 2px Limegreen;
`;

const Initials = styled.div`
  width: 40px;
  height: 40px;
  margin: 10px;

  padding-top: 12px;
  border-radius: 50%;
  background-color:pink;
  color: white;
  text-align: center;
  font-size: large;
  font-weight: bold;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  padding: 10px;
  border-radius: 50%;
  object-fit: cover;
  &:hover{
    cursor: pointer;
  }
`;

const ActivePlayerIsMe = styled.div`
  font-size: 20px;
  width: fit-content;
  color: Azure;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
`

const ActivePlayer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PlayerColor = styled.div`
  width:20px;
  height:20px;
  border-radius: 50%;
  background-color: ${props=>props.color};
`

const Instructions = styled.div`
  width: 400px;
  height: fit-content;
  max-height: calc(100vh - 60px);
  position:absolute;
  left: 150px;
  top: 58px;
  padding: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  /* display: block; */
  display: ${props=>props.flag ? 'block' : 'none'};
  background-color: white;
`;

const InstructionsP = styled.p`
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

const About = styled.div`
  width: 200px;
  height: fit-content;
  max-height: calc(100vh - 60px);
  position:absolute;
  left: 150px;
  top: 58px;
  padding: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0px 0 2px #add5e1 inset, 0 0 2px #add5e1;
  /* display: block; */
  display: ${props=>props.flag ? 'block' : 'none'};
  background-color: white;
`;