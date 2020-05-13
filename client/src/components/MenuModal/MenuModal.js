import React from 'react';
import styled from 'styled-components';

const MenuModal = ({flag, toggleInstructions, toggleAbout, toggleDropdown, startNewGame, joinNewGame}) => {
  // const [aboutFlag, setAboutFlag] = useState(false);

  const clearFlags = () => {
    toggleInstructions(false)
    toggleAbout(false)
  }
  return (
    <Wrapper flag={flag}>
      <ul>
        <Li
          onClick={()=>toggleInstructions(true)}
          onMouseEnter={()=>clearFlags()}
        >Instruction
        </Li>
        <Li
          onClick={()=>toggleAbout(true)}
          onMouseEnter={()=>toggleAbout(clearFlags)}
        >About</Li>
        <Li
          onClick={()=>startNewGame()}
        >Start a new game</Li>
        <Li
          onClick={()=>joinNewGame()}
        >Join a new game</Li>
      </ul>
    </Wrapper>
    );
}

export default MenuModal;

const Wrapper = styled.div`
  position: absolute;
  width: 150px;
  height: ${props=>props.flag ? 'fit-content' : '0px'};
  background-color:rgba(255,255,255,0.5);
  top: 58px;
  transition: all 0.5s ease-in-out;
  left: 0px;
  overflow: hidden;
`;

const Li = styled.li`
  font-family: 'Muli', sans-serif;
  font-size: 20px;
  padding: 15px 0 5px 10px;
  position: relative;
  transition: all 0.2s ease-in-out;
  &:hover{
    background-color: white;
    cursor: pointer;
  }
`;

