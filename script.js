(function () {
    'use strict';

    var GALLERY_LIMIT = 9; // photos shown before "Show all photos"

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var header = document.getElementById('header');
        var toggle = document.getElementById('nav-toggle');
        var nav = document.getElementById('nav');

        /* ---------- Mobile navigation ---------- */
        function setNav(open) {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                setNav(!nav.classList.contains('is-open'));
            });
            Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
                link.addEventListener('click', function () { setNav(false); });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                    setNav(false);
                    toggle.focus();
                }
            });
        }

        /* ---------- Header border once scrolled ---------- */
        function updateHeader() {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        }
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });

        /* ---------- Photo gallery ---------- */
        var gallery = document.getElementById('gallery');
        var lightbox = document.getElementById('lightbox');
        var photos = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('a.photo')) : [];

        // Collapse long galleries behind a "Show all photos" button.
        var items = gallery ? gallery.children : [];
        if (items.length > GALLERY_LIMIT) {
            for (var i = GALLERY_LIMIT; i < items.length; i++) items[i].classList.add('is-hidden');

            var more = document.createElement('div');
            more.className = 'gallery-more';
            more.innerHTML = '<button type="button" class="btn btn-secondary">Show all ' + items.length + ' photos</button>';
            gallery.parentNode.insertBefore(more, gallery.nextSibling);
            more.firstChild.addEventListener('click', function () {
                Array.prototype.forEach.call(items, function (li) { li.classList.remove('is-hidden'); });
                more.parentNode.removeChild(more);
            });
        }

        // Without <dialog> support, photo links simply open the image file.
        if (lightbox && typeof lightbox.showModal === 'function' && photos.length) {
            var img = document.getElementById('lightbox-img');
            var caption = document.getElementById('lightbox-caption');
            var current = 0;
            var opener = null;

            function show(index) {
                current = (index + photos.length) % photos.length;
                var link = photos[current];
                var thumb = link.querySelector('img');
                var text = link.querySelector('.photo-caption');
                img.src = link.getAttribute('href');
                img.alt = thumb ? thumb.alt : '';
                caption.textContent = text ? text.textContent : '';
                caption.hidden = !text;
            }

            photos.forEach(function (link, index) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    opener = link;
                    show(index);
                    lightbox.showModal();
                });
            });

            var single = photos.length < 2;
            lightbox.querySelector('[data-action="prev"]').hidden = single;
            lightbox.querySelector('[data-action="next"]').hidden = single;

            lightbox.addEventListener('click', function (e) {
                var action = e.target.getAttribute('data-action');
                if (action === 'close' || e.target === lightbox) lightbox.close();
                else if (action === 'prev') show(current - 1);
                else if (action === 'next') show(current + 1);
            });

            lightbox.addEventListener('keydown', function (e) {
                if (single) return;
                if (e.key === 'ArrowLeft') show(current - 1);
                else if (e.key === 'ArrowRight') show(current + 1);
            });

            lightbox.addEventListener('close', function () {
                img.removeAttribute('src');
                if (opener) opener.focus();
            });
        }

        /* ---------- Contact form → pre-filled email ---------- */
        var form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var get = function (id) { return document.getElementById(id).value.trim(); };
                var name = get('name');
                var company = get('company');
                var lines = [get('message'), '', name];
                if (company) lines.push(company);
                lines.push(get('email'));
                if (get('phone')) lines.push(get('phone'));

                var subject = 'Website inquiry from ' + name + (company ? ', ' + company : '');
                var to = form.getAttribute('action').replace(/^mailto:/, '');
                window.location.href = 'mailto:' + to +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(lines.join('\n'));
            });
        }
    });
})();
