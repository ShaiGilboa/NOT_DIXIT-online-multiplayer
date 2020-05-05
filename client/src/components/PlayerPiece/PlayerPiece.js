import React, {
  useEffect,
  useState,
} from 'react';
import styled, {keyframes} from 'styled-components';
import bunny from '../../assets/bunny.png';
import {
  randInRange
} from '../../utils';


const PlayerPiece = ({filter, score, playerTurn}) => {
  const locationsOfScore = [{top: 11, left: 6},{top: 22, left: 15},{top: 31, left: 13},{top: 39, left: 3},{top: 46, left: 16},{top: 58, left: 6},{top: 65, left: 14},{top: 77, left: 5},{top: 84, left: 18},{top: 75, left: 32},{top: 83, left: 43},{top: 75, left: 51},{top: 71, left: 62},{top: 84, left: 72},{top: 81, left: 84},{top: 70, left: 79},{top: 60, left: 87},{top: 55, left: 73},{top: 46, left: 73},{top: 38, left: 82},{top: 24, left: 86},{top: 13, left: 76},{top: 1, left: 83},{top: 1, left: 71},{top: 11, left: 64},{top: 9, left: 53},{top: 1, left: 47},{top: 11, left: 40},{top: 11, left: 29},{top: 3, left: 32},{top: 1, left: 19},];

  const [previousLocation, setPreviousLocation] = useState({
    top: locationsOfScore[0].top + playerTurn,
    left: locationsOfScore[0].left + playerTurn})
  const [currentLocation, setCurrentLocation] = useState({
    top: locationsOfScore[0].top + playerTurn,
    left: locationsOfScore[0].left + playerTurn})
  const [currentScore, setCurrentScore] = useState(0)
  useEffect(()=>{
    if(score!==currentScore){
      setCurrentScore(score)
    }
  },[score])

  useEffect(()=>{
    setPreviousLocation(currentLocation)
    setCurrentLocation({
      top: locationsOfScore[currentScore].top + playerTurn,
      left: locationsOfScore[currentScore].left + playerTurn,
    })
  },[currentScore])

  return ( 
      <Token src={bunny} style={{filter}} location={currentLocation} previousLocation={previousLocation}/>
    );
}

export default PlayerPiece;

const Wrapper = styled.div`

`;

const move = (top, left, previousTop, previousLeft) => keyframes`
  from {
    /* transform: translate(${previousLeft}%, ${previousTop}%) */
    transform: translate(0, 0)
  }
  to {
    transform: translate(${left}%, ${top}%)
  }
`

const Token = styled.img`
  /* filter: ${props=>props.filter}; */
  width: 40px;
  height: 40px;
  position: absolute;
  left: ${props=>props.location.left}%;
  top: ${props=>props.location.top}%;
  width: 6%;
  height: 6%;
  border-radius: 20%;
  animation: ${props=>move(props.location.top, props.location.left, props.previousLocation.top, props.previousLocation.left)} 0.5s linear forwards;
  box-shadow: 0px 0px 25px 2px rgba(0,0,0,0.4),  inset 0px 0px 25px 2px rgba(0,0,0,0.4);
`;