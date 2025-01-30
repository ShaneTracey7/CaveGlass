
import React from 'react';

function ScoreReaction(props)
{
    setTimeout(() => {
        props.scored(false)
        console.log("Delayed for 3 second.");
      }, 3000);
      
    return(
        <p>This is the reaction</p>
    );
}
export default ScoreReaction;