import '../mobileStyles.css';
import React, {useState,useEffect,useRef} from 'react';
import backArrow from '../pics/back-arrow.png';
import axios from 'axios';
import upArrow from '../pics/up-arrow.svg';
import downArrow from '../pics/down-arrow.svg';
import leftArrow from '../pics/left-arrow.svg';
import rightArrow from '../pics/right-arrow.svg';
import sumButton from '../pics/remote-sum.png';
import focButton from '../pics/remote-foc.png';
import pbpButton from '../pics/remote-pbp.png';
import okButton from '../pics/remote-ok.png';
import homeButton from '../pics/home.svg';
import stopButton from '../pics/stop-sign.png';


function Mobile(props) { 
    
    let backendUrl = 'https://caveglass.onrender.com'; //https://caveglass.onrender.com    'https://your-app.onrender.com/api/endpoint' 'http://localhost:8080'

    const [enteredKey, setEnteredKey] = useState(""); 
    const [mobileConnection, setMobileConnection] = useState(false); //maybe should be ref
    const [showError, setShowError] = useState(""); //shows error message for incorrect code input
    const [inGame, setInGame] = useState(true); //default is false //determines whether to show view mode buttons (Summary,Player Focus, PlaybyPlay)
    const [showInput, setShowInput] = useState(true);  //default is false //determines whether to show an input field

    const apiCheckKey = () => {
        if(!isNaN(Number(enteredKey)))//NEEDS TO BE A NUMBER
        {
            let key = Number(enteredKey);
            if(key > 1000 && key < 9999) //4 digit number
            {
             
                axios.post(backendUrl + '/key', {
                    type: 'checkKey',
                    key: key,
                }, {
                    headers: {
                    'content-type': 'application/json'
                    }}).then((data) => {
                    console.log(data);
                  
                    if(data.data.check)
                    {
                        setMobileConnection(true);
                        setShowError("");
                    }
                    else{
                        setShowError("Code does not match");
                        console.log("key does not match");
                    }

                });
            }
            else
            {
                setShowError("Code must have 4-digits");
                console.log("key is number outside of range");
                return;
            }
        }
        else //good to check
        {
            setShowError("Code must be a number");
            console.log("key is not a number");
            return;
        }
        
       console.log("api check key was called");
    }

    let displayV = <div className='mobile-container'>
                        <img className="cg-logo-1" id="main-home-logo" src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                        <input type="text" maxLength="4" id="mobile-key-input" placeholder="4-Digit Code" value={enteredKey} onChange={(e) => setEnteredKey(e.target.value)}></input>
                        <div id="mobile-enter-button" onClick={apiCheckKey}>Enter</div>
                    </div>;     
    const [display, setDisplay] = useState(displayV);  

     useEffect(() => {
        let d ="";
        console.log(" in use effect mobileConnection: " + mobileConnection);
        if(mobileConnection)
        {
            d = <div className='mobile-remote'>
                 <img className="mobile-remote-arrow" id="up-Arrow" src={upArrow} alt="Up Arrow"/>
                 <div className='remote-middle-container'>
                    <img className="mobile-remote-arrow" id="left-Arrow" src={leftArrow} alt="Left Arrow"/>
                    <img className="mobile-remote-arrow" src={okButton} alt="OK"/>
                    <img className="mobile-remote-arrow" id="right-Arrow" src={rightArrow} alt="Right Arrow"/>
                 </div>
                 <img className="mobile-remote-arrow" id="down-Arrow" src={downArrow} alt="Down Arrow"/>

                 <div className='remote-middle-container' style={{display: showInput ? "flex": "none"}}>
                    <input type="number" maxLength='3' id="mobile-key-input" placeholder="Enter Value" value={enteredKey} onChange={(e) => setEnteredKey(e.target.value)}></input>
                
                 </div>

                 <div className='remote-middle-container' style={{display: inGame ? "flex": "none"}}>
                    <img className="mobile-remote-button" src={sumButton} alt="Summary"/>
                    <img className="mobile-remote-button" src={focButton} alt="Player Focus"/>
                    <img className="mobile-remote-button" src={pbpButton} alt="Play-by-Play"/>
                 </div>

                 <div className='remote-middle-container' >
                    <img className="mobile-remote-button" id="left-Arrow" src={homeButton} alt="Home"/>
                    <img className="mobile-remote-button" id="right-Arrow" src={stopButton} alt="Stop"/>
                 </div>
            </div>;  
            setDisplay(d);          
        }
        else
        {
            d = <div className='mobile-container'>
                <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                <input type="text" maxLength='4' id="mobile-key-input" placeholder="4-Digit Code" value={enteredKey} onChange={(e) => setEnteredKey(e.target.value)}></input>
                <div id='mobile-error-message' style={{display: showError == "" ? "none": "flex"}}>{showError}</div>
                <div id="mobile-enter-button" onClick={apiCheckKey}>Enter</div>
            </div>;  
            setDisplay(d);   
        }
      }, [mobileConnection,enteredKey,showError]);  
    
    return (
        <div className='mobile'>
            {display}
        </div>
  );
}

export default Mobile;