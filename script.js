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
// VISITOR COUNTER
// ═══════════════════════════════════════════
(async function initVisitorCounter() {
  const el = document.getElementById('visitorCount');
  if (!el) return;

  // Unique namespace:key — change 'manishika-portfolio' if you want a fresh count
  const NAMESPACE = 'manishika-portfolio';
  const KEY       = 'visitors';

  function formatNumber(n) {
    // Add ordinal suffix: 1st, 2nd, 3rd, 569th…
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    return n.toLocaleString() + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function animateCount(target) {
    // Count up from ~target-30 to target for drama
    const start = Math.max(1, target - 30);
    let current = start;
    const step = () => {
      current = Math.min(current + 1, target);
      el.innerHTML = `<span class="counter-revealed">${formatNumber(current)}</span>`;
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  try {
    // Hit the counter — increments by 1 each visit
    const res  = await fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`);
    const data = await res.json();
    if (data && data.value) {
      animateCount(data.value);
    } else {
      el.textContent = '—';
    }
  } catch (err) {
    // If API is down just hide gracefully
    el.closest('.visitor-counter').style.display = 'none';
  }
})();
