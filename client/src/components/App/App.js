import React, {
  useState,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import Webcam from '../Cam';
import RND from '../RND';

const App = () => {
  
  return (
    <Wrapper>
      <RND
        initialWidth={100}
        initialHeight={100}
        initialTop={10}
        initialLeft={10}
      >
      <Webcams/>
      </RND>
    </Wrapper>
    );
}

export default App;

const Drag = styled.div`
  width: 10px;
  height: 10px;
  background: red;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom:0px;
  right:0px;
`;

const Wrapper = styled.div`
  position: relative;
`;
const Div = styled.div`
  position: absolute;
  width: 105px;
  height: 100px;
  border: 1px solid black;
  /* resize: both;
  overflow: hidden; */
  object-fit:cover;
`;

const Webcams = styled(Webcam)`
  resize: both;
  overflow: hidden;
`;