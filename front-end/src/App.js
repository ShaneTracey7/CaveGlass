
import './App.css';
import React, {useState} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import { isMobile } from 'react-device-detect';
import './styles.css';
import Mobile from './components/Mobile';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 

  let display;
  
  //Different view for mobile and desktop
    if (isMobile)
      {
        display = <Mobile />;
      }
      else
      {
        if(inGame)
          {
            display = <Game game={game} setgame={setGame} setingame={setInGame}/>;
          }
          else
          {
            display = <Home setgame={setGame} setingame={setInGame}/>;
          }
      }
          
    return (
      <div className="App">
      {display}
      
      </div>
    );
}

export default App;
