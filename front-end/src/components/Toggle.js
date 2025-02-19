import '../styles.css';
import React, {useState,useEffect} from 'react';



function Toggle(props) {


    function setLineState(value)
    {
        let temp = props.statState[0];
        temp[props.index][1] = value; //changes value to line input
        props.statState[1](temp);
    }

    const [checked, setChecked] = useState(props.state[0]); //for toggle switch in form

    let textBefore;
    let textAfterTrue;
    let textAfterFalse;
    let display;
    let lineInput;

    if(props.type == 'default')
    {
        lineInput = ""
        textBefore = "Player Info:";
        textAfterTrue = "Custom";
        textAfterFalse = "Default";
    }
    else
    {
        lineInput = <input class="line-input" type='number' style={{display: checked ? "flex": "none"}}
        onChange={(e) => setLineState(e.target.value)} /> //working on this part

        textBefore = "Display Style:"
        textAfterTrue = "Line:";
        textAfterFalse = "Total";
    }

    function handleClick()
    {
        if(props.type == 'statList')
        {
            //props.
            setChecked(!checked)
        }
        else if(props.type == 'default')
        {
            props.state[1](!props.state[0]);
            setChecked(!checked)
        }
        else
        {
            setChecked(!checked)
        }
    }
    
    
    /*  */
     return (
        <div class={props.size == "small" ? "toggle-switch-container" : "toggle-switch-container-big"}>
            <p class="toggle-left-label">{textBefore}</p>
            <label id={props.size == "small" ? 'small-toggle-switch': 'big-toggle-switch'}class="toggle-switch">
                <input type="checkbox" id="player-card-style-checkbox" checked={checked} onClick={handleClick}/>
                <span id={props.size == "small" ? 'small-slider': 'big-slider'} class="slider"></span>
            </label>
            <p class="toggle-right-label">{checked ? textAfterTrue: textAfterFalse }</p>
            {lineInput}
        </div>
          );
      }
      
      export default Toggle;