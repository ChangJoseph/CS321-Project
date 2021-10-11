//Script that handles functionality for showing the user their daily workout

//Called when the user successfully gets a workout returned
let open_workout = (text) => {
  //We hide both the name UI and survey UI, since the workout UI can be opened from either
  document.getElementById("name").style.visibility = "hidden";
  document.getElementById("survey").style.visibility = "hidden";

  //Get the workout element from the DOM
  let workout = document.getElementById("workout");
  
  //Make workout UI visible
  workout.style.visibility = "visible";

  //Populate workout UI with whatever workout we got from the server
  workout.innerHTML = text;
};