import React, { useState } from 'react';
import '../styles.css';
import redx from "../pics/red-x.png"

function PlayerHighlight(props)
{



    const [players, setPlayers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState([0,"Select a Player"]); //default (empty) value
    
    //called when the add button from player form is clicked
    function addPlayer()
    {
        console.log("Add player")
        if(selectedPlayer[0] != 0)
        {
            console.log("selected player: " + selectedPlayer)

            //CLEAR selectedPlayer
            setSelectedPlayer([0,"Select a Player"]);
        }
        else
        {
            console.log("no player selected")
        }
    }

    function cancelAdd()
    {
        //CLEAR selectedPlayer
        setSelectedPlayer([0,"Select a Player"]);
        //hide modal
        setShowForm(false);
    }

    function playerOptionClick(id,text)
    {
        setSelectedPlayer([id,text]);
        setShowOptions(false);
        
    }

    let display;
    if (players.length != 0)
    {
        display = 
        <div>
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
            playerOptions.push( <li class="player-option" onClick={() => {playerOptionClick(props.roster[i].playerId,props.roster[i].firstName.default + " " + props.roster[i].lastName.default + " #" + props.roster[i].sweaterNumber)}} key={i} ><p class='player-option-text'>{playerDesc}</p><img className='player-option-img' src={props.roster[i].headshot} alt=""/></li>);
        }

        let playerForm = <form className='player-form' style={{display: showForm ? "flex": "none"}}>
            <img id="player-form-cancel" onClick={cancelAdd} src={redx} alt="X"/>
            <div class="player-select-container">
                <div class="player-select-selected" onClick={() => {setShowOptions(true)}} > {selectedPlayer[1]}</div>
                <div class="player-select" style={{display: showOptions ? "block": "none"}}>
                    {playerOptions}
                </div>
            </div>
            <div id="player-form-add" onClick={addPlayer}>Add</div>
        </form>
   // }


   // stuff for player-select
   // Get all custom select elements
let customSelects = document.querySelectorAll('.player-select-container');

// Attach click event listeners to each custom select
customSelects.forEach(function (select) {
    let selectSelected = select.querySelector('.player-select-selected');
    let selectItems = select.querySelector('.player-select');
    let options = selectItems.querySelectorAll('.player-option');

    
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            setShowOptions(false);
            
        }
    });
});
      
    return(
        <div>
            {display}
            {playerForm}
        </div>
    );
}
export default PlayerHighlight;