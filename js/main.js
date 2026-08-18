(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ============================================
     LOADER
  ============================================= */
  function runLoader(onDone) {
    const loader = document.getElementById('loader');
    const countEl = document.getElementById('loaderCount');

    if (reduceMotion || !hasGSAP) {
      loader.style.display = 'none';
      onDone();
      return;
    }

    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => { countEl.textContent = Math.round(counter.val); },
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
          delay: 0.1,
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
     SCROLL REVEALS (sections below hero)
  ============================================= */
  function initScrollReveals() {
    const targets = document.querySelectorAll('.about [data-reveal], .work [data-reveal], .services [data-reveal], .contact [data-reveal], .marquee[data-reveal], .hero__marquee-mini[data-reveal]');

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
     PROJECT CARD IMAGE PARALLAX (subtle depth)
  ============================================= */
  function initProjectParallax() {
    if (!hasGSAP || reduceMotion) return;
    document.querySelectorAll('[data-project] .project__media img').forEach((img) => {
      gsap.fromTo(img,
        { y: -24 },
        {
          y: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
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
     HERO VISUAL - POINTER PARALLAX (desktop only)
  ============================================= */
  function initHeroPointerParallax() {
    if (!hasGSAP || reduceMotion) return;
    const hero = document.querySelector('.hero');
    const orb = document.querySelector('.hero-visual__orb');
    const ring = document.querySelector('.hero-visual__ring');
    if (!hero || !orb || !ring || window.matchMedia('(hover: none)').matches) return;

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
     MAGNETIC BUTTONS
  ============================================= */
  function initMagnetic() {
    if (!hasGSAP || reduceMotion || window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.35);
        yTo(relY * 0.35);
      });

      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
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

    revealHero();
    initScrollReveals();
    initProjectParallax();
    initManifesto();
    initHeroPointerParallax();
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
