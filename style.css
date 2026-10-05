// ═══════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY  + 'px';
  ring.classList.add('ready');
});

document.querySelectorAll('a, button, .proj-card, .skill-card, .cert-link, .social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ═══════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ═══════════════════════════════════════════
// SMOOTH NAV ACTIVE STATE
// ═══════════════════════════════════════════
const sections  = document.querySelectorAll('section[id], footer');
const navLinks  = document.querySelectorAll('.nav-links a');

const secObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--green-accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => secObserver.observe(s));

// ═══════════════════════════════════════════
// CONTACT FORM — mailto fallback
// ═══════════════════════════════════════════
const formSubmit = document.getElementById('formSubmit');
const formNote   = document.getElementById('formNote');

if (formSubmit) {
  formSubmit.addEventListener('click', () => {
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmsg').value.trim();

    if (!name || !email || !msg) {
      formNote.textContent = 'Please fill in all fields.';
      formNote.style.color = '#c0392b';
      return;
    }

    const subject = encodeURIComponent(`Portfolio Enquiry from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.open(`mailto:kkmanishika@gmail.com?subject=${subject}&body=${body}`, '_blank');

    formNote.textContent = 'Opening your mail client…';
    formNote.style.color = 'var(--green-accent)';
  });
}

// ═══════════════════════════════════════════
// DOCK — active state on scroll
// ═══════════════════════════════════════════
const dockItems = document.querySelectorAll('.dock-item');
const dockSections = ['about','experience','projects','skills','contact'];

const dockObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dockItems.forEach(item => {
        const href = item.getAttribute('href').replace('#','');
        item.classList.toggle('active', href === id);
      });
    }
  });
}, { threshold: 0.4 });

dockSections.forEach(id => {
  const el = document.getElementById(id);
  if (el) dockObserver.observe(el);
});

// ═══════════════════════════════════════════
// FEATURED CARD — 3D TILT ON MOUSE MOVE
// ═══════════════════════════════════════════
const featCard = document.querySelector('.proj-featured');
if (featCard) {
  featCard.addEventListener('mousemove', (e) => {
    const rect = featCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    const rotateX = (-y * 8).toFixed(2);   // max 8deg
    const rotateY = ( x * 8).toFixed(2);

    featCard.classList.add('tilting');
    featCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  });

  featCard.addEventListener('mouseleave', () => {
    featCard.classList.remove('tilting');
    featCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    featCard.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  });

  featCard.addEventListener('mouseenter', () => {
    featCard.style.transition = 'box-shadow 0.3s ease';
  });
}

// ═══════════════════════════════════════════
// ALL PROJECT CARDS — subtle tilt
// ═══════════════════════════════════════════
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    card.style.transition = 'box-shadow 0.2s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
  });
});
