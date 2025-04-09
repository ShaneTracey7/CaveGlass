import '../styles.css';
import React, {useState,useEffect} from 'react';


function Summary(props) {

    //props.teamGameStats = [9] format: {category: , awayValue:, homeValue}] order: sog, faceoffWinningPctg, powerPlay, powerPlayPctg, pim, hits, blockedShots,giveaways,takeaways
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
      }, [windowWidth]); 


    function setName(statName)
    {   
        switch(statName)
        {
            case "sog": return "Shots on Goal";
            case "faceoffWinningPctg": return "Faceoff Winning %";
            case "powerPlay": return "Power Play Goals";
            case "powerPlayPctg": return "Power Play %";
            case "pim": return "Penalty Minutes";
            case "hits": return "Hits";
            case "blockedShots": return "Blocked Shots";
            case "giveaways": return "Giveaways";
            case "takeaways": return "Takeaways";
            default: return statName;    
        }
    }

    function setValues(stat,isHome)
    {
        switch(stat.category)
        {
            case "faceoffWinningPctg": return isHome ? Math.round(stat.homeValue*100)+ "%": Math.round(stat.awayValue*100)+ "%"
            case "powerPlayPctg": return isHome ? Math.round(stat.homeValue*100)+ "%": Math.round(stat.awayValue*100)+ "%"
            default: return isHome ? stat.homeValue: stat.awayValue;    
        }
    }

    let statArr = [];
    
    for (let i = 0; i < props.teamGameStats[1].length; i++) 
    {  
        let stat = props.teamGameStats[1][i];
        if(stat.category == "powerPlay")
        {
            stat = props.teamGameStats[1][i+1]; //powerplay percentage
            let stat2 = props.teamGameStats[1][i]; //powerplay goals
            statArr.push(<div className='summary-stat-pp' key={stat.category}>
                <div className='top-summary-stat'>
                    <p className='home-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}} >{setValues(stat,true)}</p>
                    <p className='summary-stat-text'>{setName(stat.category)}</p>
                    <p className='away-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}}>{setValues(stat,false)}</p>
                </div>
                <div className='bottom-summary-stat'>
                    <div className='home-summary-stat-line' style={{width: ((stat.homeValue / (stat.homeValue + stat.awayValue))*95) + "%"}} id={"color-" + props.teamsInfo[0].abbrev}></div>
                    <div className='away-summary-stat-line' style={{width: ((stat.awayValue / (stat.homeValue + stat.awayValue))*95) + "%"}} id={"color-" + props.teamsInfo[1].abbrev}></div>
                </div>
                <div className='bottom-summary-stat-pp'>
                    <p className='home-summary-stat-value-pp' >{setValues(stat2,true)}</p>
                    <p className='away-summary-stat-value-pp' >{setValues(stat2,false)}</p>
                </div>
            </div>
            );
            i++;//increment so we skip the powerplay percentage
        }
        else
        {
            statArr.push(<div className='summary-stat' key={stat.category}>
                <div className='top-summary-stat'>
                    <p className='home-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}} >{setValues(stat,true)}</p>
                    <p className='summary-stat-text'>{setName(stat.category)}</p>
                    <p className='away-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}}>{setValues(stat,false)}</p>
                </div>
                <div className='bottom-summary-stat'>
                    <div className='home-summary-stat-line' style={{width: ((stat.homeValue / (stat.homeValue + stat.awayValue))*97) + "%"}} id={"color-" + props.teamsInfo[0].abbrev}></div>
                    <div className='away-summary-stat-line' style={{width: ((stat.awayValue / (stat.homeValue + stat.awayValue))*97) + "%"}} id={"color-" + props.teamsInfo[1].abbrev}></div>
                </div>
            </div>
            );
        }
    }
    /*
    let display = {props.teamGameStats[1].map((stat) => {
        return (
            <div className='summary-stat' key={stat.category}>
                <div className='top-summary-stat'>
                    <p className='home-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}} >{setValues(stat,true)}</p>
                    <p className='summary-stat-text'>{setName(stat.category)}</p>
                    <p className='away-summary-stat-value' style={props.darkMode ? {color: 'white'}: {color: 'black'}}>{setValues(stat,false)}</p>
                </div>
                <div className='bottom-summary-stat'>
                    <div className='home-summary-stat-line' style={{width: ((stat.homeValue / (stat.homeValue + stat.awayValue))*95) + "%"}} id={"color-" + props.teamsInfo[0].abbrev}></div>
                    <div className='away-summary-stat-line' style={{width: ((stat.awayValue / (stat.homeValue + stat.awayValue))*95) + "%"}} id={"color-" + props.teamsInfo[1].abbrev}></div>
                </div>
            </div>
        );
    })}*/
    
    return (
        <div className='summary' style={props.darkMode ? {border: '4px solid white'}: {border: '4px solid black'}} >{/*{props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} */}
            <div className='summary-title-container'>
                <p className='home-summary-title' id={"f-color-" + props.teamsInfo[0].abbrev} >{props.teamsInfo[0].placeName.default}</p>
                <p className='away-summary-title' id={"f-color-" + props.teamsInfo[1].abbrev}  >{props.teamsInfo[1].placeName.default}</p>
            </div>
            {statArr}
        </div>
      );
  }
  
  export default Summary;