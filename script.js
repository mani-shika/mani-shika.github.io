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
// DARK MODE + PARTICLE CANVAS
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = document.getElementById('toggleIcon');
const thumb       = document.querySelector('.toggle-thumb');
const canvas      = document.getElementById('bgCanvas');
const ctx         = canvas ? canvas.getContext('2d') : null;

// -- Particle system
let particles = [];
let animFrame;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticles() {
  particles = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 8000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: randomBetween(0.5, 2.2),
      dx: randomBetween(-0.15, 0.15),
      dy: randomBetween(-0.2, -0.05),
      alpha: randomBetween(0.3, 1),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: randomBetween(0.005, 0.02),
      color: Math.random() > 0.6
        ? `rgba(77,159,255,`    // blue
        : Math.random() > 0.5
          ? `rgba(120,80,255,`  // purple
          : `rgba(0,220,180,`   // teal
    });
  }
}

function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.pulse += p.pulseSpeed;
    const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + a + ')';
    ctx.fill();

    // draw faint connection lines between nearby particles
    particles.forEach(q => {
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(77,159,255,${0.04 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    p.x += p.dx;
    p.y += p.dy;
    if (p.y < -5)  p.y = canvas.height + 5;
    if (p.x < -5)  p.x = canvas.width  + 5;
    if (p.x > canvas.width  + 5) p.x = -5;
  });

  animFrame = requestAnimationFrame(drawParticles);
}

function startParticles() {
  resizeCanvas();
  createParticles();
  drawParticles();
}

function stopParticles() {
  cancelAnimationFrame(animFrame);
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// -- Toggle logic
let isDark = localStorage.getItem('theme') === 'dark';

function applyTheme(dark, animate) {
  isDark = dark;
  document.body.classList.toggle('dark', dark);
  toggleIcon.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark ? 'dark' : 'light');

  // set CSS var for swing animation end position
  thumb.style.setProperty('--tx', dark ? '24px' : '0px');

  if (animate) {
    thumb.classList.remove('swing');
    void thumb.offsetWidth; // force reflow
    thumb.classList.add('swing');
    setTimeout(() => thumb.classList.remove('swing'), 500);
  }

  if (dark) {
    startParticles();
  } else {
    stopParticles();
  }
}

// Apply saved theme on load (no animation)
applyTheme(isDark, false);

themeToggle.addEventListener('click', () => applyTheme(!isDark, true));

window.addEventListener('resize', () => {
  if (isDark) { resizeCanvas(); createParticles(); }
});
