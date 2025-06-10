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
import replayIcon from '../pics/replay.svg';
import PlayByPlay from './PlayByPlay';

function Game(props) {

 let backendUrl = "https://caveglass.onrender.com";   //'http://localhost:8080'; //https://caveglass.onrender.com     

 const replayEndpoint = "https://players.brightcove.net/6415718365001/D3UCGynRWU_default/index.html?videoId=";
                

    
  const [playArr, setPlayArr] = useState([]); //local instance of plays taken from api (for play-by-play view)
  
  const [score, setScore] = useState(false); //if true score reaction is displayed
  const [infoType, setInfoType] = useState('XXX'); //3 States: Summary(SUM), Box-score(BOX), and Play-by-Play(PBP)
  
  const roster = useRef([]);

  const [isRunningALL, setIsRunningALL] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls for ALL
  const [isRunningALLDelay, setIsRunningALLDelay] = useState(false); //just a toggle (true or false doesn't mean anything) to trigger useEffect into continuing api calls for ALL Delay
  const [period, setPeriod] = useState(props.game.periodDescriptor.number); //current period the game is in
  const [darkMode, setDarkMode] = useState(false); //light and dark mode toggle
  const [homeScore, setHomeScore] = useState(props.game.homeTeam.hasOwnProperty("score") ? props.game.homeTeam.score : 0) //score displayed in scoreboard
  const [awayScore, setAwayScore] = useState(props.game.awayTeam.hasOwnProperty("score") ? props.game.awayTeam.score : 0) //score displayed in scoreboard
  
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
  
    //for replay
  const [showReplay, setShowReplay] = useState(false); //to display a fullscreen goal replay
  const replayID = useRef(0); //need to complete url of replay vid (can get from nhl goal sharing url)
  const replayEndpoints = useRef([]); //array of array // [endpoint,team,player,period] for the goal in which the replay is for
  const firstReplayCall = useRef(true); //a flag so replays can be set when appropriote
  const [replayInfo, setReplayInfo] = useState([]); //array of info [replayID,team,player,scoreInfo, gtd] for replay cards (goals that have the replay)
  const [showReplayNotification, setShowReplayNotifcation] = useState(false); //to notify user that a goal replay has become available
  const replayNotificationInfo = useRef([]);

  // for settings form
  const [goalLightOn, setGoalLightOn] = useState(true);
  const [delay, setDelay] = useState(settings[0]);
  const [selectedOption, setSelectedOption] = useState(settings[2]);
  const [showOptions, setShowOptions] = useState(false); //shows dropdown team options
  const [statOptionsState, setStatOptionsState] = useState([props.game.homeTeam,props.game.awayTeam,"Both"]); //keeps track of what teams to show as options (preventing users select same teams multiple times)

  const [scoreReactionData, setScoreReactionData] = useState([]); // format: [<team object>, <player object>] needed to pass to scpore reaction component

  const [statInfo,setStatInfo] = useState([]); // an array that gets data from api for playerhighlight format: [playerByGameStats,  teamGameStats]
  const goalCount = useRef(0); //to keep track if there has been a change in score, leading to triggering of score reaction
  const [gameClockPing,setGameClockPing] = useState(""); //used to get value of game clock from ping api call

  const delayArrCount = useRef(0); //to keep track where in array allDataArr 
  const setDelayArrCount = useRef(0); //to keep track where in array allDataArr when setting ui
  const allDataArr = useRef([]); //array of nhl api instances needed for when delay is in use

  useEffect(() => {

    /*if(props.game.gameState == "LIVE")
    {*/
        goalCount.current = props.game.homeTeam.score + props.game.awayTeam.score;
        setInfoType('SUM');
        getAllData();
   // }

  }, []);

  useEffect(() => {

    if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
    {
        var timer;//could cause issues with only 1 timer var  with 2 options
        if(infoType != 'XXX')
        {
            if(settings[0] > 0) //there is a delay
            {
                timer = setTimeout(() => getAllDataDelay(), 10000) // 10 secs
            }
            else
            {
                timer = setTimeout(() => getAllData(), 10000) // 10 secs
            }
            console.log("infoType != 'XXX'");
        }
        else
        {
        console.log("infoType == 'XXX'");
        return () => clearTimeout(timer) //stops api calls (current one will still execute)
        }
    }

  }, [isRunningALL]);

  useEffect(() => {

    if(props.game.gameState == "LIVE" || props.game.gameState == "CRIT") //only have api calls running on interval if game is live
    {
        var timer;
        if(infoType != 'XXX')
        {
            
            timer = setTimeout(() => setDelayAllData(), 10000) // 10 secs   
            console.log("infoType != 'XXX'");
        }
        else
        {
        console.log("infoType == 'XXX'");
        return () => clearTimeout(timer) //stops api calls (current one will still execute)
        }
    }

  }, [isRunningALLDelay]);


function setDelayAllData()
{
    //set values based off allDataArr
    let index = setDelayArrCount.current % (Math.floor(settings[0]/10) + 1);
    let data = allDataArr.current[index];
    

    setIsRunningALLDelay(!isRunningALLDelay);
    setGameClock(data[0].clock.timeRemaining);
    if(!data[0].clock.inIntermission) //not in intermission
    {
        setPeriod(data[0].periodDescriptor.number);

        //check if more goals have been scored
        if(goalCount.current != (data[1].homeTeam.score + data[1].awayTeam.score)) //a goal has been scored
        {
            console.log("goalCount.current: " + goalCount.current + " sum: " + (data[1].homeTeam.score + data[1].awayTeam.score));
            goalCount.current = data[1].homeTeam.score + data[1].awayTeam.score;

        
            //get team and player data of who scored
            let endpoint = data[1].summary.scoring[data[1].periodDescriptor.number - 1].goals.reverse()[0];//should be last(most recent goal of period)
            let team = endpoint.isHome ? props.game.homeTeam : props.game.awayTeam;
            let player = roster.current.find(p1 => {return p1.playerId == endpoint.playerId});
            let period = data.data[1].periodDescriptor.number;

            if(settings[1] && (settings[2] == "Both" ||settings[2] == team.placeName.default ))
            {
                setScoreReactionData([team,player]);
                setScore(true);
            }

            //add endpoint to replayEndpoints
            let tempArr = replayEndpoints.current;
            tempArr.push([endpoint, team, player,period]);
            replayEndpoints.current = tempArr;
        }
            //hasn't been tested yet
            if(replayEndpoints.current.length > replayInfo.length) //at least 1 goal has scored but hasn't recieved replay url
            {   
                let tempArr = [...replayInfo];
                let dif = replayEndpoints.current.length - replayInfo.length; //how many goals have been scored that havent recieved replay url
                for(let i = 0; i < dif; i++) //need loop because 2 goals can be scored within like 2 mins and it can take up to 5 mins for a goal replay to load
                {
                    let currentReplay = data[1].summary.scoring[data[1].periodDescriptor.number - 1].goals.reverse()[(dif - i - 1)];
                    if(!(replayEndpoints.current[replayEndpoints.current.length - (dif - i)][0].highlightClip.hasOwnProperty("highlightClip")) && currentReplay.hasOwnProperty("highlightClip")) //if endpoint is there, but no replay
                    {
                        let endpoint = replayEndpoints.current[replayEndpoints.current.length - (dif - i)];
                        //add to replay Info
                        let period = endpoint[3];
                        let goal = endpoint[0];                                                                                                                                             //could be an issue
                        let scoreInfo =  props.game.homeTeam.abbrev + " " + goal.homeScore + "- " + props.game.awayTeam.abbrev + " " + goal.awayScore + " (" + goal.timeInPeriod + " • " + periodFormat(period.periodDescriptor.number)+ ")";
                        
                        //add to array
                        tempArr.push([goal.highlightClip, endpoint[1], endpoint[2], scoreInfo, goal.goalsToDate]); // [replayID,team,player, scoreInfo,gtd]
                        console.log("replay: " +goal.highlightClip + " " + endpoint[1]+ " " + endpoint[2]+ " " + scoreInfo + " " + goal.goalsToDate);

                        //set off replay notifcation
                        replayNotificationInfo.current = [goal.highlightClip, endpoint[1], endpoint[2], scoreInfo, goal.goalsToDate];
                        
                        setShowReplayNotifcation(true);
                        setTimeout(() => setShowReplayNotifcation(false), 7000); 
            
                    }
                
                }
                //set to arr
                setReplayInfo(tempArr);
            }
        
        //Update scoreboard
        if(homeScore != data[0].homeTeam.score)
            {
                setHomeScore(data[0].homeTeam.score);
            }
            if(awayScore != data[0].awayTeam.score)
            {
                setAwayScore(data[0].awayTeam.score);
            }
        
        //update summary & player focus
        if(statInfo != [data[2].playerByGameStats,data[1].summary.teamGameStats])
        {
            setStatInfo([data[2].playerByGameStats,data[1].summary.teamGameStats]);
        }

        //update playbyplay
        let apiPlays = data[0].plays;
        setPlayArr(apiPlays);
    }
    else //in intermission
    {
        console.log("in intermission")
    }
    
    if(inIntermission != data[0].clock.inIntermission){
        setInIntermission(data[0].clock.inIntermission);
    }

    setDelayArrCount.current = setDelayArrCount.current + 1;
}

//data will be the string we send from our server
const getAllDataDelay = () => {
    axios.post(backendUrl, {
        type: 'all',
        game: props.game.id,
      }, {
        headers: {
        'content-type': 'application/json'
        }}).then((data) => {
      //this console.log will be in our frontend console
        console.log(data);
        let temp = [...allDataArr.current];
        if(allDataArr.current.length < (Math.floor(settings[0]/10) + 1)) //array not fully populated
        {
            temp.push(data.data);
        }
        else //array fully populated
        {
            let index = delayArrCount.current % (Math.floor(settings[0]/10) + 1);
            temp[index] = data.data;
        }
        delayArrCount.current = delayArrCount.current + 1;
        allDataArr.current = temp; 
        setIsRunningALL(!isRunningALL);
   })
}
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

    //wait delay length before it sets useStates
    if(roster.current.length == []) //first call
    {
      roster.current = data.data[0].rosterSpots;
      
      if(statInfo != [data.data[2].playerByGameStats,data.data[1].summary.teamGameStats])
      {
          setStatInfo([data.data[2].playerByGameStats,data.data[1].summary.teamGameStats]);
      }

      let temp = [...playArr];
      data.data[0].plays.forEach(element => {
         temp.push(element);
      });
      setPlayArr(temp);

      setIsRunningALL(!isRunningALL);
      setGameClock(data.data[0].clock.timeRemaining);
      setInIntermission(data.data[0].clock.inIntermission);

      //replay info
      if(firstReplayCall.current) //add replay info
      {
          //get all replay data
          let tempReplay = [];
          let replayEndpoint = data.data[1].summary.scoring;

          replayEndpoint.forEach(period => {

              period.goals.forEach(goal => {

                  //get team data
                  let team = goal.isHome ? props.game.homeTeam : props.game.awayTeam;
                  //get player data
                  let player = roster.current.find(p => {return p.playerId == goal.playerId}); //can't work because roster is empty
                  //get url
                  let id = goal.highlightClip;
                  //get goalsToDate
                  let gtd = goal.goalsToDate;
                  //get score and time left
                  let scoreInfo =  props.game.homeTeam.abbrev + " " + goal.homeScore + "- " + props.game.awayTeam.abbrev + " " + goal.awayScore + " (" + goal.timeInPeriod + " • " + periodFormat(period.periodDescriptor.number) + ")";
                  //set to arr
                  tempReplay.push([id,team,player,scoreInfo,gtd])
                  console.log("replay: " +id + " " + team + " " + player + " " + scoreInfo);
              });
          });

          //set replays
          if(tempReplay.length > 0)
          {
              setReplayInfo(tempReplay) ;
          }
          else
          {
          console.log("no replays")
          }

          firstReplayCall.current = false;
      }


     
                        
                        
      console.log("first ALL DATA call");
      
    }
      else //to be called every 10secs
      {

        setIsRunningALL(!isRunningALL);
        setGameClock(data.data[0].clock.timeRemaining);
        if(!data.data[0].clock.inIntermission) //not in intermission
        {
            setPeriod(data.data[0].periodDescriptor.number);

            //check if more goals have been scored
            if(goalCount.current != (data.data[1].homeTeam.score + data.data[1].awayTeam.score)) //a goal has been scored
            {
                console.log("goalCount.current: " + goalCount.current + " sum: " + (data.data[1].homeTeam.score + data.data[1].awayTeam.score));
                goalCount.current = data.data[1].homeTeam.score + data.data[1].awayTeam.score;

                //get team and player data of who scored
                let endpoint = data.data[1].summary.scoring[data.data[1].periodDescriptor.number - 1].goals.reverse()[0];//should be last(most recent goal of period)
                let team = endpoint.isHome ? props.game.homeTeam : props.game.awayTeam;
                let player = roster.current.find(p1 => {return p1.playerId == endpoint.playerId});
                let period = data.data[1].periodDescriptor.number;

                if(settings[1] && (settings[2] == "Both" ||settings[2] == team.placeName.default ))
                {
                    setScoreReactionData([team,player]);
                    setScore(true);
                }

                //add endpoint to replayEndpoints
                let tempArr = replayEndpoints.current;
                tempArr.push([endpoint, team, player, period]);
                replayEndpoints.current = tempArr;
            }

            //hasn't been tested yet
            if(replayEndpoints.current.length > replayInfo.length) //at least 1 goal has scored but hasn't recieved replay url
            {   
                let tempArr = [...replayInfo];
                let dif = replayEndpoints.current.length - replayInfo.length; //how many goals have been scored that haveent recieved replay url
                for(let i = 0; i < dif; i++)
                {
                    let currentReplay = data[1].summary.scoring[data[1].periodDescriptor.number - 1].goals.reverse()[(dif - i - 1)];
                    if(!(replayEndpoints.current[replayEndpoints.current.length - (dif - i)][0].highlightClip.hasOwnProperty("highlightClip")) && currentReplay.hasOwnProperty("highlightClip")) //if endpoint is there, but no replay
                    {
                        let endpoint = replayEndpoints.current[replayEndpoints.current.length - (dif - i)];
                        //add to replay Info
                        let period = endpoint[3];

                        let goal = endpoint[0];                                                                                                                                             //could be an issue
                        let scoreInfo =  props.game.homeTeam.abbrev + " " + goal.homeScore + "- " + props.game.awayTeam.abbrev + " " + goal.awayScore + " (" + goal.timeInPeriod + " • " + periodFormat(period.periodDescriptor.number) + ")";
                        
                        //add to array
                        tempArr.push([goal.highlightClip, endpoint[1], endpoint[2], scoreInfo, goal.goalsToDate]); // [replayID,team,player, scoreInfo,gtd]
                        console.log("replay: " +goal.highlightClip + " " + endpoint[1]+ " " + endpoint[2]+ " " + scoreInfo + " " + goal.goalsToDate);
                    
                        //set off replay notifcation
                        replayNotificationInfo.current = [goal.highlightClip, endpoint[1], endpoint[2], scoreInfo, goal.goalsToDate];
                        setShowReplayNotifcation(true);
                        setTimeout(() => setShowReplayNotifcation(false), 7000);
                    
                    }
                }
                //set to arr
                setReplayInfo(tempArr);
            }

            //Update scoreboard
            if(homeScore != data.data[0].homeTeam.score)
                {
                    setHomeScore(data.data[0].homeTeam.score);
                }
                if(awayScore != data.data[0].awayTeam.score)
                {
                    setAwayScore(data.data[0].awayTeam.score);
                }
            
            //update summary & player focus
            if(statInfo != [data.data[2].playerByGameStats,data.data[1].summary.teamGameStats])
            {
                setStatInfo([data.data[2].playerByGameStats,data.data[1].summary.teamGameStats]);
            }

            //update playbyplay
            let apiPlays = data.data[0].plays;
            setPlayArr(apiPlays);

        }
        else //in intermission
        {
            console.log("in intermission")
        }
        
        if(inIntermission != data.data[0].clock.inIntermission){
            setInIntermission(data.data[0].clock.inIntermission);
        }

     }
   })
}

    const pingAPI = () => {
        axios.post(backendUrl, {
            type: 'ping',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
                console.log(data);
                setGameClockPing(data.data);
            })};
   
     function periodFormat(num)
     {
        switch(num){
            case 1: return '1st';
            case 2: return '2nd';
            case 3: return '3rd';
            case 4: return 'OT';
            case 5: return 'S/0';
            default: return num;
        }
     }

    function toolbarClick(type)
    {
        if(type == 'SUM')
        {   
            if(infoType != 'SUM')
            {
                setInfoType('SUM');
                //getSummary();
            }
            console.log('SUM')
        }
        else if(type == 'BOX')
        {
            if(infoType != 'BOX')
            {
                setInfoType('BOX');
                //getPlayerFocus();
            }
            console.log('BOX')
        }
        else if(type == 'REP')
            {
                if(infoType != 'REP')
                {
                    setInfoType('REP');
                    //getPlayerFocus();
                }
                console.log('REP')
            }
        else //type == 'PBP'
        {   
            //automatically update by calling api every 10-15 secs and handle the new data(go by difference in length of play array anc check if there are any goals from the new plays retrieved, if so, set the score to true)
            if(infoType != 'PBP')
            {
                setInfoType('PBP');
                //getPlaybyPlay();

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
        setGameClockPing("");
    }
    function updateSettings() 
    {
        if(settings[0] != delay ) //new delay
        {
            if((props.game.gameState == "LIVE" || props.game.gameState == "CRIT") && (delay > 3) && (delay <= 180)) //only allow delay if game is live
            {
                setSettings([delay,goalLightOn,selectedOption]);
                //clear all playbyplay, summary values, boxscore values (maybe not, will be tough to do without casuing issues)
                //make api calls and push results into array (every 10 secs)
                getAllDataDelay();
                
                //start displaying data by pulling from array, waiting the correct amount of time to start
                setTimeout(() => setDelayAllData(), (delay*1000))
                //have algorithm start pulling data from each index of array 
                //array will be the length of delay / 10 (interval) rounding down + 1 example: 25 sec inteval = 2.5 + 1 = array length 3
                //essentially there will be a separation from when data is recieved from api and displayed in ui
               
            }
            else
            {   
                setDelay(settings[0]);
            }
        }
        else
        {
            setSettings([delay,goalLightOn,selectedOption]);
        }
        
        setShowSettings(false);
    }
    
    function teamOptionClick(name)
    {   
        setSelectedOption(name);
        setShowOptions(false);
    }

    function leaveGame()
    {
        setInfoType('XXX');
        props.setingame(false);
    }

    function handleReplayCarcClick(id)
    {
        replayID.current = id;
        setShowReplay(true);
    }

  let display;
  let info;
  let toolbar;
  let scoreboard;
  let settingsForm;
  let helpModal;
  let replayNotifcation;
  if (score) // if goalight is on or not
  {
    replayNotifcation = <div></div>;
    settingsForm = <div></div>; //team={scoreReactionData[0]} player={scoreReactionData[1]}
    helpModal = <div></div>; //for testing: team={props.game.homeTeam} player={roster[0]}
    display = <ScoreReaction scored={setScore} team={scoreReactionData[0]} player={scoreReactionData[1]}/>;
    info = <p> .</p>;

    
  }
  else if(showReplay)
  {
    replayNotifcation = <div></div>;
    settingsForm = <div></div>; //team={scoreReactionData[0]} player={scoreReactionData[1]}
    helpModal = <div></div>; //for testing: team={props.game.homeTeam} player={roster[0]}
 
    display = <div className='goal-replay-container'>
                  <img id='goal-replay-back-button' onClick={() => {setShowReplay(false)}} src={require("../pics/back-arrow.png")} alt='Back'/>
                  <iframe title="goal-replay" className='goal-replay-iframe' src={replayEndpoint + replayID.current} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div> 
  
    info = <p> .</p>;
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
            <div id="ping-container">
                <div id="ping-button" onClick={() => {pingAPI()}}>Ping</div>
                <div id="ping-label"><b>Current value</b> &#40; Game Clock &#41; : </div>
                    <div id="ping-result">{gameClockPing}</div>
                
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
                        <div className='help-question'>Why does the game clock run inbetween periods?</div>
                        <div className='help-answer'>The game clock is displaying the amount of time left in the intermission and the period will be set to 'INT'.</div>
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
                            <li>For an optimzied experience, we reccomend you use a remote mouse app on your mobile device for selection and changing views</li>
                        </ul>
                    </div>
                </div>;

 if(showReplayNotification)
  {
    replayNotifcation = <div className={darkMode ? 'replay-modal-dark': 'replay-modal'}>
        <div className='replay-notification-text'>A goal replay is now available</div>
        <div className='replay-card-notification' id={"color-"+ replayNotificationInfo.current[1].abbrev} onClick={() => {handleReplayCarcClick(replayNotificationInfo.current[0])}}>
            <img className='replay-headshot' src={replayNotificationInfo.current[2].headshot} alt="profile"/> 
                <div className='replay-card-text-container'>
                    <div className='upper-rc-text'> {replayNotificationInfo.current[2].firstName.default + " " + replayNotificationInfo.current[2].lastName.default + " (" + replayNotificationInfo.current[4] + ")"}</div>
                    <div className='lower-rc-text'> {replayNotificationInfo.current[3]}</div> {/* games score + time of goal  */}
                </div>
            <img className='replay-logo' src={replayNotificationInfo.current[1].logo} alt="profile"/> 
        </div>
</div>;
    }
    else
    {
        replayNotifcation = <div></div>;
    }

    if(showToolbar)
    {
        toolbar = <div id="toolbar" style={{backgroundImage: "url(" + require('../pics/boards.png') + ")"}}>
                <img className="left-toolbar-buttons" id="normal-gc" class="mode-button-img" onClick={() => leaveGame()} src={ require("../pics/back-arrow.png")} alt="Back"/>
                <img id="left-toolbar-icon" class="cg-logo-toolbar" src={ darkMode ? (require("../pics/cg-logo-small-dark.png")) : (require("../pics/cg-logo-small.png"))} alt="CaveGlass"/>
                <div id='toolbar-button-group' >
                    <div  id="normal-gc" className='toolbar-button' onClick={() => {toolbarClick("SUM")}} style={infoType == "SUM" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} }><img style={infoType == "SUM" ? {display: 'none'}: {display: 'flex'} } className='view-button-img' src={summaryLogo} alt="summary"/></div>
                    <div  id="normal-gc" className='toolbar-button' onClick={() => {toolbarClick("BOX")}} style={infoType == "BOX" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} } ><img style={infoType == "BOX" ? {display: 'none'}: {display: 'flex'} } className='view-button-img' src={playerFocusLogo} alt="player focus"/></div>
                    <div  id="normal-gc" className='toolbar-button'/*className={infoType == "PBP" ? 'toolbar-button-selected': 'toolbar-button'}*/ onClick={() => {toolbarClick("PBP")}} style={infoType == "PBP" ? {backgroundImage: "url(" + require('../pics/boards-open.png') + ")"}: {backgroundImage: "url(" + require('../pics/boards.png') + ")"} }><img style={infoType == "PBP" ? {display: 'none'}: {display: 'flex'} }className='mode-button-img' src={playByPlayLogo} alt="play-by-play"/></div>
                    <img className="middle-toolbar-buttons" id="normal-gc" onClick={() => {toolbarClick("REP")}} src={replayIcon} alt="Replay"/>
                    
                </div> 
                    <img className="right-toolbar-buttons" id="normal-gc" onClick={() => {setDarkMode(!darkMode)}} src={darkMode ? lightModeLogo : darkModeLogo} alt={darkMode ? 'Light Mode' : 'Dark Mode'}/>
                    <img className="right-toolbar-buttons" id="normal-gc" onClick={() => {handleModalShow('help')}} src={help}  disabled={(showHelp) ?  true : false} alt='help'/>
                    <img className="right-toolbar-buttons"id="normal-gc" onClick={() => {handleModalShow('settings')}} src={cog}  disabled={(showSettings) ?  true : false} alt='settings'/>
               
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
        info = <Summary teamGameStats={statInfo} darkMode={darkMode}  teamsInfo={[props.game.homeTeam,props.game.awayTeam]}> </Summary>;
    }
    else if(infoType == 'BOX')
    {
        info = <PlayerHighlight scores={[homeScore,awayScore]} statInfo={statInfo} roster={roster.current} players={[players,setPlayers]} teamStats={[teamStats,setTeamStats]} teamsInfo={[props.game.homeTeam,props.game.awayTeam]} darkMode={darkMode} setShowHelp={setShowHelp} setShowSettings={setShowSettings} show={[showForm,setShowForm]} showTeam={[showTeamForm,setShowTeamForm]}></PlayerHighlight>;

    }
    else if(infoType == 'REP')
        {
            info = <div id="replay-view" >
                    <div id='replay-title'> Goal Replays </div>
                    <div className={darkMode ? 'replay-list-dark': 'replay-list'}>
                        {replayInfo.map((replay, index) => (
                            <div key={index} className='replay-card' id={"color-"+ replay[1].abbrev} onClick={() => {handleReplayCarcClick(replay[0])}}>
                               <img className='replay-headshot' src={replay[2].headshot} alt="profile"/> 
                                <div className='replay-card-text-container'>
                                    <div className='upper-rc-text'> {replay[2].firstName.default + " " + replay[2].lastName.default + " (" + replay[4] + ")"}</div>
                                    <div className='lower-rc-text'> {replay[3]}</div> {/* games score + time of goal  */}
                                </div>
                                <img className='replay-logo' src={replay[1].logo} alt="profile"/> 
                            </div>
                            ))}
                    </div>
                </div>;
    
        }
    else if(infoType == 'PBP')
    {
        info = <PlayByPlay playArr={playArr} game={props.game} darkMode={darkMode} roster={roster.current} period={period} totalGoals={homeScore+awayScore}></PlayByPlay>;
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
      {replayNotifcation}
      {settingsForm}
      {helpModal}
      {display}
      {info}
      </div>
    );
}

export default Game;
