//Script that handles functionality for the survey

//Called if the user needs to take the survey
let open_survey = () => {
  //Hide the name-entering UI
  document.getElementById("name").style.visibility = "hidden";

  //Show the survey UI
  document.getElementById("survey").style.visibility = "visible";
};

//Called when the user hits the submit button
let submit_survey = () => {

  //Get the survey element from the DOM
  const survey = document.getElementById("survey")

  //These will be the strings of bits that represent which muscle groups and days of the week our user is interested in
  let mgs = "";
  let wds = "";
  
  //set bits according to which muscle groups we want
  for (let i = 0; i < 3; i++){
    //Get the right checkbox
    let current = document.getElementById(`survey_mg_${i}`);

    //If checkbox is checked, make bit 1. Otherwise, 0
    if (current.checked){
      mgs = mgs.concat("1");
    }
    else{
      mgs = mgs.concat("0");
    }

  }

  //set bits according to which days of the week we want
  for (let i = 0; i < 7; i++){
    //Get the right checkbox
    let current = document.getElementById(`survey_wd_${i}`);

    //If checkbox is checked, make bit 1. Otherwise, 0
    if (current.checked){
      wds = wds.concat("1");
    }
    else{
      wds = wds.concat("0");
    }

  }

  //Make API call to submit the survey
  fetch(`api/survey?name=${name}&mg=${mgs}&wd=${wds}`).then(() => {
    fetch(`/api/workout?name=${name}`).then(response => {
      //Extract text from HTTP response
      return response.text();
    }).then(text => {

      //Once we get our response from the survey, open the workout UI and pass the response we got
      open_workout(text);
    });
  });
};