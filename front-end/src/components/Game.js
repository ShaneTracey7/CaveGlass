import '../styles.css';
import React, {useState,useEffect,useRef} from 'react';
import ScoreReaction from './ScoreReaction';
import Summary from './Summary';
import axios from 'axios';
import PlayerHighlight from './PlayerHighlight';
import Toggle from './Toggle';
import downArrow from '../pics/down-arrow.svg';
import upArrow from '../pics/up-arrow.svg';
import downArrowWhite from '../pics/down-arrow-white.png';
import upArrowWhite from '../pics/up-arrow-white.png';
import playByPlayLogo from '../pics/play-by-play.png';
import playerFocusLogo from '../pics/player-focus.png';
import summaryLogo from '../pics/summary.png';
import darkModeLogo from '../pics/dark-mode.png';
import lightModeLogo from '../pics/light-mode.png';
import cog from '../pics/cog.svg';
import help from '../pics/help.png';
import redx from '../pics/red-x.png';
import PlayByPlay from './PlayByPlay';

function Game(props) {

  const [playArr, setPlayArr] = useState([]); //local instance of plays taken from api (for play-by-play view)
  
  const [score, setScore] = useState(false); //if true score reaction is displayed
  const [infoType, setInfoType] = useState('XXX'); //3 States: Summary(SUM), Box-score(BOX), and Play-by-Play(PBP)
  const [roster, setRoster] = useState([]); //set once and used to get names/numbers/pics from api playerIds
  const [isRunningPBP, setIsRunningPBP] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls for PBP
  const [isRunningBOX, setIsRunningBOX] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls for BOX (player focus)
  const [isRunningSUM, setIsRunningSUM] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls for SUM
  const [period, setPeriod] = useState(props.game.periodDescriptor.number); //current period the game is in
  const [darkMode, setDarkMode] = useState(false); //light and dark mode toggle
  const [homeScore, setHomeScore] = useState(props.game.homeTeam.hasOwnProperty("score") ? props.game.homeTeam.score : 0) //score displayed in scoreboard
  const [awayScore, setAwayScore] = useState(props.game.awayTeam.hasOwnProperty("score") ? props.game.awayTeam.score : 0) //score displayed in scoreboard
  //const [homeSOG, setHomeSOG] = useState(0) //sOG displayed in scoreboard (not in use with retro scoreboard)
  //const [awaySOG, setAwaySOG] = useState(0) //sOG displayed in scoreboard (not in use with retro scoreboard)
  const [gameClock, setGameClock] = useState("") //gameClock
  const [inIntermission, setInIntermission] = useState(false); //if true game is in intermission
  const [players, setPlayers] = useState([]); //players active inside player focus (each player has format: [playerId, fullname + number, firstname, lastname, number, headshot,teamId, positionCode, stat array])
  const [teamStats, setTeamStats] = useState([]); // team stats active inside player focus (each team stat has format: [teamId, fullname, isHome, stat array])

  const [showToolbar, setShowToolbar] = useState(true) //determines if toolbar should be hidden or not
  const [showScoreBoard, setShowScoreBoard] = useState(true) //determines if scoreboard should be hidden or not
  const [showSettings, setShowSettings] = useState(false); //determines if settings modal should be hidden or not
  const [showHelp, setShowHelp] = useState(false); //determines if help modal should be hidden or not
  const [settings, setSettings] = useState([0,true,props.game.homeTeam.placeName.default]) // format: [<delay>,<goallight (true or false)>, <what team> ]
  const [showForm, setShowForm] = useState(false); //playerForm in playerhightlight
  const [showTeamForm, setShowTeamForm] = useState(false); //teamForm in playerhightlight


  // for settings form
  const [goalLightOn, setGoalLightOn] = useState(true);
  const [delay, setDelay] = useState(settings[0]);
  const [selectedOption, setSelectedOption] = useState(settings[2]);
  const [showOptions, setShowOptions] = useState(false); //shows dropdown team options
  const [statOptionsState, setStatOptionsState] = useState([props.game.homeTeam,props.game.awayTeam,"Both"]); //keeps track of what teams to show as options (preventing users select same teams multiple times)

  const [scoreReactionData, setScoreReactionData] = useState([]); // format: [<team object>, <player object>] needed to pass to scpore reaction component
  
  //const [playerByGameStats, setPlayerByGameStats] = useState([]) //

  const [statInfo,setStatInfo] = useState([]) // an array that gets data from api for playerhighlight format: [playerByGameStats,  teamGameStats]
  const goalCount = useRef(0); //to keep track if there has been a change in score, leading to triggering of score reaction

  useEffect(() => {

    /*if(props.game.gameState == "LIVE")
    {*/
        goalCount.current = props.game.homeTeam.score + props.game.awayTeam.score;
   // }

  }, []); 

  useEffect(() => {

    if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
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

  }, [isRunningPBP]); 

  //need to test during live game
  useEffect(() => {

    if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
    {
        var timer;
        if(infoType == 'BOX')
        {
        console.log("infoType == 'BOX'");
        timer = setTimeout(() => getPlayerFocus(), 10000) // 10 secs
        }
        else
        {
        console.log("infoType != 'BOX'");
        return () => clearTimeout(timer) //stops api calls (current one will still execute)
        }
    }

  }, [isRunningBOX]); 

//need to test during live game
  useEffect(() => {

    if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
    {
        var timer;
        if(infoType == 'SUM')
        {
        console.log("infoType == 'SUM'");
        timer = setTimeout(() => getSummary(), 10000) // 10 secs
        }
        else
        {
        console.log("infoType != 'SUM'");
        return () => clearTimeout(timer) //stops api calls (current one will still execute)
        }
    }

  }, [isRunningSUM]);

  const setRosterAPI = () => {
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
      setRoster(data.data[0].rosterSpots);

    })};

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
          setRoster(data.data[0].rosterSpots);
          if(playArr.length == []) //first call
          {
            let temp = [...playArr];
          data.data[0].plays.forEach(element => {
             //let temp = playArr;
             temp.push(element);
             //setPlayArr(temp);
        
          });
          setPlayArr(temp);

          setIsRunningPBP(!isRunningPBP);
          setGameClock(data.data[0].clock.timeRemaining);
          setInIntermission(data.data[0].clock.inIntermission);
          console.log("empty")
          }
          else //to be called every 10secs
          {
            
            setIsRunningPBP(!isRunningPBP);
            setPeriod(data.data[0].periodDescriptor.number);
            setGameClock(data.data[0].clock.timeRemaining);
            setInIntermission(data.data[0].clock.inIntermission);
            //Update scoreboard

            //check if more goals have been scored
            if(goalCount.current != (data.data[1].homeTeam.score + data.data[1].awayTeam.score)) //a goal has been scored
            {
                console.log("goalCount.current: " + goalCount.current + " sum: " + (data.data[1].homeTeam.score + data.data[1].awayTeam.score));
                goalCount.current = data.data[1].homeTeam.score + data.data[1].awayTeam.score;

                
                //get team and player data of who scored
                let endpoint = data.data[1].summary.scoring[data.data[1].periodDescriptor.number - 1].goals.reverse()[0];//should be last(most recent goal of period)
                let team = endpoint.isHome ? props.game.homeTeam : props.game.awayTeam;
                let player = roster.find(p1 => {return p1.playerId == endpoint.playerId});

                if(settings[1] && (settings[2] == "Both" ||settings[2] == team.placeName.default ))
                {
                    setScoreReactionData([team,player]);
                    setScore(true);
                }
            }

            //not tested
            /*
            if(homeSOG != data.data.homeTeam.sog)
            {
                setHomeSOG(data.data.homeTeam.sog);
            }
            if(awaySOG != data.data.awayTeam.sog)
            {
                setAwaySOG(data.data.awayTeam.sog);
            }*/
            if(homeScore != data.data[0].homeTeam.score)
            {
                setHomeScore(data.data[0].homeTeam.score);
            }
            if(awayScore != data.data[0].awayTeam.score)
            {
                setAwayScore(data.data[0].awayTeam.score);
            }

            //check difference 
            let apiPlays = data.data[0].plays;
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
/*
    const getNFL = () => {
        axios.post('http://localhost:8080', {
            type: 'test',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          //this console.log will be in our frontend console
          console.log(data)
       })
    }*/

    //gets boxscore
    const getPlayerFocus = () => {
        axios.post('http://localhost:8080', {
            type: 'box',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          //this console.log will be in our frontend console
          console.log(data)
    
            //data.data.playerByGameStats => (homeTeam,AwayTeam) => (defense[],forwards[],goalies[]) => get player by playerID => (all the stats)
          //setRoster(data.data.rosterSpots); // not accessible through boxscore
          if(roster.length == []) //first call
          {
            //set roster (necessary to add player to player focus)
            setRosterAPI();
            
            if(statInfo != [data.data[0].playerByGameStats,data.data[1].summary.teamGameStats])
            {
                setStatInfo([data.data[0].playerByGameStats,data.data[1].summary.teamGameStats]);
            }
            setIsRunningBOX(!isRunningBOX);
            setGameClock(data.data[0].clock.timeRemaining);
            setInIntermission(data.data[0].clock.inIntermission);
            console.log("no roster")
          }
          else //to be called every 10secs
          {
            
            if(statInfo != [data.data[0].playerByGameStats,data.data[1].summary.teamGameStats])
                {
                    setStatInfo([data.data[0].playerByGameStats,data.data[1].summary.teamGameStats]);
                }

            setIsRunningBOX(!isRunningBOX);
            //Update scoreboard
            setPeriod(data.data[0].periodDescriptor.number);
            setGameClock(data.data[0].clock.timeRemaining);
            setInIntermission(data.data[0].clock.inIntermission);
            

            //check if more goals have been scored
            if(goalCount.current != (data.data[1].homeTeam.score + data.data[1].awayTeam.score)) //a goal has been scored
            {
                console.log("goalCount.current: " + goalCount.current + " sum: " + (data.data[1].homeTeam.score + data.data[1].awayTeam.score));
                goalCount.current = data.data[1].homeTeam.score + data.data[1].awayTeam.score;

                //get team and player data of who scored
                let endpoint = data.data[1].summary.scoring[data.data[1].periodDescriptor.number - 1].goals.reverse()[0];//should be last(most recent goal of period)
                let team = endpoint.isHome ? props.game.homeTeam : props.game.awayTeam;
                let player = roster.find(p1 => {return p1.playerId == endpoint.playerId});
                
                if(settings[1] && (settings[2] == "Both" ||settings[2] == team.placeName.default ))
                {
                    setScoreReactionData([team,player]);
                    setScore(true);
                }
                
            }

            //not tested
            if(homeScore != data.data[0].homeTeam.score)
            {
                setHomeScore(data.data[0].homeTeam.score);
            }
            if(awayScore != data.data[0].awayTeam.score)
            {
                setAwayScore(data.data[0].awayTeam.score);
            }
          }

       })
    }

      //gets summary
      const getSummary = () => {
        axios.post('http://localhost:8080', {
            type: 'sum',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          
          console.log(data)
          if(roster.length == []) //first call
          {
            //set roster (necessary to add player to player focus)
            setRosterAPI();
            
            if(statInfo[1] != [data.data.summary.teamGameStats])
            {
                setStatInfo([statInfo[0],data.data.summary.teamGameStats]);
            }
            setIsRunningSUM(!isRunningSUM);
            setGameClock(data.data.clock.timeRemaining);
            setInIntermission(data.data.clock.inIntermission);
            console.log("no roster")
          }
          else //to be called every 10secs
          {
            
            if(statInfo[1] != [data.data.summary.teamGameStats])
            {
                //may need to do the force update here [...name]
                setStatInfo([statInfo[0],data.data.summary.teamGameStats]);
            }

            setIsRunningSUM(!isRunningSUM);
            //Update scoreboard
            setPeriod(data.data.periodDescriptor.number);
            setGameClock(data.data.clock.timeRemaining);
            setInIntermission(data.data.clock.inIntermission);
            
            //check if more goals have been scored
            if(goalCount.current != (data.data.homeTeam.score + data.data.awayTeam.score)) //a goal has been scored
            {
                goalCount.current = data.data.homeTeam.score + data.data.awayTeam.score;

                //get team and player data of who scored
                let endpoint = data.data.summary.scoring[data.data.periodDescriptor.number - 1].goals.reverse()[0];//should be last(most recent goal of period)
                let team = endpoint.isHome ? props.game.homeTeam : props.game.awayTeam;
                let player = roster.find(p1 => {return p1.playerId == endpoint.playerId});
                
                if(settings[1] && (settings[2] == "Both" ||settings[2] == team.placeName.default ))
                {
                    setScoreReactionData([team,player]);
                    setScore(true);
                }
            }

            //not tested
            if(homeScore != data.data.homeTeam.score)
            {
                setHomeScore(data.data.homeTeam.score);
            }
            if(awayScore != data.data.awayTeam.score)
            {
                setAwayScore(data.data.awayTeam.score);
            }
          }

       })
    }

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

    //formats UTC date into {mm/dd/yyyy} (not currently in use)
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
                getSummary();
                /*setTimeout(() => {
                    
                     console.log("Delayed for 1 second.");
                 }, 1000);*/
                
            }
            console.log('SUM')
        }
        else if(type == 'BOX')
        {
            if(infoType != 'BOX')
            {
                setInfoType('BOX');
                getPlayerFocus();
                console.log('called box')
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
               /* setTimeout(() => {
                   // setInfoType('PBP');
                    console.log("Delayed for 1 second.");
                }, 1000);*/

            }
            console.log('PBP')
        }
    }

    function handleModalShow(type)
    {
        if(type == 'settings')
        {
            setShowSettings(true);
            setShowHelp(false);
            setShowForm(false);
            setShowTeamForm(false);
        }
        else if(type == 'help')
        {
            setShowSettings(false);
            setShowHelp(true);
            setShowForm(false);
            setShowTeamForm(false);
        }
    }

    function exitSettings()
    {
        setDelay(settings[0]);
        setSelectedOption(settings[2]);
        setGoalLightOn(settings[1]);
        setShowSettings(false);
    }
    function updateSettings()
    {
        setSettings([delay,goalLightOn,selectedOption]);
        setShowSettings(false);
    }
    
    function teamOptionClick(name)
    {   
        setSelectedOption(name);
        setShowOptions(false);
        
    }
    
    function testScore()
    {
        setScore(true);
    }

  let display;
  let info;
  let toolbar;
  let scoreboard;
  let settingsForm;
  let helpModal;
  if (score) // if goalight is on or not
  {
    settingsForm = <div></div>; //team={scoreReactionData[0]} player={scoreReactionData[1]}
    helpModal = <div></div>;
    display = <ScoreReaction scored={setScore} team={scoreReactionData[0]} player={scoreReactionData[1]}/>;
    info = <p> .</p>
    
  }
  else
  {    
        const teamOptions = [];
        for (let i = 0; i < statOptionsState.length; i++) 
        {
            if(statOptionsState[i] == "Both")
            {
                teamOptions.push( <li class="player-option" onClick={() => {teamOptionClick("Both")}} key={i} ><p class='player-option-text'>Both</p></li>);
            }
            else
            {
                teamOptions.push( <li class="player-option" onClick={() => {teamOptionClick(statOptionsState[i].placeName.default)}} key={i} ><p class='player-option-text'>{statOptionsState[i].placeName.default + " " + statOptionsState[i].commonName.default}</p><img className='player-option-img' src={statOptionsState[i].logo} alt=""/></li>);
            }
        } 

    settingsForm = <form className='player-form' style={{display: showSettings ? "flex": "none"}}>
            <img id="player-form-cancel" onClick={exitSettings} src={redx} alt="exit"/>
            
            <div id="form-element">
                <label><b>Stream Delay</b> (in seconds):
                    <input class="line-input" id="settings-input" type='number' value={delay} min={0} max={180} onChange={(e) => {setDelay(e.target.value)}} /> 
                </label>
            </div>
            <div id="form-element"> {/* this toggle state is causing issues */}
                <Toggle state={[goalLightOn,setGoalLightOn]} type="settings" size='big'></Toggle>
            </div>
                
                <div class="setting-select-container" style={{display: goalLightOn ? "flex": "none"}}>
                    <p id="pss-settings-label"> Triggering Team: </p>
                    <div class="player-select-selected" id="pss-settings" onClick={() => {setShowOptions(true)}} > {selectedOption}</div>
                    <div class="player-select" style={{display: showOptions ? "block": "none"}}>
                        {teamOptions}
                    </div>
                </div>
            
            <div id="player-form-add" onClick={updateSettings}>Save Changes</div> 
        </form>;

    helpModal = <div className='player-form' style={{display: showHelp ? "flex": "none"}}>
                    <img id="player-form-cancel" onClick={() => {setShowHelp(false)}} src={redx} alt="exit"/>
                    <div className='help-content'>
                        <h1 className='help-subtitle'>FAQ's</h1>
                        <div className='help-question'>How to adjust for a stream delay?</div>
                        <div className='help-answer'>If your stream is ahead, there isn't anything that can be done, but if it's behind follow the steps below:</div>
                        <ul className='help-list'>
                            <li>Click the <img id="help-icons" src={cog} alt="cog"/>  icon on the toolbar to open the settings modal</li>
                            <li>Click the Delay Test button &#40; This will return to you the current time on the game clock &#41;</li>
                            <li>Enter the difference between the game clock on your stream and the return value into the Stream Delay text field</li>
                            <li>Finish by hitting the Save button</li>
                        </ul>
                        <div className='help-question'>Why can't I click on some of the games?</div>
                        <div className='help-answer'>If nothing happens when you click on a game listed on the home page, it's because it hasn't started yet.</div>
                        <div className='help-question'>Why does game clock run inbetween periods?</div>
                        <div className='help-answer'>The game clock is displaying the amount of time left in intermission and the period will be set to 'INT'.</div>
                        <div className='help-question'>Why can I only see the toolbar and scoreboard?</div>
                        <div className='help-answer'>Once you click on the game you want to follow on the home page, you will be directed to the game page. There you will have to select 1 of the 3 viewing modes &#40; Summary, Player Focus, and Play By Play &#41; on the toolbar to start tracking the game.</div>
                        <div className='help-question'>How often does CaveGlass update?</div>
                        <div className='help-answer'>While inside of a live game and in a selected mode, CaveGlass will update data every 10 seconds.</div>
                        
                        <h1 className='help-subtitle'>Tips</h1>
                        <ul className='help-list'>
                            <li>You can hide/show the toolbar and scoreboard by clicking the <img id="help-icons" src={upArrow} alt="arrow"/> or <img id="help-icons" src={downArrow} alt="arrow"/> icons in the top right corner</li>
                            <li>If your window is wider than 1400px, you can increase size of the scoreboard by dragging the bottom right corner</li>
                            <li>You can resize the player cards and the team cards within Player Focus mode by dragging the bottom right corner</li>
                            <li>You can change the background of the screen to black &#40; preferred mode  when you click the Dark Mode button </li>
                            <li>CaveGlass is meant to be used in full screen with the browser's toolbar hidden, you can adjust this in your browser's view settings</li>
                            <li>You can set the score reaction &#40; view that pops up when there is a goal &#41; to only fire based off the team you are rooting for in settings</li>
                        </ul>
                    </div>
                </div>;

    /*
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
            <p id="score-board-period">{props.game.gameState == 'LIVE' ? (period < 4 ? formatPeriod(period) + " Period" : formatPeriod(period)) : (props.game.gameState == 'FUT' ? formatPeriod(1) + " Period" : (props.game.periodDescriptor.periodType == 'REG' ? "FINAL" : "FINAL/" + props.game.periodDescriptor.periodType))}</p>
            <p>{props.game.gameState == 'LIVE' ? gameClock : (props.game.gameState == 'FUT' ? "20:00" : formatDate(props.game.startTimeUTC))}</p>
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
        */
    if(showToolbar)
    {
        toolbar = <div id="toolbar" style={{backgroundImage: "url(" + require('../pics/boards.png') + ")"}}>
                <img id="back-arrow" onClick={() => props.setingame(false)} src={ require("../pics/back-arrow.png")} alt="Back"/>
                <img className="cg-logo-small" onClick={testScore} src={ darkMode ? (require("../pics/cg-logo-small-dark.png")) : (require("../pics/cg-logo-small.png"))} alt="CaveGlass"/>
                <div id='toolbar-button-group' >
                    <div id="SUM" className={infoType == "SUM" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("SUM")}} style={infoType == "SUM" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} }><img style={infoType == "SUM" ? {display: 'none'}: {display: 'flex'} } className='toolbar-logo' src={summaryLogo} alt="summary"/></div>
                    <div id="BOX" className={infoType == "BOX" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("BOX")}} style={infoType == "BOX" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} } ><img style={infoType == "BOX" ? {display: 'none'}: {display: 'flex'} } className='toolbar-logo' src={playerFocusLogo} alt="player focus"/></div>
                    <div id="PBP" className={infoType == "PBP" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("PBP")}} style={infoType == "PBP" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} }><img style={infoType == "PBP" ? {display: 'none'}: {display: 'flex'} }className='toolbar-logo' src={playByPlayLogo} alt="play-by-play"/></div>
                </div>
                <img class="mode-button-img" onClick={() => {setDarkMode(!darkMode)}} src={darkMode ? lightModeLogo : darkModeLogo} alt={darkMode ? 'Light Mode' : 'Dark Mode'}/>
                <img class="mode-button-img" id="toolbar-help" onClick={() => {handleModalShow('help')}} src={help}  disabled={(showHelp) ?  true : false} alt='help'/>
                <img class="mode-button-img" id="settings-cog" onClick={() => {handleModalShow('settings')}} src={cog}  disabled={(showSettings) ?  true : false} alt='settings'/>
               <img id="hide-arrow" onClick={() => {setShowToolbar(false)}} src={upArrow} alt="hide"/>
            </div>
    }
    else
    {
        toolbar = <div id="toolbar-hidden" style={{backgroundImage: "url(" + require('../pics/boards.png') + ")"}}>
            <img id="show-arrow" onClick={() => {setShowToolbar(true)}} src={downArrow} alt="show"/>
        </div>
    }

    if(showScoreBoard)
    {
        scoreboard = <div id='score-board-retro'> 
        
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
        <img id="hide-arrow" className='ha-white' onClick={() => {setShowScoreBoard(false)}} src={upArrowWhite} alt="hide"/>
        </div>
    }
    else
    {
        scoreboard = <div id='score-board-retro-hidden'>
            <img id="show-arrow" className='ha-white' onClick={() => {setShowScoreBoard(true)}} src={downArrowWhite} alt="show"/>
        </div>
    }
    display = <div id='display'>
        {scoreboard}
        {toolbar}
    </div> ;

    if(infoType == 'SUM')
    {
        //might need to delay this call
        info = <Summary teamGameStats={statInfo} darkMode={darkMode} teamsInfo={[props.game.homeTeam,props.game.awayTeam]}> </Summary>;
    }
    else if(infoType == 'BOX')
    {
        info = <PlayerHighlight scores={[homeScore,awayScore]} statInfo={statInfo} roster={roster} players={[players,setPlayers]} teamStats={[teamStats,setTeamStats]} teamsInfo={[props.game.homeTeam,props.game.awayTeam]} darkMode={darkMode} setShowHelp={setShowHelp} setShowSettings={setShowSettings} show={[showForm,setShowForm]} showTeam={[showTeamForm,setShowTeamForm]}></PlayerHighlight>;

    }
    else if(infoType == 'PBP')
    {
        info = <PlayByPlay playArr={playArr} game={props.game} darkMode={darkMode} roster={roster} period={period} totalGoals={homeScore+awayScore}></PlayByPlay>;

        /*
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
                let pic_url;
                let pic2;
                let pic2_url;
                let assistStr;
                let score1;
                let score2;
                
                if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                {
                    pic = props.game.homeTeam.abbrev;
                    pic_url = props.game.homeTeam.darkLogo;
                    score1 = play.details.homeScore;
                    pic2 = props.game.awayTeam.abbrev
                    pic2_url = props.game.awayTeam.darkLogo;
                    score2 = play.details.awayScore;
                    
                }
                else
                {
                    pic = props.game.awayTeam.abbrev;
                    pic_url = props.game.awayTeam.darkLogo;
                    score1 = play.details.awayScore;
                    pic2 = props.game.homeTeam.abbrev;
                    pic2_url = props.game.homeTeam.darkLogo;
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
                            <div id={"color-"+ pic} className='top-goal-card' style={{backgroundImage: "url(" + pic_url + ")"}}>
                                <div className='top-goal-card-container'>
                                    <img className="play-logo" src={pic_url} alt={pic}/>
                                    <p className='play-card-goal-score' >{score1}</p>
                                    <div id="goal-light-container">
                                        <img id='goal-light-img' className="play-logo" src={ require("../pics/goal-light.png")} alt={pic}/>
                                        <p>{pic} GOAL</p>
                                    </div>
                                    <p className='play-card-goal-score2'>{score2}</p>
                                    <img id="play-logo-score2" className="play-logo" src={ pic2_url} alt={pic2}/> 
                                </div>
                            </div>
                            <div id={"color-"+ pic} className='bottom-goal-card'>
                                <div className='left-card'>
                                    <p className='time-remaining-text-goal'>{play.timeRemaining}</p>
                                    <p id="goal-period">{formatPeriod(play.periodDescriptor.number)}</p>
                                </div>
                                <img className="play-logo" src={player1.headshot} alt={pic}/> 
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
            </div>;*/
    }
    else
    {

    }
  }

 let customSelects = document.querySelectorAll('.setting-select-container');

// Attach click event listeners to each custom select
customSelects.forEach(function (select) {
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowOptions(false);
        }
    });
});

    return (
      <div className={darkMode ? 'Game-dark': 'Game'}>
      {settingsForm}
      {helpModal}
      {display}
      {info}
      </div>
    );
}

export default Game;
