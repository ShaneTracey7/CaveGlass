
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
  const [mobileKey, setMobileKey] = useState("0000"); 
  const [enteredKey, setEnteredKey] = useState(0); 
  const [mobileConnection, setMobileConnection] = useState(false); //maybe should be ref
  let backendUrl = 'https://caveglass.onrender.com';//'http://localhost:8080';// https://caveglass.onrender.com

   useEffect(() => { 
      //get key from backend
      if(!isMobile)
      {
        apiGetKey();
      }
      return () => {
        // This runs on unmount (component disposal)
        if(!isMobile)
          {
            apiRemoveKey();
          }
        console.log('Component is being unmounted');
      };
      }, []);

  const apiGetKey = () => {
    axios.post(backendUrl + '/key', {
        type: 'setKey',
      }, {
        headers: {
        'content-type': 'application/json'
        }}).then((data) => {
          console.log(data);
          
          
          if(!isNaN(data.data.key)) //NEEDS TO BE A NUMBER
          {
            setMobileKey(data.data.key);
            setMobileConnection(false);
          }
          else{
            console.log("not a number");
          }
   })
   console.log("api get key was called");
  }

  const apiRemoveKey = () => {
    axios.post(backendUrl + '/key', {
        type: 'removeKey',
        key: mobileKey,
      }, {
        headers: {
        'content-type': 'application/json'
        }}).then((data) => {
          console.log(data.data.message);
        })
   console.log("api remove key was called");
  }


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
      display = <Mobile/>;
    }
    else
    {
      display = <Home mobileKey={mobileKey} setgame={setGame} setingame={setInGame}/>;
    }
  }

    return (
      <div className="App">
      {/*mobileKey /* only here for testing */}
      {display}
      
      </div>
    );
}

export default App;
