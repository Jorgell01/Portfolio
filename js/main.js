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
    habilidades[4].classList.add("java");
    habilidades[5].classList.add("communication");
    habilidades[6].classList.add("teamwork");
    habilidades[7].classList.add("creativity");
    habilidades[8].classList.add("dedication");
    habilidades[9].classList.add("management");
  }
}

//detect scrolling to apply the animation of the skills
window.onscroll = function(){
  effectAbilities();
} 

// Function to download CV
function downloadCV() {
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = 'files/Jorge_Alberto_Herrero_Santana_CV.pdf'; // Path to your CV file
  link.download = 'Jorge_Alberto_Herrero_Santana_CV.pdf'; // Name for the downloaded file
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const cvButton = document.getElementById('download-cv');
  if (cvButton) {
    cvButton.addEventListener('click', downloadCV);
  }
});