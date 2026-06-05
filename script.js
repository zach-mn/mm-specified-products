(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        // Enable JS-dependent visual states only once we know JS is running.
        // Without this class, all [data-reveal] content stays visible.
        document.documentElement.classList.add('js-ready');

        var header = document.getElementById('header');
        var toggle = document.getElementById('mobile-toggle');
        var nav = document.getElementById('nav');

        /* ---------- Mobile navigation ---------- */
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('open');
            });
            nav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    nav.classList.remove('open');
                });
            });
        }

        /* ---------- Header scroll state ---------- */
        var lastScrolled = false;
        function updateHeader() {
            var scrolled = window.scrollY > 24;
            if (scrolled !== lastScrolled) {
                header.classList.toggle('is-scrolled', scrolled);
                lastScrolled = scrolled;
            }
        }
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });

        /* ---------- Reveal on scroll ---------- */
        var revealEls = document.querySelectorAll('[data-reveal]');

        // Apply per-element transition delays from data-reveal-delay
        revealEls.forEach(function (el) {
            var delay = el.getAttribute('data-reveal-delay');
            if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
        });

        var revealObserver = null;

        function revealNow(el) {
            if (!el.classList.contains('is-revealed')) {
                el.classList.add('is-revealed');
                if (revealObserver) revealObserver.unobserve(el);
            }
        }

        function revealSection(hash) {
            if (!hash || hash.length < 2) return;
            var section;
            try { section = document.querySelector(hash); } catch (e) { return; }
            if (!section) return;
            if (section.hasAttribute('data-reveal')) revealNow(section);
            section.querySelectorAll('[data-reveal]').forEach(revealNow);
        }

        if ('IntersectionObserver' in window) {
            revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(function (el) { revealObserver.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
        }

        // Anchor-jump fix: when the URL hash changes (nav click, deep link),
        // reveal everything inside the target section right away so the user
        // never lands on a "blank" section while the observer thinks about it.
        if (window.location.hash) revealSection(window.location.hash);
        window.addEventListener('hashchange', function () {
            revealSection(window.location.hash);
        });
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function () {
                var hash = link.getAttribute('href');
                if (hash && hash.length > 1) revealSection(hash);
            });
        });

        /* ---------- Stat counters ---------- */
        var counters = document.querySelectorAll('[data-count-to]');

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count-to'), 10);
            var suffix = el.getAttribute('data-count-suffix') || '';
            var duration = 1600;
            var startTime = null;

            function step(now) {
                if (startTime === null) startTime = now;
                var elapsed = now - startTime;
                var t = Math.min(1, elapsed / duration);
                // easeOutQuart
                var eased = 1 - Math.pow(1 - t, 4);
                var current = Math.round(target * eased);
                el.textContent = current + suffix;
                if (t < 1) requestAnimationFrame(step);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window && counters.length) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function (c) { counterObserver.observe(c); });
        } else {
            counters.forEach(function (c) {
                var target = c.getAttribute('data-count-to');
                var suffix = c.getAttribute('data-count-suffix') || '';
                c.textContent = target + suffix;
            });
        }
    });
})();
