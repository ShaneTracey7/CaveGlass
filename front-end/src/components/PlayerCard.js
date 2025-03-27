import '../styles.css';
import React, {useState,useEffect,useRef} from 'react';
import redTrash from '../pics/red-trash.png';
import ProgressBar from './ProgressBar';

function PlayerCard(props) {

   const [customStatArr, setCustomStatArr] = useState(setDefaultCustomStats());
   const elementRef = useRef(null); //used on parent div
   const prevHeightRef = useRef(0);// used to change jsx upon player card height
   const prevWidthRef = useRef(0);// used to change jsx upon player card width

      useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            // Get the new dimensions
            const { width, height } = entry.contentRect;
            console.log("height: " + height);

            // Compare previous Dims with the current height
            const prevHeight = prevHeightRef.current;
            const prevWidth = prevWidthRef.current;

            if(prevHeight >= 370 && height < 370 || (height >= 370 && prevWidth >= 900 && width < 900))//was over 330
                {
                    let temp1 = [];
                    for(let i = 0; i < customStats.length; i++)
                        {   
                            temp1.push( <div className='player-card-line-container'><p className='shrunk-player-card-line-stat'> {customStats[i][0]}</p> <p className='shrunk-stat-line-text'>{"(" +customStats[i][2] + " " + Math.round(customStats[i][1] * 10) / 10 + "): " + Math.round(customStats[i][3] * 10) / 10}</p></div> );
                        }
                        let temp2 = temp1;
                       setCustomStatArr(temp2);
                } 
            else if(prevHeight < 370 && height >= 370 || (height >= 370 && prevWidth < 900 && width >= 900))
                {
                    if(width >= 900)
                    {    
                        let temp1 = [];
                        for(let i = 0; i < customStats.length; i++)
                            { 
                                temp1.push( <div className='player-card-line-container'><p className='player-card-line-stat'> {customStats[i][0]}</p> <ProgressBar value={Math.round(customStats[i][3] * 10) / 10} line={Math.round(customStats[i][1] * 10) / 10} ou={customStats[i][2]}></ProgressBar></div> );
                            }
                            let temp2 = temp1;
                            setCustomStatArr(temp2);
                    }
                }
            else
            {
                console.log("else")
            }
            // Update the ref with the current Dims for the next comparison
            prevHeightRef.current = height;
            prevWidthRef.current = width;

          });
        });

        // Observe the element
        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }
  
        // Cleanup the observer on component unmount
        return () => {
            if (elementRef.current) {
            resizeObserver.unobserve(elementRef.current);
            }
        };
        }, []);

    //needed to initalize customStatArr
   function setDefaultCustomStats()
   {
       let stats = props.playerData[8];

      const customStats = [];
      for(let i = 0; i < stats.length; i++)
       {
           if(stats[i][1] != 0) // display style isn'total'
           {
               customStats.push(stats[i]);
           }
       }
       //adding custom stats
       const csa = [];
       for(let i = 0; i < customStats.length; i++)
           {
            csa.push( <div className='player-card-line-container'><p className='shrunk-player-card-line-stat'> {customStats[i][0]}</p> <p className='shrunk-stat-line-text'>{"(" +customStats[i][2] + " " + Math.round(customStats[i][1] * 10) / 10 + "): " + Math.round(customStats[i][3] * 10) / 10}</p></div> );
            }
       return csa;
   }

    function deletePlayerCard()
    {   
        let temp = props.players[0];
        let newTemp = temp.filter((e)=>{ return e[0] != props.playerData[0];});
        props.players[1](newTemp);
        console.log('card deleted');
    }

    let stats = props.playerData[8];
    const statArr = [];
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
        }
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

    return (                
        <div className='PlayerCard1' style={props.darkMode ? {border: '4px solid white'}: {border: '4px solid black'}} id={"color-" + props.teamInfo.abbrev} ref={elementRef}> {/*props.darkMode ? 'PlayerCard1-dark': 'PlayerCard1'*/ }
            
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