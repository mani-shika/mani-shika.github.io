// ══ CURSOR ══
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  ring.classList.add('ready');
});
document.querySelectorAll('a,button,.proj-card,.proj-featured,.skill-card,.social-btn,.cert-link').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ══ SCROLL REVEAL ══
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); }});
}, { threshold: 0.1, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ══ HAMBURGER ══
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ══ DOCK ACTIVE STATE ══
const dockItems = document.querySelectorAll('.dock-item');
const dockObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const id = e.target.id;
      dockItems.forEach(item => item.classList.toggle('active', item.dataset.section === id));
    }
  });
}, { threshold: 0.4 });
['about','experience','projects','skills','contact'].forEach(id => {
  const el = document.getElementById(id);
  if(el) dockObs.observe(el);
});

// ══ CONTACT FORM ══
const formSubmit = document.getElementById('formSubmit');
const formNote   = document.getElementById('formNote');
if(formSubmit){
  formSubmit.addEventListener('click', () => {
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmsg').value.trim();
    if(!name||!email||!msg){ formNote.textContent='Please fill in all fields.'; formNote.style.color='#c0392b'; return; }
    const s = encodeURIComponent(`Portfolio Enquiry from ${name}`);
    const b = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
    window.open(`mailto:kkmanishika@gmail.com?subject=${s}&body=${b}`,'_blank');
    formNote.textContent='Opening your mail client…'; formNote.style.color='var(--green-accent)';
  });
}

