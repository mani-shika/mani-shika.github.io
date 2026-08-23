// ═══════════════════════════════════════════
// RESUME BUTTON
// ═══════════════════════════════════════════
function handleResume(e) {
  e.preventDefault();
  // Replace the URL below once you upload your resume PDF to Google Drive
  // Right-click PDF in Drive → Share → Anyone with link → copy link → paste here
  const resumeUrl = 'assets/resume.pdf'; // or your Google Drive share link
  window.open(resumeUrl, '_blank');
}

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
