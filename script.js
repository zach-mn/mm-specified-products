(function () {
    'use strict';

    var EMAIL = 'MichaelMoore@mmspecifiedproductsllc.com';

    /* ---------- Mobile navigation ---------- */
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');

    function setNav(open) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? 'Close' : 'Menu';
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            setNav(!nav.classList.contains('is-open'));
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setNav(false); });
        });
    }

    /* ---------- Contact form ----------
       There is no form backend, so build a mailto: link with the fields
       filled in and hand it to the visitor's email app. */
    var form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var get = function (name) { return form.elements[name].value.trim(); };
            var name = get('name');
            var company = get('company');

            var lines = [get('message'), '', name];
            if (company) lines.push(company);
            lines.push(get('email'));
            if (get('phone')) lines.push(get('phone'));

            var subject = 'Website inquiry from ' + name + (company ? ', ' + company : '');
            window.location.href = 'mailto:' + EMAIL +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(lines.join('\n'));
        });
    }
})();
