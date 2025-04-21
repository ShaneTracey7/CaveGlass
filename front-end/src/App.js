
import './App.css';
import React, {useState, useEffect,useRef} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import MobileGame from './components/MobileGame';
import { isMobile } from 'react-device-detect';
import './styles.css';
import axios from 'axios';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 
  const [mobileKey, setMobileKey] = useState("0000"); 
  const [enteredKey, setEnteredKey] = useState(0); 
  const [mobileConnection, setMobileConnection] = useState(false); //maybe should be ref
  let backendUrl = 'https://caveglass.onrender.com';//'http://localhost:8080';// https://caveglass.onrender.com

   useEffect(() => { 
      //get key from backend
      apiGetKey();
      }, []);

  const apiGetKey = () => {
    axios.post(backendUrl + '/api/users', {
        type: 'setKey',
      }, {
        headers: {
        'content-type': 'application/json'
        }}).then((data) => {
          console.log(data);
          
          
          if(!isNaN(data.key)) //NEEDS TO BE A NUMBER
          {
            setMobileKey(data.key);
            setMobileConnection(false);
          }
          else{
            console.log("not a number");
          }
   })
   console.log("api get key was called");
}

const apiCheckKey = () => {
  axios.post(backendUrl, {
      type: 'checkKey',
      key: enteredKey,
    }, {
      headers: {
      'content-type': 'application/json'
      }}).then((data) => {
        if(data.data)
        {
          setMobileConnection(true);
        }
 })
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
      display = <Home setgame={setGame} setingame={setInGame}/>;
    }
    else
    {
      display = <Home key={mobileKey} setgame={setGame} setingame={setInGame}/>;
    }
  }

    return (
      <div className="App">
      {mobileKey}
      {display}
      
      </div>
    );
}

export default App;
