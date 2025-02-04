import '../styles.css';
import React, {useState,useEffect} from 'react';
import ScoreReaction from './ScoreReaction';
import axios from 'axios';

function Game(props) {
  
  const [score, setScore] = useState(false); //if true score reaction is displayed
  const [infoType, setInfoType] = useState('XXX'); //3 States: Summary(SUM), Box-score(BOX), and Play-by-Play(PBP)
  const [playArr, setPlayArr] = useState([]); //local instance of plays taken from api (for play-by-play view)
  const [roster, setRoster] = useState([]); //set once and used to get names/numbers/pics from api playerIds
  const [isRunning, setIsRunning] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls
  const [period, setPeriod] = useState(props.game.periodDescriptor.number); //current period the game is in
  const [darkMode, setDarkMode] = useState(false); //light and dark mode toggle
  const [homeScore, setHomeScore] = useState(props.game.homeTeam.score) //score displayed in scoreboard
  const [awayScore, setAwayScore] = useState(props.game.awayTeam.score) //score displayed in scoreboard
  const [homeSOG, setHomeSOG] = useState(0) //sOG displayed in scoreboard
  const [awaySOG, setAwaySOG] = useState(0) //sOG displayed in scoreboard
  useEffect(() => {

    if(props.game.gameState == "LIVE") //only have api calls running on interval if game is live
    {
        var timer;
        if(infoType == 'PBP')
        {
        console.log("infoType == 'PBP'");
        timer = setTimeout(() => getPlaybyPlay(), 10000) // 10 secs
        }
        else
        {
        console.log("infoType != 'PBP'");
        return () => clearTimeout(timer) //stops api calls (current one will still execute)
        }
    }

  }, [isRunning]); 

    //data will be the string we send from our server
    const getPlaybyPlay = () => {
        axios.post('http://localhost:8080', {
            type: 'pbp',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          //this console.log will be in our frontend console
          console.log(data)
          //might crash if no games that day
          setRoster(data.data.rosterSpots);
          if(playArr.length == []) //first call
          {
          data.data.plays.forEach(element => {
             let temp = playArr;
             temp.push(element);
             setPlayArr(temp);
        
          });
          setIsRunning(!isRunning);
          setHomeSOG(data.data.homeTeam.sog);
          setAwaySOG(data.data.awayTeam.sog);
          //setPeriod(data.data.periodDescriptor.number);
          console.log("empty")
          }
          else //to be called every 10secs
          {
            
            setIsRunning(!isRunning);
            setPeriod(data.data.periodDescriptor.number);
            
            //Update scoreboard
            //not tested
            if(homeSOG != data.data.homeTeam.sog)
            {
                setHomeSOG(data.data.homeTeam.sog);
            }
            if(awayScore != data.data.awayTeam.sog)
            {
                setAwaySOG(data.data.awayTeam.sog);
            }
            if(homeScore != data.data.homeTeam.score)
            {
                setHomeScore(data.data.homeTeam.score);
            }
            if(awayScore != data.data.awayTeam.score)
            {
                setAwayScore(data.data.awayTeam.score);
            }

            //check difference 
            let apiPlays = data.data.plays;
            let dif = (apiPlays.length) - (playArr.length) + 8;
            console.log("Dif: " + dif);
          /*  if(dif > 0)
            {*/
                console.log("length b4: " + playArr.length);
                //replacing the last 8 plays already in (in case of any updates)
                let te = playArr;
                te.length = (playArr.length - 8);
                setPlayArr(te);
                let startingLength = playArr.length;
                console.log("length aft: " + playArr.length);
                for(let i=0; i < dif; i++)
                {
                    let temp = playArr;
                    temp.push(apiPlays[(startingLength + i )]);
                    setPlayArr(temp);
                    console.log(apiPlays[(startingLength + i )]);
                    console.log("i: " + i)
                    
                }
            //}
            
         }
       })
    }

    const getNFL = () => {
        axios.post('http://localhost:8080', {
            type: 'nfl',
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          //this console.log will be in our frontend console
          console.log(data)
       })
    }

    //idk if i need this quite yet
    /*function getTeamById(id)
    {
        switch(id) {
            case 1:
              return 'BUF';
            case y:
              // code block
              break;
            default:
              // code block
          }
    } */
   /*
    function runApiCalls()
    {
        // your function code here
        console.log("calling api");
        var to = setTimeout(runApiCalls, 10000);
            if(infoType == 'PBP')
            {
                getPlaybyPlay();
                to = setTimeout(runApiCalls, 10000);
            }
            else
            {
                clearTimeout(to);
            }
    }*/

    //formats UTC date into {mm/dd/yyyy}
    function formatDate(date)
    {
      var d = new Date(date);
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();

      return mon + '/' + day + '/' + year;
    }

    function toolbarClick(type)
    {
        if(type == 'SUM')
        {   
            if(infoType != 'SUM')
            {
                setInfoType('SUM');
            }
            console.log('SUM')
        }
        else if(type == 'BOX')
        {
            if(infoType != 'BOX')
            {
                getNFL();
                setInfoType('BOX');
            }
            console.log('BOX')
        }
        else //type == 'PBP'
        {   
            //automatically update by calling api every 10-15 secs and handle the new data(go by difference in length of play array anc check if there are any goals from the new plays retrieved, if so, set the score to true)
            if(infoType != 'PBP')
            {
                setInfoType('PBP');
                getPlaybyPlay();
                setTimeout(() => {
                   // setInfoType('PBP');
                    console.log("Delayed for 1 second.");
                }, 1000);

            }
            console.log('PBP')
        }
    }

    function formatPeriod(num)
    {
        switch(num) {
            case 1:
                return "1st";
            case 2:
                return "2nd";
            case 3:
                return "3rd";
            case 4:
                return "OT";
            case 5:
                return "SO";
            default:
        }
    }

    //capitalizes each word in a sentence(string)
    function capitalizeEachWord(str)
    {
        let newStr = str.charAt(0).toUpperCase();
        let flag = false;
        for (let i = 1; i < str.length; i++) {
            if(str[i] == ' ')
            {   
                flag = true;
                newStr = newStr + str[i];
            }
            else
            {
                if(flag)
                {
                    newStr = newStr + str.charAt(i).toUpperCase();
                    flag = false;
                }
                else
                {
                    newStr = newStr + str[i];
                }
            }
          }
          return newStr;
    }

    
    

  let display;
  let info;
  if (score)
  {
    display = <ScoreReaction scored={setScore}/>;
    info = <p> .</p>
  }
  else
  {
    display = <div id='display'>
        
        <div id='score-board'> 
        <div id='score-board-container'> 
            <img className="score-board-logo" src={ require("../pics/logos/" + String(props.game.homeTeam.abbrev) + ".svg")} alt={props.game.homeTeam.abbrev}/>
                <div className='score-board-info'>
                    <p className='score-board-location'>{props.game.homeTeam.placeName.default}</p>
                    <p className='score-board-name'>{props.game.homeTeam.commonName.default}</p>
                    <p className='score-board-sog'> SOG: {homeSOG}</p>
                </div>
            <p className='score-board-score'>{homeScore}</p>
            <div className='score-board-info'>
            <p id="score-board-period">{props.game.gameState == 'LIVE' ? (period < 4 ? formatPeriod(period) + " Period" : formatPeriod(period)) : (props.game.periodDescriptor.periodType == 'REG' ? "FINAL" : "FINAL/" + props.game.periodDescriptor.periodType)}</p>
                
            <p>{props.game.gameState == 'LIVE' ? "gameclock time" : formatDate(props.game.startTimeUTC)}</p>
            </div>
            <p className='score-board-score'>{awayScore}</p>
            <div className='score-board-info'>
                <p className='score-board-location'>{props.game.awayTeam.placeName.default}</p>
                <p className='score-board-name'>{props.game.awayTeam.commonName.default}</p>
                <p className='score-board-sog'> SOG: {awaySOG}</p>
            </div>
            <img className="score-board-logo" src={ require("../pics/logos/" + String(props.game.awayTeam.abbrev) + ".svg")} alt={props.game.awayTeam.abbrev}/>
        </div>
        </div>
        <div id="toolbar">
            <img id="back-arrow" onClick={() => props.setingame(false)} src={ require("../pics/back-arrow.png")} alt="Back"/>
            <div id="SUM" className={infoType == "SUM" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("SUM")}}>Summary</div>
            <div id="BOX" className={infoType == "BOX" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("BOX")}}>Box Score</div>
            <div id="PBP" className={infoType == "PBP" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("PBP")}}>Play-by-Play</div>
            <div className={darkMode ? 'mode-button-light': 'mode-button-dark'} onClick={() => {setDarkMode(!darkMode)}}>{darkMode ? "Light Mode" : "Dark Mode"}</div>
        </div>
        
    </div> ;

    if(infoType == 'SUM')
    {
        info = <p> no plays</p>
    }
    else if(infoType == 'BOX')
    {
        info = <p> no plays</p>
    }
    else if(infoType == 'PBP')
    {

        let pArr = [];

        playArr.forEach(play => {
            
            if(!play.hasOwnProperty("typeDescKey"))
            {
                //catch weird case
            }
            
            if(play.typeDescKey == 'stoppage' || play.typeDescKey == 'period-start'|| play.typeDescKey == 'period-end'  || play.typeDescKey == 'game-end')
            {
                var desc = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                if(play.typeDescKey == 'stoppage')
                {
                    let reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "Stoppage");
                    desc = capitalizeEachWord(reason);
                }
               let p =  <div className={darkMode ? 'play-card-basic-dark': 'play-card-basic'}>
                            <div className='middle-basic-card'>
                                <img id="whistle-img" src={ darkMode ? (require("../pics/whistle-white.png")): (require("../pics/whistle.png"))} alt="whistle"/> 
                                <p className={darkMode ? 'card-description-basic-dark': 'card-description-basic'}>{desc}</p>
                            </div>
                        </div>; 
                pArr.push(p);
            }
            else if (play.typeDescKey == 'goal')
            {
                let pic;
                let pic2;
                let assistStr;
                let score1;
                let score2;
                
                if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                {
                    pic = props.game.homeTeam.abbrev;
                    score1 = play.details.homeScore;
                    pic2 = props.game.awayTeam.abbrev
                    score2 = play.details.awayScore;
                    
                }
                else
                {
                    pic = props.game.awayTeam.abbrev;
                    score1 = play.details.awayScore;
                    pic2 = props.game.homeTeam.abbrev;
                    score2 = play.details.homeScore;
                }
                if (play.details.hasOwnProperty("assist1PlayerId"))
                {
                    
                    if (play.details.hasOwnProperty("assist2PlayerId"))
                    {
                        let player2 = roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                        let player3 = roster.find(p1 => {return p1.playerId == play.details.assist2PlayerId});
                        assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ") , " + player3.firstName.default + " " + player3.lastName.default + " #" + player3.sweaterNumber + " (" +play.details.assist2PlayerTotal + ")";
                    }
                    else
                    {
                        let player2 = roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                        assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ")";
                    }
                    
                }
                else
                {
                    assistStr = "Unassisted";
                }
                let player1 = roster.find(p1 => {return p1.playerId == play.details.scoringPlayerId});

                let p =  <div className='play-card-goal'>
                            <div id={"color-"+ pic} className='top-goal-card' style={{backgroundImage: "url(" + require('../pics/logos/' + String(pic) + ".svg") + ")"}}>
                                <div className='top-goal-card-container'>
                                    <img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/>
                                    <p className='play-card-goal-score' >{score1}</p>
                                    <div id="goal-light-container">
                                        <img id='goal-light-img' className="play-logo" src={ require("../pics/goal-light.png")} alt={pic}/>
                                        <p>{pic} GOAL</p>
                                    </div>
                                    <p className='play-card-goal-score2'>{score2}</p>
                                    <img id="play-logo-score2" className="play-logo" src={ require("../pics/logos/" + String(pic2) + ".svg")} alt={pic2}/> 
                                </div>
                            </div>
                            <div id={"color-"+ pic} className='bottom-goal-card'>
                                <div className='left-card'>
                                    <p className='time-remaining-text-goal'>{play.timeRemaining}</p>
                                    <p id="goal-period">{formatPeriod(play.periodDescriptor.number)}</p>
                                </div>
                                <img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
                                <div className='right-card'>
                                    <p className='card-description-goal'>{player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " (" + play.details.scoringPlayerTotal + ")"}</p>     
                                    <p className='card-description-assist'>{assistStr}</p>
                                </div>
                            </div>
                        </div>; 
                pArr.push(p);
            }
            else
            {   let description = " ";
                let playType = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                let pic;
                let pic_url;
                if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                {
                    pic = props.game.homeTeam.abbrev;
                    pic_url = darkMode ? props.game.homeTeam.darkLogo : props.game.homeTeam.logo;
                }
                else
                {
                    pic = props.game.awayTeam.abbrev;
                    pic_url = darkMode ? props.game.awayTeam.darkLogo : props.game.awayTeam.logo;
                }
                
                let player1;
                let player2;
                let shotType;
                let reason;
                switch(play.typeDescKey) {
                    case 'faceoff':
                        if (play.details.hasOwnProperty("winningPlayerId") && play.details.hasOwnProperty("losingPlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.winningPlayerId});
                            player2 = roster.find(p1 => {return p1.playerId == play.details.losingPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " face-off won against " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = 'Face-off';
                        }
                        
                        playType = 'Face-off';
                        break;
                    case 'hit':
                        if (play.details.hasOwnProperty("hittingPlayerId") && play.details.hasOwnProperty("hitteePlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.hittingPlayerId});
                            player2 = roster.find(p1 => {return p1.playerId == play.details.hitteePlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " hit " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = 'Hit';
                        }
                            break;
                    case 'shot-on-goal':
                        shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                        if(play.details.hasOwnProperty("shootingPlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                            if(play.details.hasOwnProperty("goalieInNetId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else
                            {
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot";
                            }
                        }
                        else
                        {
                            if(play.details.hasOwnProperty("goalieInNetId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                                description = shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else   
                            {
                                description = shotType + " shot";
                            }
                        }
                        break;
                    case 'missed-shot':
                        reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                        shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                        if(play.details.hasOwnProperty("shootingPlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot " + reason;
                        }
                        else
                        {
                            description = shotType + " shot misses";
                        }
                         break;
                    case 'giveaway':
                        if(play.details.hasOwnProperty("playerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.playerId});
                            description = "Giveaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                        }
                        else
                        {
                            description = "Giveaway";
                        }
                        break;
                    case 'takeaway':
                        if(play.details.hasOwnProperty("playerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.playerId});
                            description = "Takeaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                        }
                        else
                        {
                            description = "Takeaway";
                        }
                        break;
                    case 'penalty':
                        //player1 undefined
                        let penaltyType = (play.details.hasOwnProperty("descKey") ? ("for " + String(play.details.descKey) + " "): "");
                        if (play.details.hasOwnProperty("committedByPlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.committedByPlayerId});
                            if (play.details.hasOwnProperty("drawnByPlayerId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType+ player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else
                            {
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType;
                            }
                        }
                        else
                        {
                            if (play.details.hasOwnProperty("drawnByPlayerId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                                description = play.details.duration+ " minutes "+penaltyType + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else
                            {
                                description = 'Penalty';
                            }
                        }
                        break;
                    case 'delayed-penalty':
                        {
                            description =  "Delayed Penalty";
                        }
                        break;
                    case 'blocked-shot':
                        reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                        if (play.details.hasOwnProperty("shootingPlayerId"))
                        {
                            player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                            if (play.details.hasOwnProperty("blockingPlayerId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            
                            }
                            else
                            {
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                        
                            }
                        }
                        else
                        {
                            if (play.details.hasOwnProperty("blockingPlayerId"))
                            {
                                player2 = roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                                description = "Shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            
                            }
                            else
                            {
                                description = "Shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                            }
                        }
                        break;
                    default:
                  }
                  //<img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
                let p = <div className={darkMode ? 'play-card-dark': 'play-card'}>
                            <div className='left-card'>
                                <p className={darkMode ? 'time-remaining-text-dark': 'time-remaining-text'}>{play.timeRemaining}</p>
                                <p>{formatPeriod(play.periodDescriptor.number)}</p>
                            </div>                              
                            <img className="play-logo" src={pic_url} alt={pic}/> 
                            <div className='right-card'>
                                <p className={darkMode ? 'card-description-dark': 'card-description'}>{playType}</p>     
                                <p className={darkMode ? 'card-description-body-dark': 'card-description-body'}>{description}</p>
                            </div>
                            
                        </div>; 
                pArr.push(p);
            }
                
            });


            let arrlength = playArr.length -1;
            info = <div id='playList-container'>
                <p id="period-indicator">{props.game.gameState == 'LIVE' ? (period < 4 ? formatPeriod(period) + " Period" : formatPeriod(period)) : (props.game.periodDescriptor.periodType == 'REG' ? "FINAL" : "FINAL/" + props.game.periodDescriptor.periodType)}</p>
                <div className='playList'> {playArr.map((play,index) => (
                    <div>{pArr[(arrlength - index)]}</div>
                ))}
                </div>
            </div>;
    }
    else
    {

    }
  }

    return (
      <div className={darkMode ? 'Game-dark': 'Game'}>
      {display}
      {info}
      </div>
    );
}

export default Game;
