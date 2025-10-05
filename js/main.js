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

  // Initialize EmailJS using config.js (previously failed due to comparing against the real key itself)
  if(window.APP_CONFIG){
    const { EMAILJS_PUBLIC_KEY } = window.APP_CONFIG;
    if(EMAILJS_PUBLIC_KEY){
      try{ 
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        console.log('[EmailJS] Initialized correctly');
      } catch(err){ 
        console.warn('[EmailJS] Failed to initialize:', err); 
      }
    } else {
      console.warn('[EmailJS] Public key empty or not configured in config.js');
    }
  } else {
    console.warn('[EmailJS] APP_CONFIG not found. Make sure to load js/config.js before main.js');
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

  // Read configuration
      const cfg = window.APP_CONFIG || {};
      const { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_DISABLE_SENDING } = cfg;

  // Generic placeholder detection (values not replaced yet)
      const isPlaceholder = (val) => !val || /^REEMPLAZA(_|)/i.test(val);
      if(isPlaceholder(EMAILJS_PUBLIC_KEY) || isPlaceholder(EMAILJS_SERVICE_ID) || isPlaceholder(EMAILJS_TEMPLATE_ID)) {
        showFormMessage('Email service not configured. Update config.js.', 'error');
        console.warn('[EmailJS] Incomplete config or placeholders still present in config.js');
        return;
      }

      if(EMAILJS_DISABLE_SENDING){
        showFormMessage('Sending disabled (development mode).', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const templateParams = {
        name: nameInput.value.trim(),
        reply_to: emailInput.value.trim(),
        message: msgInput.value.trim(),
        time: new Date().toLocaleString()
      };

      try {
        console.log('[EmailJS] Sending...', { service: EMAILJS_SERVICE_ID, template: EMAILJS_TEMPLATE_ID, params: templateParams });
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('[EmailJS] Response:', response);
        showFormMessage('Message sent successfully! I will contact you soon.', 'success');
        form.reset();
      } catch(err){
        console.error('[EmailJS] Error while sending:', err);
        const friendly = (err && (err.text || err.message)) ? 'Error: ' + (err.text || err.message) : 'There was an error sending your message. Please try again later.';
        showFormMessage(friendly, 'error');
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