const express = require("express");//Server hosting and rest API
const path = require("path");//Converts relative paths to absolute paths, needed for serving up the files when they're requested
const database = require("@replit/database")//Replit's database

const app = express();//Initialize express
const db = new database();//Initialize db
const resolve = path.resolve;//It's just easier than typing path.resolve every time

//Port should be 8000, as this is the HTTPS port
const port = 8000;

////////////////////Helper methods////////////////////////
//Returns random int in range [0, max)
//Probably won't be necessary in final implementation -- it's used to give a random workout to the user.
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
///////////////////End helper methods/////////////////////


//////////////////////REST API////////////////////////////

//Serve up home page
app.get("/", (req, res) => {
  res.sendFile(resolve("./index.html"));
});

///////////////////////Files//////////////////////////////
app.get("/name.js", (req, res) => {
  res.sendFile(resolve("./name.js"));
});

app.get("/survey.js", (req, res) => {
  res.sendFile(resolve("./survey.js"));
});

app.get("/workout.js", (req, res) => {
  res.sendFile(resolve("./workout.js"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(resolve("./style.css"));
});

/////////////////End files////////////////////////////////

//This call is made when the user submits their survey
//Puts all of the info into the db
app.get("/api/survey", (req, res) => {
  //EXAMPLE CALL: api/survey?name=Nathan&mg=111&wd=0010110
  //muscle groups (mg) are 3 bits for legs, core, arms
  //work days (wd) are 7 bits for which days you want to
  //work out on
  
  //Grab values from the call
  const name = req.query.name;
  const muscle_groups = req.query.mg;
  const work_days = req.query.wd;

  //Stick values into db
  db.set(`${name}_mg`, muscle_groups).then(db.set(`${name}_wd`, work_days)).then(res.send('yay'));
});

app.get("/api/workout", (req, res) => {
  //Name that the user entered
  const name = req.query.name;

  //Get user's schedule
  db.get(`${name}_wd`).then(value => {

    //If name not in system
    if (value == undefined){
      res.send('nnf');
      return;
    }


    //Get current day of the week, int 0-6 (sun-sat)
    const day = new Date().getDay();

    //If today is NOT on user's schedule
    if (value.substring(day, day + 1) == '0'){
      //Hand back no workout
      res.send('No workout today!');
    }

    //If today is on user's schedule
    else{
      //Get the muscle groups the user wants to work on
      db.get(`${name}_mg`).then(val => {
        //This list is just the temporary youtube IDs for three workouts (pushup, squat, plank). Later on, we will probably have a lot more videos, so we should store them in the db or in a separate .json file
        let mg = ["_l3ySVKYVJ8", "MVMNk0HiTMg", "ASdvN_XEl_c"];

        //This list is going to be populated with the worouts from mg that the user might actually want (based on survey response)
        let groups = [];

        //Split muscle groups string into an array of the individual bits
        const bits = val.split('');

        //Checks which muscle groups user said they
        //wanted to work on, adds all of them
        //to an array
        for (let i = 0; i < bits.length; i++){
          if (bits[i] == "1"){
            groups.push(mg[i]);
          }
        }

        //Send one muscle group at random to user
        res.send(`<p>Here's your workout for today:</p><iframe src="https://www.youtube.com/embed/${groups[getRandomInt(groups.length)]}"><iframe>`);
      });
    }
  });
});
///////////////////End REST API///////////////////////////

//Launch server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})



//Uncomment this loop and click the "Run" button to remove all entries from the db

/*
db.list().then(keys => {
  keys.forEach((key) => {
    db.delete(key);
  });
  console.log("Database cleared");
});
*/