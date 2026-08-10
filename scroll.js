/* ===========================================================
   CYRUSLINKSHUB — COOL SCROLL ANIMATIONS
   Auto-applies to every page. No HTML editing needed.
=========================================================== */
(function () {

    /* 1. Neon scroll progress bar */
    var bar = document.createElement('div');
    bar.id = 'scrollProgress';
    document.body.appendChild(bar);

    /* 2. Back-to-top button */
    var topBtn = document.createElement('button');
    topBtn.className = 'back-top';
    topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(topBtn);

    /* 3. Tag elements with reveal classes */
    document.querySelectorAll('main section, .cta, footer').forEach(function (el) {
        el.classList.add('reveal');
    });

    /* Staggered zoom-in for grid children (cards fly in one by one) */
    document.querySelectorAll('.tools-grid, .features-grid, .hero-stats, .landing-info, .footer-grid').forEach(function (grid) {
        Array.prototype.forEach.call(grid.children, function (child, i) {
            child.classList.add('reveal-zoom');
            child.style.transitionDelay = (i * 0.09) + 's';
        });
    });

    /* FAQ items slide in alternating left/right */
    document.querySelectorAll('.faq-item').forEach(function (el, i) {
        el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

    /* Headings pop with zoom */
    document.querySelectorAll('h1, h2').forEach(function (el) {
        el.classList.add('reveal-zoom');
    });

    /* Hero buttons flip in */
    document.querySelectorAll('.hero-buttons a, .hero-buttons button, .cta a').forEach(function (el, i) {
        el.classList.add('reveal-flip');
        el.style.transitionDelay = (0.2 + i * 0.12) + 's';
    });

    /* 4. IntersectionObserver — triggers when element enters screen */
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) {
                en.target.classList.add('active');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-flip').forEach(function (el) {
        if (io) io.observe(el);
        else el.classList.add('active');
    });

    /* 5. Scroll events: progress bar + navbar glow + back-top */
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';

        var nav = document.querySelector('.navbar, nav');
        if (nav) nav.classList.toggle('scrolled', h.scrollTop > 40);

        topBtn.classList.toggle('show', h.scrollTop > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

})();
