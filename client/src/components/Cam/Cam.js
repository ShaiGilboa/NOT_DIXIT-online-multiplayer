import React from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

const Cam = ({
  width,
  height,
  }) => {

  // this is the size of the video stream itself
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };
 
 const webcamRef = React.useRef(null);
 
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
    },
    [webcamRef]
  );

  return (
    <Wrapper>
      <Cams
        // style={{resize: 'both'}}
        audio={false}
        ref={webcamRef}
        // screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        // this is the size of the component
        height={height}
        width={width}
      />
      {/* <button onClick={capture}>Capture photo</button> */}
    </Wrapper>
    );
}

export default Cam;

const Wrapper = styled.div`

`;
const Cams = styled(Webcam)`
  resize: both;
  overflow: hidden;
`;