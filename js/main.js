(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const NAV_OFFSET = 76;

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ============================================
     LOADER
  ============================================= */
  function runLoader(onDone) {
    const loader = document.getElementById('loader');
    const countEl = document.getElementById('loaderCount');
    const bar = document.getElementById('loaderBar');

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
      onUpdate: () => {
        countEl.textContent = Math.round(counter.val);
        bar.style.transform = `scaleX(${counter.val / 100})`;
      },
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.75,
          ease: 'expo.inOut',
          delay: 0.15,
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
      { id: 'contact', links: '[href="#contact"]' }
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
    const targets = document.querySelectorAll('.about [data-reveal], .work [data-reveal], .services [data-reveal], .contact [data-reveal], .marquee[data-reveal]');

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
     PROJECTS - 3D tilt + cursor-following tag
  ============================================= */
  function initProjectMicroInteractions() {
    if (!hasGSAP || reduceMotion || noHover) return;

    document.querySelectorAll('[data-project]').forEach((card) => {
      const media = card.querySelector('.project__media');
      const tag = card.querySelector('.project__cursor-tag');
      if (!media) return;

      const rotateXTo = gsap.quickTo(media, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(media, 'rotateY', { duration: 0.6, ease: 'power3.out' });
      const tagXTo = tag ? gsap.quickTo(tag, 'x', { duration: 0.4, ease: 'power3.out' }) : null;
      const tagYTo = tag ? gsap.quickTo(tag, 'y', { duration: 0.4, ease: 'power3.out' }) : null;

      media.addEventListener('mousemove', (e) => {
        const rect = media.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        rotateYTo(relX * 10);
        rotateXTo(relY * -10);
        if (tagXTo) { tagXTo(e.clientX - rect.left); tagYTo(e.clientY - rect.top); }
      });

      media.addEventListener('mouseenter', () => {
        if (tag) gsap.to(tag, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
      });

      media.addEventListener('mouseleave', () => {
        rotateXTo(0);
        rotateYTo(0);
        if (tag) gsap.to(tag, { opacity: 0, scale: 0.7, duration: 0.25, ease: 'power3.in' });
      });
    });
  }

  /* ============================================
     PROJECTS - cinematic sticky-stack (desktop + motion only)
     Each project pins at the top of the viewport until the
     next one arrives, scaling and dimming down as it's covered.
     Canonical GSAP ScrollTrigger pin pattern: start "top top",
     pin the outgoing card, scrub its scale/opacity off the
     incoming card's entrance.
  ============================================= */
  function initProjectStack() {
    if (!hasGSAP || reduceMotion) return;
    if (!window.matchMedia('(min-width: 900px)').matches) return;

    const list = document.querySelector('.project-list');
    const cards = gsap.utils.toArray('.project[data-project]');
    if (!list || cards.length < 2) return;

    list.classList.add('is-stacked');

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        endTrigger: cards[cards.length - 1],
        end: 'top top',
        pin: true,
        pinSpacing: false
      });
      gsap.to(card, {
        scale: 0.94,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: cards[i + 1],
          start: 'top bottom',
          end: 'top top',
          scrub: true
        }
      });
    });
  }

  /* ============================================
     PROJECT IMAGE PARALLAX (subtle depth, non-stacked cards)
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

    revealHero();
    initAnchorScroll(lenis);
    initNavBehavior();
    initDirectionalHover('.nav__link');
    initScrollReveals();
    initTitleReveals();
    initProjectMicroInteractions();
    initProjectParallax();
    initManifesto();
    initHeroVisual();
    initMagnetic();
    initMobileMenu();
    initAccordion();
    initProgress();
    initBackToTop(lenis);

    // Stack layout depends on final geometry of the reveal/tilt setup above,
    // so it's wired last and gets its own refresh once everything settles.
    initProjectStack();

    runLoader(() => {
      revealNav();
      if (hasGSAP) ScrollTrigger.refresh();
    });

    window.addEventListener('load', () => {
      if (hasGSAP) ScrollTrigger.refresh();
    });
  });
})();
