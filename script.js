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

  /* ---- hero background: channel deck + settings (v0 port) ---- */
  (function(){
    var hero = document.querySelector('.hero-bg');
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-bg-slide'));
    var cells = Array.prototype.slice.call(document.querySelectorAll('.hch'));
    if(!hero || slides.length < 2 || !cells.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var state = { idx:0, timer:null, transition:'fade', kenburns:true, autoplay:!reduce, duration:6 };

    function clearFx(){
      hero.classList.remove('is-dip','is-slide');
      slides.forEach(function(s){ s.classList.remove('is-leaving'); });
    }
    function renderCells(){
      cells.forEach(function(c, k){
        var on = (k === state.idx);
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
        var st = c.querySelector('.hch-status b');
        if(st) st.textContent = on ? 'Live' : 'Cue';
      });
    }
    function armProgress(){
      cells.forEach(function(c, k){
        var f = c.querySelector('.hch-progress span');
        if(!f) return;
        f.style.transition = 'none';
        f.style.width = '0';
        if(k === state.idx && state.autoplay && !reduce){
          void f.offsetWidth;
          f.style.transition = 'width ' + state.duration + 's linear';
          f.style.width = '100%';
        }
      });
    }
    function stop(){ if(state.timer){ clearInterval(state.timer); state.timer = null; } }
    function play(){
      stop();
      armProgress();
      if(!state.autoplay || reduce) return;
      state.timer = setInterval(function(){ transitionTo((state.idx + 1) % slides.length); }, state.duration * 1000);
    }
    function transitionTo(next){
      next = (next + slides.length) % slides.length;
      if(next === state.idx){ play(); return; }
      var prev = state.idx;
      state.idx = next;
      clearFx();
      if(state.transition === 'dip' && !reduce){
        hero.classList.add('is-dip');
        setTimeout(function(){
          slides[prev].classList.remove('is-active');
          slides[next].classList.add('is-active');
          setTimeout(function(){ hero.classList.remove('is-dip'); }, 280);
        }, 300);
      } else if(state.transition === 'slide' && !reduce){
        hero.classList.add('is-slide');
        var ps = slides[prev], ns = slides[next];
        ns.classList.add('is-active');
        ps.classList.add('is-leaving');
        setTimeout(function(){
          ps.classList.remove('is-active','is-leaving');
          hero.classList.remove('is-slide');
        }, 680);
      } else {
        slides.forEach(function(s, k){ s.classList.toggle('is-active', k === next); });
      }
      renderCells();
      play();
    }
    cells.forEach(function(c, k){
      c.addEventListener('click', function(){ transitionTo(k); });
    });

    /* settings panel */
    var btn = document.getElementById('heroSettingsBtn');
    var panel = document.getElementById('heroSettings');
    if(btn && panel){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = panel.hasAttribute('hidden');
        if(open){ panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
        else { panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
      });
      document.addEventListener('click', function(e){
        if(!panel.hasAttribute('hidden') && !panel.contains(e.target)){
          panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false');
        }
      });
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && !panel.hasAttribute('hidden')){
          panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); btn.focus();
        }
      });
      function pillGroup(id, fn){
        var g = document.getElementById(id);
        if(!g) return;
        g.addEventListener('click', function(e){
          var b = e.target.closest('button'); if(!b) return;
          Array.prototype.forEach.call(g.querySelectorAll('button'), function(x){ x.classList.remove('is-active'); });
          b.classList.add('is-active');
          fn(b.getAttribute('data-v'));
        });
      }
      pillGroup('hsTrans', function(v){ state.transition = v; });
      pillGroup('hsKb', function(v){
        state.kenburns = (v === 'on');
        hero.classList.toggle('kb-off', !state.kenburns);
      });
      pillGroup('hsAuto', function(v){
        state.autoplay = (v === 'on');
        play();
      });
      var range = document.getElementById('hsRange');
      var secs = document.getElementById('hsSecs');
      var preset = document.getElementById('hsPreset');
      function setDuration(n){
        state.duration = Math.max(2, Math.min(15, n));
        if(range) range.value = state.duration;
        if(secs) secs.textContent = state.duration + 's';
        if(preset) Array.prototype.forEach.call(preset.querySelectorAll('button'), function(x){
          x.classList.toggle('is-active', x.getAttribute('data-v') == String(state.duration));
        });
        play();
      }
      if(range) range.addEventListener('input', function(){ setDuration(parseInt(range.value, 10) || 6); });
      var slower = document.getElementById('hsSlower');
      var faster = document.getElementById('hsFaster');
      if(slower) slower.addEventListener('click', function(){ setDuration(state.duration - 1); });
      if(faster) faster.addEventListener('click', function(){ setDuration(state.duration + 1); });
      if(preset) preset.addEventListener('click', function(e){
        var b = e.target.closest('button'); if(!b) return;
        setDuration(parseInt(b.getAttribute('data-v'), 10));
      });
    }

    renderCells();
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

  /* ---- works: filters + case lightbox (v0 port) ---- */
  (function(){
    var cards = Array.prototype.slice.call(document.querySelectorAll('.case[data-case]'));
    if(!cards.length) return;
    var pad2 = function(n){ return (n < 10 ? '0' : '') + n; };
    var galleries = {
      0: [
        { src:'assets/work-wireframe-sketches.jpg', alt:'Website wireframe sketches on a desk' },
        { src:'assets/work-wireframe-city.jpg', alt:'Wireframe layout over a city backdrop' },
        { src:'assets/work-draw-tablet.jpg', alt:'Designing on a drawing tablet' }
      ],
      1: [
        { src:'assets/work-wireframe-city.jpg', alt:'Wireframe layout over a city backdrop' },
        { src:'assets/work-draw-tablet.jpg', alt:'Designing on a drawing tablet' },
        { src:'assets/work-camera-desk.jpg', alt:'Camera and notebook on a desk' }
      ],
      2: [
        { src:'assets/work-draw-tablet.jpg', alt:'Designing on a drawing tablet' },
        { src:'assets/work-dual-monitor-edit.jpg', alt:'Editing a site across dual monitors' },
        { src:'assets/work-headphones-desk.jpg', alt:'Headphones resting on a desk' }
      ],
      3: [
        { src:'assets/work-dual-monitor-edit.jpg', alt:'Editing a site across dual monitors' },
        { src:'assets/work-office-city.jpg', alt:'Office desk with a city view' },
        { src:'assets/work-night-office.jpg', alt:'Office glowing at night' }
      ],
      4: [
        { src:'assets/work-responsive-trio.jpg', alt:'Responsive website shown on three devices' },
        { src:'assets/work-dual-monitor-edit.jpg', alt:'Editing a site across dual monitors' },
        { src:'assets/work-pc-tower.jpg', alt:'Workstation tower close-up' }
      ],
      5: [
        { src:'assets/work-pc-tower.jpg', alt:'Workstation tower close-up' },
        { src:'assets/work-night-office.jpg', alt:'Office glowing at night' },
        { src:'assets/work-headphones-desk.jpg', alt:'Headphones resting on a desk' }
      ],
      6: [
        { src:'assets/work-headphones-desk.jpg', alt:'Headphones resting on a desk' },
        { src:'assets/work-pc-tower.jpg', alt:'Workstation tower close-up' },
        { src:'assets/work-office-city.jpg', alt:'Office desk with a city view' }
      ],
      7: [
        { src:'assets/work-camera-desk.jpg', alt:'Camera and notebook on a desk' },
        { src:'assets/work-night-office.jpg', alt:'Office glowing at night' },
        { src:'assets/work-draw-tablet.jpg', alt:'Designing on a drawing tablet' }
      ],
      8: [
        { src:'assets/work-office-city.jpg', alt:'Office desk with a city view' },
        { src:'assets/work-responsive-trio.jpg', alt:'Responsive website shown on three devices' },
        { src:'assets/work-camera-desk.jpg', alt:'Camera and notebook on a desk' }
      ],
      9: [
        { src:'assets/work-night-office.jpg', alt:'Office glowing at night' },
        { src:'assets/work-wireframe-sketches.jpg', alt:'Website wireframe sketches on a desk' },
        { src:'assets/work-pc-tower.jpg', alt:'Workstation tower close-up' }
      ]
    };
    var projects = cards.map(function(card, i){
      var title = card.querySelector('.case h3');
      var tag = card.querySelector('.case-tag');
      var stats = Array.prototype.slice.call(card.querySelectorAll('.case-outcomes li')).map(function(li){
        var b = li.querySelector('strong');
        var value = b ? b.textContent.trim() : '';
        var label = li.textContent.replace(value, '').trim();
        return { value: value, label: label };
      });
      return {
        idx: i,
        cat: card.getAttribute('data-cat') || 'all',
        title: title ? title.textContent.trim() : ('Case ' + (i + 1)),
        crumb: (tag ? tag.textContent.trim() : 'Featured') + ' ' + String.fromCharCode(8212) + ' Case ' + pad2(i + 1) + ' of ' + pad2(cards.length),
        desc: card.getAttribute('data-desc') || '',
        outcomes: stats,
        views: galleries[i] || []
      };
    });

    /* filters */
    var chips = Array.prototype.slice.call(document.querySelectorAll('.wf-chip'));
    var count = document.getElementById('wfCount');
    function applyFilter(f){
      var shown = 0;
      cards.forEach(function(card){
        var match = (f === 'all') || (card.getAttribute('data-cat') === f);
        card.style.display = match ? '' : 'none';
        if(match) shown++;
      });
      if(count) count.textContent = pad2(shown) + (shown === 1 ? ' case study' : ' case studies');
      var car = document.getElementById('workCarousel');
      if(car){
        car.scrollTo({left: 0});
        if(car._carouselUpdate) setTimeout(car._carouselUpdate, 60);
      }
    }
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.classList.remove('is-active'); c.setAttribute('aria-pressed','false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed','true');
        applyFilter(chip.getAttribute('data-filter'));
      });
    });
    applyFilter('all');

    /* lightbox */
    var lb = document.getElementById('lightbox');
    if(!lb) return;
    var lbImg = document.getElementById('lbImg'),
        lbCount = document.getElementById('lbCount'),
        lbCrumb = document.getElementById('lbCrumb'),
        lbTitle = document.getElementById('lbTitle'),
        lbDesc = document.getElementById('lbDesc'),
        lbOutcomes = document.getElementById('lbOutcomes'),
        lbThumbs = document.getElementById('lbThumbs'),
        lbViewsLabel = document.getElementById('lbViewsLabel'),
        lbCta = document.getElementById('lbCta'),
        lbClose = document.getElementById('lbClose'),
        lbPrev = document.getElementById('lbPrev'),
        lbNext = document.getElementById('lbNext');
    var cur = 0, view = 0, lastFocus = null;

    function render(){
      var p = projects[cur];
      var v = p.views[view] || p.views[0] || { src:'', alt:'' };
      lbImg.src = v.src;
      lbImg.alt = v.alt;
      lbCount.textContent = pad2(cur + 1) + ' / ' + pad2(projects.length);
      lbCrumb.textContent = p.crumb;
      lbTitle.textContent = p.title;
      lbDesc.textContent = p.desc;
      lbOutcomes.innerHTML = '';
      p.outcomes.forEach(function(o){
        var d = document.createElement('div');
        d.className = 'lb-outcome';
        var b = document.createElement('b'); b.textContent = o.value;
        var s = document.createElement('span'); s.textContent = o.label;
        d.appendChild(b); d.appendChild(s);
        lbOutcomes.appendChild(d);
      });
      lbThumbs.innerHTML = '';
      if(p.views.length > 1){
        lbViewsLabel.textContent = 'Views';
        p.views.forEach(function(vv, k){
          var b = document.createElement('button');
          b.type = 'button';
          b.className = k === view ? 'is-active' : '';
          b.setAttribute('aria-label', 'View ' + (k + 1) + ': ' + vv.alt);
          var im = document.createElement('img');
          im.src = vv.src; im.alt = '';
          b.appendChild(im);
          b.addEventListener('click', function(){ view = k; render(); });
          lbThumbs.appendChild(b);
        });
      } else {
        lbViewsLabel.textContent = '';
      }
    }
    function open(i){
      cur = (i + projects.length) % projects.length;
      view = 0;
      lastFocus = document.activeElement;
      render();
      lb.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if(lbClose) lbClose.focus();
    }
    function close(){
      lb.setAttribute('hidden','');
      document.body.style.overflow = '';
      if(lastFocus && lastFocus.focus) lastFocus.focus();
    }
    cards.forEach(function(card, i){
      card.addEventListener('click', function(){ open(i); });
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(i); }
      });
    });
    if(lbClose) lbClose.addEventListener('click', close);
    if(lbPrev) lbPrev.addEventListener('click', function(){ cur = (cur - 1 + projects.length) % projects.length; view = 0; render(); });
    if(lbNext) lbNext.addEventListener('click', function(){ cur = (cur + 1) % projects.length; view = 0; render(); });
    if(lbCta) lbCta.addEventListener('click', close);
    lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if(lb.hasAttribute('hidden')) return;
      if(e.key === 'Escape') close();
      else if(e.key === 'ArrowLeft'){ cur = (cur - 1 + projects.length) % projects.length; view = 0; render(); }
      else if(e.key === 'ArrowRight'){ cur = (cur + 1) % projects.length; view = 0; render(); }
      else if(e.key === 'Tab'){
        var f = Array.prototype.slice.call(lb.querySelectorAll('button, a[href], input'));
        if(!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
  })();


  /* ---- works carousel: arrows + timeline progress ---- */
  (function(){
    var car = document.getElementById('workCarousel');
    var track = document.getElementById('workTrack');
    var prog = document.getElementById('workProgress');
    var prev = document.getElementById('workPrev');
    var next = document.getElementById('workNext');
    if(!car || !track) return;
    function visibleSlides(){
      return Array.prototype.filter.call(track.children, function(el){
        return el.style.display !== 'none';
      });
    }
    function currentIndex(slides){
      var mid = car.scrollLeft + car.clientWidth / 2;
      var best = 0, bestD = Infinity;
      for(var k = 0; k < slides.length; k++){
        var c = slides[k].offsetLeft + slides[k].offsetWidth / 2;
        var d = Math.abs(c - mid);
        if(d < bestD){ bestD = d; best = k; }
      }
      return best;
    }
    function go(dir){
      var slides = visibleSlides();
      if(!slides.length) return;
      var i = Math.min(slides.length - 1, Math.max(0, currentIndex(slides) + dir));
      /* scroll the strip only -- never the page (scrollIntoView jumps the page on iOS) */
      car.scrollTo({left: slides[i].offsetLeft, behavior: 'smooth'});
    }
    function update(){
      var max = car.scrollWidth - car.clientWidth;
      var p = max > 0 ? car.scrollLeft / max : 0;
      p = Math.min(1, Math.max(0, p));
      if(prog) prog.style.width = Math.max(8, Math.round(p * 100)) + '%';
      if(prev) prev.disabled = car.scrollLeft <= 4;
      if(next) next.disabled = max > 0 && car.scrollLeft >= max - 4;
    }
    if(prev) prev.addEventListener('click', function(){ go(-1); });
    if(next) next.addEventListener('click', function(){ go(1); });
    var raf = 0;
    car.addEventListener('scroll', function(){
      if(!raf) raf = requestAnimationFrame(function(){ raf = 0; update(); });
    }, {passive:true});
    window.addEventListener('resize', update);
    car._carouselUpdate = update;
    update();
  })();

})();
