import '../styles.css';
import React, {useState,useEffect} from 'react';
import redTrash from '../pics/red-trash.png';
import ProgressBar from './ProgressBar';

function PlayerCard(props) {

    function deletePlayerCard()
    {   
        let temp = props.players[0];
        let newTemp = temp.filter((e)=>{ return e[0] != props.playerData[0];});
        props.players[1](newTemp);
        console.log('card deleted');
    }


    let stats = props.playerData[8];
    const statArr = [];
    const customStatArr = [];

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
       const totalStats = [];;
       const customStats = [];;
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
        if(totalStats.length % 3 == 0) //divisible by 3
        {
            let col1 = [];
            let col2 = [];
            let col3 = [];
            let temp1;
            let temp2;
            let temp3;

            for(let i = 0; i < totalStats.length; i+=3)
                {
                    col1.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                    col2.push(<p className='player-card-stat'> {totalStats[i+1][0] + ": "+ totalStats[i+1][3]}</p>);
                    col3.push(<p className='player-card-stat'> {totalStats[i+2][0] + ": "+ totalStats[i+2][3]}</p>);
                }
                temp1 = <div className='player-card-container'>
                            {col1}   
                    </div>;
                temp2 = <div className='player-card-container'>
                            {col2}   
                    </div>;
                temp3 = <div className='player-card-container'>
                            {col3}   
                    </div>;
                statArr.push(temp1);
                statArr.push(temp2);
                statArr.push(temp3);
        }/*
        if(totalStats.length % 3 == 0) //divisible by 3
        {
            for(let i = 0; i < totalStats.length; i+=3)
                {
                    let temp = <div className='player-card-container'>
                                <p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>
                                <p className='player-card-stat'> {totalStats[i+1][0] + ": "+ totalStats[i+1][3]}</p>
                                <p className='player-card-stat'> {totalStats[i+2][0] + ": "+ totalStats[i+2][3]}</p>
                            </div>;
                    statArr.push(temp);
                }
        }*/
        else if(totalStats.length % 3 == 1)
        {
            let i = 0;
            let col1 = [];
            let col2 = [];
            let col3 = [];
            let temp1;
            let temp2;
            let temp3;
            while( i < totalStats.length)
                {
                    
                    if(i == 0)
                    {
                        
                        col2.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                        i++;
                    }
                    else
                    {
                        col1.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                        col2.push(<p className='player-card-stat'> {totalStats[i+1][0] + ": "+ totalStats[i+1][3]}</p>);
                        col3.push(<p className='player-card-stat'> {totalStats[i+2][0] + ": "+ totalStats[i+2][3]}</p>);
                        i+=3;
                    }
                }
                temp1 = <div className='player-card-container'>
                            {col1}   
                    </div>;
                temp2 = <div className='player-card-container'>
                            {col2}   
                    </div>;
                temp3 = <div className='player-card-container'>
                            {col3}   
                    </div>;
                statArr.push(temp1);
                statArr.push(temp2);
                statArr.push(temp3);
        }
        else //totalStats.length % 3 == 2
        {
            let i = 0;
            let col1 = [];
            let col2 = [];
            let col3 = [];
            let temp1;
            let temp2;
            let temp3;
            while( i < totalStats.length)
                {
                    if(i == 0)
                    {
                        col1.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                        i++;
                    }
                    else if(i == 1)
                    {
                        col2.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                        i++;
                    }
                    else
                    {
                        col1.push(<p className='player-card-stat'> {totalStats[i][0] + ": "+ totalStats[i][3]}</p>);
                        col2.push(<p className='player-card-stat'> {totalStats[i+1][0] + ": "+ totalStats[i+1][3]}</p>);
                        col3.push(<p className='player-card-stat'> {totalStats[i+2][0] + ": "+ totalStats[i+2][3]}</p>);
                        i+=3;
                    }
                }
            temp1 = <div className='player-card-container'>
                            {col1}   
                    </div>;
            temp2 = <div className='player-card-container'>
                            {col2}   
                    </div>;
            temp3 = <div className='player-card-container'>
                            {col3}   
                    </div>;
            statArr.push(temp1);
            statArr.push(temp2);
            statArr.push(temp3);
        }
            /* old way (2 cols)
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
        }*/

        //adding custom stats
        for(let i = 0; i < customStats.length; i++)
            {
                customStatArr.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <ProgressBar value={Math.round(customStats[i][3] * 10) / 10} line={Math.round(customStats[i][1] * 10) / 10} ou={customStats[i][2]}></ProgressBar></div> );
            }

    return (                
        <div className='PlayerCard1' style={props.darkMode ? {border: '4px solid white'}: {border: '4px solid black'}} id={"color-" + props.teamInfo.abbrev}> {/*props.darkMode ? 'PlayerCard1-dark': 'PlayerCard1'*/ }
            
            <div id="player-card-layer2"className='PlayerCard' style={{backgroundImage: "url(" + props.teamInfo.darkLogo + ")"}}>{/*className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} */ }
                
                <p id="bg-player-card-number">{ props.playerData[4]}</p>
                
                <div id="player-card-layer3"className='PlayerCard'> {/*className={props.darkMode ? 'PlayerCard-dark': 'PlayerCard'} */ }
                    <div className='player-card-stat-container'>
                    <div className='player-card-normal-stat-container'>
                            {statArr}
                        </div>
                        {customStatArr}
                    </div>
                    <div id="profile-pic-and-button">
                        <img className='player-card-delete' onClick={() => {deletePlayerCard()}} src={redTrash} alt='delete'/>
                        <img className='player-card-img' src={props.playerData[5]} alt={props.playerData[1]}/>
                    </div>
                    
                </div>
                
            </div>
            <div className='player-card-name-container'>
                <p id="player-card-name">{props.playerData[2] + " " + props.playerData[3]}</p>
            </div>
            
        </div>
      );
  }
  
  export default PlayerCard;