/* ==========================================================================
   ALBEDO SOLAR — interactions + bilingual engine (ES default / EN via data-en)
   Site numbers, contacts and integrations live in assets/js/config.js.
   ========================================================================== */
(function () {
  'use strict';

  const CFG = window.ALBEDO || { stats: {}, estimator: {} };

  /* ======================================================================
     i18n  —  Spanish is the rendered default. English lives in data-en*.
     - [data-en]      : swap textContent (or content= on <meta>, text on <title>)
     - [data-en-ph]   : swap placeholder
     - [data-en-alt]  : swap alt
     - [data-en-aria] : swap aria-label
     ICU note: Latin American Spanish only.
     ====================================================================== */
  const LANG_KEY = 'albedo-lang';
  const SUPPORTED = ['es', 'en'];

  const getInitialLang = () => {
    const url = new URLSearchParams(location.search).get('lang');
    if (url && SUPPORTED.includes(url)) return url;
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    return 'es';
  };

  // Capture the original (Spanish) value once so we can toggle back.
  const cacheEs = (el, prop) => {
    const key = 'es' + prop;
    if (el.dataset[key] === undefined) {
      if (prop === 'Text') {
        if (el.tagName === 'META') el.dataset[key] = el.getAttribute('content');
        else if (el.tagName === 'TITLE') el.dataset[key] = el.textContent;
        else el.dataset[key] = el.innerHTML;
      }
      else if (prop === 'Ph') el.dataset[key] = el.getAttribute('placeholder') || '';
      else if (prop === 'Alt') el.dataset[key] = el.getAttribute('alt') || '';
      else if (prop === 'Aria') el.dataset[key] = el.getAttribute('aria-label') || '';
    }
    return el.dataset[key];
  };

  const applyLang = (lang) => {
    const en = lang === 'en';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach((el) => {
      const es = cacheEs(el, 'Text');
      const val = en ? el.dataset.en : es;
      if (el.tagName === 'META') el.setAttribute('content', val);
      else if (el.tagName === 'TITLE') { el.textContent = val; document.title = val; }
      else el.innerHTML = val;
    });
    document.querySelectorAll('[data-en-ph]').forEach((el) => {
      const es = cacheEs(el, 'Ph');
      el.setAttribute('placeholder', en ? el.dataset.enPh : es);
    });
    document.querySelectorAll('[data-en-alt]').forEach((el) => {
      const es = cacheEs(el, 'Alt');
      el.setAttribute('alt', en ? el.dataset.enAlt : es);
    });
    document.querySelectorAll('[data-en-src]').forEach((el) => {
      if (el.dataset.esSrc === undefined) el.dataset.esSrc = el.getAttribute('src');
      el.setAttribute('src', en ? el.dataset.enSrc : el.dataset.esSrc);
    });
    document.querySelectorAll('[data-en-aria]').forEach((el) => {
      const es = cacheEs(el, 'Aria');
      el.setAttribute('aria-label', en ? el.dataset.enAria : es);
    });

    document.querySelectorAll('.lang button').forEach((b) => {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  };

  applyLang(getInitialLang());

  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  const t = (es, en) => (document.documentElement.lang === 'en' ? en : es);

  /* ----- Live stats injection ------------------------------------------
     Elements tagged data-stat="projects|delinquency|co2Tons|clientSavings|
     impactClients" get their value from config.js (or the live feed).
     Numeric stats keep the count-up animation via data-count.
     -------------------------------------------------------------------- */
  const applyStats = (stats) => {
    document.querySelectorAll('[data-stat]').forEach((el) => {
      const v = stats[el.dataset.stat];
      if (v === undefined || v === null) return;
      if (el.dataset.count !== undefined && typeof v === 'number') { el.dataset.count = v; el.textContent = v.toLocaleString('en-US') + (el.dataset.suffix || ''); }
      else el.textContent = v;
    });
  };
  applyStats(CFG.stats || {});
  if (CFG.LIVE_FEED_URL) {
    fetch(CFG.LIVE_FEED_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((live) => { if (live) applyStats(Object.assign({}, CFG.stats, live)); })
      .catch(() => {});
  }

  /* ----- Nav: scroll state ----- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Mobile drawer ----- */
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    const toggle = (force) => {
      const open = force !== undefined ? force : !drawer.classList.contains('open');
      drawer.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }

  /* ----- Scroll reveal ----- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ----- Animated counters ----- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (String(el.dataset.count).split('.')[1] || '').length;
    const dur = 1500;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const fmt = (n) => decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-US');
      el.textContent = prefix + fmt(target * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target) + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ----- Before / After sliders ----- */
  document.querySelectorAll('.ba').forEach((ba) => {
    const after = ba.querySelector('.after');
    const handle = ba.querySelector('.ba-handle');
    const input = ba.querySelector('input');
    if (!after || !input) return;
    const set = (v) => { after.style.clipPath = `inset(0 0 0 ${v}%)`; if (handle) handle.style.left = v + '%'; };
    input.addEventListener('input', () => set(input.value));
    set(input.value || 50);
  });

  /* ----- Video lazy-embed (bilingual: data-video ES, data-video-en EN) ----- */
  document.querySelectorAll('[data-video]').forEach((wrap) => {
    const btn = wrap.querySelector('.play-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const en = document.documentElement.lang === 'en';
      const id = (en && wrap.dataset.videoEn) ? wrap.dataset.videoEn : wrap.dataset.video;
      if (!id) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  });

  /* ----- WhatsApp links: add a context prefill so the team knows the source.
     Any wa.me link may carry data-wa-es / data-wa-en with the message. ----- */
  const waBase = 'https://wa.me/' + (CFG.whatsapp || '50247136486');
  document.querySelectorAll('a[href*="wa.me"]:not(.wa-keep)').forEach((a) => {
    const setHref = () => {
      const msg = t(a.dataset.waEs || '', a.dataset.waEn || '');
      a.href = msg ? waBase + '?text=' + encodeURIComponent(msg) : waBase;
    };
    setHref();
    document.addEventListener('langchange', setHref);
  });

  /* ----- Savings estimator (assumptions in config.js) ----- */
  const SAVINGS_RATE = (CFG.estimator && CFG.estimator.savingsRate) || 0.90;
  const YEARS = (CFG.estimator && CFG.estimator.years) || 25;
  const fmtQ = (n) => 'Q' + Math.round(n).toLocaleString('es-GT');
  const est = document.querySelector('#estimator');
  if (est) {
    const input = est.querySelector('#bill');
    const out = est.querySelector('.est-out');
    const oMonth = est.querySelector('[data-est="month"]');
    const oYear = est.querySelector('[data-est="year"]');
    const oLife = est.querySelector('[data-est="life"]');
    const quote = est.querySelector('.est-quote');
    const calc = () => {
      const bill = parseFloat(input.value);
      if (!bill || bill <= 0) { if (out) out.hidden = true; return; }
      const m = bill * SAVINGS_RATE;
      if (oMonth) oMonth.textContent = fmtQ(m);
      if (oYear) oYear.textContent = fmtQ(m * 12);
      if (oLife) oLife.textContent = fmtQ(m * 12 * YEARS);
      if (quote) {
        const msg = t(
          `Hola Albedo. Pago aprox. ${fmtQ(bill)} de luz al mes y quiero una cotización gratis.`,
          `Hi Albedo. I pay about ${fmtQ(bill)} a month for power and I'd like a free quote.`
        );
        quote.href = waBase + '?text=' + encodeURIComponent(msg);
      }
      if (out) out.hidden = false;
    };
    est.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
    input.addEventListener('input', calc);

    // Prefill from the hero mini-calculator (?bill=1200)
    const pre = new URLSearchParams(location.search).get('bill');
    if (pre && !isNaN(parseFloat(pre))) {
      input.value = pre; calc();
      est.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ----- Hero mini-calculator: hands the bill to the estimator page ----- */
  const heroCalc = document.querySelector('#hero-calc');
  if (heroCalc) {
    heroCalc.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = parseFloat(heroCalc.querySelector('input').value);
      const target = heroCalc.dataset.target || 'beneficios.html';
      location.href = v > 0 ? `${target}?bill=${v}#estimador` : `${target}#estimador`;
    });
  }

  /* ----- Contact form: routes by audience. --------------------------------
     Inversionista -> email (config.emailInvestors), everyone else -> WhatsApp
     with a prefilled message. No third-party backend, no lead lost.
     ------------------------------------------------------------------------ */
  const form = document.querySelector('#contact-form');
  if (form) {
    // Pre-fill subject / bill coming from the estimator.
    const params = new URLSearchParams(location.search);
    const asunto = params.get('asunto');
    const monto = params.get('monto');
    const aField = form.querySelector('[name="asunto"]');
    if (asunto && aField) aField.value = asunto;
    if (monto && form.querySelector('[name="mensaje"]')) {
      form.querySelector('[name="mensaje"]').value = t(
        `Pago actual de luz: aprox. Q${monto} al mes. Quiero saber cuánto puedo ahorrar.`,
        `Current power bill: about Q${monto} per month. I'd like to know how much I can save.`
      );
    }

    const note = form.querySelector('.form-note');
    const setNote = (msg, ok) => {
      if (!note) return;
      note.textContent = msg;
      note.style.display = 'block';
      note.style.color = ok ? 'var(--green)' : 'var(--orange-dark)';
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return; // honeypot
      if (!form.reportValidity()) return;

      const f = new FormData(form);
      const nombre = `${f.get('nombre') || ''} ${f.get('apellido') || ''}`.trim();
      const soy = f.get('soy') || '';
      const pais = f.get('pais') || '';
      const correo = f.get('correo') || '';
      const tel = f.get('whatsapp') || '';
      const sub = f.get('asunto') || '';
      const mensaje = f.get('mensaje') || '';

      if (soy === 'Inversionista') {
        // Investors: open the visitor's mail app addressed to Albedo.
        const subject = t('Inversionista: ' + (sub || nombre), 'Investor: ' + (sub || nombre));
        const body = t(
          `Nombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${tel}\nPaís: ${pais}\n\n${mensaje}`,
          `Name: ${nombre}\nEmail: ${correo}\nPhone: ${tel}\nCountry: ${pais}\n\n${mensaje}`
        );
        location.href = `mailto:${CFG.emailInvestors || 'investment@albedo-solar.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setNote(t('Se abrió tu correo con el mensaje listo. Si no, escríbenos a ' + (CFG.emailInvestors || 'investment@albedo-solar.com') + '.',
                  'Your email app opened with the message ready. If not, write to ' + (CFG.emailInvestors || 'investment@albedo-solar.com') + '.'), true);
      } else {
        // Clients, homes, installers: straight to WhatsApp with everything filled in.
        const msg = t(
          `Hola Albedo. Soy ${soy || 'interesado'}${pais ? ' en ' + pais : ''}. ${sub ? sub + '. ' : ''}${mensaje}\n\nNombre: ${nombre}\nCorreo: ${correo}\nTel: ${tel}`,
          `Hi Albedo. I'm a ${soy || 'prospect'}${pais ? ' in ' + pais : ''}. ${sub ? sub + '. ' : ''}${mensaje}\n\nName: ${nombre}\nEmail: ${correo}\nPhone: ${tel}`
        );
        window.open(waBase + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        setNote(t('¡Listo! Se abrió WhatsApp con tu mensaje. Envíalo y te contactamos muy pronto.',
                  'Done! WhatsApp opened with your message. Hit send and we\'ll be in touch soon.'), true);
      }
    });
  }

  /* ----- Newsletter (footer, Mailchimp) ----- */
  document.querySelectorAll('.newsletter form').forEach((nf) => {
    nf.addEventListener('submit', (e) => {
      const noteEl = nf.closest('.newsletter').querySelector('.nl-note');
      if (CFG.MAILCHIMP_ACTION) {
        nf.action = CFG.MAILCHIMP_ACTION;   // standard Mailchimp embedded POST
        nf.method = 'post';
        nf.target = '_blank';
        if (noteEl) noteEl.textContent = t('¡Gracias por suscribirte!', 'Thanks for subscribing!');
        return; // let the browser submit to Mailchimp
      }
      e.preventDefault();
      if (noteEl) noteEl.textContent = t(
        'Muy pronto activamos el boletín. Mientras, escríbenos por WhatsApp.',
        'The newsletter is coming soon. In the meantime, reach us on WhatsApp.'
      );
    });
  });

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.faq-item .faq-q').forEach((q) => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });

  /* ----- current year ----- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
