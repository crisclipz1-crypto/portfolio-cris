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
      rotatorHint: 'Drag to look around',
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
      rotatorHint: 'Arrastra para mirar alrededor',
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
    const videos = document.querySelectorAll('.gallery-item__preview');
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

    // Delegated so it also covers cards the rotator gallery builds
    // after this runs, without needing a second binding pass.
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-gallery]');
      if (!el) return;
      const src = el.getAttribute('data-src');
      const media = el.getAttribute('data-media');
      if (src) open(src, media);
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }

  /* ============================================
     MORE CUTS - 3D rotating gallery. Builds the cards, then on
     desktop arranges them in a ring (rotateY + translateZ per card)
     that auto-rotates via a GSAP tween and can be spun by dragging;
     both write to the same rotation value, so they never fight each
     other for control of the ring's transform. Mobile gets no ring
     math at all - the same cards just sit in the CSS flex/scroll
     strip defined for .rotator-ring below 768px.
  ============================================= */
  function initRotatorGallery() {
    const stage = document.getElementById('rotatorStage');
    const ring = document.getElementById('rotatorRing');
    if (!stage || !ring) return;

    const items = [
      { src: 'assets/media/photo/photo-03.jpg', media: 'photo', poster: 'assets/media/photo/photo-03.jpg', alt: 'Taper fade with beard shape-up' },
      { src: 'assets/media/video/clip-01.mp4', media: 'video', poster: 'assets/media/video/clip-01-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-02.mp4', media: 'video', poster: 'assets/media/video/clip-02-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-03.mp4', media: 'video', poster: 'assets/media/video/clip-03-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-05.mp4', media: 'video', poster: 'assets/media/video/clip-05-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-06.mp4', media: 'video', poster: 'assets/media/video/clip-06-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-07.mp4', media: 'video', poster: 'assets/media/video/clip-07-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-08.mp4', media: 'video', poster: 'assets/media/video/clip-08-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-10.mp4', media: 'video', poster: 'assets/media/video/clip-10-poster.jpg', alt: 'Cutting clip' },
      { src: 'assets/media/video/clip-11.mp4', media: 'video', poster: 'assets/media/video/clip-11-poster.jpg', alt: 'Cutting clip' }
    ];

    items.forEach((item) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'rotator-card';
      card.setAttribute('data-gallery', '');
      card.setAttribute('data-media', item.media);
      card.setAttribute('data-src', item.src);
      const img = document.createElement('img');
      img.src = item.poster;
      img.alt = item.alt;
      img.loading = 'lazy';
      card.appendChild(img);
      ring.appendChild(card);
    });

    if (!hasGSAP || !window.matchMedia('(min-width: 768px)').matches) return;

    const cards = Array.from(ring.querySelectorAll('.rotator-card'));
    const RADIUS = 380;
    const angleStep = 360 / cards.length;

    cards.forEach((card, i) => {
      card.style.transform = `translate(-50%, -50%) rotateY(${i * angleStep}deg) translateZ(${RADIUS}px)`;
    });

    const state = { rotation: 0 };

    function applyRotation() {
      ring.style.transform = `rotateY(${state.rotation}deg)`;
      cards.forEach((card, i) => {
        const itemAngle = i * angleStep;
        const relative = ((itemAngle + state.rotation) % 360 + 360) % 360;
        const normalized = relative > 180 ? 360 - relative : relative;
        card.style.opacity = String(Math.max(0.25, 1 - normalized / 180));
      });
    }
    applyRotation();

    let autoRotate = null;
    if (!reduceMotion) {
      autoRotate = gsap.to(state, {
        rotation: '+=360',
        duration: 55,
        ease: 'none',
        repeat: -1,
        onUpdate: applyRotation
      });
    }

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startRotation = 0;

    function pointerX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    function onDown(e) {
      dragging = true;
      moved = false;
      startX = pointerX(e);
      startRotation = state.rotation;
      if (autoRotate) autoRotate.pause();
      stage.classList.add('is-dragging');
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = pointerX(e) - startX;
      if (Math.abs(dx) > 6) moved = true;
      state.rotation = startRotation + dx * 0.35;
      applyRotation();
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (autoRotate) autoRotate.resume();
    }

    stage.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    stage.addEventListener('touchstart', onDown, { passive: true });
    stage.addEventListener('touchmove', onMove, { passive: true });
    stage.addEventListener('touchend', onUp);

    // A drag that ends over a card shouldn't also open the lightbox.
    stage.addEventListener('click', (e) => {
      if (moved) e.stopPropagation();
    }, true);
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
     HERO PATHS - ambient flowing-line background. Two mirrored SVG
     layers of curved paths, each with a short dash that loops around
     it via a CSS animation (see @keyframes hero-path-flow), driven
     entirely by CSS after this one-time setup - no per-frame JS.
     Under prefers-reduced-motion the paths still render, just static.
  ============================================= */
  function initHeroPaths() {
    const container = document.querySelector('.hero-paths');
    if (!container) return;
    const svgs = container.querySelectorAll('svg');
    if (svgs.length < 2) return;

    const NS = 'http://www.w3.org/2000/svg';
    const COUNT = 20;

    function build(svg, position) {
      for (let i = 0; i < COUNT; i++) {
        const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', 'var(--accent)');
        path.setAttribute('stroke-width', String(0.5 + i * 0.03));
        path.setAttribute('fill', 'none');
        path.style.opacity = String(0.035 + i * 0.006);
        svg.appendChild(path);

        if (!reduceMotion) {
          // Most of each path's arc length falls outside the 696x316
          // viewBox (the curves are drawn far larger than the visible
          // window on purpose, same as the source component). A short
          // "comet" dash would spend most of its cycle outside that
          // window and rarely be seen, so the dash covers most of the
          // path instead - the animated offset then reads as a slow
          // gap drifting through, not the line disappearing.
          const len = path.getTotalLength();
          path.style.strokeDasharray = `${len * 0.75} ${len * 0.25}`;
          path.style.setProperty('--path-len', String(len));
          const duration = 16 + Math.random() * 12;
          path.style.animation = `hero-path-flow ${duration}s linear infinite`;
          path.style.animationDelay = `-${Math.random() * duration}s`;
        }
      }
    }

    build(svgs[0], 1);
    build(svgs[1], -1);
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
    initHeroPaths();
    initAnchorScroll(lenis);
    initNavBehavior();
    initDirectionalHover('.nav__link');
    initScrollReveals();
    initTitleReveals();
    initGalleryMicroInteractions();
    initAutoplayVideos();
    initRotatorGallery();
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
