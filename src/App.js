import React, {useEffect, useReducer } from "react";
import "./App.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";


const initialState = {
  paddle1: {
    y: 0
  },
  paddle2: {
    y: 0
  },
  ball: {
    x: 0,
    y: 0,
    dx: 5,
    dy: 5
  }
};


function reducer (state, action) {
  switch (action.type) {
    case "MOVE_PADDLE1":
      return { ...state, paddle1: action.payload }
    case "MOVE_PADDLE2":
      return { ...state, paddle2: action.payload }
    case "MOVE_BALL":
      return { ...state, ball: action.payload }
    default:
      throw new Error();
  }
}

export default function App() {


  const [state, dispatch] = useReducer(reducer, initialState); 

  function handleKeyP1({key}) {
    const char = key.toLowerCase();
    if (char === "w" || char === "s") {
      let boundedY = (state.paddle1.y + (char === "w" ? -5 : 5));
      if (boundedY < 0) {
        boundedY = 0;
      } else if (boundedY > 400) {
        boundedY = 400;
      }
      dispatch({type: "MOVE_PADDLE1", payload: {y: boundedY}});
    }
  }

  function handleKeyP2({key}) {
    const char = key.toLowerCase();
    if (char === "o" || char === "l") {
      let boundedY = (state.paddle2.y + (char === "o" ? -5 : 5));
      if (boundedY < 0) {
        boundedY = 0;
      } else if (boundedY > 400) {
        boundedY = 400;
      }
      dispatch({type: "MOVE_PADDLE2", payload: {y: boundedY}});
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyP1);
    window.addEventListener("keydown", handleKeyP2);
    return () => {
      window.removeEventListener("keydown", handleKeyP1);
      window.removeEventListener("keydown", handleKeyP2);
    }
  }, [state]);

  useEffect(() => {
    const myTimeout = setTimeout(() => {
      let dx = state.ball.dx;
      let dy = state.ball.dy;
      if (state.ball.x + state.ball.dx > 750 - 20 || state.ball.x + state.ball.dx < 0) {
        dx = -dx;
      }
      if (state.ball.y + state.ball.dy > 500 - 20 || state.ball.y + state.ball.dy < 0) {
        dy = -dy;
      }
      dispatch({
        type: "MOVE_BALL",
        payload: {
          dx,
          dy,
          x: state.ball.x + state.ball.dx,
          y: state.ball.y + state.ball.dy
        }
      })
    }, 25);
    return () => clearTimeout(myTimeout);
}, [state.ball]);

  return (
    <div className="container">
      <Paddle paddleY={state.paddle1.y}/>
      <Paddle isPlayerTwo paddleY={state.paddle2.y}/>
      <Ball pos={state.ball}/>
    </div>
  );
}
