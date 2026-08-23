/* KTA Spices — Shared JavaScript v3.0 (Fully Responsive, Optimized) */
'use strict';

/* ── 1. Scroll Reveal & Line Drawing ── */
(function(){
  var els = document.querySelectorAll('[data-reveal], .line-draw');
  if(!els.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var delay = e.target.dataset.delay ? parseInt(e.target.dataset.delay) * 40 : 0;
        setTimeout(function(){
          e.target.classList.add('revealed');
          e.target.classList.add('drawn');
        }, delay);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.02,rootMargin:'0px 0px -20px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

/* ── 2. Mobile Nav (Universal Handler) ── */
(function(){
  var hamburgers = document.querySelectorAll('.nav-hamburger, .home-hamburger, #navHamburger, #homeHamburger');
  var panel      = document.getElementById('mobilePanel');
  var overlay    = document.getElementById('mobileOverlay');
  var closeBtn   = document.getElementById('mobileClose');
  if(!panel) return;

  function openMenu(){
    panel.classList.add('is-open');
    if(overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function shutMenu(){
    panel.classList.remove('is-open');
    if(overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  hamburgers.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      openMenu();
    });
  });

  if(closeBtn) closeBtn.addEventListener('click', shutMenu);
  if(overlay)  overlay.addEventListener('click', shutMenu);

  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', shutMenu);
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && panel.classList.contains('is-open')){
      shutMenu();
    }
  });

  // Touch swipe to close
  var startX = 0;
  panel.addEventListener('touchstart', function(e){
    startX = e.touches[0].clientX;
  }, {passive: true});

  panel.addEventListener('touchend', function(e){
    var diff = e.changedTouches[0].clientX - startX;
    if(diff > 50){ shutMenu(); }
  }, {passive: true});
})();

/* ── 3. Stat Counters ── */
(function(){
  var els = document.querySelectorAll('[data-counter]');
  if(!els.length) return;

  function animate(el){
    var target   = parseFloat(el.dataset.counter);
    var suffix   = el.dataset.suffix||'';
    var prefix   = el.dataset.prefix||'';
    var decimals = (String(target).split('.')[1]||'').length;
    var duration = 800;
    var start    = null;
    function ease(t){ return 1-Math.pow(1-t,3); }
    function step(ts){
      if(!start) start=ts;
      var p  = Math.min((ts-start)/duration,1);
      var v  = target*ease(p);
      el.textContent = prefix+(decimals?v.toFixed(decimals):Math.round(v))+suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
    });
  },{threshold:0.2});
  els.forEach(function(el){ io.observe(el); });
})();

/* ── 4. Horizontal Scroll Arrows ── */
(function(){
  document.querySelectorAll('.scroll-row-wrap').forEach(function(wrap){
    var row  = wrap.querySelector('.scroll-row');
    var prev = wrap.querySelector('.arrow-prev');
    var next = wrap.querySelector('.arrow-next');
    if(!row) return;
    var amt = 280;
    if(prev) prev.addEventListener('click',function(){ row.scrollBy({left:-amt,behavior:'smooth'}); });
    if(next) next.addEventListener('click',function(){ row.scrollBy({left: amt,behavior:'smooth'}); });
  });
})();

/* ── 5. Wholesale Carousel ── */
(function(){
  var carousel = document.getElementById('wsCarousel');
  if(!carousel) return;
  var slides  = carousel.querySelectorAll('.ws-slide');
  var prevBtn = document.getElementById('wsPrev');
  var nextBtn = document.getElementById('wsNext');
  var counter = document.getElementById('wsCounter');
  var total   = slides.length;
  var current = 0;
  var timer;

  function show(idx){
    slides.forEach(function(s){ s.classList.remove('active'); });
    slides[idx].classList.add('active');
    if(counter) counter.textContent=(idx+1)+' / '+total;
  }
  function advance(){ current=(current+1)%total; show(current); }

  function startTimer(){ timer=setInterval(advance,5000); }
  function resetTimer(){ clearInterval(timer); startTimer(); }

  if(prevBtn) prevBtn.addEventListener('click',function(){ current=(current-1+total)%total; show(current); resetTimer(); });
  if(nextBtn) nextBtn.addEventListener('click',function(){ current=(current+1)%total; show(current); resetTimer(); });

  show(0);
  startTimer();
})();

/* ── 7. FAQ Accordion Handler (Fixed & Reliable) ── */
window.toggleFaq = function(el) {
  // el can be the faq-header or a child of it
  var header = el;
  // Find closest faq-header if el isn't one
  if (!header.classList.contains('faq-header') && !header.classList.contains('faq-question')) {
    header = el.closest('.faq-header, .faq-question');
  }
  if (!header) return;

  var item = header.closest('.faq-card, .faq-item');
  if (!item) return;

  var wasActive = item.classList.contains('active');

  // Close all open FAQ cards
  document.querySelectorAll('.faq-card, .faq-item').forEach(function(i) {
    i.classList.remove('active');
  });

  // Toggle current card
  if (!wasActive) {
    item.classList.add('active');
  }
};

// Attach click handlers on DOMContentLoaded to cover all pages
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-header, .faq-question').forEach(function(hdr) {
    // Remove any existing onclick to prevent double-firing
    hdr.removeAttribute('onclick');
    hdr.style.cursor = 'pointer';
    hdr.addEventListener('click', function(e) {
      e.preventDefault();
      window.toggleFaq(this);
    });
  });

  // Also handle any + buttons inside FAQ cards
  document.querySelectorAll('.faq-btn-icon').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleFaq(this.closest('.faq-header, .faq-question') || this);
    });
  });
});

/* ── 8. Universal Nav Scroll Floating ── */
(function(){
  var nav = document.getElementById('homeNav');
  if(!nav) return;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){
      nav.classList.add('floating');
    } else {
      nav.classList.remove('floating');
    }
  }, {passive:true});
})();
