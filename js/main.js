// =============================================
// MMONARK DIGITAL — MAIN JS
// =============================================

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(13,11,32,0.97)';
  } else {
    nav.style.background = 'rgba(13,11,32,0.85)';
  }
});

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ---- NAV: show DASHBOARD if logged in ----
(function() {
  const user = JSON.parse(localStorage.getItem('mm_user') || 'null');
  const loginLi = document.getElementById('nav-login-li');
  if (user && loginLi) {
    loginLi.innerHTML = `<a href="dashboard.html">DASHBOARD</a>`;
  }
})();

// ---- MODAL ----
const modalOverlay = document.getElementById('modal-overlay');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === modalOverlay) closeModal();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ---- FORM SUBMIT ----
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const formEl = document.querySelector('.modal-form');
  const successEl = document.getElementById('form-success');

  // Collect data
  const name     = form.querySelector('input[type="text"]').value;
  const email    = form.querySelector('input[type="email"]').value;
  const phone    = form.querySelector('input[type="tel"]').value;
  const message  = form.querySelector('textarea').value;
  const services = [...form.querySelectorAll('input[name="services"]:checked')].map(c => c.value);

  // Save inquiry to localStorage for admin
  const inquiries = JSON.parse(localStorage.getItem('mm_inquiries') || '[]');
  inquiries.unshift({
    id: Date.now(),
    name, email, phone, message, services,
    date: new Date().toLocaleDateString('en-CA')
  });
  localStorage.setItem('mm_inquiries', JSON.stringify(inquiries));

  // Show success
  formEl.style.display = 'none';
  successEl.classList.add('show');

  setTimeout(() => {
    closeModal();
    formEl.style.display = '';
    successEl.classList.remove('show');
    form.reset();
  }, 3500);
}

// ---- FAQ ----
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  // toggle current
  if (!wasOpen) item.classList.add('open');
}

// ---- SCROLL REVEAL ----
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.dataset.delay = i % 4;
  observer.observe(el);
});

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
