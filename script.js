// ═══════════════════════════════════════════
// RESUME BUTTON
// ═══════════════════════════════════════════
function handleResume(e) {
  e.preventDefault();
  window.open('assets/Updated_Resume (4).pdf', '_blank');
}

// ═══════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  ring.classList.add('ready');
});
document.querySelectorAll('a, button, .proj-card, .skill-card, .cert-link, .social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ═══════════════════════════════════════════
// NAV ACTIVE STATE
// ═══════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--green-accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

// ═══════════════════════════════════════════
// CONTACT FORM
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
// DARK MODE + AURORA CANVAS
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = document.getElementById('toggleIcon');
const canvas      = document.getElementById('bgCanvas');
const ctx         = canvas ? canvas.getContext('2d') : null;

// Mouse position (normalised 0-1)
let mouse = { x: 0.5, y: 0.5 };
let targetMouse = { x: 0.5, y: 0.5 };

document.addEventListener('mousemove', e => {
  targetMouse.x = e.clientX / window.innerWidth;
  targetMouse.y = e.clientY / window.innerHeight;
});

// ── Canvas resize
function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Aurora blobs — each follows mouse with different lag
const blobs = [
  { x: 0.2, y: 0.3, vx: 0, vy: 0, r: 0.45, speed: 0.008, hue: 210, sat: 100, lit: 60 }, // electric blue
  { x: 0.7, y: 0.6, vx: 0, vy: 0, r: 0.38, speed: 0.005, hue: 260, sat: 90,  lit: 55 }, // purple
  { x: 0.5, y: 0.2, vx: 0, vy: 0, r: 0.32, speed: 0.012, hue: 185, sat: 100, lit: 50 }, // cyan
  { x: 0.3, y: 0.7, vx: 0, vy: 0, r: 0.28, speed: 0.006, hue: 230, sat: 95,  lit: 58 }, // indigo
];

// ── Stars
let stars = [];
function createStars() {
  stars = [];
  const n = Math.floor(window.innerWidth * window.innerHeight / 4000);
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.015
    });
  }
}
createStars();

let animFrame;
let time = 0;

function drawAurora() {
  if (!ctx || !canvas) return;
  time += 0.004;

  // Smoothly interpolate mouse
  mouse.x += (targetMouse.x - mouse.x) * 0.04;
  mouse.y += (targetMouse.y - mouse.y) * 0.04;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const W = canvas.width;
  const H = canvas.height;

  // ── 1. Deep space base gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,   '#03060F');
  bg.addColorStop(0.4, '#060B1A');
  bg.addColorStop(1,   '#02040C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── 2. Aurora blobs — move toward mouse with individual lag
  blobs.forEach((b, i) => {
    // Each blob attracted to mouse position with its own speed
    const targetX = mouse.x + Math.sin(time * 0.7 + i * 1.3) * 0.12;
    const targetY = mouse.y + Math.cos(time * 0.5 + i * 0.9) * 0.10;
    b.x += (targetX - b.x) * b.speed;
    b.y += (targetY - b.y) * b.speed;

    // Organic drift
    b.x += Math.sin(time * 0.3 + i * 2.1) * 0.0008;
    b.y += Math.cos(time * 0.4 + i * 1.7) * 0.0006;

    const cx = b.x * W;
    const cy = b.y * H;
    const rad = b.r * Math.max(W, H);

    const pulse = 0.12 + 0.06 * Math.sin(time * 1.2 + i * 0.8);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grd.addColorStop(0,   `hsla(${b.hue + Math.sin(time + i) * 15}, ${b.sat}%, ${b.lit}%, ${pulse})`);
    grd.addColorStop(0.4, `hsla(${b.hue + 20}, ${b.sat}%, ${b.lit - 10}%, ${pulse * 0.5})`);
    grd.addColorStop(1,   `hsla(${b.hue}, ${b.sat}%, ${b.lit}%, 0)`);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  });

  // ── 3. Mouse spotlight — bright glow follows cursor exactly
  const mx = mouse.x * W;
  const my = mouse.y * H;
  const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, W * 0.22);
  spotlight.addColorStop(0,   'rgba(100, 180, 255, 0.07)');
  spotlight.addColorStop(0.5, 'rgba(60, 120, 255, 0.03)');
  spotlight.addColorStop(1,   'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, W, H);

  // ── 4. Twinkling stars
  stars.forEach(s => {
    s.twinkle += s.speed;
    const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
    // Stars subtly drift away from mouse
    const sx = (s.x + (s.x - mouse.x) * 0.015) * W;
    const sy = (s.y + (s.y - mouse.y) * 0.015) * H;
    ctx.beginPath();
    ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 220, 255, ${a})`;
    ctx.fill();
  });

  // ── 5. Scan lines (subtle depth)
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, y, W, 1);
  }

  animFrame = requestAnimationFrame(drawAurora);
}

function startAurora() {
  resizeCanvas();
  createStars();
  drawAurora();
}

function stopAurora() {
  cancelAnimationFrame(animFrame);
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ── Theme apply
let isDark = localStorage.getItem('theme') === 'dark';

function applyTheme(dark) {
  isDark = dark;
  document.body.classList.toggle('dark', dark);
  toggleIcon.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  if (dark) startAurora(); else stopAurora();
}

// Init on load
applyTheme(isDark);

// Toggle click
themeToggle.addEventListener('click', () => applyTheme(!isDark));

window.addEventListener('resize', () => {
  if (isDark) { resizeCanvas(); createStars(); }
});
