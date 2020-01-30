import React, { useContext } from "react";
import Paddle from "./Paddle";
import Ball from "./Ball";
import Obstacle from "./Obstacle";
import Lives from "./Lives";
import { GameContext } from "../state/context";

export default function GameContainer() {
    const { state } = useContext(GameContext);
    console.log(state);
    return (<div className="container">
        {state.obstacles.map(({ type, ...style }) => (
          <Obstacle type={type} style={style} />
        ))}
        <Paddle paddleY={state.paddle1y.y}/>
        <Paddle isPlayerTwo paddleY={state.paddle2y.y}/>
        <Ball pos={state.ball}/>
        <Lives/>
      </div>);
}