import '../styles.css';
import React, {useState,useEffect} from 'react';
import redTrash from '../pics/red-trash.png';
import ProgressBar from './ProgressBar';

function TeamCard(props) {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [widthFlag, setWidthFlag] = useState(window.innerWidth > 1100 ? true : false);
    window.addEventListener('resize', () => { setWindowWidth(window.innerWidth)});

    useEffect(() => {
        
        if(widthFlag) // was > 1100
        {
            if(windowWidth <= 1100)
            {
                //make changes
                for(let i = 0; i < customStats.length; i++)
                    {   
                        customStatArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <p className='shrunk-stat-line-text'>{"(" +customStats[i][2] + " " + Math.round(customStats[i][1] * 10) / 10 + "): " + Math.round(customStats[i][3] * 10) / 10}</p></div> );
                    }
            }
        }
        else
        {
            if(windowWidth > 1100)
            {
                //make changes
                for(let i = 0; i < customStats.length; i++)
                    { 
                        customStatArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <ProgressBar value={Math.round(customStats[i][3] * 10) / 10} line={Math.round(customStats[i][1] * 10) / 10} ou={customStats[i][2]}></ProgressBar></div> );
                    }
            }
        }
    
      }, [windowWidth]); 


    function deleteTeamCard()
    {   
        let temp = props.teams[0];
        let newTemp = temp.filter((e)=>{ return e[0] != props.teamData[0];});
        props.teams[1](newTemp);

        //add back to options list
        let temp2 = props.statOptionsState[0];

        temp2.push(props.teamInfo);
        props.statOptionsState[1](temp2);

        console.log('card deleted');
    }


    let stats = props.teamData[3];
    const statArr = [];
    const customStatArr = [];

       const totalStats = [];
       const customStats = [];
    for(let i = 0; i < stats.length; i++)
        {
            if(stats[i][1] == 0) // display style isn'total'
            {
                totalStats.push(stats[i]);
            }
            else // display style is 'custom'
            {
                customStats.push(stats[i]);
            }
        }

        //adding total stats
        let col1 = [];
        let col2 = [];
        let col3 = [];
        //need to go from here
            
            if(totalStats.length > 0)
            {
                if(totalStats.length == 1)
                {
                    col2.push(<p className='player-card-stat'> {totalStats[0][0] + ": "+ totalStats[0][3]}</p>);
                }
                else if (totalStats.length == 2)
                {
                    col1.push(<p className='player-card-stat'> {totalStats[0][0] + ": "+ totalStats[0][3]}</p>);
                    col3.push(<p className='player-card-stat'> {totalStats[1][0] + ": "+ totalStats[1][3]}</p>);
                }
                else if(totalStats.length == 3)
                {
                    col1.push(<p className='player-card-stat'> {totalStats[0][0] + ": "+ totalStats[0][3]}</p>);
                    col2.push(<p className='player-card-stat'> {totalStats[1][0] + ": "+ totalStats[1][3]}</p>);
                    col3.push(<p className='player-card-stat'> {totalStats[2][0] + ": "+ totalStats[2][3]}</p>);
                }
                let temp1 = <div className='player-card-container'>
                        {col1}   
                    </div>;
                let temp2 = <div className='player-card-container'>
                        {col2}   
                    </div>;
                let temp3 = <div className='player-card-container'>
                        {col3}   
                    </div>;
                statArr.push(temp1);
                statArr.push(temp2);
                statArr.push(temp3);
            }

        //adding custom stats
    if(customStats.length > 0)
            {   
                if(window.innerWidth > 1100)
                {
                    for(let i = 0; i < customStats.length; i++)
                    {   
                        customStatArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <ProgressBar value={Math.round(customStats[i][3] * 10) / 10} line={Math.round(customStats[i][1] * 10) / 10} ou={customStats[i][2]}></ProgressBar></div> );
                    }
                }       
                else
                {   
                    for(let i = 0; i < customStats.length; i++)
                    {
                        customStatArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <p className='shrunk-stat-line-text'>{"(" +customStats[i][2] + " " + Math.round(customStats[i][1] * 10) / 10 + "): " + Math.round(customStats[i][3] * 10) / 10}</p></div> );
                    }
                }
            }
                    
    return (
        <div className='PlayerCard1' style={props.darkMode ? {border: '4px solid white'}: {border: '4px solid black'}} id={"color-" + props.teamInfo.abbrev}>{/*{props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} */}
            

            <div id="player-card-layer2" className='PlayerCard'> 
                
                <div className='bg-player-card-text-container-team'>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                </div>

                <div id="player-card-layer3"className='PlayerCard'> 
                    <div className='player-card-stat-container'>
                        <div className='player-card-normal-stat-container'>
                            {statArr}
                        </div>
                        {customStatArr}
                    </div>
                    <div id="profile-pic-and-button">
                        <img className='player-card-delete' onClick={() => {deleteTeamCard()}} src={redTrash} alt='delete'/>
                        <img className='player-card-img' src={props.teamInfo.darkLogo} alt={props.teamData[1]}/>
                    </div>
                </div>
                
            </div>
            <div className='player-card-name-container'>
                <p id="player-card-name">{props.teamData[1]}</p>
            </div>
            
        </div>
      );
  }
  
  export default TeamCard;