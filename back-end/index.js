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
        const apiUrl1 = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/play-by-play"); 
        let apiUrl2 = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID);          
        Promise.all([fetch(apiUrl1), fetch(apiUrl2)])
            .then(([response1, response2]) => {
                // Check if both responses are ok (status 200-299)
                if (response1.ok && response2.ok) {
                    return Promise.all([response1.json(), response2.json()]);
                }
                throw new Error("One or both fetch requests failed");
            })
            .then(([data1, data2]) => {
                console.log("Data1:", data1);
                console.log("Data2:", data2);
                res.send([data1,data2]) // Run func3 after both fetch requests are completed
            })
            .catch(error => {
                console.error("Error:", error);
                res.send('Error!')
            });
    }
    else if(req.body.type == "box")
        {   
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            console.log("in box") //https://api.sleeper.app/v1/league/1125318770018463744/rosters

            const apiUrl1 = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/boxscore"); 
            let apiUrl2 = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID);          
            Promise.all([fetch(apiUrl1), fetch(apiUrl2)])
                .then(([response1, response2]) => {
                    // Check if both responses are ok (status 200-299)
                    if (response1.ok && response2.ok) {
                        return Promise.all([response1.json(), response2.json()]);
                    }
                    throw new Error("One or both fetch requests failed");
                })
                .then(([data1, data2]) => {
                    console.log("Data1:", data1);
                    console.log("Data2:", data2);
                    res.send([data1,data2]) // Run func3 after both fetch requests are completed
                })
                .catch(error => {
                    console.error("Error:", error);
                    res.send('Error!')
                });
        }
    else if(req.body.type == "sum")
        {   
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            const apiUrl = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID);
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
    else if(req.body.type == "all")
        {   
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            console.log("in all") //https://api.sleeper.app/v1/league/1125318770018463744/rosters
            const apiUrl1 = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/play-by-play"); //pbp
            const apiUrl2 = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID);             //summary
            const apiUrl3 = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/boxscore");   //playerfocus(box)
            Promise.all([fetch(apiUrl1), fetch(apiUrl2), fetch(apiUrl3)])
                .then(([response1, response2, response3]) => {
                    // Check if both responses are ok (status 200-299)
                    if (response1.ok && response2.ok && response3.ok) {
                        return Promise.all([response1.json(), response2.json(), response3.json()]);
                    }
                    throw new Error("One or more fetch requests failed");
                })
                .then(([data1, data2, data3]) => {
                    console.log("Data1:", data1);
                    console.log("Data2:", data2);
                    console.log("Data2:", data3);
                    res.send([data1,data2,data3]) 
                })
                .catch(error => {
                    console.error("Error:", error);
                    res.send('Error!')
                });
        }
    else if(req.body.type == "ping")
        {   
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            const apiUrl = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID);
            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                //console.log(response.json());
                return response.json();
            })
            .then(data => {
                let temp = data.clock.timeRemaining;
                res.send(temp);
            })
            .catch(error => {
                console.error('Error:', error);
                res.send('Error!')
            });
        }
    else if(req.body.type == "test")   // summary.teamGameStats[0].category -> 'sog' .awayValue -> num
                                        // [5] -> hits, [6] -> blocked shots, [4] -> pim,
        {  
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            console.log("in test") //https://api.sleeper.app/v1/league/1125318770018463744/rosters
            const apiUrl = String("https://api-web.nhle.com/v1/wsc/game-story/" + gameID); 
            //const apiUrl = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/landing"); 
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
                                                                    //today //2025-01-28
    const apiUrl = String("https://api-web.nhle.com/v1/schedule/" + today); //YYYY-MM-DD
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