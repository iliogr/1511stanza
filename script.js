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

  nav.classList.toggle('scrolled', current > 50);

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

const revealElements = document.querySelectorAll('.reveal-up, .reveal-text, .team-member');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// =========================
// Parallax on Full-Bleed Images
// =========================

const parallaxElements = document.querySelectorAll('[data-parallax]');

function updateParallax() {
  parallaxElements.forEach(el => {
    const rect = el.parentElement.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return;
    const progress = (rect.top + rect.height) / (vh + rect.height);
    const offset = (progress - 0.5) * 60;
    el.style.transform = `translateY(${offset}px)`;
  });
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

// =========================
// Gallery Drag-to-Scroll
// =========================

const galleryScroll = document.querySelector('.gallery-scroll');
const galleryWrapper = document.querySelector('.gallery-wrapper');
const galleryBtnLeft = document.querySelector('.gallery-btn-left');
const galleryBtnRight = document.querySelector('.gallery-btn-right');

if (galleryScroll) {
  let isDown = false;
  let startX;
  let scrollLeft;

  galleryScroll.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - galleryScroll.offsetLeft;
    scrollLeft = galleryScroll.scrollLeft;
  });

  galleryScroll.addEventListener('mouseleave', () => {
    isDown = false;
  });

  galleryScroll.addEventListener('mouseup', () => {
    isDown = false;
  });

  galleryScroll.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryScroll.scrollLeft = scrollLeft - walk;
  });

  // Gallery nav buttons — only show when content overflows
  function checkGalleryOverflow() {
    const hasOverflow = galleryScroll.scrollWidth > galleryScroll.clientWidth + 4;
    galleryWrapper.classList.toggle('has-overflow', hasOverflow);
    if (hasOverflow) updateGalleryBtns();
  }

  function updateGalleryBtns() {
    const sl = galleryScroll.scrollLeft;
    const maxScroll = galleryScroll.scrollWidth - galleryScroll.clientWidth;
    galleryBtnLeft.classList.toggle('hidden', sl <= 4);
    galleryBtnRight.classList.toggle('hidden', sl >= maxScroll - 4);
  }

  galleryBtnLeft.addEventListener('click', () => {
    galleryScroll.scrollBy({ left: -300, behavior: 'smooth' });
  });

  galleryBtnRight.addEventListener('click', () => {
    galleryScroll.scrollBy({ left: 300, behavior: 'smooth' });
  });

  galleryScroll.addEventListener('scroll', updateGalleryBtns, { passive: true });
  window.addEventListener('resize', checkGalleryOverflow);
  checkGalleryOverflow();
}

// =========================
// Reviews Carousel
// =========================

const reviews = [
  'Καταπληκτικός χώρος, ευγενική και φιλική εξυπηρέτηση, τήρηση ραντεβού χωρίς αναμονή, πολύ καλό κούρεμα-ξύρισμα.',
  'Εξαιρετικός και πολύ ευχάριστος χώρος, η εξυπηρέτηση άψογη. Ο Αλεξ είναι καταπληκτικός.',
  'Απίστευτα εξυπηρετικοί και ευχάριστοι!! Ένα από τα καλύτερα Barber πού θα βρείτε στην Αθήνα!',
  'Τα παιδιά παίρνουν άριστα σε όλα. Το περιβάλλον, η μουσική, η εξυπηρέτηση, ο επαγγελματισμός.',
  'Άριστος επαγγελματίας και καλλιτέχνης και τυπικός στα ραντεβού του. Το καλύτερο κομμωτήριο της πόλης.',
  'Πανέμορφο μαγαζί, τρομεροί κομμωτές, πεντακάθαρο και πολύ φιλικό κλίμα!'
];

let currentReview = 0;
const featuredQuote = document.getElementById('featured-review');
const reviewCounter = document.getElementById('review-counter');
const prevBtn = document.getElementById('review-prev');
const nextBtn = document.getElementById('review-next');

