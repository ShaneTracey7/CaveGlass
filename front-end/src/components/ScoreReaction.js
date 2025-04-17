
import React from 'react';
import goalLight from '../pics/goal-light-sr.png'

function ScoreReaction(props)
{
    //props.team = <team object>
    //props.player = <player object>
/*
   setTimeout(() => {
        props.scored(false)
        console.log("Delayed for 20 second.");
      }, 20000);*/
      
    return(
        <div class="scoreReaction" id={"color-" + props.team.abbrev} > 

        <div class="sr-container">

            <img id="sr-bg-logo" src={props.team.darkLogo} alt="team logo"></img>
            <div class="sr-overlay">
                <div id="sr-goal-number">{props.player.sweaterNumber}</div>
               
                <div class="sr-overlay2">
                    <div class="sr-title" id={"color-" + props.team.abbrev}>
                
                        <img id="gl" src={goalLight} alt="goal light"></img>
                        <div id="sr-goal-text">GOAL</div>
                        <img id="gl" src={goalLight} alt="goal light"></img>

                    </div>
            
                    <img id="sr-headshot" src={props.player.headshot} alt="headshot"></img>
                    <div id="sr-player-name">{props.player.firstName.default + " " + props.player.lastName.default}</div>
                </div>
            </div>
        </div> 
        </div>
        
    );
}
export default ScoreReaction;