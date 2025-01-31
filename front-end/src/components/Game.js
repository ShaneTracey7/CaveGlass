import '../styles.css';
import React, {useState} from 'react';
import ScoreReaction from './ScoreReaction';
import axios from 'axios';

function Game(props) {
  
  const [score, setScore] = useState(false); //if true score reaction is displayed
  const [infoType, setInfoType] = useState('SUM'); //3 States: Summary(SUM), Box-score(BOX), and Play-by-Play(PBP)
  const [playArr, setPlayArr] = useState([]); //if true score reaction is displayed,

    //data will be the string we send from our server
    const getPlaybyPlay = () => {
        axios.post('http://localhost:8080', {
            type: 'pbp',
            game: props.game.id,
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
          //this console.log will be in our frontend console
          console.log(data)
          //might crash if no games that day
          data.data.plays.forEach(element => {
             let temp = playArr;
             temp.push(element);
             setPlayArr(temp);
             console.log(element.typeDescKey);
        
          });
          
       })
    }
    function toolbarClick(type)
    {
        if(type == 'SUM')
        {   
            if(infoType != 'SUM')
            {
                setInfoType('SUM');
            }
            console.log('SUM')
        }
        else if(type == 'BOX')
        {
            if(infoType != 'BOX')
            {
                setInfoType('BOX');
            }
            console.log('BOX')
        }
        else //type == 'PBP'
        {   
            //automatically update by calling api every 10-15 secs and handle the new data(go by difference in length of play array anc check if there are any goals from the new plays retrieved, if so, set the score to true)
            if(infoType != 'PBP')
            {
                getPlaybyPlay();
                setTimeout(() => {
                    setInfoType('PBP');
                    console.log("Delayed for 2 seconds.");
                }, 2000);

            }
            console.log('PBP')
        }
    }



    

  let display;
  let info;
  if (score)
  {
    display = <ScoreReaction scored={setScore}/>;
    info = <p> .</p>
  }
  else
  {
    display = <div>
        <p>Game</p>
        <button onClick={() => props.setingame(false)}>Back</button>
        <div id="toolbar">
            <div id="SUM" className={infoType == "SUM" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("SUM")}}>Summary</div>
            <div id="BOX" className={infoType == "BOX" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("BOX")}}>Box Score</div>
            <div id="PBP" className={infoType == "PBP" ? 'toolbar-button-selected': 'toolbar-button'} onClick={() => {toolbarClick("PBP")}}>Play-by-Play</div>
        </div>
        <button onClick={getPlaybyPlay}>get play by play</button>
    </div> ;

    if(infoType == 'SUM')
    {
        info = <p> no plays</p>
    }
    else if(infoType == 'BOX')
    {
        info = <p> no plays</p>
    }
    else //type == 'PBP'
    {
        
        info = <div className='playList'> {playArr.map((play, index) => (
                <div className='playCard'>
                 
                    <p>{play.typeDescKey}</p>
                
                </div>))}
                </div>;
    }
  }

    return (
      <div className="Game">
      {display}
      {info}
      </div>
    );
}

export default Game;
