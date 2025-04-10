import '../styles.css';
import React, {useState,useEffect,useRef} from 'react';


function Summary(props) {

    //props.teamGameStats = [9] format: {category: , awayValue:, homeValue}] order: sog, faceoffWinningPctg, powerPlay, powerPlayPctg, pim, hits, blockedShots,giveaways,takeaways
        let loadingSpinner = <div class="loader"></div>;
        //const [showGames, setShowGames] = useState(false); //if true score reaction is displayed,
        const [statList, setStatList] = useState(loadingSpinner); //if true score reaction is displayed,
        const isLoading = useRef(true); //needed to create a loading state
        
        useEffect(() => {
          
          isLoading.current = true;
        if (props.teamGameStats && Array.isArray(props.teamGameStats) && props.teamGameStats[1]) {
        if (props.teamGameStats[1].length > 0) //showGames
        { 
        //will show start time, "live", or "Ended"
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
                    <div className='home-summary-stat-line' style={{width: ((stat.homeValue / (stat.homeValue + stat.awayValue))*98) + "%"}} id={"color-" + props.teamsInfo[0].abbrev}></div>
                    <div className='away-summary-stat-line' style={{width: ((stat.awayValue / (stat.homeValue + stat.awayValue))*98) + "%"}} id={"color-" + props.teamsInfo[1].abbrev}></div>
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
                    <div className='home-summary-stat-line' style={{width: ((stat.homeValue / (stat.homeValue + stat.awayValue))*98) + "%"}} id={"color-" + props.teamsInfo[0].abbrev}></div>
                    <div className='away-summary-stat-line' style={{width: ((stat.awayValue / (stat.homeValue + stat.awayValue))*98) + "%"}} id={"color-" + props.teamsInfo[1].abbrev}></div>
                </div>
            </div>
            );
        }
    }
        let sL = <div className='summary' >
                    <div className='summary-title-container'>
                        <p className='home-summary-title' id={"f-color-" + props.teamsInfo[0].abbrev} >{props.teamsInfo[0].placeName.default}</p>
                        <p className='away-summary-title' id={"f-color-" + props.teamsInfo[1].abbrev}  >{props.teamsInfo[1].placeName.default}</p>
                    </div>
                    {statArr}
                </div>;

        isLoading.current = false;
          
        setStatList(sL);
      }
      else
      {
        let sL = <div class="loader"></div>;
        setStatList(sL);
        /*setTimeout(() => {
          if(isLoading.current)
          {
            setStatList(sL);
            isLoading.current = false;
          }
        },2000)*/
      }
    }
       console.log('in useeffect'); 
      }, [props.teamGameStats]);
      


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
    
    return (
        <div className='basic-container' >
            {statList}
        </div>
      );
  }
  
  export default Summary;