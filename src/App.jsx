import { useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";

function App() {
  // const [count, setCount] = useState(0);
  const [gameRun, setGameRun] = useState(false);

  return (
    <div>
      {!gameRun && <StartScreen setGameRun={setGameRun} />}
      {gameRun && <Game />}
    </div>
  );
}

export default App;
