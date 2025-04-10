import '../styles.css';
import React, {useState,useEffect,useRef} from 'react';


function PlayByPlay(props) {

    let loadingSpinner = <div class="loader"></div>;
    const isLoading = useRef(true); //needed to create a loading state
    const [playList, setPlayList] = useState(loadingSpinner); //if true score reaction is displayed,

    //This function is called when component is create (called only once)
    useEffect(() => { 
        //just here for testing
        //apiGetGames();//getting today's game data from NHL api
    }, []);

    useEffect(() => {
          
        isLoading.current = true;

          //defaults to no plays if it hasn't been clicked before
        
        if (props.playArr && Array.isArray(props.playArr) && props.playArr.length > 0) //showGames
        { 
            //possible gameState's: PRE(right b4 game start), FUT(future), OFF, LIVE, FINAL
            props.playArr.forEach(play => {
        
                if(!play.hasOwnProperty("typeDescKey"))
                {
                    //catch weird case
                }
                
                if(play.typeDescKey == 'stoppage' || play.typeDescKey == 'period-start'|| play.typeDescKey == 'period-end'  || play.typeDescKey == 'game-end')
                {
                    var desc = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                    if(play.typeDescKey == 'stoppage')
                    {
                        let reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "Stoppage");
                        desc = capitalizeEachWord(reason);
                    }
                    let p =  <div className={props.darkMode ? 'play-card-basic-dark': 'play-card-basic'}>
                                <div className='middle-basic-card'>
                                    <img id="whistle-img" src={ props.darkMode ? (require("../pics/whistle-white.png")): (require("../pics/whistle.png"))} alt="whistle"/> 
                                    <p className={props.darkMode ? 'card-description-basic-dark': 'card-description-basic'}>{desc}</p>
                                </div>
                            </div>; 
                    pArr.push(p);
                }
                else if (play.typeDescKey == 'goal')
                {
                    let pic;
                    let pic_url;
                    let pic2;
                    let pic2_url;
                    let assistStr;
                    let score1;
                    let score2;
                    
                    if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                    {
                        pic = props.game.homeTeam.abbrev;
                        pic_url = props.game.homeTeam.darkLogo;
                        score1 = play.details.homeScore;
                        pic2 = props.game.awayTeam.abbrev
                        pic2_url = props.game.awayTeam.darkLogo;
                        score2 = play.details.awayScore;
                        
                    }
                    else
                    {
                        pic = props.game.awayTeam.abbrev;
                        pic_url = props.game.awayTeam.darkLogo;
                        score1 = play.details.awayScore;
                        pic2 = props.game.homeTeam.abbrev;
                        pic2_url = props.game.homeTeam.darkLogo;
                        score2 = play.details.homeScore;
                    }
                    if (play.details.hasOwnProperty("assist1PlayerId"))
                    {
                        
                        if (play.details.hasOwnProperty("assist2PlayerId"))
                        {
                            let player2 = props.roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                            let player3 = props.roster.find(p1 => {return p1.playerId == play.details.assist2PlayerId});
                            assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ") , " + player3.firstName.default + " " + player3.lastName.default + " #" + player3.sweaterNumber + " (" +play.details.assist2PlayerTotal + ")";
                        }
                        else
                        {
                            let player2 = props.roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                            assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ")";
                        }
                        
                    }
                    else
                    {
                        assistStr = "Unassisted";
                    }
                    let player1 = props.roster.find(p1 => {return p1.playerId == play.details.scoringPlayerId});
        
                    let p =  <div className='play-card-goal'>
                                <div id={"color-"+ pic} className='top-goal-card' style={{backgroundImage: "url(" + pic_url + ")"}}>
                                    <div className='top-goal-card-container'>
                                        <img className="play-logo" src={pic_url} alt={pic}/>
                                        <p className='play-card-goal-score' >{score1}</p>
                                        <div id="goal-light-container">
                                            <img id='goal-light-img' className="play-logo" src={ require("../pics/goal-light.png")} alt={pic}/>
                                            <p>{pic} GOAL</p>
                                        </div>
                                        <p className='play-card-goal-score2'>{score2}</p>
                                        <img id="play-logo-score2" className="play-logo" src={ pic2_url} alt={pic2}/> 
                                    </div>
                                </div>
                                <div id={"color-"+ pic} className='bottom-goal-card'>
                                    <div className='left-card'>
                                        <p className='time-remaining-text-goal'>{play.timeRemaining}</p>
                                        <p id="goal-period">{formatPeriod(play.periodDescriptor.number)}</p>
                                    </div>
                                    <img className="play-logo" src={player1.headshot} alt={pic}/> 
                                    <div className='right-card'>
                                        <p className='card-description-goal'>{player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " (" + play.details.scoringPlayerTotal + ")"}</p>     
                                        <p className='card-description-assist'>{assistStr}</p>
                                    </div>
                                </div>
                            </div>; 
                    pArr.push(p);
                }
                else
                {   let description = " ";
                    let playType = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
                    let pic;
                    let pic_url;
                    if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
                    {
                        pic = props.game.homeTeam.abbrev;
                        pic_url = props.darkMode ? props.game.homeTeam.darkLogo : props.game.homeTeam.logo;
                    }
                    else
                    {
                        pic = props.game.awayTeam.abbrev;
                        pic_url = props.darkMode ? props.game.awayTeam.darkLogo : props.game.awayTeam.logo;
                    }
                    
                    let player1;
                    let player2;
                    let shotType;
                    let reason;
                    switch(play.typeDescKey) {
                        case 'faceoff':
                            if (play.details.hasOwnProperty("winningPlayerId") && play.details.hasOwnProperty("losingPlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.winningPlayerId});
                                player2 = props.roster.find(p1 => {return p1.playerId == play.details.losingPlayerId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " face-off won against " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else
                            {
                                description = 'Face-off';
                            }
                            
                            playType = 'Face-off';
                            break;
                        case 'hit':
                            if (play.details.hasOwnProperty("hittingPlayerId") && play.details.hasOwnProperty("hitteePlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.hittingPlayerId});
                                player2 = props.roster.find(p1 => {return p1.playerId == play.details.hitteePlayerId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " hit " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                            }
                            else
                            {
                                description = 'Hit';
                            }
                                break;
                        case 'shot-on-goal':
                            shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                            if(play.details.hasOwnProperty("shootingPlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                                if(play.details.hasOwnProperty("goalieInNetId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                }
                                else
                                {
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot";
                                }
                            }
                            else
                            {
                                if(play.details.hasOwnProperty("goalieInNetId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                                    description = shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                }
                                else   
                                {
                                    description = shotType + " shot";
                                }
                            }
                            break;
                        case 'missed-shot':
                            reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                            shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                            if(play.details.hasOwnProperty("shootingPlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                                description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot " + reason;
                            }
                            else
                            {
                                description = shotType + " shot misses";
                            }
                                break;
                        case 'giveaway':
                            if(play.details.hasOwnProperty("playerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.playerId});
                                description = "Giveaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                            }
                            else
                            {
                                description = "Giveaway";
                            }
                            break;
                        case 'takeaway':
                            if(play.details.hasOwnProperty("playerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.playerId});
                                description = "Takeaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                            }
                            else
                            {
                                description = "Takeaway";
                            }
                            break;
                        case 'penalty':
                            //player1 undefined
                            let penaltyType = (play.details.hasOwnProperty("descKey") ? ("for " + String(play.details.descKey) + " "): "");
                            if (play.details.hasOwnProperty("committedByPlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.committedByPlayerId});
                                if (play.details.hasOwnProperty("drawnByPlayerId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType+ player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                }
                                else
                                {
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType;
                                }
                            }
                            else
                            {
                                if (play.details.hasOwnProperty("drawnByPlayerId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                                    description = play.details.duration+ " minutes "+penaltyType + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                }
                                else
                                {
                                    description = 'Penalty';
                                }
                            }
                            break;
                        case 'delayed-penalty':
                            {
                                description =  "Delayed Penalty";
                            }
                            break;
                        case 'blocked-shot':
                            reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                            if (play.details.hasOwnProperty("shootingPlayerId"))
                            {
                                player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                                if (play.details.hasOwnProperty("blockingPlayerId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                
                                }
                                else
                                {
                                    description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                            
                                }
                            }
                            else
                            {
                                if (play.details.hasOwnProperty("blockingPlayerId"))
                                {
                                    player2 = props.roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                                    description = "Shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                                
                                }
                                else
                                {
                                    description = "Shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                                }
                            }
                            break;
                        default:
                        }
                        //<img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
                    let p = <div className={props.darkMode ? 'play-card-dark': 'play-card'}>
                                <div className='left-card'>
                                    <p className={props.darkMode ? 'time-remaining-text-dark': 'time-remaining-text'}>{play.timeRemaining}</p>
                                    <p>{formatPeriod(play.periodDescriptor.number)}</p>
                                </div>                              
                                <img className="play-logo" src={pic_url} alt={pic}/> 
                                <div className='right-card'>
                                    <p className={props.darkMode ? 'card-description-dark': 'card-description'}>{playType}</p>     
                                    <p className={props.darkMode ? 'card-description-body-dark': 'card-description-body'}>{description}</p>
                                </div>
                                
                            </div>; 
                    pArr.push(p);
                }
                    
                });

            let arrlength = props.playArr.length -1;
            let pL = <div><p id="period-indicator">{props.game.gameState == 'LIVE' ? (props.period < 4 ? formatPeriod(props.period) + " Period" : formatPeriod(props.period)) : (props.game.periodDescriptor.periodType == 'REG' ? "FINAL" : "FINAL/" + props.game.periodDescriptor.periodType)}</p>
                <div className='playList'> {props.playArr.map((play,index) => (
                    <div>{pArr[(arrlength - index)]}</div>
                ))}
                </div>
            </div>;

            isLoading.current = false;
            setPlayList(pL);
        }
        else
        {
            let pL = <p id="player-highlight-message" > No Plays</p> ;
            setTimeout(() => {
            if(isLoading.current)
            {
                setPlayList(pL);
                isLoading.current = false;
            }
            },2000)
        }
    
        console.log('in useeffect'); 
    }, [props.playArr]);

    let pArr = [];

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

    function formatPeriod(num)
    {
        switch(num) {
            case 1:
                return "1st";
            case 2:
                return "2nd";
            case 3:
                return "3rd";
            case 4:
                return "OT";
            case 5:
                return "SO";
            default:
        }
    }

    //this is undefined (props just need to implement loading spinner and a no plays option)
    /*
    props.playArr.forEach(play => {
        
        if(!play.hasOwnProperty("typeDescKey"))
        {
            //catch weird case
        }
        
        if(play.typeDescKey == 'stoppage' || play.typeDescKey == 'period-start'|| play.typeDescKey == 'period-end'  || play.typeDescKey == 'game-end')
        {
            var desc = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
            if(play.typeDescKey == 'stoppage')
            {
                let reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "Stoppage");
                desc = capitalizeEachWord(reason);
            }
            let p =  <div className={props.darkMode ? 'play-card-basic-dark': 'play-card-basic'}>
                        <div className='middle-basic-card'>
                            <img id="whistle-img" src={ props.darkMode ? (require("../pics/whistle-white.png")): (require("../pics/whistle.png"))} alt="whistle"/> 
                            <p className={props.darkMode ? 'card-description-basic-dark': 'card-description-basic'}>{desc}</p>
                        </div>
                    </div>; 
            pArr.push(p);
        }
        else if (play.typeDescKey == 'goal')
        {
            let pic;
            let pic_url;
            let pic2;
            let pic2_url;
            let assistStr;
            let score1;
            let score2;
            
            if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
            {
                pic = props.game.homeTeam.abbrev;
                pic_url = props.game.homeTeam.darkLogo;
                score1 = play.details.homeScore;
                pic2 = props.game.awayTeam.abbrev
                pic2_url = props.game.awayTeam.darkLogo;
                score2 = play.details.awayScore;
                
            }
            else
            {
                pic = props.game.awayTeam.abbrev;
                pic_url = props.game.awayTeam.darkLogo;
                score1 = play.details.awayScore;
                pic2 = props.game.homeTeam.abbrev;
                pic2_url = props.game.homeTeam.darkLogo;
                score2 = play.details.homeScore;
            }
            if (play.details.hasOwnProperty("assist1PlayerId"))
            {
                
                if (play.details.hasOwnProperty("assist2PlayerId"))
                {
                    let player2 = props.roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                    let player3 = props.roster.find(p1 => {return p1.playerId == play.details.assist2PlayerId});
                    assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ") , " + player3.firstName.default + " " + player3.lastName.default + " #" + player3.sweaterNumber + " (" +play.details.assist2PlayerTotal + ")";
                }
                else
                {
                    let player2 = props.roster.find(p1 => {return p1.playerId == play.details.assist1PlayerId});
                    assistStr = "Assists: " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber + " (" +play.details.assist1PlayerTotal + ")";
                }
                
            }
            else
            {
                assistStr = "Unassisted";
            }
            let player1 = props.roster.find(p1 => {return p1.playerId == play.details.scoringPlayerId});

            let p =  <div className='play-card-goal'>
                        <div id={"color-"+ pic} className='top-goal-card' style={{backgroundImage: "url(" + pic_url + ")"}}>
                            <div className='top-goal-card-container'>
                                <img className="play-logo" src={pic_url} alt={pic}/>
                                <p className='play-card-goal-score' >{score1}</p>
                                <div id="goal-light-container">
                                    <img id='goal-light-img' className="play-logo" src={ require("../pics/goal-light.png")} alt={pic}/>
                                    <p>{pic} GOAL</p>
                                </div>
                                <p className='play-card-goal-score2'>{score2}</p>
                                <img id="play-logo-score2" className="play-logo" src={ pic2_url} alt={pic2}/> 
                            </div>
                        </div>
                        <div id={"color-"+ pic} className='bottom-goal-card'>
                            <div className='left-card'>
                                <p className='time-remaining-text-goal'>{play.timeRemaining}</p>
                                <p id="goal-period">{formatPeriod(play.periodDescriptor.number)}</p>
                            </div>
                            <img className="play-logo" src={player1.headshot} alt={pic}/> 
                            <div className='right-card'>
                                <p className='card-description-goal'>{player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " (" + play.details.scoringPlayerTotal + ")"}</p>     
                                <p className='card-description-assist'>{assistStr}</p>
                            </div>
                        </div>
                    </div>; 
            pArr.push(p);
        }
        else
        {   let description = " ";
            let playType = capitalizeEachWord(play.typeDescKey.replaceAll('-', ' '));
            let pic;
            let pic_url;
            if(play.details.eventOwnerTeamId == props.game.homeTeam.id)
            {
                pic = props.game.homeTeam.abbrev;
                pic_url = props.darkMode ? props.game.homeTeam.darkLogo : props.game.homeTeam.logo;
            }
            else
            {
                pic = props.game.awayTeam.abbrev;
                pic_url = props.darkMode ? props.game.awayTeam.darkLogo : props.game.awayTeam.logo;
            }
            
            let player1;
            let player2;
            let shotType;
            let reason;
            switch(play.typeDescKey) {
                case 'faceoff':
                    if (play.details.hasOwnProperty("winningPlayerId") && play.details.hasOwnProperty("losingPlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.winningPlayerId});
                        player2 = props.roster.find(p1 => {return p1.playerId == play.details.losingPlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " face-off won against " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                    }
                    else
                    {
                        description = 'Face-off';
                    }
                    
                    playType = 'Face-off';
                    break;
                case 'hit':
                    if (play.details.hasOwnProperty("hittingPlayerId") && play.details.hasOwnProperty("hitteePlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.hittingPlayerId});
                        player2 = props.roster.find(p1 => {return p1.playerId == play.details.hitteePlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " hit " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                    }
                    else
                    {
                        description = 'Hit';
                    }
                        break;
                case 'shot-on-goal':
                    shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                    if(play.details.hasOwnProperty("shootingPlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        if(play.details.hasOwnProperty("goalieInNetId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot";
                        }
                    }
                    else
                    {
                        if(play.details.hasOwnProperty("goalieInNetId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.goalieInNetId});
                            description = shotType + " shot saved by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else   
                        {
                            description = shotType + " shot";
                        }
                    }
                    break;
                case 'missed-shot':
                    reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                    shotType = (play.details.hasOwnProperty("shotType") ? String(play.details.shotType) : "");
                    if(play.details.hasOwnProperty("shootingPlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + shotType + " shot " + reason;
                    }
                    else
                    {
                        description = shotType + " shot misses";
                    }
                        break;
                case 'giveaway':
                    if(play.details.hasOwnProperty("playerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.playerId});
                        description = "Giveaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                    }
                    else
                    {
                        description = "Giveaway";
                    }
                    break;
                case 'takeaway':
                    if(play.details.hasOwnProperty("playerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.playerId});
                        description = "Takeaway by " + player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber;
                    }
                    else
                    {
                        description = "Takeaway";
                    }
                    break;
                case 'penalty':
                    //player1 undefined
                    let penaltyType = (play.details.hasOwnProperty("descKey") ? ("for " + String(play.details.descKey) + " "): "");
                    if (play.details.hasOwnProperty("committedByPlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.committedByPlayerId});
                        if (play.details.hasOwnProperty("drawnByPlayerId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType+ player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " " + play.details.duration+ " minutes "+penaltyType;
                        }
                    }
                    else
                    {
                        if (play.details.hasOwnProperty("drawnByPlayerId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.drawnByPlayerId});
                            description = play.details.duration+ " minutes "+penaltyType + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        }
                        else
                        {
                            description = 'Penalty';
                        }
                    }
                    break;
                case 'delayed-penalty':
                    {
                        description =  "Delayed Penalty";
                    }
                    break;
                case 'blocked-shot':
                    reason = (play.details.hasOwnProperty("reason") ? String(play.details.reason).replaceAll('-', ' ') : "");
                    if (play.details.hasOwnProperty("shootingPlayerId"))
                    {
                        player1 = props.roster.find(p1 => {return p1.playerId == play.details.shootingPlayerId});
                        if (play.details.hasOwnProperty("blockingPlayerId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        
                        }
                        else
                        {
                            description = player1.firstName.default + " " + player1.lastName.default + " #" + player1.sweaterNumber + " shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                    
                        }
                    }
                    else
                    {
                        if (play.details.hasOwnProperty("blockingPlayerId"))
                        {
                            player2 = props.roster.find(p1 => {return p1.playerId == play.details.blockingPlayerId});
                            description = "Shot blocked by " + player2.firstName.default + " " + player2.lastName.default + " #" + player2.sweaterNumber;
                        
                        }
                        else
                        {
                            description = "Shot blocked " + reason;// + play.details.reason.replaceAll('-', ' ');
                        }
                    }
                    break;
                default:
                }
                //<img className="play-logo" src={ require("../pics/logos/" + String(pic) + ".svg")} alt={pic}/> 
            let p = <div className={props.darkMode ? 'play-card-dark': 'play-card'}>
                        <div className='left-card'>
                            <p className={props.darkMode ? 'time-remaining-text-dark': 'time-remaining-text'}>{play.timeRemaining}</p>
                            <p>{formatPeriod(play.periodDescriptor.number)}</p>
                        </div>                              
                        <img className="play-logo" src={pic_url} alt={pic}/> 
                        <div className='right-card'>
                            <p className={props.darkMode ? 'card-description-dark': 'card-description'}>{playType}</p>     
                            <p className={props.darkMode ? 'card-description-body-dark': 'card-description-body'}>{description}</p>
                        </div>
                        
                    </div>; 
            pArr.push(p);
        }
            
        });*/


           // let arrlength = props.playArr.length -1;
    
    return (
        <div id='playList-container'>
                {/*
                <p id="period-indicator">{props.game.gameState == 'LIVE' ? (props.period < 4 ? formatPeriod(props.period) + " Period" : formatPeriod(props.period)) : (props.game.periodDescriptor.periodType == 'REG' ? "FINAL" : "FINAL/" + props.game.periodDescriptor.periodType)}</p>
                <div className='playList'> {props.playArr.map((play,index) => (
                    <div>{pArr[(arrlength - index)]}</div>
                ))}
                </div>
                    */}
            {playList}
            </div>
      );
  }
  
  export default PlayByPlay;