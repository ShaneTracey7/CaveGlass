
import './App.css';
import React, {useState, useEffect,useRef} from 'react';
import Game from './components/Game';
import Home from './components/Home';
import MobileGame from './components/MobileGame';
import { isMobile } from 'react-device-detect';
import './styles.css';
import axios from 'axios';
import Mobile from './components/Mobile';
import { io } from 'socket.io-client';
import socket from './components/Socket';

function App() {
  
  const [inGame, setInGame] = useState(false); //if true score reaction is displayed,
  const [game, setGame] = useState([]); 
  const [mobileKey, setMobileKey] = useState(""); 
  const mobileKeyRef = useRef(0);
  const [enteredKey, setEnteredKey] = useState(0); 
  const [mobileConnection, setMobileConnection] = useState(false); //maybe should be ref

  const [isRC, setIsRC] = useState(false); 
  const isRCRef = useRef(false); 

   useEffect(() => {    
        isRCRef.current = isRC;    
          
            }, [isRC]);

  let backendUrl = 'https://caveglass.onrender.com';//'http://localhost:8080';// https://caveglass.onrender.com
  

   //emit socket stuff inside of home/game (can't access useStates from app.js(here))
   useEffect(() => { 
      //get key from backend
      if(!isMobile)
      {
        apiGetKey();
        
        
        socket.emit('ping');
        socket.on('pong', () => {
        console.log('Received pong');
    });
        /*
        socket.on('remoteMove', (msg) => {
          //setMessage(msg);
        });*/
      }
      else //is a Mobile device
      {

      }

      

      const handleUnload = () => {
        const data = { type: 'removeKey', key: mobileKeyRef.current };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    
        navigator.sendBeacon(backendUrl + '/key', blob);
        console.log("unloading");
        console.log("mobilekey: " + mobileKey);
      };
    
      

      window.addEventListener('unload', handleUnload);
    
      return () => {
        socket.off('pong');
        socket.disconnect();
        window.removeEventListener('unload', handleUnload);
      };
      }, []);

      useEffect(() => {
        if(!isMobile)
          {
            mobileKeyRef.current = mobileKey;
            if (mobileKeyRef.current != 0 && mobileKeyRef.current != "")
            {
              socket.emit('register', { code: mobileKey}/*mobileKeyRef.current*/); //new
            }
            
          }
      }, [mobileKey]);

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
/*
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
*/

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
        display = <Mobile socket={socket} />;
      }
      else
      {
      
        if( inGame)
          {
            display = <Game setIsRC={setIsRC} isRC={isRC} isRCRef={isRCRef.current} game={game} socket={socket} setgame={setGame} setingame={setInGame}/>;
          }
          else
          {
            display = <Home setIsRC={setIsRC} isRC={isRC} isRCRef={isRCRef.current} mobileKey={mobileKey} socket={socket} setgame={setGame} setingame={setInGame}/>;
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
