import '../styles.css';
import React, {useState,useEffect} from 'react';



function ProgressBar(props) {


    function setLineState()
    {
       
    }

    let colorTrue;
    let colorFalse;
    if(props.ou == 'Over')
    {
        colorTrue = 'red';
        colorFalse = 'green';
    }
    else
    {
        colorTrue = 'green';
        colorFalse = 'red';
    }

    /* <p>{props.ou + " " + props.line}</p>*/
     return (
        <div className='progress-bar-container-with-label'>
            <p>{props.ou + " " + props.line}</p>
            
            <div className='progress-bar-container'> 
            <div className='progress-bar-slider' style={{left: ( props.value/props.line > 1.2 ? '100%' :((props.value/props.line) * 80) + "%")}}>{props.value}</div>
                <div className='progress-bar'>
                    <div className='progress-bar-value' style={{width: (props.value/props.line > 1.2 ? '100%' : ((props.value/props.line) * 100) + "%"), backgroundColor: (props.value < props.line ? colorTrue: colorFalse)}}></div>
                </div>
                <div className='progress-bar-ext'>
                    <div className='progress-bar-value' style={{width: (props.value/props.line > 1 ? (props.value/props.line > 1.2 ? '100%' : ((((props.value/props.line)-1)/0.2) * 100)+ "%") : 0), backgroundColor: (props.value < props.line ? colorTrue: colorFalse)}}></div>
                </div>
            </div>
        </div>
          );
      }
      
      export default ProgressBar;