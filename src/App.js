import React, {useEffect, useReducer } from "react";
import "./App.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";


const initialState = {
  paddle1: {
    y: 200
  },
  paddle2: {
    y: 200
  },
  ball: {
    x: 200,
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
      let x = state.ball.x;
      let y = state.ball.y;
      let dx = state.ball.dx;
      let dy = state.ball.dy;

      let paddle1Y = state.paddle1.y;
      let paddle2Y = state.paddle2.y;

      if (x < 5 || x > 700) {
        return dispatch({
          type: "MOVE_BALL",
          payload: {
            dx: 5,
            dy: 5,
            x: 200,
            y: 0
          }
        });
      }

      if (x + dx > 750 - 20 || x + dx < 0) {
        dx = -dx;
      }
      if (y + dy > 500 - 20 || y + dy < 0) {
        dy = -dy;
      }

      if ((paddle1Y < y+dy && paddle1Y + 100 > y+dy) && x < 45) {
        dx = -dx;
      }

      if ((paddle2Y < y+dy && paddle2Y + 100 > y+dy) && x > 685) {
        dx = -dx;
      }

      dispatch({
        type: "MOVE_BALL",
        payload: {
          dx,
          dy,
          x: x + dx,
          y: y + dy
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
