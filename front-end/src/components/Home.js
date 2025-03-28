import React, {useState, useEffect, useRef} from 'react';
import '../styles.css';
import axios from 'axios';


function Main(props)
{
  let loadingSpinner = <div class="loader"></div>;
    //const [showGames, setShowGames] = useState(false); //if true score reaction is displayed,
    const [gameArr, setGameArr] = useState([]); //if true score reaction is displayed,
    const [gameList, setGameList] = useState(loadingSpinner); //if true score reaction is displayed,
    const isLoading = useRef(true); //needed to create a loading state
    
    useEffect(() => {
      
      isLoading.current = true;
      
    if (gameArr.length > 0) //showGames
    { 
    //will show start time, "live", or "Ended"
    let status = []
    //possible gameState's: PRE(right b4 game start), FUT(future), OFF, LIVE, FINAL
    gameArr.forEach(game => {
      
      if(game.gameState == 'LIVE') //if(game.startTimeUTC)
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
    //gameList = <div>{gameArr.map((game, index) => (<div className='gameCard'><p> {game.homeTeam.abbrev} vs. {game.awayTeam.abbrev}</p></div>))}</div>;
    let gL = <div className='gameList'> {gameArr.map((game, index) => (
      <div className={ (game.gameState == "FUT" || game.gameState == "PRE") ? "gameCardFUT" : "gameCard"} onClick={() => gameClick(index)}>
        {status[index]}
        <div className='cardContainer'>
          <img className="logo" src={game.homeTeam.logo} alt={game.homeTeam.abbrev}/> 
          <p>vs.</p> 
          <img className="logo" src={game.awayTeam.logo} alt={game.awayTeam.abbrev}/>
        </div>
      </div>))}
      </div>;
      isLoading.current = false;
      
    setGameList(gL);
  }
  else
  {
    let gL = <p id="player-highlight-message" > No Games Today</p> ;
    setTimeout(() => {
      if(isLoading.current)
      {
        setGameList(gL);
        isLoading.current = false;
      }
    },2000)
  }
   console.log('in useeffect'); 
  }, [gameArr]);

    function gameClick(index)
    {
      console.log("test" + index)
      if(gameArr[index].gameState == "FUT" || gameArr[index].gameState == "PRE")
      {
        console.log("hasn't started");

        //only availible rn for testing
        props.setgame(gameArr[index]);
        props.setingame(true);
      }
      else // 'LIVE', 'FINAL', 'END' or etc
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

     //data will be the string we send from our server
  const apiGetGames = () => {
    axios.get('http://localhost:8080').then((data) => {
      //this console.log will be in our frontend console
      console.log(data)
      //might crash if no games that day
      //might need to go 'data.data'
      let temp = [];
      let games = data.data.gameWeek[0].games;
      games.forEach((element, index)=> {
         temp.push(element);
         if(index == (games.length - 1))
         {
            setGameArr(temp);
         }
      });
      
   })
   setTimeout(() => {
    //setShowGames((gameArr.length > 0));
    console.log("Delayed for 1 seconds.");
  }, 1000);
   
  }
  //getting today's game data from NHL api
   // This function will called only once
   useEffect(() => {
    console.log("useEffect");
    apiGetGames();
  }, [])


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
                </div>

   /* <button className="main-button" onClick={apiGetGames}>Test Api call</button> */
    return(
        <div id="home-page">
            <img className="cg-logo-1"  id="main-home-logo"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
            <div id='home-date-container'>
                <p id="home-date">{new Date().toDateString()}</p>
            </div>
            {gameList}
            {footer}
        </div>
    );
}
export default Main;