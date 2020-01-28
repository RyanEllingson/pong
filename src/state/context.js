import React, { useReducer, useEffect } from "react";
import reducer from "./reducer";
import makeLevel from "../levels/makeLevel";
import levelOne from "../levels/one";
import willCollide from "../utils/willCollide";

export const GameContext = React.createContext();

export default function GameProvider(props) {

    const initialState = {
        paddle1y: {
          y: 200
        },
        paddle1dy: {
          dy: 0
        },
        paddle2y: {
          y: 200
        },
        paddle2dy: {
          dy: 0
        },
        ball: {
          x: 200,
          y: 0,
          dx: 5,
          dy: 5
        },
        obstacles: makeLevel(levelOne)
      };

    const [state, dispatch] = useReducer(reducer, initialState); 

  function handleKeyP1({key}) {
    const char = key.toLowerCase();
    if (char === "w" || char === "s") {
      const newDy = (char === "w" ? -5 : 5);
      dispatch({type: "PADDLE1_SPEED", payload: {dy: newDy}});
    }
  }

  function releaseKeyP1({key}) {
    const char = key.toLowerCase();
    if (char === "w" || char === "s") {
      dispatch({type: "PADDLE1_SPEED", payload: {dy: 0}});
    }
  }

  function handleKeyP2({key}) {
    const char = key.toLowerCase();
    if (char === "o" || char === "l") {
      const newDy = (char === "o" ? -5 : 5);
      dispatch({type: "PADDLE2_SPEED", payload: {dy: newDy}});
    }
  }

  function releaseKeyP2({key}) {
    const char = key.toLowerCase();
    if (char === "o" || char === "l") {
      dispatch({type: "PADDLE2_SPEED", payload: {dy: 0}});
    }
  }

  useEffect(() => {
    window.addEventListener("keypress", handleKeyP1);
    window.addEventListener("keyup", releaseKeyP1);
    window.addEventListener("keypress", handleKeyP2);
    window.addEventListener("keyup", releaseKeyP2);
    return () => {
      window.removeEventListener("keypress", handleKeyP1);
      window.removeEventListener("keyup", releaseKeyP1);
      window.removeEventListener("keypress", handleKeyP2);
      window.removeEventListener("keyup", releaseKeyP2);
    }
  }, [state]);

  useEffect(() => {
    const myTimeout = setTimeout(() => {
      let paddle1Y = state.paddle1y.y;
      let paddle2Y = state.paddle2y.y;
      let paddle1dy = state.paddle1dy.dy;
      let paddle2dy = state.paddle2dy.dy;

      let boundedY1 = paddle1Y + paddle1dy;
      if (boundedY1 < 0) {
        boundedY1 = 0;
      } else if (boundedY1 > 400) {
        boundedY1 = 400; 
      }
      dispatch({type: "MOVE_PADDLE1", payload: {y: boundedY1}});

      let boundedY2 = paddle2Y + paddle2dy;
      if (boundedY2 < 0) {
        boundedY2 = 0;
      } else if (boundedY2 > 400) {
        boundedY2 = 400; 
      }
      dispatch({type: "MOVE_PADDLE2", payload: {y: boundedY2}});
    }, 10)
    return () => clearTimeout(myTimeout);
  }, [state]);

  useEffect(() => {
    const myTimeout = setTimeout(() => {
      let x = state.ball.x;
      let y = state.ball.y;
      let dx = state.ball.dx;
      let dy = state.ball.dy;

      let paddle1Y = state.paddle1y.y;
      let paddle2Y = state.paddle2y.y;

      const ball = {
        x,
        dx,
        y,
        dy,
        width: 20,
        height: 20
      };

      const walls = [
        // left
        {
          x: -100,
          y: 0,
          width: 100,
          height: 500
        },
        // right
        {
          x: 750,
          y: 0,
          width: 100,
          height: 500
        },
        // top
        {
          x: 0,
          y: -100,
          width: 750,
          height: 100
        },
        // bottom
        {
          x: 0,
          y: 500,
          width: 750,
          height: 100
        }
      ];


      const collisions = [
        ...walls,
        ...state.obstacles,
        {
          y: paddle1Y,
          x: 20,
          height: 100,
          width: 25
        },
        {
          y: paddle2Y,
          x: 705,
          height: 100,
          width: 25
        }
      ].map(ob => {
        return willCollide(ball, ob);
      });

      if (collisions.some(c => c.x)) {
        dx = -dx;
      }

      if (collisions.some(c => c.y)) {
        dy = -dy;
      }

      dispatch({
        type: "MOVE_BALL",
        payload: {
          dx,
          dy,
          x: x + dx,
          y: y + dy
        }
      });

      

    }, 25);
    return () => clearTimeout(myTimeout);
  }, [state.ball]);

    return <GameContext.Provider value={{ state, dispatch }} {...props} />
}