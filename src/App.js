import React, {useEffect, useReducer } from "react";
import "./App.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";
import Brick from "./components/Brick";


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
  bricks: [
    {
      top: 0, left: 300
    },
    { 
      top: 200, left: 400
    },
    {
      top: 390, left: 550
    }
  ]
};


function reducer (state, action) {
  switch (action.type) {
    case "MOVE_PADDLE1":
      return { ...state, paddle1y: action.payload }
    case "MOVE_PADDLE2":
      return { ...state, paddle2y: action.payload }
    case "PADDLE1_SPEED":
      return { ...state, paddle1dy: action.payload }
    case "PADDLE2_SPEED":
      return { ...state, paddle2dy: action.payload }
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

  function willCollide(rect1, rect2) {
    let x = false;
    let y = false;
    let xCurr = false;
    let yCurr = false;
    let collided = false;

    const rect1XNext = rect1.x + rect1.dx;
    const rect1YNext = rect1.y + rect1.dy;

    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x) {
      xCurr = true;
    }
    if (rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      yCurr = true;
    }
    if (
      yCurr &&
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x
    ) {
      x = true;
    }
    if (
      xCurr &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      y = true;
    }
    if (
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      collided = true;
    }
    return { x, y, collided };
  }

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

      // if (x < 5 || x > 700) {
      //   return dispatch({
      //     type: "MOVE_BALL",
      //     payload: {
      //       dx: 5,
      //       dy: 5,
      //       x: 200,
      //       y: 0
      //     }
      //   });
      // }

      // if (x + dx > 750 - 20 || x + dx < 0) {
      //   dx = -dx;
      // }
      // if (y + dy > 500 - 20 || y + dy < 0) {
      //   dy = -dy;
      // }

      // if ((paddle1Y < y+dy && paddle1Y + 100 > y+dy) && x < 45) {
      //   dx = -dx+2;
      // }

      // if ((paddle2Y < y+dy && paddle2Y + 100 > y+dy) && x > 685) {
      //   dx = -(dx+2);
      // }
      
      const wallCollisions = walls.map(wall => {
        return willCollide(ball, wall);
      });

      if (wallCollisions[0].collided || wallCollisions[1].collided) {
        dx = -dx;
      }

      if (wallCollisions[2].collided || wallCollisions[3].collided) {
        dy = -dy;
      }

      const obstacleCols = [
        {
          left: 20,
          top: paddle1Y
        },
        {
          left: 705,
          top: paddle2Y
        },
        ...state.bricks
      ].map(ob => {
        return willCollide(ball, {
          width: 25,
          height: 100,
          x: ob.left,
          y: ob.top
        });
      });

      if (obstacleCols.some(obc => obc.y)) {
        dy = -dy;
      }
      if (obstacleCols.some(obc => obc.x)) {
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
      });

      

    }, 25);
    return () => clearTimeout(myTimeout);
  }, [state.ball]);

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

  const brickList = state.bricks.map((brickObj) => 
    <Brick style={{top: brickObj.top, left: brickObj.left}}/>
  )

  return (
    <div className="container">
      {brickList}
      <Paddle paddleY={state.paddle1y.y}/>
      <Paddle isPlayerTwo paddleY={state.paddle2y.y}/>
      <Ball pos={state.ball}/>
    </div>
  );
}
