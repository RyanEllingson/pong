import React from "react";
import "./App.css";
import GameContainer from "./components/GameContainer";

import GameProvider from "./state/context";








export default function App() {

  

  

  

  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}
