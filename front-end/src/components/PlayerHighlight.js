import React, { useState,useEffect } from 'react';
import '../styles.css';
import redx from "../pics/red-x.png"
import whitex from "../pics/white-x.png"
import PlayerCard from './PlayerCard';
import Toggle from './Toggle';

function PlayerHighlight(props)
{

   let ssl = ['Goals','Assists','Points','+/-','TOI','Shots','Blocks','Hits','Face-off %'];
   let gsl = ['Shots Against','Saves','Goals Against','Save %','TOI'];
    
    const [showForm, setShowForm] = useState(false);
    const [showOptions, setShowOptions] = useState(false); //shows dropdown player options
    const [selectedPlayer, setSelectedPlayer] = useState([0,"Select a Player","","",0,"",0,"",[]]); //format: [playerId, fullname + number, firstname, lastname, number, headshot,teamId, positionCode, stat array]
    const [checked, setChecked] = useState(false); //for toggle switch in form
    const [skaterStatList, setSkaterStatList] = useState(ssl);
    const [goalieStatList, setGoalieStatList] = useState(gsl);
    const [customStats, setCustomStats] = useState([]); // arr of user selected stats. Stat format [<stat name>,<line value>, "over" or "under",<value>]
    const [showStatOptions, setShowStatOptions] = useState(false); //shows dropdown stat options


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
                    arr = props.playerByGameStats.homeTeam.defense
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else if(position == 'G')
                {
                    arr = props.playerByGameStats.homeTeam.goalies
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else //forward
                {
                    arr = props.playerByGameStats.homeTeam.forwards
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
            }
            else
            {
                if(position == 'D')
                {
                    arr = props.playerByGameStats.awayTeam.defense
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else if(position == 'G')
                {
                    arr = props.playerByGameStats.awayTeam.goalies
                    apiPlayer = arr.find(p => {return p.playerId == player[0]});
                }
                else //forward
                {
                    arr = props.playerByGameStats.awayTeam.forwards
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
            console.log('no box score updates');
        }
    
      }, [props.playerByGameStats]);


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
                arr = props.playerByGameStats.homeTeam.defense
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else if(position == 'G')
            {
                arr = props.playerByGameStats.homeTeam.goalies
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else //forward
            {
                arr = props.playerByGameStats.homeTeam.forwards
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
        }
        else
        {
            if(position == 'D')
            {
                arr = props.playerByGameStats.awayTeam.defense
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else if(position == 'G')
            {
                arr = props.playerByGameStats.awayTeam.goalies
                apiPlayer = arr.find(p => {return p.playerId == player[0]});
            }
            else //forward
            {
                arr = props.playerByGameStats.awayTeam.forwards
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
                case 'Save %': return Math.round(apiPlayer.savePctg * 1000)/1000; //not always there in api (backup doesn't have it) (shows up a NaN)
                //default: return statName.toLowerCase();
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
                case 'Face-off %': return apiPlayer.faceoffWinningPctg * 100;
                //default: return statName.toLowerCase();
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
        }
        else
        {
            console.log("no player selected")
        }
    }

    function removeStat(stat)
    {
        //remove from list
        setCustomStats(customStats.filter((e)=>{return e != stat}));

        //add back to options
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
        setShowForm(false);
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

    function statOptionClick(stat)
    {
        //add to list
        let temp = customStats;
        temp.push([stat,0,"Over",0]); //on add need to update custom stats array to see if there are any 'line's set (non total display types)
        setCustomStats(temp);

        setShowStatOptions(false);

        if(selectedPlayer[7] == 'G')
        {
            setGoalieStatList(goalieStatList.filter((e)=>{return e != stat}));
        }
        else
        {
            setSkaterStatList(skaterStatList.filter((e)=>{return e != stat}));
        }
    }

    let display;
    if (props.players[0].length != 0)
    {
        const playerCards = [];
        for (let i = 0; i < props.players[0].length; i++) 
        {   
            
            playerCards.push( <PlayerCard playerData={props.players[0][i]} teamInfo={props.players[0][i][6] == props.teamsInfo[0].id ? props.teamsInfo[0] : props.teamsInfo[1]} darkMode={props.darkMode} players={[props.players[0],props.players[1]]}></PlayerCard>);
        }


        display = 
        <div id="player-focus-container" >
            {playerCards}
            <div className='mode-button-dark' onClick={() => {setShowForm(true)}}> Add Player </div>
            
        </div>
    }
    else
    {
        display = 
        <div>
            <p> No highlighted players</p>
            <div className='mode-button-dark' onClick={() => {setShowForm(true)}}> Add Player </div>
        </div>
    }
    /*let playerForm = '';
    if(showForm)
    {*/
   /*
        const playerOptions = [];
        let playerDesc;
        for (let i = 0; i < props.roster.length; i++) 
        {   
            playerDesc = props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[1].sweaterNumber;
            playerOptions.push( <option className="player-option" key={i} value={props.roster[i].playerId}><div><p>{playerDesc}</p><img className='player-option-img' src={props.roster[i].headshot} alt=""/></div></option>);
        }
        
        let playerForm = <form className='player-form' style={{display: showForm ? "block": "none"}}>
            <img id="player-form-cancel"  onClick={() => {setShowForm(false)}} src={redx} alt="X"/>
            <select id="player-select">
                {playerOptions}
            </select>
        </form>
                */
        const playerOptions = [];
        let playerDesc;
        for (let i = 0; i < props.roster.length; i++) 
        {   
            playerDesc = props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[i].sweaterNumber;
            playerOptions.push( <li class="player-option" onClick={() => {playerOptionClick(props.roster[i].playerId,props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[i].sweaterNumber,props.roster[i].firstName.default,props.roster[i].lastName.default,props.roster[i].sweaterNumber,props.roster[i].headshot,props.roster[i].teamId,props.roster[i].positionCode,[])}} key={i} ><p class='player-option-text'>{playerDesc}</p><img className='player-option-img' src={props.roster[i].headshot} alt=""/></li>);
        }
        
        const statOptions = [];
        const selectedStats = [];
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

        
        for (let i = 0; i < statList.length; i++) 
        {   
            statOptions.push( <li class="stat-option" onClick={() => {statOptionClick(statList[i])}} key={i} ><p class='stat-option-text'>{statList[i]}</p></li>);
        }

        for (let i = 0; i < customStats.length; i++) 
        {   
            selectedStats.push( <li class="selected-stat-element" key={i} ><p class='player-option-text'>{customStats[i][0]}</p> <Toggle type="statList" state={[false]} size='small' statState={[customStats,setCustomStats]} index={i}></Toggle>   <img className='stat-delete-img' onClick={() => {removeStat(customStats[i])}} src={whitex} alt="delete"/> </li>);
        }

        let playerForm = <form className='player-form' style={{display: showForm ? "flex": "none"}}>
            <img id="player-form-cancel" onClick={cancelAdd} src={redx} alt="exit"/>
            <div class="player-select-container">
                <div class="player-select-selected" onClick={() => {setShowOptions(true)}} > {selectedPlayer[1]}</div>
                <div class="player-select" style={{display: showOptions ? "block": "none"}}>
                    {playerOptions}
                </div>
            </div>
            <div id="form-element">
                <Toggle state={[checked,setChecked]} type="default" size='big'></Toggle>
            </div>
            <div id='custom-options-container' style={{display: checked ? "flex": "none"}}>
                <div class="stat-select-container">
                    <div class="player-select-selected" onClick={() => {setShowStatOptions(true)}} > Select Stats </div>
                    <div class="player-select" style={{display: showStatOptions ? "block": "none"}}>
                        {statOptions}
                    </div>
                </div>

                <div id="custom-stats-container">
                    {selectedStats}
                </div>
            </div>

            <div id="player-form-add" onClick={addPlayer}>Add</div>
        </form>;
   // }

   /*<div class="stat-select-container">
                <div class="player-select-selected" onClick={() => {setShowStatOptions(true)}} > Select Stats </div>
                <div class="player-select" style={{display: showStatOptions ? "block": "none"}}>
                    {statOptions}
                </div>
            </div>
            */

    /*
    <div class="toggle-switch-container">

                <p>Player Info:</p>
                <label class="toggle-switch">
                    <input type="checkbox" id="player-card-style-checkbox" checked={checked} onClick={()=>{ setChecked(!checked)}}/>
                    <span class="slider"></span>
                </label>
                <p>{checked ? 'Custom': 'Default' }</p>
            </div>
            */

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
      
    return(
        <div>
            {playerForm}
            {display}
            
        </div>
    );
}
export default PlayerHighlight;