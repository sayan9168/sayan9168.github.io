/* ============================================
   MAIN.JS - Preloader, Typing, Counters, Form
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    if (window.AOS) AOS.init({ once: true });

    /* ---------- Preloader ---------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 600);
    });
    setTimeout(() => preloader.classList.add('hidden'), 2500);

    /* ---------- Scroll Progress Bar ---------- */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (scrollTop / height) * 100 + '%';
    });

    /* ---------- Typing Effect ---------- */
    const typedEl = document.querySelector('.typed-text');
    if (typedEl) {
        const roles = SITE_DATA.roles;
        let roleIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const current = roles[roleIndex];
            typedEl.textContent = isDeleting
                ? current.substring(0, charIndex--)
                : current.substring(0, charIndex++);
            let speed = isDeleting ? 50 : 120;
            if (!isDeleting && charIndex === current.length + 1) {
                speed = 1800; isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }
            setTimeout(type, speed);
        }
        type();
    }

    /* ---------- Live Clock ---------- */
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
        setInterval(() => {
            clockEl.textContent = new Date().toLocaleTimeString('en-IN', { hour12: true });
        }, 1000);
    }

    /* ---------- Stat Counters ---------- */
    const counters = document.querySelectorAll('.counter');
    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            let count = 0;
            const inc = target / 80;
            const update = () => {
                count += inc;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + (target >= 1000 ? '+' : '');
                }
            };
            update();
        });
    };
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { runCounters(); aboutObserver.disconnect(); }
            });
        });
        aboutObserver.observe(aboutSection);
    }

    /* ---------- Skill Bars ---------- */
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const percent = +item.dataset.percent;
                const fill = item.querySelector('.skill-fill');
                const label = item.querySelector('.skill-percent');
                fill.style.width = percent + '%';
                let cur = 0;
                const interval = setInterval(() => {
                    cur++;
                    label.textContent = cur + '%';
                    if (cur >= percent) clearInterval(interval);
                }, 15);
                skillObserver.unobserve(item);
            }
        });
    }, { threshold: 0.4 });
    skillItems.forEach(item => skillObserver.observe(item));

    /* ---------- Testimonial Rotation ---------- */
    const quoteEl = document.getElementById('testimonial-text');
    const authorEl = document.getElementById('testimonial-author');
    const quoteBox = document.querySelector('.testimonial-box');
    if (quoteEl && authorEl) {
        const quotes = SITE_DATA.testimonials;
        let qi = 0;
        setInterval(() => {
            qi = (qi + 1) % quotes.length;
            quoteEl.textContent = quotes[qi].text;
            authorEl.textContent = quotes[qi].author;
            if (quoteBox) {
                quoteBox.classList.remove('fade-in');
                void quoteBox.offsetWidth;
                quoteBox.classList.add('fade-in');
            }
        }, 5000);
    }

    /* ---------- Toast ---------- */
    function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    /* ---------- Contact Form ---------- */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const message = document.getElementById('cf-message').value.trim();
            const subject = encodeURIComponent('Portfolio Message from ' + name);
            const body = encodeURIComponent(message + '\n\n— From: ' + name + ' (' + email + ')');
            window.location.href = 'mailto:' + SITE_DATA.contactEmail + '?subject=' + subject + '&body=' + body;
            showToast('Opening your email app... ✉️');
            form.reset();
        });
    }

    /* ---------- Back to Top ---------- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- Smooth Scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
});