function showReview(index) {
  featuredQuote.classList.add('switching');
  setTimeout(() => {
    featuredQuote.querySelector('p').textContent = reviews[index];
    reviewCounter.textContent = `${index + 1} / ${reviews.length}`;
    featuredQuote.classList.remove('switching');
  }, 300);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    showReview(currentReview);
  });

  nextBtn.addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
  });

  // Auto-advance every 5s
  let autoPlay = setInterval(() => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
  }, 5000);

  // Pause auto-advance on interaction
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => {
        currentReview = (currentReview + 1) % reviews.length;
        showReview(currentReview);
      }, 5000);
    });
  });
}

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

document.querySelectorAll('.gallery-item img').forEach(img => {
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
// i18n Language Toggle
// =========================

const translations = {
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.team': 'Team',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.book': 'Book Now',
    'about.label': 'Since 2020',
    'about.title': 'About <em>Us</em>',
    'about.p1': 'Creating a barbershop was a dream that became reality in 2020 under the name 1511 Stanza Della Barberia.',
    'about.p2': '1511 Stanza Della Barberia, inspired by the Sistine Chapel of the Vatican, has a distinctly Renaissance character and came to bring the new school version of old school barbershops.',
    'about.p3': 'It is a space created exclusively for men\'s grooming, maintaining its identity while covering all modern needs.',
    'services.label': 'What We Offer',
    'services.title': 'Services',
    's.haircut': 'Men\'s Haircut & Styling',
    's.kids': 'Kids Haircut',
    's.clipper': 'Clipper Cut',
    's.cleanup': 'Edge Cleanup',
    's.cleanup.desc': 'Neck &middot; Sideburns',
    's.beard': 'Beard Grooming',
    's.shave.special': 'Special Shave',
    's.shave.special.desc': 'Traditional shave with hot compress, massage, facial cleansing and threading',
    's.shave.simple': 'Simple Shave',
    's.blackmask': 'Black Mask Facial Treatment',
    's.threading': 'Threading Hair Removal',
    's.eyebrows': 'Eyebrow Shaping',
    'cta.book': 'Book Appointment',
    'reviews.count': '160+ Google Reviews',
    'gallery.label': 'Our Work',
    'gallery.title': 'Fresh Cuts <em>in Action</em>',
    'team.label': 'The Artists',
    'team.title': 'Our <em>Team</em>',
    'booking.title': 'Booking &mdash;<br>Hassle-Free,<br><em>Just One Click</em>',
    'booking.desc': 'Pick a date, choose your barber and reserve your spot.',
    'contact.label': 'Visit Us',
    'contact.title': 'Contact',
    'contact.address': 'Address',
    'contact.address.val': 'Kountouriotou 100<br>Galatsi, Athens',
    'contact.phone': 'Phone',
    'contact.follow': 'Follow Us',
    'footer.privacy': 'Privacy Policy',
    'footer.booking': 'Online Booking',
    'review.mini1': 'Excellent and very pleasant space, impeccable service.',
    'review.mini2': 'One of the best barbers you\'ll find in Athens!',
    'review.mini3': 'The team excels in everything. The atmosphere, the music, the professionalism.',
    'footer.stay': 'Stay<br>Connected!',
    'hero.w1': 'A',
    'hero.w2': 'Ritual',
    'hero.w3': 'of',
    'hero.w4': 'Grooming',
    'm.1': 'Renaissance Grooming',
    'm.2': 'Est. 2020',
    'm.3': 'Galatsi, Athens',
    'm.4': 'Sistine Chapel Inspired',
    'm.5': 'A Ritual of Grooming',
    'nav.events': 'Events',
    'events.label': 'Events',
    'events.title': 'Community <em>& Action</em>',
    'events.mov.month': 'Nov 2025',
    'events.mov.title': 'Movember &mdash; A Day Dedicated to Men\'s Health',
    'events.mov.desc': 'A special awareness event for men\'s health featuring live music, activities and social contribution. All proceeds were donated to IASIS and EPAPSY.',
    'events.readmore': 'Read More &rarr;'
  },
  el: {
    'nav.about': 'Σχετικά',
    'nav.services': 'Υπηρεσίες',
    'nav.team': 'Ομάδα',
    'nav.gallery': 'Γκαλερί',
    'nav.contact': 'Επικοινωνία',
    'nav.book': 'Κράτηση',
    'about.label': 'Από το 2020',
    'about.title': 'Γνωρίστε <em>Μας</em>',
    'about.p1': 'Η δημιουργία ενός barbershop ήταν ένα όνειρο το οποίο έγινε πραγματικότητα το 2020 με την ονομασία 1511 Stanza Della Barberia.',
    'about.p2': 'Το 1511 Stanza Della Barberia εμπνευσμένο από την Καπέλα Σιξτίνα του Βατικανού έχει ένα ιδιαίτερα αναγεννησιακό χαρακτήρα και ήρθε για να φέρει την new school εκδοχή των old school barbershop\'s.',
    'about.p3': 'Είναι ένας χώρος, ο οποίος δημιουργήθηκε αποκλειστικά για την περιποίηση του άντρα και κρατάει την ταυτότητα του καλύπτοντας όλες του τις σύγχρονες ανάγκες.',
    'services.label': 'Τι Προσφέρουμε',
    'services.title': 'Υπηρεσίες',
    's.haircut': 'Ανδρικό Κούρεμα & Styling',
    's.kids': 'Παιδικό Κούρεμα',
    's.clipper': 'Κούρεμα με Μηχανή',
    's.cleanup': 'Περιμετρικό Καθάρισμα',
    's.cleanup.desc': 'Αυχένας &middot; Φαβορίτες',
    's.beard': 'Περιποίηση Γενειάδας',
    's.shave.special': 'Ξύρισμα Special',
    's.shave.special.desc': 'Παραδοσιακό ξύρισμα με ζεστή κομπρέσα, μασάζ, καθαρισμός προσώπου και αποτρίχωση με κλωστή',
    's.shave.simple': 'Ξύρισμα Απλό',
    's.blackmask': 'Περιποίηση Προσώπου Black Mask',
    's.threading': 'Αποτρίχωση με Κλωστή',
    's.eyebrows': 'Σχήμα Φρυδιών',
    'cta.book': 'Κλείσε Ραντεβού',
    'reviews.count': '160+ Google Reviews',
    'gallery.label': 'Η Δουλειά Μας',
    'gallery.title': 'Κουρέματα <em>σε Δράση</em>',
    'team.label': 'Οι Καλλιτέχνες',
    'team.title': 'Η Ομάδα <em>Μας</em>',
    'booking.title': 'Κράτηση &mdash;<br>Χωρίς Ταλαιπωρία,<br><em>Μόνο ένα Click</em>',
    'booking.desc': 'Διάλεξε ημερομηνία, επέλεξε τον κουρέα σου και κλείσε τη θέση σου.',
    'contact.label': 'Επισκεφθείτε Μας',
    'contact.title': 'Επικοινωνία',
    'contact.address': 'Διεύθυνση',
    'contact.address.val': 'Κουντουριώτου 100<br>Γαλάτσι, Αθήνα',
    'contact.phone': 'Τηλέφωνο',
    'contact.follow': 'Ακολουθήστε Μας',
    'footer.privacy': 'Πολιτική Απορρήτου',
    'footer.booking': 'Online Κράτηση',
    'review.mini1': 'Εξαιρετικός και πολύ ευχάριστος χώρος, η εξυπηρέτηση άψογη.',
    'review.mini2': 'Ένα από τα καλύτερα Barber πού θα βρείτε στην Αθήνα!',
    'review.mini3': 'Τα παιδιά παίρνουν άριστα σε όλα. Το περιβάλλον, η μουσική, ο επαγγελματισμός.',
    'footer.stay': 'Μείνετε<br>Συνδεδεμένοι!',
    'hero.w1': 'Η',
    'hero.w2': 'Τέχνη',
    'hero.w3': 'της',
    'hero.w4': 'Περιποίησης',
    'm.1': 'Αναγεννησιακή Περιποίηση',
    'm.2': 'Από το 2020',
    'm.3': 'Γαλάτσι, Αθήνα',
    'm.4': 'Εμπνευσμένο από την Καπέλα Σιξτίνα',
    'm.5': 'Η Τέχνη της Περιποίησης',
    'nav.events': 'Εκδηλώσεις',
    'events.label': 'Εκδηλώσεις',
    'events.title': 'Κοινότητα <em>& Δράση</em>',
    'events.mov.month': 'Νοε 2025',
    'events.mov.title': 'Movember &mdash; Μια Ημέρα Αφιερωμένη στην Ανδρική Υγεία',
    'events.mov.desc': 'Μια ξεχωριστή εκδήλωση ευαισθητοποίησης για την ανδρική υγεία με ζωντανή μουσική, δράσεις και κοινωνική προσφορά. Όλα τα έσοδα δόθηκαν στον ΙΑΣΙΣ και την ΕΠΑΨΥ.',
    'events.readmore': 'Διαβάστε Περισσότερα &rarr;'
  }
};

const reviewsEn = [
  'Amazing space, polite and friendly service, appointments on time with no waiting, excellent haircut and shave.',
  'Excellent and very pleasant space, impeccable service. Alex is amazing.',
  'Incredibly helpful and pleasant!! One of the best barbers you\'ll find in Athens!',
  'The team excels in everything. The atmosphere, the music, the service, the professionalism.',
  'Excellent professional and artist, always on time with his appointments. The best barbershop in town.',
  'Beautiful shop, incredible barbers, spotlessly clean and very friendly atmosphere!'
];

const reviewsEl = [
  'Καταπληκτικός χώρος, ευγενική και φιλική εξυπηρέτηση, τήρηση ραντεβού χωρίς αναμονή, πολύ καλό κούρεμα-ξύρισμα.',
  'Εξαιρετικός και πολύ ευχάριστος χώρος, η εξυπηρέτηση άψογη. Ο Αλεξ είναι καταπληκτικός.',
  'Απίστευτα εξυπηρετικοί και ευχάριστοι!! Ένα από τα καλύτερα Barber πού θα βρείτε στην Αθήνα!',
  'Τα παιδιά παίρνουν άριστα σε όλα. Το περιβάλλον, η μουσική, η εξυπηρέτηση, ο επαγγελματισμός.',
  'Άριστος επαγγελματίας και καλλιτέχνης και τυπικός στα ραντεβού του. Το καλύτερο κομμωτήριο της πόλης.',
  'Πανέμορφο μαγαζί, τρομεροί κομμωτές, πεντακάθαρο και πολύ φιλικό κλίμα!'
];

let currentLang = 'el';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Update reviews carousel
  const langReviews = lang === 'en' ? reviewsEn : reviewsEl;
  reviews.length = 0;
  reviews.push(...langReviews);
  if (featuredQuote) {
    featuredQuote.querySelector('p').textContent = reviews[currentReview];
  }

  // Update toggle button text
  const toggleBtn = document.getElementById('lang-toggle');
  toggleBtn.textContent = lang === 'el' ? 'EN' : 'GR';

  localStorage.setItem('lang', lang);
}

const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
  setLanguage(currentLang === 'el' ? 'en' : 'el');
});

// Restore saved language
const savedLang = localStorage.getItem('lang');
if (savedLang && savedLang !== 'el') {
  setLanguage(savedLang);
}

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

// =========================
// Hide scroll indicator on scroll
// =========================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transition = 'opacity 0.4s ease';
    }
  }, { once: true });
}
