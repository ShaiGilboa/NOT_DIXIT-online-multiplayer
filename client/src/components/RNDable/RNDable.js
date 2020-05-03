import React, {
  useState,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import Webcam from '../Cam';

// function useClientRect() {
//   const [rect, setRect] = React.useState(7);
//   const ref = React.useCallback(node => {
//     if (node !== null) {
//       setRect(node.getBoundingClientRect());
//     }
//   }, []);
//   return [rect, ref];
// }

const RNDable = ({
  initialWidth,
  initialHeight,
  initialTop,
  initialLeft,
  children,
}) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [resizeXY, setResizeXY] = useState({x:0, y:0})
  const [pastX, setPastX] = useState(0);
  const [pastY, setPastY] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [top, setTop] = useState(initialTop);
  const [left, setLeft] = useState(initialLeft);
  const [dragXY,setDragXY] = useState({x:0, y:0})
  const [dragPastX, setDragPastX] = useState(0);
  const [dragPastY, setDragPastY] = useState(0);
  const [isDragDown, setIsDragDown] = useState(false);

  const ref = React.useRef();
  
  const mousedownOnDrag = (event) => {
    if(event.repeat){return}    
    // document.addEventListener('mouseup',mouseupHandler)
    setIsDragDown(true)
    setDragXY({
      x:event.clientX,
      y:event.clientY,
      })
  }

  useEffect(()=>{
    setResizeXY({
      x:ref.current.getBoundingClientRect().right,
      y:ref.current.getBoundingClientRect().bottom,
    })
    setDragXY({
      x:ref.current.getBoundingClientRect().left,
      y:ref.current.getBoundingClientRect().top,
    })
    setTop(ref.current.getBoundingClientRect().top)
    setLeft(ref.current.getBoundingClientRect().left)
  },[ref])

  const resizeHandler = (event) => {
    if(event.repeat){return}
    document.addEventListener('mouseup',mouseupHandler)
    if(isMouseDown && event.pageX !== resizeXY.x){
      setWidth(width+(event.pageX-resizeXY.x))
      setResizeXY({
        ...resizeXY,
        x:event.pageX,
      })
    }
    if(isMouseDown && event.pageY !== resizeXY.y){
      setHeight(height+(event.pageY-resizeXY.y))
      setResizeXY({
        ...resizeXY,
        y:event.pageY,
      })
    }
  }

  const dragMoveHandler = (event) => {
    if(event.repeat) {return}
    document.addEventListener('mouseup',mouseupHandler)
    if(isDragDown && event.clientX !== dragXY.x) {
      setLeft(left + (event.clientX - dragXY.x))
      setDragXY({
        ...dragXY,
        x:event.clientX,
      })
    }
    if(isDragDown && event.clientY !== dragXY.y) {
      setTop(top + (event.clientY-dragXY.y))
      setDragXY({
        ...dragXY,
        y:event.clientY,
      })
    }
  }

  useEffect(()=>{
    isDragDown
      ? document.addEventListener('mousemove',dragMoveHandler)
      : document.removeEventListener('mousemove',dragMoveHandler)
  },[isDragDown])

  useEffect(()=>{
    isMouseDown
      ? document.addEventListener('mousemove',resizeHandler)
      : document.removeEventListener('mousemove',resizeHandler)
  },[isMouseDown])

  const mousedownOnResize =(event) => {
    setIsMouseDown(true)
    // document.addEventListener('mouseup',mouseupHandler)
    setResizeXY({
      x:event.pageX,
      y:event.pageY,
    })
  }

  const mouseupHandler = (event) => {
    if(event.repeat) {return}
    setDragXY({
      x:event.clientX,
      y:event.clientY,
    })
    setResizeXY({
      x:event.pageX,
      y:event.pageY,
    })
    setIsMouseDown(false)
    setIsDragDown(false)
    document.removeEventListener('mouseup',mouseupHandler)
    document.removeEventListener('mousemove', resizeHandler)
    document.removeEventListener('mousemove', dragMoveHandler)
  }

  return (
      <Div
        style={{width: `${width}px`, height: `${height}px`,top: `${top}px`, left: `${left}px`}}
        ref={ref}
        onMouseDown={(event)=>{
          event.preventDefault();
          event.stopPropagation()
          mousedownOnDrag(event)
        }}
      >
      {children && React.cloneElement(children,{width,height})}
      <Drag 
        onMouseDown={(event)=>{
          event.preventDefault();
          event.stopPropagation()
          mousedownOnResize(event)
        }}
        onMouseUp={()=>setIsMouseDown(false)}
      />
      </Div>
    );
}

export default RNDable;

const Drag = styled.div`
  width: 10px;
  height: 10px;
  background: red;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom:0px;
  right:0px;
  z-index:100;
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
