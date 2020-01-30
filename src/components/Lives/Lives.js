import React, { useContext } from "react";

import "./Lives.css";
import { GameContext } from "../../state/context";

export default function Lives() {
    const { state } = useContext(GameContext);
    return <div className="lives">Lives Remaining: {state.lives}</div>
}