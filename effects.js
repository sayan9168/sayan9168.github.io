/* ============================================
   EFFECTS.JS - Optimized for performance (low lag)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 3D Particle Background (lightweight) ---------- */
    let particleMaterial = null;
    let animationId = null;
    let renderer = null;

    if (window.THREE && document.querySelector('#bg')) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            alpha: true,
            antialias: false,
            powerPreference: 'low-power'
        });
        // Cap pixel ratio to reduce GPU load (big lag fix on mobile/low-end)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 30;

        // Reduced from 800 → 220 particles (major lag reduction)
        const particlesCount = 220;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleMaterial = new THREE.PointsMaterial({
            color: document.body.classList.contains('light-theme') ? 0x2563eb : 0x38bdf8,
            size: 0.25,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        const particles = new THREE.Points(geometry, particleMaterial);
        scene.add(particles);

        let mouseX = 0, mouseY = 0;
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        function animate() {
            animationId = requestAnimationFrame(animate);
            particles.rotation.x += 0.0004;
            particles.rotation.y += 0.0006;
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }

        // Pause animation when tab is hidden (saves CPU/GPU)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) cancelAnimationFrame(animationId);
                animationId = null;
            } else if (!animationId) {
                animate();
            }
        });

        animate();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 150);
        }, { passive: true });
    }

    /* ---------- Theme Toggle ---------- */
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        function applyTheme(theme) {
            const isLight = theme === 'light';
            document.body.classList.toggle('light-theme', isLight);
            themeToggle.innerHTML = isLight
                ? '<i class="fas fa-moon"></i>'
                : '<i class="fas fa-sun"></i>';
            try { localStorage.setItem('sm-theme', theme); } catch(e) {}
            if (particleMaterial) {
                particleMaterial.color.set(isLight ? 0x2563eb : 0x38bdf8);
            }
        }
        const saved = (function(){ try { return localStorage.getItem('sm-theme'); } catch(e){ return null; } })();
        applyTheme(saved === 'light' ? 'light' : 'dark');

        themeToggle.addEventListener('click', () => {
            const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    /* ---------- Custom Cursor (desktop only, throttled) ---------- */
    const cursor = document.querySelector('.cursor');
    const cursorFollow = document.querySelector('.cursor-follow');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursor && cursorFollow && !isTouch) {
        let cx = 0, cy = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', (e) => {
            cx = e.clientX;
            cy = e.clientY;
        }, { passive: true });

        function updateCursor() {
            cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
            fx += (cx - fx) * 0.15;
            fy += (cy - fy) * 0.15;
            cursorFollow.style.transform = 'translate(' + fx + 'px,' + fy + 'px)';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        document.querySelectorAll('a, button, .project-card, .achievement-card, .social-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollow.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollow.classList.remove('hover');
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none';
        if (cursorFollow) cursorFollow.style.display = 'none';
    }

    /* ---------- Tilt Effect (optional, skip on mobile) ---------- */
    if (window.VanillaTilt && !isTouch) {
        VanillaTilt.init(document.querySelectorAll('.project-card, .achievement-card'), {
            max: 10, speed: 400, glare: false
        });
    }

    /* ---------- Click Confetti (reduced) ---------- */
    function spawnConfetti(x, y) {
        const colors = (window.SITE_DATA && SITE_DATA.confettiColors) || ['#38bdf8', '#a855f7', '#f472b6'];
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'confetti';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 70;
            p.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            p.style.setProperty('--ty', (Math.sin(angle) * velocity - 80) + 'px');
            p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('a, button, input, textarea')) return;
        spawnConfetti(e.clientX, e.clientY);
    });
});
