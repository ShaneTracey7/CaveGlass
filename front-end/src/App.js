
import './App.css';
import React, {useState} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import './styles.css';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 

  let display;
  if (inGame)
  {
    display = <Game game={game} setgame={setGame} setingame={setInGame}/>;
  }
  else
  {
    display = <Home setgame={setGame} setingame={setInGame}/>;
  }

    return (
      <div className="App">
      {display}
      </div>
    );
}

export default App;
