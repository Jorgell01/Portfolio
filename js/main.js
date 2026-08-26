(() => {
  const content = window.PORTFOLIO_CONTENT || {};
  let lang = localStorage.getItem('portfolio-lang') || 'es';
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  const languageToggle = document.getElementById('language-toggle');
  const year = document.getElementById('year');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const backToTop = document.getElementById('back-to-top');

  const t = (key) => (content[lang] && content[lang][key]) || key;

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (content[lang] && content[lang][key]) el.textContent = content[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (content[lang] && content[lang][key]) el.placeholder = content[lang][key];
    });
    document.querySelector('.lang-current').textContent = lang.toUpperCase();
    document.querySelector('.lang-other').textContent = lang === 'es' ? 'EN' : 'ES';
    document.title = lang === 'es'
      ? 'Jorge A. Herrero Santana | Desarrollador Full Stack'
      : 'Jorge A. Herrero Santana | Full Stack Developer';
  }

  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  languageToggle?.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    localStorage.setItem('portfolio-lang', lang);
    applyLanguage();
  });

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (year) year.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  backToTop?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });

  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  const cfg = window.APP_CONFIG || {};
  if (cfg.EMAILJS_PUBLIC_KEY && window.emailjs) {
    try { window.emailjs.init({ publicKey: cfg.EMAILJS_PUBLIC_KEY }); } catch (_) {}
  }

  function setStatus(message, type = '') {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status ${type}`.trim();
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    const button = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      setStatus(t('contact.form.required'), 'error');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus(t('contact.form.invalidEmail'), 'error');
      return;
    }

    const canSend = window.emailjs && cfg.EMAILJS_PUBLIC_KEY && cfg.EMAILJS_SERVICE_ID && cfg.EMAILJS_TEMPLATE_ID && !cfg.EMAILJS_DISABLE_SENDING;
    if (!canSend) {
      setStatus(t('contact.form.error'), 'error');
      return;
    }

    button.disabled = true;
    button.textContent = t('contact.form.sending');
    setStatus('');

    try {
      await window.emailjs.send(cfg.EMAILJS_SERVICE_ID, cfg.EMAILJS_TEMPLATE_ID, {
        from_name: name,
        name,
        reply_to: email,
        email,
        message,
        time: new Date().toLocaleString()
      });
      form.reset();
      setStatus(t('contact.form.success'), 'success');
    } catch (_) {
      setStatus(t('contact.form.error'), 'error');
    } finally {
      button.disabled = false;
      button.textContent = t('contact.form.submit');
    }
  });

  applyLanguage();
})();
