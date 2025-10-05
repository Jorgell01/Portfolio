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

  // Inicializar EmailJS usando config.js
  if(window.APP_CONFIG){
    const { EMAILJS_PUBLIC_KEY } = window.APP_CONFIG;
    if(EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.includes('gfj346M0eDEMGMMKA')){
      try{ emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }
      catch(err){ console.warn('Fallo al inicializar EmailJS:', err); }
    } else {
      console.warn('EmailJS public key no configurada aún (config.js)');
    }
  } else {
    console.warn('APP_CONFIG no encontrado. Asegúrate de cargar js/config.js antes de main.js');
  }

  // Contact form handling
  const form = document.getElementById('contact-form');
  const messageBox = document.getElementById('form-message');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const msgInput = document.getElementById('mensaje');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Basic validation
      if(!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()){
        showFormMessage('Please fill in all fields.', 'error');
        return;
      }

      // Very simple email pattern check
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput.value.trim())){
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Leer configuración
      const cfg = window.APP_CONFIG || {};
      const { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_DISABLE_SENDING } = cfg;

      // Validaciones de configuración
      if(!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes('REEMPLAZA_TU_PUBLIC_KEY') ||
         !EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.includes('REEMPLAZA_SERVICE_ID') ||
         !EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID.includes('REEMPLAZA_TEMPLATE_ID')){
        showFormMessage('Email service not configured. Update config.js.', 'error');
        console.warn('Config EmailJS incompleta en config.js');
        return;
      }

      if(EMAILJS_DISABLE_SENDING){
        showFormMessage('Sending disabled (development mode).', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const templateParams = {
        from_name: nameInput.value.trim(),
        reply_to: emailInput.value.trim(),
        message: msgInput.value.trim()
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        showFormMessage('Message sent successfully! I will contact you soon.', 'success');
        form.reset();
      } catch(err){
        console.error(err);
        showFormMessage('There was an error sending your message. Please try again later.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function showFormMessage(text, type){
    if(!messageBox) return;
    messageBox.style.display = 'block';
    messageBox.textContent = text;
    messageBox.style.backgroundColor = type === 'success' ? '#1cb698' : '#b61c1c';
    messageBox.style.color = '#fff';
  }
});