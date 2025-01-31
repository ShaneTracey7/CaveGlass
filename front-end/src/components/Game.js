import '../styles.css';
import React, {useState} from 'react';
import ScoreReaction from './ScoreReaction';
import axios from 'axios';

function Game(props) {
  
  const [score, setScore] = useState(false); //if true score reaction is displayed
  const [infoType, setInfoType] = useState('XXX'); //3 States: Summary(SUM), Box-score(BOX), and Play-by-Play(PBP)
  const [playArr, setPlayArr] = useState([]); //if true score reaction is displayed,
  const [roster, setRoster] = useState([]); //if true score reaction is displayed,
  


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
          setRoster(data.data.rosterSpots);
          data.data.plays.forEach(element => {
             let temp = playArr;
             temp.push(element);
             setPlayArr(temp);
        
          });
          
       })
    }

    //idk if i need this quite yet
    /*function getTeamById(id)
    {
        switch(id) {
            case 1:
              return 'BUF';
            case y:
              // code block
              break;
            default:
              // code block
          }
    } */

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

    function formatPeriod(num)
    {
        switch(num) {
            case 1:
                return "1st";
            case 2:
                return "2nd";
            case 1:
                return "3rd";
            case 1:
                return "OT";
            case 5:
                return "SO";
            default:
        }
    }

    //capitalizes each word in a sentence(string)
    function capitalizeEachWord(str)
    {
        let newStr = str.charAt(0).toUpperCase();
        let flag = false;
        for (let i = 1; i < str.length; i++) {
            if(str[i] == ' ')
            {   
                flag = true;
                newStr = newStr + str[i];
            }
            else
            {
                if(flag)
                {
                    newStr = newStr + str.charAt(i).toUpperCase();
                    flag = false;
                }
                else
                {
                    newStr = newStr + str[i];
                }
            }
          }
          return newStr;
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

        let pArr = [];

        playArr.forEach(play => {
            
            if(play.typeDescKey == 'stoppage' || play.typeDescKey == 'period-start'|| play.typeDescKey == 'period-end'  || play.typeDescKey == 'game-end')
            {
                var desc = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                if(play.typeDescKey == 'stoppage')
                {
                    desc = capitalizeEachWord(play.details.reason.replaceAll('-', ' '));
                }
               let p =  <div className='play-card-basic'>
                            <div className='middle-basic-card'>
                                <img id="whistle-img" src={ require("../pics/whistle.png")} alt="whistle"/> 
                                <p>{desc}</p>
                            </div>
                        </div>; 
                pArr.push(p);
            }
            else if (play.typeDescKey == 'goal')
            {
                let pic;
                if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                {
                    pic = props.game.homeTeam.abbrev;
                }
                else
                {
                    pic = props.game.awayTeam.abbrev;
                }

                let player1 = roster.find(p1 => {return p1.playerId == play.details.scoringPlayerId});

                let p =  <div className='play-card-goal'>
                            <div id={"color-"+ pic} className='top-goal-card'>
                                
                            </div>
                            <div id={"color-"+ pic} className='bottom-goal-card'>
                                <div className='left-card'>
                                    <p className='time-remaining-text-goal'>{play.timeRemaining}</p>
                                    <p id="goal-period">{formatPeriod(play.periodDescriptor.number)}</p>
                                </div>
                                <img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
                                <div className='right-card'>
                                    <p className='card-description-goal'>{player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " (" + play.details.scoringPlayerTotal + ")"}</p>     
                                    <p></p>
                                </div>
                            </div>
                        </div>; 
                pArr.push(p);
            }
            else
            {   let description = " ";
                let playType = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                let pic;
                if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                {
                    pic = props.game.homeTeam.abbrev;
                }
                else
                {
                    pic = props.game.awayTeam.abbrev;
                }
                
                let player1;
                let player2;
                switch(play.typeDescKey) {
                    case 'faceoff':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.winningPlayerId});
                        player2 = roster.find(p1 => {return p1.playerId == play.details.losingPlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " face-off won against " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        playType = 'Face-off';
                        break;
                    case 'hit':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.hittingPlayerId});
                        player2 = roster.find(p1 => {return p1.playerId == play.details.hitteePlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " hit " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        break;
                    case 'shot-on-goal':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        player2 = roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " +play.details.shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        break;
                    case 'missed-shot':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " +play.details.shotType + " shot " + play.details.reason.replaceAll('-', ' ');
                        break;
                    case 'giveaway':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.playerId});
                        description = "Giveaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                        break;
                    case 'takeaway':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.playerId});
                        description = "Takeaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                        break;
                    case 'penalty':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.committedByPlayerId});
                        if (play.details.hasOwnProperty("drawnByPlayerId"))
                        {
                            player2 = roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes for "+play.details.descKey + " " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes for "+play.details.descKey;
                        }
                        break;
                    case 'blocked-shot':
                        player1 = roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        if (play.details.hasOwnProperty("blockingPlayerId"))
                        {
                            player2 = roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked";// + play.details.reason.replaceAll('-', ' ');
                        }
                        break;
                    default:
                      // code block
                  }

                let p = <div className='play-card'>
                            <div className='left-card'>
                                <p className='time-remaining-text'>{play.timeRemaining}</p>
                                <p>{formatPeriod(play.periodDescriptor.number)}</p>
                            </div>
                            <img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
                            <div className='right-card'>
                                <p className='card-description'>{playType}</p>     
                                <p>{description}</p>
                            </div>
                            
                        </div>; 
                pArr.push(p);
            }
                
            });

            
            info = <div className='playList'> {playArr.map((play,index) => (
                    <div>{pArr[index]}</div>
                ))}
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
