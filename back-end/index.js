//index.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.post("/", (req, res) => {
    console.log("req.body.type: " + req.body.type);
    if(req.body.type == "pbp")
    {   let gameID = req.body.game;
        console.log("gameid: " +gameID)
        const apiUrl = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/play-by-play"); 
        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            //console.log(response.json());
            return response.json();
        })
        .then(data => {
            res.send(data)
        })
        .catch(error => {
            console.error('Error:', error);
            res.send('Error!')
        });
    }
    else if(req.body.type == "box")
        {  
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            console.log("in box") //https://api.sleeper.app/v1/league/1125318770018463744/rosters
            const apiUrl = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/boxscore"); 
            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                //console.log(response.json());
                return response.json();
            })
            .then(data => {
                res.send(data)
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error);
                res.send('Error!')
            });
        }
    else
    {   
        console.log("error");
        res.send('Error! in post');
    }
    
  });

app.get('/', (req, res) => {

    date = new Date();
    month_str = date.getMonth() > 8 ? String(date.getMonth() + 1) : ("0" + String(date.getMonth() + 1));
    day_str = date.getDate() > 8 ? String(date.getDate()) : ("0" + String(date.getDate()));
    today = String(date.getFullYear()) + '-' + month_str + '-' +  day_str;
    console.log(today)
    //maybe add a timeout?
                                                                    //today
    const apiUrl = String("https://api-web.nhle.com/v1/schedule/" + "2025-01-30"); //YYYY-MM-DD
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        //console.log(response.json());
        return response.json();
    })
    .then(data => {
        res.send(data)
    })
    .catch(error => {
        console.error('Error:', error);
        res.send('Error!')
    });
    /*
    fetch("https://api.nhle.com/stats/rest/en/players")
    .then((response) => response.json())
    .then((json) => console.log(json));
    */
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})