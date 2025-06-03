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
    
    return (
        <div className='mobile'>
            <div className='mobile-container'>
                <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                <div>Please visit on us on non-mobile device</div>  
            </div>
        </div>
  );
}

export default Mobile;