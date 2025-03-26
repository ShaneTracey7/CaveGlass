import '../styles.css';
import React, {useState,useEffect} from 'react';



function Toggle(props) {

    function lineInputChange(e)
    {
        setLineState(e.target.value);
        setLiValue(e.target.value);
        if(e.target.value == "")
        {
            props.cap[1](props.cap[0] -= 2);
            setLicFlag(true);
        }
        else
        {   
            if(licFlag)
            {
                props.cap[1](props.cap[0] += 2);
                setLicFlag(false);
            }
        }
        console.log("licFlag: " + licFlag + " e.target.value: " + e.target.value);
    }

    function setLineState(value)
    {
        let temp;
        if(value == 'Over' || value == 'Under')
        {
            temp = props.statState[0];
            temp[props.index][2] = value; //changes value to line input
            props.statState[1](temp);
            setOUState(value);
        }
        else
        {
            temp = props.statState[0];
            temp[props.index][1] = value; //changes value to line input
            props.statState[1](temp);
        }
    }

    const [checked, setChecked] = useState(props.state[0]); //for toggle switch in form
    const [oUState, setOUState] = useState(""); //for toggle switch in form
    const [licFlag, setLicFlag] = useState(true); //flag for line input change (true if value is ""/null)
    const [liValue, setLiValue] = useState(""); //used to be "" 

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
        lineInput = <div className='line-container' style={{display: checked ? "flex": "none"}}>
                <input class="line-input" type='number' value={liValue} onChange={(e) => {lineInputChange(e)}} /> 
                <div className='over-under-container'>
                <div onClick={() => setLineState('Over')} >
                        Over
                        <div className='over-under-tab' style={{display: oUState == 'Over' ? "block": "none"}}></div>
                    </div>
                    <div onClick={() => setLineState('Under')} >
                        Under
                        <div className='over-under-tab' style={{display: oUState == 'Under' ? "block": "none"}}></div>
                    </div>
                </div>
            </div>

        textBefore = "Display Style:"
        textAfterTrue = "Line:";
        textAfterFalse = "Total";
    }

    function handleClick()
    {
        if(props.type == 'statList')
        {
            if(props.cap[0] <= 10 || checked)
            {
                let temp = props.statState[0];
                temp[props.index][1] = 0; //changes value to line input back to default
                props.statState[1](temp);

                setChecked(!checked)

                if(checked && !licFlag)
                {
                    //clear line value
                    setLiValue("");
                    props.cap[1](props.cap[0] -= 2);
                    setLicFlag(true);
                }
        
            }
            else // no more room 
            {
                //do nothing
            }
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
                <input type="checkbox" id="player-card-style-checkbox" checked={checked} onClick={handleClick} onChange={(e) => {}}/>
                <span id={props.size == "small" ? 'small-slider': 'big-slider'} class="slider"></span>
            </label>
            <p class="toggle-right-label">{checked ? textAfterTrue: textAfterFalse }</p>
            {lineInput}
        </div>
          );
      }
      
      export default Toggle;