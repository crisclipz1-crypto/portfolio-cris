(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const NAV_OFFSET = 76;

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ============================================
     TRANSLATIONS (EN default, ES toggle)
  ============================================= */
  const translations = {
    en: {
      pageTitle: 'Crisclipz · Houston Barber',
      navAbout: 'About', navWork: 'Work', navBook: 'Book',
      heroStatus: 'Houston, TX · Booking open',
      heroLine1: 'Fades.', heroLine2: 'Designs.', heroLine3: 'Beard Work.',
      heroSubtext: 'Precision fades, custom designs, and detailed beard work. Booked online, done right.',
      bookNow: 'Book Now',
      aboutTitle: 'About',
      aboutLead: "I'm Cris, a barber based in Houston, TX. Every fade, design, and beard trim gets the same attention: clean lines, sharp precision, no rushed work.",
      aboutBody: "Consistency is the whole job. Whether it's a simple taper or a custom design, the standard doesn't change. Take a look at the work below, then book your spot.",
      skillFade: 'Skin Fades', skillTaper: 'Taper Fades', skillLineup: 'Line-Ups',
      skillDesign: 'Custom Designs', skillBeard: 'Beard Sculpting', skillTowel: 'Hot Towel Finish',
      workTitle: 'Recent Work',
      tagView: 'View',
      moreInstagram: 'More on Instagram',
      servicesTitle: 'Services',
      serviceFadeTitle: 'Fades',
      serviceFadeDesc: 'Skin fades, taper fades, and everything between. Clean fade lines, blended right, every time.',
      serviceDesignTitle: 'Designs',
      serviceDesignDesc: "Custom line-ups, part designs, and detailed hair art. Bring a reference or let's build one together.",
      serviceBeardTitle: 'Beard Work',
      serviceBeardDesc: "Beard trims, shaping, and hot towel finishes. A sharp cut isn't done until the beard matches it.",
      reelsTitle: 'More Cuts',
      manifesto: "A good fade isn't rushed. Every line gets checked twice, every edge gets cleaned up, and nothing leaves the chair until it's right.",
      followHeadline: 'See the full catalog on Instagram.',
      followCta: 'Follow @crisclipz',
      bookTitle: 'Book a Cut',
      bookHeadline: 'Ready for a fresh cut?',
      backToTop: '↑ Back to top'
    },
    es: {
      pageTitle: 'Crisclipz · Barbero en Houston',
      navAbout: 'Sobre mí', navWork: 'Trabajo', navBook: 'Reservar',
      heroStatus: 'Houston, TX · Reservas abiertas',
      heroLine1: 'Degradados.', heroLine2: 'Diseños.', heroLine3: 'Barba.',
      heroSubtext: 'Degradados de precisión, diseños personalizados y trabajo de barba detallado. Reserva en línea, bien hecho.',
      bookNow: 'Reservar',
      aboutTitle: 'Sobre mí',
      aboutLead: 'Soy Cris, barbero en Houston, TX. Cada degradado, diseño y arreglo de barba recibe la misma atención: líneas limpias, precisión y sin apuros.',
      aboutBody: 'La consistencia es todo el trabajo. Ya sea un corte simple o un diseño personalizado, el estándar no cambia. Mira los trabajos abajo y reserva tu cita.',
      skillFade: 'Degradado a piel', skillTaper: 'Degradado Taper', skillLineup: 'Delineados',
      skillDesign: 'Diseños personalizados', skillBeard: 'Esculpido de barba', skillTowel: 'Toalla caliente',
      workTitle: 'Trabajos recientes',
      tagView: 'Ver',
      moreInstagram: 'Más en Instagram',
      servicesTitle: 'Servicios',
      serviceFadeTitle: 'Degradados',
      serviceFadeDesc: 'Degradado a piel, taper y todo lo intermedio. Líneas limpias, bien difuminadas, siempre.',
      serviceDesignTitle: 'Diseños',
      serviceDesignDesc: 'Delineados personalizados, diseños de raya y arte capilar detallado. Trae una referencia o lo creamos juntos.',
      serviceBeardTitle: 'Barba',
      serviceBeardDesc: 'Arreglo, perfilado y toalla caliente. Un corte no está completo hasta que la barba combina.',
      reelsTitle: 'Más cortes',
      manifesto: 'Un buen degradado no se apura. Cada línea se revisa dos veces, cada borde se limpia, y nada sale de la silla hasta que está bien.',
      followHeadline: 'Mira el catálogo completo en Instagram.',
      followCta: 'Seguir @crisclipz',
      bookTitle: 'Reserva un Corte',
      bookHeadline: '¿Listo para un corte nuevo?',
      backToTop: '↑ Volver arriba'
    }
  };

  function initLanguageSwitch() {
    const btn = document.getElementById('langSwitch');
    if (!btn) return;

    function setLangText(el, text) {
      // Hero lines and the manifesto/section-title words get wrapped
      // in extra spans by revealHero()/initTitleReveals()/initManifesto()
      // for the mask-reveal animation. Once that reveal has played,
      // overwriting textContent (and losing those wrapper spans) is
      // safe - it just won't replay. The hero line's wrapper is the
      // one exception worth preserving since it's a simple leaf span.
      const heroInner = el.querySelector(':scope > .hero__line-inner');
      if (heroInner) { heroInner.textContent = text; return; }
      el.textContent = text;
    }

    function applyLanguage(lang) {
      const dict = translations[lang];
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) setLangText(el, dict[key]);
      });
      document.documentElement.lang = lang;
      document.title = dict.pageTitle;
      btn.textContent = lang === 'en' ? 'ES' : 'EN';
      localStorage.setItem('site-lang', lang);
    }

    const saved = localStorage.getItem('site-lang');
    const initial = saved === 'es' || saved === 'en' ? saved : 'en';
    applyLanguage(initial);

    btn.addEventListener('click', () => {
      const current = document.documentElement.lang === 'es' ? 'es' : 'en';
      applyLanguage(current === 'en' ? 'es' : 'en');
    });
  }

  /* ============================================
     LOADER - wordmark wipes in as a duotone fill, the barber-pole
     striped bar tracks the same counter, then the whole panel
     closes into a circle at its own center (iris wipe) to reveal
     the page. clip-path is animated by GSAP as a plain string
     tween (matching shape/param count on both ends), no plugin
     needed.
  ============================================= */
  function runLoader(onDone) {
    const loader = document.getElementById('loader');
    const countEl = document.getElementById('loaderCount');
    const bar = document.getElementById('loaderBar');
    const wordFill = document.querySelector('.loader__word-fill');

    if (reduceMotion || !hasGSAP) {
      loader.style.display = 'none';
      onDone();
      return;
    }

    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        countEl.textContent = Math.round(counter.val);
        bar.style.transform = `scaleX(${counter.val / 100})`;
        if (wordFill) wordFill.style.clipPath = `inset(0 ${100 - counter.val}% 0 0)`;
      },
      onComplete: () => {
        gsap.to(loader, {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 0.85,
          ease: 'power4.in',
          delay: 0.2,
          onComplete: () => {
            loader.style.display = 'none';
            onDone();
          }
        });
      }
    });
  }

  /* ============================================
     SMOOTH SCROLL (Lenis + GSAP ticker)
  ============================================= */
  function initSmoothScroll() {
    if (reduceMotion || typeof Lenis === 'undefined' || !hasGSAP) return null;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  /* ============================================
     ANCHOR NAVIGATION - routes every in-page link
     through Lenis so scrolling stays consistent,
     with an offset so the fixed nav never covers
     the target section's heading.
  ============================================= */
  function initAnchorScroll(lenis) {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const offset = hash === '#top' ? 0 : -NAV_OFFSET;
        if (lenis) {
          lenis.scrollTo(target, { offset, duration: 1.2 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ============================================
     HERO LINE REVEAL (masked clip-in)
  ============================================= */
  function revealHero() {
    const lines = document.querySelectorAll('[data-reveal-line]');
    lines.forEach((line) => {
      const inner = document.createElement('span');
      inner.className = 'hero__line-inner';
      inner.style.display = 'block';
      inner.innerHTML = line.innerHTML;
      line.innerHTML = '';
      line.appendChild(inner);
    });

    if (reduceMotion || !hasGSAP) {
      document.querySelectorAll('.hero__line-inner').forEach(el => { el.style.transform = 'none'; });
      revealGenericInHero();
      return;
    }

    gsap.set('.hero__line-inner', { yPercent: 110, opacity: 0 });
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to('.hero__line-inner', {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.09
    });
    revealGenericInHero(tl, '-=0.55');
  }

  function revealGenericInHero(tl, position) {
    const els = document.querySelectorAll('.hero [data-reveal]');
    if (!hasGSAP || reduceMotion) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const anim = gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      onStart: () => els.forEach(el => el.classList.add('is-visible'))
    });
    if (tl) tl.add(anim, position);
  }

  /* ============================================
     NAV REVEAL
  ============================================= */
  function revealNav() {
    const nav = document.querySelector('[data-reveal-nav]');
    if (!nav) return;
    if (reduceMotion || !hasGSAP) { nav.style.opacity = '1'; return; }
    gsap.fromTo(nav,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }

  /* ============================================
     NAV - compact on scroll + scroll-spy active link
  ============================================= */
  function initNavBehavior() {
    const nav = document.querySelector('.nav');
    if (!nav || !hasGSAP) return;

    ScrollTrigger.create({
      start: 'top -100',
      end: 99999,
      toggleClass: { targets: nav, className: 'is-compact' }
    });

    const sections = [
      { id: 'about', links: '[href="#about"]' },
      { id: 'work', links: '[href="#work"]' },
      { id: 'book', links: '[href="#book"]' }
    ];

    sections.forEach(({ id, links }) => {
      const section = document.getElementById(id);
      if (!section) return;
      const navEls = document.querySelectorAll(links);

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('is-active'));
            navEls.forEach(l => l.classList.add('is-active'));
          }
        }
      });
    });
  }

  /* ============================================
     DIRECTIONAL UNDERLINE - the hover line grows
     from whichever edge the cursor entered.
  ============================================= */
  function initDirectionalHover(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        const fromLeft = (e.clientX - rect.left) < rect.width / 2;
        el.style.setProperty('--underline-origin', fromLeft ? 'left' : 'right');
      });
    });
  }

  /* ============================================
     SCROLL REVEALS (sections below hero)
  ============================================= */
  function initScrollReveals() {
    const targets = document.querySelectorAll('main > section:not(.hero) [data-reveal], main > .marquee[data-reveal]');

    if (!hasGSAP || reduceMotion) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    targets.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        onStart: () => el.classList.add('is-visible')
      });
    });
  }

  /* ============================================
     SECTION TITLES - word-by-word clip reveal.
     Uses the same "top 85%" trigger point as the parent
     .section-head fade in initScrollReveals so the two always
     fire together - if the word-mask fired earlier (it used to,
     at 88%) a slow scroller could sit on a fully-revealed-but-
     still-invisible title, then see it just flat-fade in later
     with no visible word reveal left to show.
  ============================================= */
  function initTitleReveals() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach((title) => {
      const words = title.textContent.trim().split(/\s+/);
      title.innerHTML = words.map(w => `<span class="word-reveal"><span>${w}</span></span>`).join(' ');
    });

    if (!hasGSAP || reduceMotion) return;

    titles.forEach((title) => {
      const words = title.querySelectorAll('.word-reveal > span');
      gsap.set(words, { yPercent: 100 });
      gsap.to(words, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ============================================
     GALLERY - 3D tilt + cursor-following tag (bento cells only,
     the small reel-strip cards stay flat, see 4.5 "not every
     card needs" restraint).
  ============================================= */
  function initGalleryMicroInteractions() {
    if (!hasGSAP || reduceMotion || noHover) return;

    document.querySelectorAll('.gallery-item').forEach((card) => {
      const tag = card.querySelector('.gallery-item__tag');

      const rotateXTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });
      const tagXTo = tag ? gsap.quickTo(tag, 'x', { duration: 0.4, ease: 'power3.out' }) : null;
      const tagYTo = tag ? gsap.quickTo(tag, 'y', { duration: 0.4, ease: 'power3.out' }) : null;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        rotateYTo(relX * 8);
        rotateXTo(relY * -8);
        if (tagXTo) { tagXTo(e.clientX - rect.left); tagYTo(e.clientY - rect.top); }
      });

      card.addEventListener('mouseenter', () => {
        if (tag) gsap.to(tag, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
      });

      card.addEventListener('mouseleave', () => {
        rotateXTo(0);
        rotateYTo(0);
        if (tag) gsap.to(tag, { opacity: 0, scale: 0.7, duration: 0.25, ease: 'power3.in' });
      });
    });
  }

  /* ============================================
     GALLERY - videos autoplay (muted/looping) once scrolled into
     view, pause once scrolled away. preload="none" keeps first
     load light - nothing fetches until a clip is actually about
     to be visible. Skipped under prefers-reduced-motion, where
     the poster frame stays put and the lightbox is the only way
     to watch.
  ============================================= */
  function initAutoplayVideos() {
    const videos = document.querySelectorAll('.gallery-item__preview, .reel-card__preview');
    if (!videos.length || reduceMotion) return;

    if (!('IntersectionObserver' in window)) {
      videos.forEach((v) => v.play().catch(() => {}));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    }, { threshold: 0.35 });

    videos.forEach((v) => io.observe(v));
  }

  /* ============================================
     LIGHTBOX - opens any [data-gallery] item (bento cells and
     reel-strip cards) full-size: photos as <img>, videos as a
     real <video> with controls and sound.
  ============================================= */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const stage = document.getElementById('lightboxStage');
    const closeBtn = document.getElementById('lightboxClose');
    if (!lightbox || !stage || !closeBtn) return;

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      stage.innerHTML = '';
      document.body.style.overflow = '';
    }

    function open(src, media) {
      stage.innerHTML = '';
      if (media === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        stage.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        stage.appendChild(img);
      }
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('[data-gallery]').forEach((el) => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-src');
        const media = el.getAttribute('data-media');
        if (src) open(src, media);
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }

  /* ============================================
     MANIFESTO - SCRUBBED WORD REVEAL
  ============================================= */
  function initManifesto() {
    const el = document.querySelector('[data-reveal-words]');
    if (!el) return;

    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

    if (!hasGSAP || reduceMotion) {
      el.querySelectorAll('.word').forEach(w => { w.style.opacity = '1'; });
      return;
    }

    gsap.to(el.querySelectorAll('.word'), {
      opacity: 1,
      stagger: 0.04,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: 0.6
      }
    });
  }

  /* ============================================
     HERO VISUAL - pointer parallax + idle breathing.
     The breathing loop animates "scale" via GSAP (not a CSS
     @keyframes transform) so it composites cleanly with the
     quickTo-driven x/y from the pointer parallax below -
     mixing a CSS transform animation with GSAP's inline
     transform on the same element would make the two fight
     and stall, the same bug the accordion had with height.
  ============================================= */
  function initHeroVisual() {
    if (!hasGSAP) return;
    const orb = document.querySelector('.hero-visual__orb');
    if (!orb) return;

    if (!reduceMotion) {
      gsap.to(orb, { scale: 1.05, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }

    if (reduceMotion || noHover) return;
    const hero = document.querySelector('.hero');
    const ring = document.querySelector('.hero-visual__ring');
    if (!hero || !ring) return;

    const orbTo = gsap.quickTo(orb, 'x', { duration: 0.7, ease: 'power3.out' });
    const orbToY = gsap.quickTo(orb, 'y', { duration: 0.7, ease: 'power3.out' });
    const ringTo = gsap.quickTo(ring, 'x', { duration: 1, ease: 'power3.out' });
    const ringToY = gsap.quickTo(ring, 'y', { duration: 1, ease: 'power3.out' });

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      orbTo(relX * 26);
      orbToY(relY * 26);
      ringTo(relX * -14);
      ringToY(relY * -14);
    });

    hero.addEventListener('mouseleave', () => {
      orbTo(0); orbToY(0); ringTo(0); ringToY(0);
    });
  }

  /* ============================================
     CUSTOM CURSOR - a small dot tracks the pointer precisely, a
     ring trails behind it and grows over links/buttons. Hidden
     entirely over [data-gallery] items, which already show their
     own cursor-following tag (see initGalleryMicroInteractions) -
     two things trailing the pointer at once would be clutter.
  ============================================= */
  function initCustomCursor() {
    if (!hasGSAP || reduceMotion || noHover) return;

    const cursor = document.getElementById('cursor');
    const dot = cursor?.querySelector('.cursor__dot');
    const ring = cursor?.querySelector('.cursor__ring');
    if (!cursor || !dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      cursor.classList.add('is-active');
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    document.querySelectorAll('[data-gallery]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-gallery'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-gallery'));
    });
  }

  /* ============================================
     MAGNETIC BUTTONS (+ tactile press feedback)
  ============================================= */
  function initMagnetic() {
    if (!hasGSAP || reduceMotion || noHover) return;

    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      const scaleTo = gsap.quickTo(btn, 'scale', { duration: 0.25, ease: 'power3.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.35);
        yTo(relY * 0.35);
      });

      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); scaleTo(1); });
      btn.addEventListener('pointerdown', () => scaleTo(0.94));
      btn.addEventListener('pointerup', () => scaleTo(1));
    });
  }

  /* ============================================
     MOBILE MENU
  ============================================= */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================
     ACCORDION
  ============================================= */
  function initAccordion() {
    const items = document.querySelectorAll('[data-accordion-item]');

    function setState(item, open, animate) {
      const panel = item.querySelector('.accordion__panel');
      const inner = item.querySelector('.accordion__panel-inner');
      item.classList.toggle('is-open', open);
      const targetHeight = open ? inner.scrollHeight : 0;

      // CSS handles the transition (see .accordion__panel); JS only sets the
      // target height. Driving the same property from GSAP as well would
      // fight the CSS transition and stall the animation mid-way.
      if (!animate) {
        panel.style.transition = 'none';
        panel.style.height = targetHeight + 'px';
        void panel.offsetHeight; // force reflow before re-enabling transition
        panel.style.transition = '';
        return;
      }
      panel.style.height = targetHeight + 'px';
    }

    items.forEach((item) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        items.forEach((other) => { if (other !== item) setState(other, false, true); });
        setState(item, willOpen, true);
      });
    });

    // Initialize open state (first item) without animation, after layout settles
    requestAnimationFrame(() => {
      items.forEach((item) => {
        setState(item, item.classList.contains('is-open'), false);
      });
    });
  }

  /* ============================================
     SCROLL PROGRESS (ring + label) - via ScrollTrigger, no raw scroll listener
  ============================================= */
  function initProgress() {
    const fill = document.querySelector('.progress-ring__fill');
    const label = document.getElementById('progressLabel');
    if (!fill || !label) return;

    const CIRCUMFERENCE = 138.2;

    function update(progress) {
      const offset = CIRCUMFERENCE * (1 - progress);
      fill.style.strokeDashoffset = String(offset);
      label.textContent = Math.round(progress * 100) + '%';
    }

    if (!hasGSAP) {
      update(0);
      return;
    }

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => update(self.progress)
    });
  }

  /* ============================================
     BACK TO TOP
  ============================================= */
  function initBackToTop(lenis) {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================
     INIT
  ============================================= */
  document.addEventListener('DOMContentLoaded', () => {
    const lenis = initSmoothScroll();

    // Language must be applied before the reveal-wrapping functions
    // below split text into spans (hero lines, section-title words,
    // the manifesto) so those wrap the correct, already-translated
    // strings on first paint.
    initLanguageSwitch();

    revealHero();
    initAnchorScroll(lenis);
    initNavBehavior();
    initDirectionalHover('.nav__link');
    initScrollReveals();
    initTitleReveals();
    initGalleryMicroInteractions();
    initAutoplayVideos();
    initLightbox();
    initManifesto();
    initHeroVisual();
    initCustomCursor();
    initMagnetic();
    initMobileMenu();
    initAccordion();
    initProgress();
    initBackToTop(lenis);

    runLoader(() => {
      revealNav();
      if (hasGSAP) ScrollTrigger.refresh();
    });

    window.addEventListener('load', () => {
      if (hasGSAP) ScrollTrigger.refresh();
    });
  });
})();
