
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
  const [date, setDate] = useState(new Date()); //date state variable, used to fetch games for that date

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
            display = <Home date={date} setDate={setDate} setgame={setGame} setingame={setInGame}/>;
          }
      }
          
    return (
      <div className="App">
      {display}
      
      </div>
    );
}

export default App;
