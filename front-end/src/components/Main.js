import React, {useState} from 'react';
import '../styles.css';
import axios from 'axios';


function Main(props)
{
    const [showGames, setShowGames] = useState(false); //if true score reaction is displayed,
    const [gameArr, setGameArr] = useState([]); //if true score reaction is displayed,
    //var gameArr = [];

    function handleClick()
    {
        props.scored(true)
    }



     //data will be the string we send from our server
  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      //this console.log will be in our frontend console
      console.log(data)
      //might crash if no games that day
      //might need to go 'data.data'
      data.data.gameWeek[0].games.forEach(element => {
         let temp = gameArr;
         temp.push(element);
         setGameArr(temp);
    
      });
   })
   setTimeout(() => {
    setShowGames(true);
    console.log("Delayed for 2 seconds.");
  }, 2000);
   
  }
  let gameList;
  if (showGames)
  { 
    //will show start time, "live", or "Ended"

    console.log(gameArr[0])
    //gameList = <div>{gameArr.map((game, index) => (<div className='gameCard'><p> {game.homeTeam.abbrev} vs. {game.awayTeam.abbrev}</p></div>))}</div>;
    gameList = <div className='gameList'> {gameArr.map((game, index) => (
      <div className='gameCard'>
        <div className='cardContainer'>
          <img className="logo" src={ require("../logos/" + String(game.homeTeam.abbrev) + ".svg")} alt={game.homeTeam.abbrev}/> 
          <p>vs.</p> 
          <img className="logo" src={ require("../logos/" + String(game.awayTeam.abbrev) + ".svg")} alt={game.awayTeam.abbrev}/>
        </div>
      </div>))}
      </div>;
  
  }
  else
  {
    gameList = <p> No Games Today</p> ;
  }

/*
    fetch("https://api.nhle.com/stats/rest/en/players", {mode: "no-cors"})
  .then((response) => response.json())
  .then((json) => console.log(json));
    /*
    const apiUrl = 'https://api-web.nhle.com/v1/schedule/now ';
    const outputElement = document.getElementById('output');


    const requestOptions = {
        mode: 'no-cors',
        method: 'get',
      };

    fetch(apiUrl,requestOptions)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        console.log(response.json());
        return response.json();
    })
    .then(data => {
        // Display data in an HTML element
        outputElement.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
    return(
        <div>
            <p>CaveGlass</p>
            <p>{new Date().toDateString()}</p>
            <button className="main-button" onClick={handleClick}>score</button>
            <button className="main-button" onClick={apiCall}>Test Api call</button>
            <p id="output"></p>
            {gameList}
        </div>
    );
}
export default Main;