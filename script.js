/* DigitalStudioz v1 — vanilla JS */
(function(){
  "use strict";

  /* ---- mobile menu: full-height panel, own scroll, never cuts links ---- */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  var scrim = document.getElementById('menuScrim');

  function setMenu(open){
    document.body.classList.toggle('menu-open', open);
    menu.classList.toggle('open', open);
    scrim.classList.toggle('show', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function(){
    setMenu(!menu.classList.contains('open'));
  });
  scrim.addEventListener('click', function(){ setMenu(false); });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
  });

  /* ---- back to top after 600px ---- */
  var toTop = document.getElementById('toTop');
  function onScroll(){
    toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  toTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---- hero background: cycling desk photography + dot controls ---- */
  (function(){
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-bg-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hb-dot'));
    if(slides.length < 2) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = 0, timer = null;
    function go(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, k){ s.classList.toggle('is-active', k === idx); });
      dots.forEach(function(d, k){
        d.classList.toggle('is-active', k === idx);
        d.setAttribute('aria-selected', k === idx ? 'true' : 'false');
      });
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function play(){
      if(reduce) return;
      stop();
      timer = setInterval(function(){ go(idx + 1); }, 6000);
    }
    dots.forEach(function(d, k){
      d.addEventListener('click', function(){ go(k); play(); });
    });
    play();
  })();

  /* ---- services fan: 3D coverflow (dark Deckz pattern) ---- */
  (function(){
    var fan = document.getElementById('svcFan');
    if(!fan) return;
    var stage = document.getElementById('fanStage');
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.fan-card'));
    var dots = Array.prototype.slice.call(fan.querySelectorAll('.fan-dot'));
    var count = document.getElementById('fanCount');
    var n = cards.length, active = 0;
    if(!n) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function layout(){
      var w = cards[0].getBoundingClientRect().width || 380;
      var xStep = w * 0.66, rot = 42, maxH = 0;
      cards.forEach(function(c, k){
        maxH = Math.max(maxH, c.offsetHeight);
        var o = k - active;
        while(o > n / 2) o -= n;
        while(o < -n / 2) o += n;
        var ao = Math.abs(o);
        var x = o * xStep;
        var z = o === 0 ? 0 : -170 * Math.min(ao, 2);
        var r = o === 0 ? 0 : (o > 0 ? -rot : rot);
        var op = o === 0 ? 1 : (ao === 1 ? 0.5 : 0.16);
        c.style.transform = 'translateX(' + x.toFixed(1) + 'px) translateZ(' + z + 'px) rotateY(' + r + 'deg)';
        c.style.opacity = op;
        c.style.zIndex = 20 - ao;
        c.style.pointerEvents = ao <= 1 ? 'auto' : 'none';
        c.classList.toggle('is-active', o === 0);
        c.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
      });
      stage.style.height = (maxH + 28) + 'px';
      dots.forEach(function(d, k){
        d.classList.toggle('is-active', k === active);
        d.setAttribute('aria-selected', k === active ? 'true' : 'false');
      });
      if(count) count.textContent = ('0' + (active + 1)).slice(-2) + ' / ' + ('0' + n).slice(-2);
    }
    function go(i){
      active = ((i % n) + n) % n;
      layout();
    }
    window.__fanGoTo = go;

    document.getElementById('fanPrev').addEventListener('click', function(){ go(active - 1); });
    document.getElementById('fanNext').addEventListener('click', function(){ go(active + 1); });
    dots.forEach(function(d, k){ d.addEventListener('click', function(){ go(k); }); });
    cards.forEach(function(c, k){
      c.addEventListener('click', function(e){
        if(e.target.closest('a')) return;
        if(k !== active) go(k);
      });
    });
    /* swipe */
    var tx = null;
    stage.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', function(e){
      if(tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if(Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
      tx = null;
    }, {passive:true});
    /* keyboard when the fan has focus */
    fan.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){ e.preventDefault(); go(active - 1); }
      else if(e.key === 'ArrowRight'){ e.preventDefault(); go(active + 1); }
    });
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    if(reduce) cards.forEach(function(c){ c.style.transition = 'none'; });
    layout();
  })();

  /* ---- services dropdown (desktop) ---- */
  (function(){
    var drop = document.getElementById('svcDrop');
    if(!drop) return;
    var btn = drop.querySelector('.nav-drop-btn');
    function open(){ drop.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    function close(){ drop.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    drop.addEventListener('mouseenter', open);
    drop.addEventListener('mouseleave', close);
    btn.addEventListener('click', function(e){
      e.preventDefault();
      drop.classList.contains('open') ? close() : open();
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    document.addEventListener('click', function(e){ if(!drop.contains(e.target)) close(); });
    window.__closeSvcDrop = close;
  })();

  /* ---- fan deep-link: nav items jump to a specific service card ---- */
  function goToService(i){
    var target = document.getElementById('services');
    if(target) target.scrollIntoView({behavior:'smooth'});
    if(window.__closeSvcDrop) window.__closeSvcDrop();
    setTimeout(function(){
      if(window.__fanGoTo) window.__fanGoTo(i);
      var card = document.querySelectorAll('#fanStage .fan-card')[i];
      if(card){
        card.classList.remove('flash');
        void card.offsetWidth;
        card.classList.add('flash');
        setTimeout(function(){ card.classList.remove('flash'); }, 1500);
      }
    }, 600);
  }
  document.querySelectorAll('[data-deck]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      goToService(parseInt(a.getAttribute('data-deck'), 10) || 0);
    });
  });

  /* ---- mobile services accordion ---- */
  (function(){
    var acc = document.getElementById('mSvcAcc');
    if(!acc) return;
    var btn = acc.querySelector('.m-acc-btn');
    var panel = acc.querySelector('.m-acc-panel');
    btn.addEventListener('click', function(){
      var open = acc.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0';
    });
  })();

  /* ---- scrollspy: highlight the nav + footer-menu links for the section in view ---- */
  (function(){
    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"], .f-menu-panel a[href^="#"]'));
    var dropBtn = document.querySelector('.nav-drop-btn');
    if(!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function(a){ a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
        if(dropBtn) dropBtn.classList.toggle('is-active', id === 'services');
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    ['services','difference','work','process','pricing'].forEach(function(id){
      var s = document.getElementById(id);
      if(s) obs.observe(s);
    });
  })();

  /* ---- footer studio menu box toggle ---- */
  (function(){
    var box = document.getElementById('fMenuBox');
    var btn = document.getElementById('fMenuBtn');
    if(!box || !btn) return;
    btn.addEventListener('click', function(){
      var open = box.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && box.classList.contains('open')){
        box.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  })();

  /* ---- mobile: collapsible hero dashboard (starts collapsed under 760px) ---- */
  (function(){
    var frame = document.querySelector('.browser-frame');
    var bar = frame ? frame.querySelector('.bf-bar') : null;
    if(!frame || !bar) return;
    var mq = window.matchMedia('(max-width:760px)');
    function sync(){
      if(mq.matches){
        frame.classList.add('bf-collapsed');
        bar.setAttribute('role', 'button');
        bar.setAttribute('tabindex', '0');
        bar.setAttribute('aria-expanded', 'false');
        bar.setAttribute('aria-label', 'Toggle build dashboard');
      } else {
        frame.classList.remove('bf-collapsed');
        bar.removeAttribute('role');
        bar.removeAttribute('tabindex');
        bar.removeAttribute('aria-expanded');
        bar.removeAttribute('aria-label');
      }
    }
    function toggle(){
      if(!mq.matches) return;
      var collapsed = frame.classList.toggle('bf-collapsed');
      bar.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    bar.addEventListener('click', toggle);
    bar.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
    if(mq.addEventListener) mq.addEventListener('change', sync);
    sync();
  })();

  /* ---- toast (sonner-style) ---- */
  function toast(msg){
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    var dot = document.createElement('span');
    dot.className = 'toast-dot';
    t.appendChild(dot);
    t.appendChild(document.createTextNode(msg));
    document.body.appendChild(t);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.classList.add('show'); }); });
    setTimeout(function(){
      t.classList.remove('show');
      setTimeout(function(){ t.remove(); }, 400);
    }, 4200);
  }

  /* ---- pricing parallax backdrop ---- */
  (function(){
    var section = document.getElementById('pricing');
    var photo = section ? section.querySelector('.pricing-bg-photo') : null;
    if(!section || !photo) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ticking = false;
    function update(){
      ticking = false;
      var r = section.getBoundingClientRect();
      var vh = window.innerHeight;
      if(r.bottom < -100 || r.top > vh + 100) return;
      var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      photo.style.transform = 'translateY(' + (p * 70).toFixed(1) + 'px)';
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(update); }
    }, {passive:true});
    window.addEventListener('resize', update);
    update();
  })();

  /* ---- static demo forms: toast instead of sending ---- */
  function wireForm(formId, msg){
    var form = document.getElementById(formId);
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      form.querySelectorAll('input,textarea').forEach(function(el){ el.value=''; });
      toast(msg);
    });
  }
  wireForm('contactForm', 'Message received — we reply within 2 business days.');
  wireForm('newsForm', 'You\u2019re on the list. Talk soon.');

  /* ---- subtle hero entrance (transform + opacity only) ---- */
  var heroCopy = document.querySelector('.hero-copy');
  var heroVis = document.querySelector('.hero-visual');
  if(heroCopy && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    [heroCopy, heroVis].forEach(function(el, i){
      if(!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .7s ease ' + (i*0.12) + 's, transform .7s ease ' + (i*0.12) + 's';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });
    });
  }
})();
