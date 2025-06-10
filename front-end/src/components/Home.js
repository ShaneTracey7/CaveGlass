import React, {useState, useEffect, useRef} from 'react';
import '../styles.css';
import axios from 'axios';
import leftArrow from '../pics/left-arrow.svg';
import rightArrow from '../pics/right-arrow.svg';

function Main(props)
{
    let backendUrl = "https://caveglass.onrender.com";    //'http://localhost:8080'; //

    let loadingSpinner = <div class="loader"></div>;
    
    const [gameArr, setGameArr] = useState([]); 
    const [gameList, setGameList] = useState(loadingSpinner); 
    const isLoading = useRef(true); //needed to create a loading state
    
   //This function is called when component is create (called only once)
    useEffect(() => { 

      apiGetGames();
    }, []);

    // Whenever date changes, fetch games for that date
       useEffect(() => { 
      
      apiGetGames();
    }, [props.date]);


    useEffect(() => {
      
      //isLoading.current = true; moved this
    if (isLoading.current)
    {
      let gL = <div className="loader"></div>;
      if(gameList != gL)
      {
        setGameList(gL);
      }
      
    }
    else
    {

      if (gameArr.length > 0) //showGames
      { 
      //will show start time, "live", or "Ended"
      let status = []
      //possible gameState's: PRE(right b4 game start), FUT(future), OFF, LIVE, FINAL, CRIT(idk why, seems to be near the end of games)
      gameArr.forEach(game => {
      
        if(game.gameState == 'LIVE' || game.gameState == 'CRIT') //if(game.startTimeUTC)
        {
          let live = <img id="live-img" src={ require("../pics/live-icon.png")} alt="LIVE"/>
          status.push(live)
        }
        else if(game.gameState == 'FINAL' || game.gameState == 'OFF')
        {
          let final = <p className='game-status'> {game.homeTeam.score}-{game.awayTeam.score} FINAL</p>
          status.push(final)
        }
        else  // 'FUT' aka game hasn't started yet
        {
        
          let fut = <p className='game-status'>{formatTime(game.startTimeUTC)}</p>
          status.push(fut)
        }
      });

      let gL = <div className='gameList'> {gameArr.map((game, index) => (
        <div key={index} id="normal-gc" className={ (game.gameState == "FUT" || game.gameState == "PRE") ? "gameCardFUT" : "gameCard"} onClick={() => gameClick(index)}>
          {status[index]}
          <div className='cardContainer'>
            <img className="logo" src={game.homeTeam.logo} alt={game.homeTeam.abbrev}/> 
            <p>vs.</p> 
            <img className="logo" src={game.awayTeam.logo} alt={game.awayTeam.abbrev}/>
          </div>
        </div>))}
        </div>;
      
      setGameList(gL);
    }
    else
    {
      let gL = <p id="player-highlight-message" > No Games Today</p> ;
      setGameList(gL);
    }
  }
   console.log('in useeffect'); 
  }, [gameArr]);

  //data will be the string we send from our server
  const apiGetGames = () => {

    isLoading.current = true;

    axios.post(backendUrl, {
            type: 'games',
            date: props.date.toISOString().split('T')[0],
          }, {
            headers: {
            'content-type': 'application/json'
            }}).then((data) => {
      //this console.log will be in our frontend console
      console.log(data)
      let temp = [];
      let games = data.data.gameWeek[0].games;
      games.forEach((element, index)=> {
         temp.push(element);
         if(index == (games.length - 1))
         {
            setGameArr(temp);
         }
      });

      isLoading.current = false;
      if (games.length == 0)
        {
          setGameArr([]) //may not be enough
        }
      
   })
   
  }

  function gameClick(index)
  {
    console.log("test" + index)
    if(gameArr[index].gameState == "FUT" || gameArr[index].gameState == "PRE")
    {
      console.log("hasn't started");

    }
    else // 'LIVE', 'FINAL', 'END' , 'CRIT' or etc
    {
      console.log("live or ended");
      props.setgame(gameArr[index]);
      props.setingame(true);
    }
  }

    //formats UTC date into {hh:mm {AM/PM}}
    function formatTime(date)
    {
      var d = new Date(date);
      var h = d.getHours();
      let min = d.getMinutes();
      let min_str = min < 10? "0" + String(min): String(min);
      var m = "AM";
      if(h < 10)
      {
        if(h == 0)
        {
          h = 12;
        }
      }
      else if (h == 12)
      {
        m = "PM"
      }
      else
      {
        h = h - 12;
        m = "PM"
      }
      let date_str = h + ":" + min_str + " " + m;
      return date_str;
    }

  function leftClick()
  {
    console.log("left click");
    setGameList(loadingSpinner);
    props.setDate(new Date(props.date.getTime() - 24 * 60 * 60 * 1000))
  }
  function rightClick()
  {
    console.log("right click");
    setGameList(loadingSpinner);
    props.setDate(new Date(props.date.getTime() + 24 * 60 * 60 * 1000))
  }

  const footer = <div id="home-footer">
                    <hr class="footer-line"/>
                    <a href='https://www.nhl.com'>
                      <img className="footer-logos" src='https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/05_NHL_Shield.svg/1200px-05_NHL_Shield.svg.png' alt="NHL"/>
                    </a>
                    <a href='https://www.hockeycanada.ca/en-ca/home'>
                      <img className="footer-logos" src='https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Hockey_Canada.svg/1200px-Hockey_Canada.svg.png' alt="Hockey Canada"/>
                    </a>
                    <a href='https://www.usahockey.com'>
                      <img className="footer-logos" src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Usa_ice_hockey_logo.svg/1200px-Usa_ice_hockey_logo.svg.png' alt="USA Hockey"/>
                    </a>

                    <hr class="footer-line"/>
                    <img className="cg-logo-small" id="footer-main-logo" src={ require("../pics/cg-logo-small.png")} alt="CaveGlass"/>
                    <p id="footer-blurb"> Cave Glass is designed to complement the live viewing experience of an NHL game, making it perfect for sports bars, man caves, or any setting with a TV or display showing the game. It pulls real-time data from the NHL API to showcase live game statistics, such as score updates, player performance, and team stats, right next to the action on the screen. The app provides dynamic, up-to-the-minute insights, giving fans a deeper understanding of the game as it unfolds. Whether it's tracking goals, penalties, or shots on goal, this tool enhances the atmosphere of any sports viewing space, keeping everyone engaged and informed without taking attention away from the live game itself.</p>
                    <p id="footer-tag"> created by Shane T.</p>
                </div>

    return(
        <div id="home-page">
          <div className='home-header-info'>
              <div className='home-mobile-info'>
                 <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
                 <div id='home-date-container'>
                    <img className="home-arrows" onClick={leftClick} src={leftArrow} alt="previous"/>
                    <p id="home-date">{props.date.toDateString()}</p>
                    <img className="home-arrows" onClick={rightClick} src={rightArrow} alt="next"/>
                    </div>
               </div>
            </div>
            {gameList}
            {footer}
        </div>
    );
}
export default Main;