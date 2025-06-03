
import './App.css';
import React, {useState, useEffect,useRef} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import MobileGame from './components/MobileGame';
import { isMobile } from 'react-device-detect';
import './styles.css';
import axios from 'axios';
import Mobile from './components/Mobile';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 

  let backendUrl = 'https://caveglass.onrender.com';//'http://localhost:8080';// https://caveglass.onrender.com

  let display;
  /*
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
      display = <Mobile/>;
    }
    else
    {
      display = <Home mobileKey={mobileKey} setgame={setGame} setingame={setInGame}/>;
    }
  }*/

 
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
