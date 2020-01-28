import React from "react";
import "./Ball.css";

export default function Ball({pos}) {

    return <div className="ball" style={{
        top: `${pos.y}px`,
        left: `${pos.x}px`
    }}/>
}