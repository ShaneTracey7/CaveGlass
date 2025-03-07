import '../styles.css';
import React, {useState,useEffect} from 'react';
import redTrash from '../pics/red-trash.png';
import ProgressBar from './ProgressBar';

function TeamCard(props) {

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

    /*
    for(let i = 0; i < stats.length; i++)
    {
        if(stats[i][1] == 0) // display style is 'total'
        {
            statArr.push( <div className='player-card-container'><p className='player-card-stat'> {stats[i][0] + ":"}</p></div>);
        }     
    }
    for(let i = 0; i < stats.length; i++)
    {
        if(stats[i][1] != 0) // display style is 'custom'
        {
            statArr.push( <div className='player-card-line-container'><p className='player-card-stat'> {stats[i][0]}</p> <ProgressBar value={Math.round(0.75 * 10) / 10} line={Math.round(stats[i][1] * 10) / 10} ou={stats[i][2]}></ProgressBar></div> );
        }
    }
        */
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
            for(let i = 0; i < totalStats.length; i++)
                {
                    let temp = <p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>
                    statArr.push(temp);
                }
        /*
        if(totalStats.length % 2 == 0) //even number
        {
            for(let i = 0; i < totalStats.length; i+=2)
                {
                    let temp = <div className='player-card-container'>
                                <p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>
                                <p className='player-card-stat'> {totalStats[i+1][0] + ": "+ totalStats[i+1][3]}</p>
                            </div>;
                    statArr.push(temp);
                }
        }
        else //odd number
        {
            let i = 0;
            let temp;
            while( i < totalStats.length)
                {
                    if(i == 0)
                    {
                        temp = <div className='player-card-container'>
                                    <p className='player-card-stat'> {totalStats[i][0] + ": " + totalStats[i][3]}</p>
                                </div>;
                        statArr.push(temp);
                        i++;
                    }
                    else
                    {
                        temp = <div className='player-card-container'>
                                <p id='player-card-stat-left' className='player-card-stat'> {totalStats[i][0] + ": " + totalStats[i][3]}</p>
                                <p id='player-card-stat-right' className='player-card-stat'> {totalStats[i+1][0] + ": " + totalStats[i+1][3]}</p>
                            </div>;
                        statArr.push(temp);
                        i+=2;
                    }
                }
        }
        */

        //adding custom stats
        for(let i = 0; i < customStats.length; i++)
            {
                statArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <ProgressBar value={Math.round(customStats[i][3] * 10) / 10} line={Math.round(customStats[i][1] * 10) / 10} ou={customStats[i][2]}></ProgressBar></div> );
            }

                        //style={{backgroundImage: "url(" + props.teamInfo.logo + ")"}}
    return (
        <div className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} id={"color-" + props.teamInfo.abbrev}>
            

            <div id="player-card-layer2"className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'}> 
                <div className='player-card-stat-container'>
                    {statArr}
                </div>
                <div className='bg-player-card-text-container'>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                    <p id="bg-player-card-text">{props.teamInfo.placeName.default}</p>
                </div>
                <div id="player-card-layer3"className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'}>
                    <img className='player-card-delete' onClick={() => {deleteTeamCard()}} src={redTrash} alt='delete'/>
                    <img className='player-card-img' src={props.teamInfo.darkLogo} alt={props.teamData[1]}/>
                    
                </div>
                
            </div>
            <div className='player-card-name-container'>
                <p id="player-card-name">{props.teamData[1]}</p>
            </div>
            
        </div>
      );
  }
  
  export default TeamCard;