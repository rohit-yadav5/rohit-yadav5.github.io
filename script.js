/* ---- Typing animation ---- */
const phrases = ['Backend Engineer.', 'AI Developer.', 'I build things that think.'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer = null;

function runTyping() {
  const el = document.getElementById('typing');
  if (!el) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    el.textContent = current.substring(0, charIndex);
  } else {
    charIndex++;
    el.textContent = current.substring(0, charIndex);
  }

  let delay = isDeleting ? 45 : 95;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(runTyping, delay);
}

/* ---- Scroll fade-in (Intersection Observer) ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in, .fade-in-group').forEach((el) => {
    observer.observe(el);
  });
}

/* ---- Mobile nav toggle ---- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
}

/* ---- Active nav link ---- */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Contact form (Web3Forms) ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await res.json();

      if (data.success) {
        form.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = '✓ Message sent. I\'ll get back to you soon.';
        }
        btn.textContent = 'Message Sent';
      } else {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        alert('Something went wrong. Please try emailing directly.');
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      alert('Something went wrong. Please try emailing directly.');
    }
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollAnimations();
  initMobileNav();
  initContactForm();

  const typingEl = document.getElementById('typing');
  if (typingEl) {
    setTimeout(runTyping, 800);
  }
});