// ══ 3D TILT — featured card ══
const featCard = document.querySelector('.proj-featured');
if(featCard){
  featCard.addEventListener('mousemove', e => {
    const r = featCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    featCard.style.transition = 'box-shadow .3s ease';
    featCard.style.transform = `perspective(1000px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;
  });
  featCard.addEventListener('mouseleave', () => {
    featCard.style.transition = 'transform .5s ease,box-shadow .5s ease';
    featCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
}

// ══ 3D TILT — project cards ══
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transition = 'box-shadow .2s';
    card.style.transform = `perspective(600px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .4s ease,box-shadow .4s ease';
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ══ VISITOR COUNTER ══
(async () => {
  const el = document.getElementById('visitorCount');
  if(!el) return;
  try {
    const res  = await fetch('https://api.countapi.xyz/hit/manishika-portfolio/visitors');
    const data = await res.json();
    if(data && data.value){
      const n = data.value;
      const s = ['th','st','nd','rd'];
      const v = n % 100;
      const suffix = s[(v-20)%10] || s[v] || s[0];
      let cur = Math.max(1, n-20);
      const step = () => {
        cur = Math.min(cur+1, n);
        el.innerHTML = `${cur.toLocaleString()}<sup>${suffix}</sup>`;
        if(cur < n) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  } catch(e){ el.closest('.visitor-counter') && (el.closest('.visitor-counter').style.display='none'); }
})();

// ══ DARK MODE + AURORA ══
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = document.getElementById('toggleIcon');
const canvas      = document.getElementById('bgCanvas');
const ctx         = canvas ? canvas.getContext('2d') : null;
let mouse = {x:.5,y:.5}, targetMouse = {x:.5,y:.5};

document.addEventListener('mousemove', e => {
  targetMouse.x = e.clientX / window.innerWidth;
  targetMouse.y = e.clientY / window.innerHeight;
});

function resizeCanvas(){ if(!canvas) return; canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const blobs = [
  {x:.2,y:.3,speed:.008,hue:210,sat:100,lit:60,r:.45},
  {x:.7,y:.6,speed:.005,hue:260,sat:90,lit:55,r:.38},
  {x:.5,y:.2,speed:.012,hue:185,sat:100,lit:50,r:.32},
  {x:.3,y:.7,speed:.006,hue:230,sat:95,lit:58,r:.28},
];
let stars=[], animFrame, time=0;

function createStars(){
  stars=[];
  const n = Math.floor(window.innerWidth*window.innerHeight/4000);
  for(let i=0;i<n;i++) stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.2,alpha:Math.random()*.7+.3,tw:Math.random()*Math.PI*2,spd:.005+Math.random()*.015});
}
createStars();

function drawAurora(){
  if(!ctx||!canvas) return;
  time+=.004;
  mouse.x += (targetMouse.x-mouse.x)*.04;
  mouse.y += (targetMouse.y-mouse.y)*.04;
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  // Base
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#03060F'); bg.addColorStop(.4,'#060B1A'); bg.addColorStop(1,'#02040C');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  // Blobs
  blobs.forEach((b,i)=>{
    const tx=mouse.x+Math.sin(time*.7+i*1.3)*.12;
    const ty=mouse.y+Math.cos(time*.5+i*.9)*.10;
    b.x+=(tx-b.x)*b.speed; b.y+=(ty-b.y)*b.speed;
    b.x+=Math.sin(time*.3+i*2.1)*.0008; b.y+=Math.cos(time*.4+i*1.7)*.0006;
    const cx=b.x*W, cy=b.y*H, rad=b.r*Math.max(W,H);
    const pulse=.12+.06*Math.sin(time*1.2+i*.8);
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
    g.addColorStop(0,`hsla(${b.hue+Math.sin(time+i)*15},${b.sat}%,${b.lit}%,${pulse})`);
    g.addColorStop(.4,`hsla(${b.hue+20},${b.sat}%,${b.lit-10}%,${pulse*.5})`);
    g.addColorStop(1,`hsla(${b.hue},${b.sat}%,${b.lit}%,0)`);
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  });
  // Spotlight
  const mx=mouse.x*W, my=mouse.y*H;
  const sp=ctx.createRadialGradient(mx,my,0,mx,my,W*.22);
  sp.addColorStop(0,'rgba(100,180,255,.07)'); sp.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sp; ctx.fillRect(0,0,W,H);
  // Stars
  stars.forEach(s=>{
    s.tw+=s.spd;
    const a=s.alpha*(.5+.5*Math.sin(s.tw));
    const sx=(s.x+(s.x-mouse.x)*.015)*W;
    const sy=(s.y+(s.y-mouse.y)*.015)*H;
    ctx.beginPath(); ctx.arc(sx,sy,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(200,220,255,${a})`; ctx.fill();
  });
  animFrame=requestAnimationFrame(drawAurora);
}

function startAurora(){ resizeCanvas(); createStars(); drawAurora(); }
function stopAurora(){ cancelAnimationFrame(animFrame); ctx&&canvas&&ctx.clearRect(0,0,canvas.width,canvas.height); }

let isDark = localStorage.getItem('theme')==='dark';

function applyTheme(dark){
  isDark=dark;
  document.body.classList.toggle('dark',dark);
  toggleIcon.textContent = dark ? '🌙' : '☀️';
  localStorage.setItem('theme', dark?'dark':'light');
  if(dark) startAurora(); else stopAurora();
}

applyTheme(isDark);
themeToggle.addEventListener('click', () => applyTheme(!isDark));
window.addEventListener('resize', () => { if(isDark){ resizeCanvas(); createStars(); }});

// ══ PROJECT CAROUSEL ══
(function(){
  const carousel = document.getElementById('projCarousel');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  const dots     = document.querySelectorAll('.cdot');
  const viewAllBtn  = document.getElementById('btnViewAll');
  const viewAllText = document.getElementById('viewAllText');
  const viewAllIcon = document.getElementById('viewAllIcon');
  const allGrid     = document.getElementById('allProjectsGrid');
  if(!carousel) return;

  const slides = carousel.querySelectorAll('.proj-slide');
  let current = 0;

  function scrollTo(idx){
    current = Math.max(0, Math.min(idx, slides.length-1));
    const slide = slides[current];
    carousel.scrollTo({ left: slide.offsetLeft - carousel.offsetLeft, behavior:'smooth' });
    dots.forEach((d,i) => d.classList.toggle('active', i===current));
  }

  prevBtn && prevBtn.addEventListener('click', e => { e.preventDefault(); scrollTo(current-1); });
  nextBtn && nextBtn.addEventListener('click', e => { e.preventDefault(); scrollTo(current+1); });
  dots.forEach(d => d.addEventListener('click', () => scrollTo(+d.dataset.idx)));

  // Drag / swipe
  let startX=0, isDragging=false;
  carousel.addEventListener('mousedown',  e => { isDragging=true; startX=e.pageX; carousel.style.cursor='grabbing'; });
  carousel.addEventListener('mousemove',  e => { if(!isDragging) return; });
  carousel.addEventListener('mouseup',    e => {
    if(!isDragging) return; isDragging=false; carousel.style.cursor='';
    const diff = startX - e.pageX;
    if(Math.abs(diff)>40) scrollTo(diff>0 ? current+1 : current-1);
  });
  carousel.addEventListener('mouseleave', () => { isDragging=false; carousel.style.cursor=''; });
  carousel.addEventListener('touchstart', e => { startX=e.touches[0].pageX; }, {passive:true});
  carousel.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].pageX;
    if(Math.abs(diff)>40) scrollTo(diff>0 ? current+1 : current-1);
  });

  // Sync dots on manual scroll
  carousel.addEventListener('scroll', () => {
    const idx = Math.round(carousel.scrollLeft / (slides[0].offsetWidth + 24));
    if(idx !== current){ current=idx; dots.forEach((d,i)=>d.classList.toggle('active',i===idx)); }
  });

  // View all
  let expanded = false;
  viewAllBtn && viewAllBtn.addEventListener('click', () => {
    expanded = !expanded;
    allGrid.classList.toggle('expanded', expanded);
    viewAllBtn.classList.toggle('open', expanded);
    viewAllText.textContent = expanded ? 'Hide projects' : 'View all projects';
    if(expanded){
      // trigger tilt on newly visible cards
      setTimeout(()=>{
        allGrid.querySelectorAll('.proj-card').forEach(card => {
          card.addEventListener('mousemove', e => {
            const r=card.getBoundingClientRect();
            const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
            card.style.transition='box-shadow .2s';
            card.style.transform=`perspective(600px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
          });
          card.addEventListener('mouseleave',()=>{ card.style.transition='transform .4s ease,box-shadow .4s ease'; card.style.transform='perspective(600px) rotateX(0) rotateY(0) translateY(0)'; });
        });
      }, 100);
    }
  });
})();
