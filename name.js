//Script that handles all functionality for getting the original name the user enters

//Name starts out empty
//This variable is global so that the other scripts can use it if they need to
let name = '';

//This function is called when the user hits submit
let submit_name = () => {

  //Get the field where the name was entered
  const field = document.getElementById("name_field");

  //Set name to whatever was in the field
  name = field.value;
  
  //Make API call to try to get a workout for the corresponding name
  fetch(`/api/workout?name=${name}`).then(response => {
    //Extract text from the HTTP response
    return response.text();
  }).then(text => {
    //If name is not in the db, give user the survey
    if (text == 'nnf'){
      open_survey();
    }
    else{
      //Otherwise, show the user their workout!
      open_workout(text);
    }
  });
};