
import React from 'react';
import goalLight from '../pics/goal-light-sr.png'

function ScoreReaction(props)
{
   /* setTimeout(() => {
        props.scored(false)
        console.log("Delayed for 3 second.");
      }, 3000);*/
      




{/* */}{/*}  */}
    return(
        <div class="scoreReaction"> 
           <div className="goal-container">
                
                <div class="gl-overlay">
                <img id="gl" src={goalLight}></img>
                <div class="gl-overlay2">
                    <div className="light top"></div>
                    <div className="light middle"></div>
                    <div className="light bottom"></div>
                </div></div>
                
            </div>
        </div>
        
    );
}
export default ScoreReaction;