//index.js
const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg'); // Import the pg module
//const port = process.env.PORT || 3000;
//const cookieParser = require('cookie-parser');

//app.use(cookieParser());

app.use(cors());

app.use(express.json());

app.post("/", (req, res) => {
    console.log("req.body.type: " + req.body.type);
    if(req.body.type == "all")
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
        /*
    else if(req.body.type == "pbp")
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
    */
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
    else if(req.body.type == "roster")
        {   
            let gameID = req.body.game;
            console.log("gameid: " +gameID)
            const apiUrl = String("https://api-web.nhle.com/v1/gamecenter/" + gameID + "/play-by-play"); 
            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let temp = data.rosterSpots;
                res.send(temp);
            })
            .catch(error => {
                console.error('Error:', error);
                res.send('Error!')
            });
        }
    else if(req.body.type == "setKey")
        {   
            let key = Math.floor(Math.random() * (9998 - 1001 + 1)) + 1001;
            //res.cookie('key', key);
            //res.send('key has been set!');
            //res.send(key);
        }
    else if(req.body.type == "checkKey")
        {   
            
            res.cookie('key', key);
            res.send('key has been set!');
            //res.send(key);
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
    const apiUrl = String("https://api-web.nhle.com/v1/schedule/" + "2025-01-28"); //YYYY-MM-DD
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

// POST route to add a new user
app.post('/api/users', async (req, res) => {
     if( req.body.type == "setKey")
     {
        const key = Math.floor(Math.random() * (9998 - 1001 + 1)) + 1001;
        console.log("key: " + key);
        try {
            
            const result = await pool.query('INSERT INTO "MobileKeys" (key) VALUES ($1)',[key]);
        
            res.status(201).json({ key });//or res.send(key);
            /*
            const result = await pool.query('SELECT NOW()'); // Just an example query to check the connection
                res.json(result.rows);
                */

          } catch (error) {
            console.error('Error inserting user:', error);
            res.status(500).send('Server error');
          }
     }
     else if(req.body.type == "checkKey")
     {
        const key = req.body.key;
        console.log("key: " + key);
        try {
            const result = await pool.query('SELECT * FROM "MobileKeys" WHERE key = $1', [key]);
            if (result.rows.length > 0) {
                res.status(200).json({ check: true });
            } else {
                res.status(404).json({ check: false });
            }
          } catch (error) {
            console.error('Error checking user:', error);
            res.status(500).send('Server error');
          }
     }
     
    });

// Get PostgreSQL connection string from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Connection string will be stored in environment variable
    ssl: {
      rejectUnauthorized: false,  // Ensures that SSL is used if Render requires it
    },
  });
  
  // Sample route to test the connection to PostgreSQL
  app.get('/', async (req, res) => {
    try {
      // Query the PostgreSQL database
      const result = await pool.query('SELECT NOW()'); // Just an example query to check the connection
      res.json(result.rows); // Respond with the query result (current timestamp)
    } catch (err) {
      console.error('Error querying PostgreSQL:', err);
      res.status(500).send('Error connecting to PostgreSQL');
    }
  });

  //the port (8080) should prpbs be set to a env variable in render down the road as it may cause issues
app.listen(8080, () => {
      console.log('server listening on port 8080')
})