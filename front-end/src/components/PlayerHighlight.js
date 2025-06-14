import React, { useState,useEffect } from 'react';
import '../styles.css';
import redx from "../pics/red-x.png"
import whitex from "../pics/white-x.png"
import PlayerCard from './PlayerCard';
import Toggle from './Toggle';
import TeamCard from './TeamCard';

function PlayerHighlight(props)
{

   let ssl = ['Goals','Assists','Points','+/-','TOI','Shots','Blocks','Hits','Face-off'];
   let gsl = ['Shots Against','Saves','Goals Against','Save','TOI'];
   let tsl = ['Goals','Shots','Blocks']; //maybe add penalty mins
    
   
    //props.show[0], props.show[1] = showForm, setShowForm
    //props.showTeam[0], props.showTeam[1] = showTeamForm, setShowTeamForm
    const [showOptions, setShowOptions] = useState(false); //shows dropdown player options
    const [showTeamOptions, setShowTeamOptions] = useState(false); //shows dropdown team options
    const [selectedPlayer, setSelectedPlayer] = useState([0,"Select a Player","","",0,"",0,"",[]]); //format: [playerId, fullname + number, firstname, lastname, number, headshot,teamId, positionCode, stat array]
    const [selectedTeam, setSelectedTeam] = useState([0,"Select a Team", false, []]); //format: [teamId, team name, isHomeTeam, stat array]
    const [checked, setChecked] = useState(false); //for toggle switch in playerform
    const [checkedTeam, setCheckedTeam] = useState(false); //for toggle switch in teamform
    const [skaterStatList, setSkaterStatList] = useState(ssl);
    const [goalieStatList, setGoalieStatList] = useState(gsl);
    const [teamStatList, setTeamStatList] = useState(tsl);
    const [customStats, setCustomStats] = useState([]); // arr of user selected stats. Stat format [<stat name>,<line value>, "over" or "under",<value>, <checked(bool)>]
    const [showStatOptions, setShowStatOptions] = useState(false); //shows dropdown stat options
    const [showTeamStatOptions, setShowTeamStatOptions] = useState(false); //shows dropdown team stat options
    const [statOptionsState, setStatOptionsState] = useState([props.teamsInfo[0],props.teamsInfo[1]]); //keeps track of what teams to show as options (preventing users select same teams multiple times)
    const [statListCap, setStatListCap] = useState(0); //value to keep track of how much space stats will take up on playercard
    
    // called on when api call for box score data which is on interval (decided in Game.js)    not fully tested (but pretty sure works)
    useEffect(() => {
    
        //playerByGameStats => (homeTeam,AwayTeam) => (defense[],forwards[],goalies[]) => get player by playerID => (all the stats)
        let position;
        let arr;
        let player; // one of players from play cards
        let apiPlayer; //endpoint at which the player's stats are located in API
        let statArr;
        let apiStatValue; //stats value in api
        let isHomeTeam; //boolean player is on hometeam or not
        let tempPlayers = props.players[0]; //player arr instance that holds all changes 
        for(let i=0; i < props.players[0].length; i++) //each player
        {
            player = props.players[0][i];
            position = player[7];
            isHomeTeam = player[6] == props.teamsInfo[0].id ? true : false;
            statArr = player[8];

            if(isHomeTeam)
            {
                if(position == 'D')
                {
                    arr = props.statInfo[0].homeTeam.defense
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else if(position == 'G')
                {
                    arr = props.statInfo[0].homeTeam.goalies
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else //forward
                {
                    arr = props.statInfo[0].homeTeam.forwards
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
            }
            else
            {
                if(position == 'D')
                {
                    arr = props.statInfo[0].awayTeam.defense
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else if(position == 'G')
                {
                    arr = props.statInfo[0].awayTeam.goalies
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else //forward
                {
                    arr = props.statInfo[0].awayTeam.forwards
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
            }
            
            for(let i2=0; i2 < statArr.length; i2++) //each stat
            {
                apiStatValue = setStatForCheck(apiPlayer,position,statArr[i2][0]);
                if(statArr[i2][3] != apiStatValue)
                {
                    tempPlayers[i][8][i2][3] = apiStatValue;
                }
            }
        }
        //set new value for players (if any there were any updates)
        if(props.players[0] != tempPlayers)
        {
            props.players[1](tempPlayers);
            console.log('box score updated');
        }
        else
        {
            console.log('no box score player updates');
        }


        //CHECKING TEAM CASES
        let tempTeams = props.teamStats[0]; //team arr instance that holds all changes 
        for(let i=0; i < props.teamStats[0].length; i++) //each teamStat (max 2)
        {
        
            statArr = props.teamStats[0][i][3];
            let endpoint = props.statInfo[1]
            for(let i2=0; i2 < statArr.length; i2++) //each stat
            {
                apiStatValue = setTeamStatForCheck(endpoint,statArr[i2][0],props.teamStats[0][i][2]);
                if(statArr[i2][3] != apiStatValue)
                {
                    tempTeams[i][3][i2][3] = apiStatValue;
                }
            }
        }
        
        //set new value for teamstats (if any there were any updates)
        if(props.teamStats[0] != tempTeams)
        {
            props.teamStats[1](tempTeams);
            console.log('box score updated');
        }
        else
        {
            console.log('no box score player updates');
        }
      }, [props.statInfo]);


      //was made just for testing
      useEffect(() => {

        console.log("change in custom stats")

      }, [customStats]);


      //gets a specific stat value (used when adding player card) 
    function getTeamStatValue(isHome,statName)
    {
        let endpoint = props.statInfo[1]; //endpoint at which the team's stats are located in API
        let value = setTeamStatForCheck(endpoint,statName,isHome);
        console.log("value: " + value);
        return value;
    }

    //gets a specific stat value (used when adding player card) 
    function getStatValue(player,statName)
    {
        let arr;
        let apiPlayer; //endpoint at which the player's stats are located in API
        let position = player[7];
        let isHomeTeam = player[6] == props.teamsInfo[0].id ? true : false;
            
        if(isHomeTeam)
        {
            if(position == 'D')
            {
                arr = props.statInfo[0].homeTeam.defense
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else if(position == 'G')
            {
                arr = props.statInfo[0].homeTeam.goalies
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else //forward
            {
                arr = props.statInfo[0].homeTeam.forwards
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
        }
        else
        {
            if(position == 'D')
            {
                arr = props.statInfo[0].awayTeam.defense
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else if(position == 'G')
            {
                arr = props.statInfo[0].awayTeam.goalies
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else //forward
            {
                arr = props.statInfo[0].awayTeam.forwards
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
        }
        let value = setStatForCheck(apiPlayer,position,statName);
        console.log("value: " + value);
        return value;
    }

    function setStatForCheck(apiPlayer,position,statName)
    {
        if(position == 'G')
        {
            switch(statName)
            {
                case 'TOI': return apiPlayer.toi;
                case 'Saves': return apiPlayer.saves;
                case 'Shots Against': return apiPlayer.shotsAgainst;
                case 'Goals Against': return apiPlayer.goalsAgainst;
                //case 'Save %': return Math.round(apiPlayer.savePctg * 1000)/1000; //not always there in api (backup doesn't have it) (shows up a NaN)
                //default: return statName.toLowerCase();
                case 'Save': return isNaN(apiPlayer.savePctg) ? 0 + '%' : (apiPlayer.savePctg * 100).toFixed(1) + '%';
                default: return statName; //this case should not happen
            }
        }
        else
        {
            switch(statName)
            {
                case 'Goals': return apiPlayer.goals;
                case 'Assists': return apiPlayer.assists;
                case 'Points': return apiPlayer.points;
                case 'Hits': return apiPlayer.hits;
                case 'TOI': return apiPlayer.toi;
                case '+/-': return apiPlayer.plusMinus;
                case 'Shots': return apiPlayer.sog;
                case 'Blocks': return apiPlayer.blockedShots;
                case 'Face-off': return (apiPlayer.faceoffWinningPctg * 100).toFixed(0) + '%';
                default: return statName; //this case should not happen
            }
        }
    }  
    function setTeamStatForCheck(endpoint,statName,isHome)
    {
        if(isHome)
        {
            switch(statName)
            {
                case 'Shots': return endpoint[0].homeValue;
                case 'Hits': return endpoint[5].homeValue;
                case 'Penalty minutes': return endpoint[4].homeValue;
                case 'Blocks': return endpoint[6].homeValue;
                case 'Goals': return props.scores[0]; //goals will have a different endpoint
                default: return statName; //this case should not happen
                
            }
        }
        else //away team
        {
            switch(statName)
            {
                case 'Shots': return endpoint[0].awayValue;
                case 'Hits': return endpoint[5].awayValue;
                case 'Penalty minutes': return endpoint[4].awayValue;
                case 'Blocks': return endpoint[6].awayValue;
                case 'Goals': return props.scores[1]; //goals will have a different endpoint
                default: return statName; //this case should not happen
            }
        }
    }  
    //called when the add button from player form is clicked
    function addPlayer()
    {
        console.log("Add player")
        if(selectedPlayer[0] != 0)
        {
            let temp;
            let tempSP;
            let statValue;
            if(checked == false)
            {
                //setting values for each default
                let list = (selectedPlayer[7] == 'G' ? gsl : ssl);
                let defaultStats = [];
                for (let i = 0; i < list.length; i++){
                
                    statValue = getStatValue(selectedPlayer,list[i]);
                    defaultStats.push([list[i],0,'',statValue]);
                    console.log("stat: " + list[i])
                }

                //add selected player to hightlighted players array
                temp = props.players[0];
                tempSP = [selectedPlayer[0],selectedPlayer[1],selectedPlayer[2],selectedPlayer[3],selectedPlayer[4],selectedPlayer[5],selectedPlayer[6],selectedPlayer[7],defaultStats]
            }
            else
            {
                if(customStats.length < 1)
                {
                    console.log("no stats selected")
                    return; //do nothing
                }
                //setting value for each customstat
                for (let i = 0; i < customStats.length; i++){
            
                    statValue = getStatValue(selectedPlayer,customStats[i][0]);
                    customStats[i][3] = statValue;
                    
                }

                //add selected player to hightlighted players array
                temp = props.players[0];
                tempSP = [selectedPlayer[0],selectedPlayer[1],selectedPlayer[2],selectedPlayer[3],selectedPlayer[4],selectedPlayer[5],selectedPlayer[6],selectedPlayer[7],customStats]
            }
            console.log("selected player: " + selectedPlayer)

            //temp.push(selectedPlayer);
            temp.push(tempSP);
            console.log(tempSP);
            props.players[1](temp);

            //CLEAR selectedPlayer
            setSelectedPlayer([0,"Select a Player","","",0,"",0,"",[]]);

            setStatListCap(0);
        }
        else
        {
            console.log("no player selected")
        }
    }

    //called when the add button from player form is clicked
    function addTeam(team)
    {
        console.log("Add Team")
        if(selectedTeam[0] != 0)
        {
            let temp;
            let tempSP;
            let statValue;
            if(checkedTeam == false)
            {
                //setting values for each default
                let list = tsl;
                let defaultStats = [];
                for (let i = 0; i < list.length; i++){
                
                    statValue = getTeamStatValue(selectedTeam[2],list[i]);
                    defaultStats.push([list[i],0,'',statValue]);
                    console.log("stat: " + list[i])
                }

                //add selected player to hightlighted players array
                temp = props.teamStats[0]; //array of players
                tempSP = [selectedTeam[0],selectedTeam[1],selectedTeam[2],defaultStats];
            }
            else
            {
                //setting value for each customstat
                for (let i = 0; i < customStats.length; i++){
            
                    statValue = getTeamStatValue(selectedTeam[2],customStats[i][0]);
                    customStats[i][3] = statValue;
                }

                //add selected player to hightlighted players array
                temp = props.teamStats[0];
                tempSP = [selectedTeam[0],selectedTeam[1],selectedTeam[2],customStats];
            }
            console.log("selected team: " + selectedTeam)

            //temp.push(selectedPlayer);
            temp.push(tempSP);
            console.log(tempSP);
            props.teamStats[1](temp);

            //CLEAR selected Team
            setSelectedTeam([0,"Select a Team",false,[]]);

            //take away this team as an option in the teamform (i dont want user to make multiple instances)
            setStatOptionsState(statOptionsState.filter((e)=>{return e != team}));
        }
        else
        {
            console.log("no team selected")
        }
    }

    function removeStat(stat)
    {
        console.log("stat: " + stat);
        
        //remove from data list
        setCustomStats(customStats.filter((e)=>{return e != stat}));
        
        //add back to options
        if(selectedTeam[0] != 0) // team stats
        {
            let temp = teamStatList;
            temp.push(stat[0]);
            setTeamStatList(temp);
        }
        else // player stats
        {
            if(selectedPlayer[7] == 'G')
            {
                let temp = goalieStatList;
                temp.push(stat[0]);
                setGoalieStatList(temp);
            }
            else
            {
                let temp = skaterStatList;
                temp.push(stat[0]);
                setSkaterStatList(temp);
            }
        
            //decrement statlistcap
            if(stat[1] > 0)
            {
                setStatListCap((statListCap - 3));
                //clear line value
            }
            else
            {
                setStatListCap((statListCap - 1));
            }
        }
    }


    function handleModalShow(type)
    {
        if(type == 'team')
        {
            props.showTeam[1](true);
            props.show[1](false);
            props.setShowSettings(false);
            props.setShowHelp(false);
        }
        else if(type == 'player')
        {
            props.showTeam[1](false);
            props.show[1](true);
            props.setShowSettings(false);
            props.setShowHelp(false);
        }
    }

    function cancelAdd()
    {
        //CLEAR selectedPlayer
        setSelectedPlayer([0,"Select a Player","","",0,"",0,"",[]]);
        //clear stat list
        setCustomStats([]);
        //repopulate goalie and skater stat options
        setGoalieStatList(gsl);
        setSkaterStatList(ssl);
        //hide modal
        props.show[1](false);//setShowForm(false);
        //resets the cap
        setStatListCap(0);
        //resets custom/default toggle
        setChecked(false); //new
    }

    function cancelTeamAdd()
    {
        //CLEAR selectedPlayer
        setSelectedTeam([0,"Select a Team",false]);
        //clear stat list
        setCustomStats([]);
        //repopulate goalie and skater stat options
        setTeamStatList(tsl);
        //hide modal
        props.showTeam[1](false);//setShowTeamForm(false);
        //resets the cap
        setStatListCap(0);
        //resets custom/default toggle
        setCheckedTeam(false); //new
    }

    function playerOptionClick(id,text,fn,ln,n,hs,tid,pc,s)
    {
        setSelectedPlayer([id,text,fn,ln,n,hs,tid,pc,s]);
        setShowOptions(false);
        //clear stat list
        setCustomStats([]);
        //repopulate goalie and skater stat options
        setGoalieStatList(gsl);
        setSkaterStatList(ssl);
    }

    function teamOptionClick(id,text)
    {   
        let isHome = (id == props.teamsInfo[0].id ? true : false);
        setSelectedTeam([id,text,isHome]);
        setShowTeamOptions(false);
        //clear stat list
        setCustomStats([]);
        //repopulate team stat options
        setTeamStatList(tsl);
    }

    function statOptionClick(stat) 
    {
        //check to see if list is full
        if(statListCap < 12)
        {
            //increment capacity
            setStatListCap((statListCap+1));
        }
        //add to list
        const temp = [...customStats]; // use effect should recognize now
        temp.push([stat,0,"Over",0,false]); //on add need to update custom stats array to see if there are any 'line's set (non total display types)
        setCustomStats(temp);

        setShowStatOptions(false);

        if(selectedTeam[0] != 0) //team form
        {
            setTeamStatList(teamStatList.filter((e)=>{return e != stat}));
        }
        else //player form
        {
            if(selectedPlayer[7] == 'G')
            {
                setGoalieStatList(goalieStatList.filter((e)=>{return e != stat}));
            }
            else
            {
                setSkaterStatList(skaterStatList.filter((e)=>{return e != stat}));
            }
        }
    }

    let display;
    let buttons; //arr of buttons to be displayed
    buttons = <div className='player-focus-button-container'>
                        <button className='mode-button-dark' onClick={() => {handleModalShow('player')}} disabled={(props.show[0]) ?  true : false} > Add Player </button>
                        <button className='mode-button-dark' onClick={() => {handleModalShow('team')}} disabled={(props.showTeam[0]) ?  true : false}> Add Team </button>{/*disabled={showForm && showTeamForm ? true : false} */}
                </div>;
   
    if (props.players[0].length != 0 && props.teamStats[0].length != 0)
    {
        const playerCards = [];
        for (let i = 0; i < props.players[0].length; i++) 
        {   
            playerCards.push( <PlayerCard playerData={props.players[0][i]} teamInfo={props.players[0][i][6] == props.teamsInfo[0].id ? props.teamsInfo[0] : props.teamsInfo[1]} darkMode={props.darkMode} players={[props.players[0],props.players[1]]}></PlayerCard>);
        }
        const teamCards = [];
        for (let i = 0; i < props.teamStats[0].length; i++) 
        {   
            teamCards.push( <TeamCard statOptionsState={[statOptionsState,setStatOptionsState]} teamData={props.teamStats[0][i]} teamInfo={ props.teamStats[0][i][2] ? props.teamsInfo[0] : props.teamsInfo[1]} darkMode={props.darkMode} teams={[props.teamStats[0],props.teamStats[1]]}></TeamCard>);
        }
        
        display = 
        <div id="player-focus-container" >
            {playerCards}
            {teamCards}
            {buttons}
        </div>
    }
    else if (props.players[0].length != 0)
    {
        const playerCards = [];
        for (let i = 0; i < props.players[0].length; i++) 
        {   
            playerCards.push( <PlayerCard playerData={props.players[0][i]} teamInfo={props.players[0][i][6] == props.teamsInfo[0].id ? props.teamsInfo[0] : props.teamsInfo[1]} darkMode={props.darkMode} players={[props.players[0],props.players[1]]}></PlayerCard>);
        }

        display = 
        <div id="player-focus-container" >
            {playerCards}
            {buttons}    
        </div>
    }
    else if (props.teamStats[0].length != 0)
    {
        const teamCards = [];
        for (let i = 0; i < props.teamStats[0].length; i++) 
        {   
            teamCards.push( <TeamCard statOptionsState={[statOptionsState,setStatOptionsState]} teamData={props.teamStats[0][i]} teamInfo={ props.teamStats[0][i][2] ? props.teamsInfo[0] : props.teamsInfo[1]} darkMode={props.darkMode} teams={[props.teamStats[0],props.teamStats[1]]}></TeamCard>);
        }
    
        display = 
        <div id="player-focus-container" >
            {teamCards}
            {buttons}
        </div>
    }
    else
    {
        display = 
        <div id="player-focus-container" >
            <p id="player-highlight-message"> No players</p>
            {buttons}
        </div>
    }
   
        const playerOptions = [];
        let playerDesc;
        for (let i = 0; i < props.roster.length; i++) 
        {   
            playerDesc = props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[i].sweaterNumber;
            playerOptions.push( <li class="player-option" onClick={() => {playerOptionClick(props.roster[i].playerId,props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[i].sweaterNumber,props.roster[i].firstName.default,props.roster[i].lastName.default,props.roster[i].sweaterNumber,props.roster[i].headshot,props.roster[i].teamId,props.roster[i].positionCode,[])}} key={i} ><p class='player-option-text'>{playerDesc}</p><img className='player-option-img' src={props.roster[i].headshot} alt=""/></li>);
        }
        const teamOptions = [];
        for (let i = 0; i < statOptionsState.length; i++) 
        {
            teamOptions.push( <li class="player-option" onClick={() => {teamOptionClick(statOptionsState[i].id,statOptionsState[i].placeName.default + " " + statOptionsState[i].commonName.default)}} key={i} ><p class='player-option-text'>{statOptionsState[i].placeName.default + " " + statOptionsState[i].commonName.default}</p><img className='player-option-img' src={statOptionsState[i].logo} alt=""/></li>);
        } 
        
        const statOptions = [];
       // const selectedStats = [];
        let statList = [];
        if (selectedPlayer[7] != "") //there is a selected player 
        {
            if (selectedPlayer[7] == "G") //selected player is a goalie
            {
                statList = goalieStatList;
            }
            else //selected player is skater
            {
                statList = skaterStatList;
            }
        }
        else if(selectedTeam[0] != 0){
            statList = teamStatList;
        }
        
        for (let i = 0; i < statList.length; i++) 
        {   
            statOptions.push( <li class="stat-option" onClick={() => {statOptionClick(statList[i])}} key={i} ><p class='stat-option-text'>{statList[i]}</p></li>);
        }

        let tempSS = customStats.map((cs, i) => (                                                                                                       //may need to change to [cs[4]]      //figure this out       key={cs[4]}                               
            <li class="selected-stat-element" key={cs[0]} ><p class='player-option-text'>{cs[0]}</p> <Toggle cap={[statListCap,setStatListCap]} type="statList" state={[false]}  statState={[customStats,setCustomStats]} size='small' index={i}></Toggle>   <img className='stat-delete-img' onClick={() => {removeStat(cs)}} src={whitex} alt="delete"/> </li>
        ));
    
        let playerForm = <form className='player-form' style={{display: props.show[0] ? "flex": "none"}}>
            <img id="player-form-cancel" onClick={cancelAdd} src={redx} alt="exit"/>
            <div class="player-select-container">
                <div class="player-select-selected" onClick={() => {if (statListCap < 12){ setShowOptions(true)}}} > {selectedPlayer[1]}</div>
                <div class="player-select" style={{display: showOptions ? "block": "none"}}>
                    {playerOptions}
                </div>
            </div>
            <div id="form-element">
                <Toggle state={[checked,setChecked]} type="default" size='big'></Toggle>
            </div>
            <div id='custom-options-container' style={{display: checked ? "flex": "none"}}>
                <div class="stat-select-container">
                    <div class="player-select-selected" onClick={() => {if(statListCap < 12 ){setShowStatOptions(true)}}} > Select Stats </div>
                    <div class="player-select" style={{display: showStatOptions ? "block": "none"}}>
                        {statOptions}
                    </div>
                </div>

                <div id="custom-stats-container">
                        {tempSS}
                </div>
            </div>

            <div id="player-form-add" onClick={addPlayer}>Add</div>
            {/*<p>{"statlistcap: " + statListCap}</p>*/} {/* only here for testing*/}
        </form>;

         let teamForm = <form className='player-form' style={{display: props.showTeam[0] ? "flex": "none"}}>
            <img id="player-form-cancel" onClick={cancelTeamAdd} src={redx} alt="exit"/>
            
            <div class="team-select-container">
                <div class="player-select-selected" onClick={() => {setShowTeamOptions(true)}} > {selectedTeam[1]}</div>
                <div class="player-select" style={{display: showTeamOptions ? "block": "none"}}>
                    {teamOptions}
                </div>
            </div>
            <div id="form-element">
                <Toggle state={[checkedTeam,setCheckedTeam]} type="default" size='big'></Toggle>
            </div>
            <div id='custom-options-container' style={{display: checkedTeam ? "flex": "none"}}>
                <div class="team-stat-select-container">
                    <div class="player-select-selected" onClick={() => {setShowTeamStatOptions(true)}} > Select Stats </div>
                    <div class="player-select" style={{display: showTeamStatOptions ? "block": "none"}}>
                        {statOptions}
                    </div>
                </div>

                <div id="custom-stats-container">
                     {/* use to not be a state variable*/}
                    {tempSS}
                </div>
            </div>
            
            <div id="player-form-add" onClick={() => {addTeam(selectedTeam[0] == props.teamsInfo[0].id ? props.teamsInfo[0] : props.teamsInfo[1])}}>Add</div>
            
        </form>;

   

   // stuff for player-select
   // Get all custom select elements
   
let customSelects = document.querySelectorAll('.player-select-container');

// Attach click event listeners to each custom select
customSelects.forEach(function (select) {
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowOptions(false);
        }
    });
});

let customSelects2 = document.querySelectorAll('.stat-select-container');

// Attach click event listeners to each custom select
customSelects2.forEach(function (select) {
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowStatOptions(false);
        }
    });
});

let customSelects3 = document.querySelectorAll('.team-select-container');

// Attach click event listeners to each custom select
customSelects3.forEach(function (select) {
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowTeamOptions(false);
        }
    });
});

let customSelects4 = document.querySelectorAll('.team-stat-select-container');

// Attach click event listeners to each custom select
customSelects4.forEach(function (select) {
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowTeamStatOptions(false);
        }
    });
});
      
    return(
        <div>
            {playerForm}
            {teamForm}
            {display}
            
        </div>
    );
}
export default PlayerHighlight;