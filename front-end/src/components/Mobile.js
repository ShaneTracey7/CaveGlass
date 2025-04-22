import '../mobileStyles.css';
import React, {useState,useEffect,useRef} from 'react';
import backArrow from '../pics/back-arrow.png';
import axios from 'axios';
import upArrow from '../pics/up-arrow.svg';
import downArrow from '../pics/down-arrow.svg';

function MobileGame(props) { 
    
    let backendUrl = 'https://caveglass.onrender.com'; //https://caveglass.onrender.com    'https://your-app.onrender.com/api/endpoint' 'http://localhost:8080'

    const [enteredKey, setEnteredKey] = useState(0); 
    const [mobileConnection, setMobileConnection] = useState(false); //maybe should be ref
    
    let display = <div className='mobile-container'>
                    <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                    <input type="number" max='9999' id="mobile-key-input" placeholder="4-Digit Code" onChange={(e) => setEnteredKey(e.target.value)}></input>
                    <div id="mobile-enter-button">Enter</div>
                </div>;   

     useEffect(() => {
        if(mobileConnection)
        {
            display = <div className='mobile-remote'>
                 <img className="mobile-remote-arrow" id="up-Arrow" src={upArrow} alt="Up Arrow"/>
                 <div className='remote-middle-container'>
                    <img className="mobile-remote-arrow" id="up-Arrow" src={upArrow} alt="Down Arrow"/>
                    <div id='remote-enter-button'>OK</div>
                    <img className="mobile-remote-arrow" id="up-Arrow" src={upArrow} alt="Down Arrow"/>
                 </div>
                 <img className="mobile-remote-arrow" id="up-Arrow" src={downArrow} alt="Down Arrow"/>
            </div>;            
        }
        else
        {
            display = <div className='mobile-container'>
                <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                <input type="text" maxLength='4' id="mobile-key-input" placeholder="4-Digit Code" onChange={(e) => setEnteredKey(e.target.value)}></input>
                <div id="mobile-enter-button" onClick={() => apiCheckKey()}>Enter</div>
            </div>;   
        }
      }, [mobileConnection]);

        const apiCheckKey = () => {
            if(!isNaN(Number(enteredKey)))//NEEDS TO BE A NUMBER
            {
                let key = Number(enteredKey);
                if(key > 1000 && key < 9999) //4 digit number
                {
                 
                    axios.post(backendUrl + '/api/users', {
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
                        }
                        else{
                            console.log("not a number");
                        }

                    });
                }
                else
                {
                    console.log("key is number outisde of range");
                    return;
                }
            }
            else //good to check
            {
                console.log("key is not a number");
                return;
            }
            
           console.log("api get key was called");
        }
    
    return (
        <div className='mobile'>
            {display}
        </div>
  );
}

export default MobileGame;