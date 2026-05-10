document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('mobile-toggle');
    var nav = document.getElementById('nav');

    toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
    });

    document.querySelectorAll('.nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
        });
    });

    var header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        header.style.boxShadow = window.scrollY > 10
            ? '0 2px 8px rgba(0,0,0,0.08)'
            : 'none';
    });
});
