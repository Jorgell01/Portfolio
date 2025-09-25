let menuVisible = false;

//Function to show or hide the menu
function showHideMenu(){
  if(menuVisible){
    document.getElementById("nav").classList ="";
    menuVisible = false;
  }else{
    document.getElementById("nav").classList ="responsive";
    menuVisible = true;
  }
}

function seleccionar(){
  //hide the menu once a section is selected
  document.getElementById("nav").classList = "";
  menuVisible = false;
}

//Function to apply the animations of the skills
function effectAbilities(){
  var skills = document.getElementById("skills");
  var distance_skills = window.innerHeight - skills.getBoundingClientRect().top;
  if(distance_skills >= 300){
    let habilidades = document.getElementsByClassName("progress");
    habilidades[0].classList.add("javascript");
    habilidades[1].classList.add("htmlcss");
    habilidades[2].classList.add("photoshop");
    habilidades[3].classList.add("wordpress");
    habilidades[4].classList.add("comunication");
    habilidades[5].classList.add("trabajo");
    habilidades[6].classList.add("creativity");
    habilidades[7].classList.add("dedication");
    habilidades[8].classList.add("project");
  }
}

//detect scrolling to apply the animation of the skills
window.onscroll = function(){
  effectAbilities();
} 