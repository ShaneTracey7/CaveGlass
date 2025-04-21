
import './App.css';
import React, {useState} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import MobileGame from './components/MobileGame';
import { isMobile } from 'react-device-detect';
import './styles.css';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 
  const test = <p> Testing</p>;
   useEffect(() => { 
  
      setTimeout(() => {test = <div></div>}, 5000) // 10 secs
      }, []);

  let display;
  if (inGame)
  {
    if( isMobile)
    {
      display = <MobileGame game={game} setgame={setGame} setingame={setInGame}/>;
    }
    else
    {
      display = <Game game={game} setgame={setGame} setingame={setInGame}/>;
    }
    
  }
  else
  {
    if( isMobile)
    {
      display = <Home setgame={setGame} setingame={setInGame}/>;
    }
    else
    {
      display = <Home setgame={setGame} setingame={setInGame}/>;
    }
  }

    return (
      <div className="App">
      {display}
      {test}
      </div>
    );
}

export default App;
