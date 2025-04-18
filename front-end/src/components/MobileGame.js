import '../styles.css';
import React, {useState,useEffect,useRef} from 'react';
import upArrowWhite from '../pics/up-arrow-white.png';
import axios from 'axios';

function MobileGame(props) { 
    
    let backendUrl = 'https://caveglass.onrender.com'; //https://caveglass.onrender.com    'https://your-app.onrender.com/api/endpoint'

    const [period, setPeriod] = useState(props.game.periodDescriptor.number); //current period the game is in
    const [homeScore, setHomeScore] = useState(props.game.homeTeam.hasOwnProperty("score") ? props.game.homeTeam.score : 0) //score displayed in scoreboard
    const [awayScore, setAwayScore] = useState(props.game.awayTeam.hasOwnProperty("score") ? props.game.awayTeam.score : 0) //score displayed in scoreboard
    const [gameClock, setGameClock] = useState("") //gameClock
    const [inIntermission, setInIntermission] = useState(false); //if true game is in intermission
    const [isRunningALL, setIsRunningALL] = useState(false);

     useEffect(() => {
    
        getAllData();
    
      }, []);

       useEffect(() => {
      
          if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
          {
              var timer;
              if(props.setingame) //while in game
              {
                  timer = setTimeout(() => getAllData(), 10000) // 10 secs
                  console.log('props.setingame == true');
              }
              else
              {
                console.log('props.setingame == false');
                return () => clearTimeout(timer) //stops api calls (current one will still execute)
              }
          }
      
        }, [isRunningALL]);


        //data will be the string we send from our server
        const getAllData = () => {
            axios.post(backendUrl, {
                type: 'all',
                game: props.game.id,
              }, {
                headers: {
                'content-type': 'application/json'
                }}).then((data) => {
              //this console.log will be in our frontend console
              console.log(data)
        
              setIsRunningALL(!isRunningALL);
              setGameClock(data.data[0].clock.timeRemaining);
              
                if(!data.data[0].clock.inIntermission) //not in intermission
                {
                    //Update scoreboard
                    setPeriod(data.data[0].periodDescriptor.number);

                    if(homeScore != data.data[0].homeTeam.score)
                        {
                            setHomeScore(data.data[0].homeTeam.score);
                        }
                        if(awayScore != data.data[0].awayTeam.score)
                        {
                            setAwayScore(data.data[0].awayTeam.score);
                        }
                }
                else //in intermission
                {
                    console.log("in intermission")
                }
                
                if(inIntermission != data.data[0].clock.inIntermission){
                    setInIntermission(data.data[0].clock.inIntermission);
                }
           })
        }
    
    return (
    <div className='Game'>
         <div id='score-board-retro'> 
                <img id="hide-arrow" className='ha-white' onClick={() => {props.setingame(false)}} src={upArrowWhite} alt="back"/>
                <img className="score-board-logo" src={ props.game.homeTeam.darkLogo} alt={props.game.homeTeam.abbrev}/>
                    <div className='score-board-info'>
                        <p className='score-board-location'>{props.game.homeTeam.placeName.default}</p>
                        <p className='score-board-name'>{props.game.homeTeam.commonName.default}</p>
                        <p className='score-board-score-retro'>{homeScore}</p>
                    </div>
                
                <div className='score-board-info-middle'>
                <p id="game-clock">{(props.game.gameState == 'LIVE' || props.game.gameState == 'CRIT') ? gameClock : (props.game.gameState == 'FUT' ? "20:00" : "00:00")}</p>
                <div className='score-board-period-container-retro'>
                    <p className='score-board-period-label-retro'> Period </p>
                    <p id="score-board-period-retro">{(props.game.gameState == 'LIVE' || props.game.gameState == 'CRIT') ? (inIntermission ? ("int") : period > 3 ? ("OT") : (period)) : (props.game.gameState == 'FUT' ? 1 : (props.game.periodDescriptor.periodType == 'REG' ? "F" : "F/" + props.game.periodDescriptor.periodType))}</p>
                </div>
                </div>
                
                <div className='score-board-info'>
                    <p className='score-board-location'>{props.game.awayTeam.placeName.default}</p>
                    <p className='score-board-name'>{props.game.awayTeam.commonName.default}</p>
                    <p className='score-board-score-retro'>{awayScore}</p>
                </div>
                <img className="score-board-logo" src={props.game.awayTeam.darkLogo} alt={props.game.awayTeam.abbrev}/>
                </div>
    
   
    </div>
  );
}

export default MobileGame;