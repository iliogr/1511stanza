// =========================
// Navigation
// =========================

const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');
const navRight = document.querySelector('.nav-right');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 200) {
    nav.classList.add('hidden');
    navRight.classList.remove('open');
    toggle.classList.remove('active');
  } else {
    nav.classList.remove('hidden');
  }

  lastScroll = current;
});

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  navRight.classList.toggle('open');
});

navRight.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navRight.classList.remove('open');
    toggle.classList.remove('active');
  });
});

// =========================
// Scroll Reveal
// =========================

const revealElements = document.querySelectorAll(
  '.hero-text, .hero-images,' +
  '.about-img-col, .about-text-col,' +
  '.atmo-img, .atmo-text,' +
  '.services-list,' +
  '.gallery-card,' +
  '.team-member,' +
  '.booking-text, .booking-img,' +
  '.contact-info, .contact-map'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

// Stagger
document.querySelectorAll('.team-member').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});

document.querySelectorAll('.gallery-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

// =========================
// Lightbox
// =========================

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
  <img src="" alt="">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery-card img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
});

// =========================
// Privacy Modal
// =========================

const privacyModal = document.getElementById('privacy-modal');
const privacyLink = document.getElementById('privacy-link');
const modalClose = privacyModal.querySelector('.modal-close');

privacyLink.addEventListener('click', e => {
  e.preventDefault();
  privacyModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

modalClose.addEventListener('click', () => {
  privacyModal.classList.remove('active');
  document.body.style.overflow = '';
});

privacyModal.addEventListener('click', e => {
  if (e.target === privacyModal) {
    privacyModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// =========================
// Dynamic Year
// =========================

document.getElementById('year').textContent = new Date().getFullYear();

// =========================
// Escape Key
// =========================

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (privacyModal.classList.contains('active')) {
      privacyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});
