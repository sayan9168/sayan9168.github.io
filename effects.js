/* ============================================
   EFFECTS.JS - 3D Background, Theme, Confetti
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 3D Particle Background ---------- */
    let particleMaterial = null;

    if (window.THREE) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.position.z = 30;

        const particlesCount = 800;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleMaterial = new THREE.PointsMaterial({
            color: document.body.classList.contains('light-theme') ? 0x2563eb : 0x38bdf8,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const particles = new THREE.Points(geometry, particleMaterial);
        scene.add(particles);

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            particles.rotation.x += 0.0005;
            particles.rotation.y += 0.0008;
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
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
        // প্রাথমিক অবস্থা সেট করা
        const saved = (function(){ try { return localStorage.getItem('sm-theme'); } catch(e){ return null; } })();
        applyTheme(saved === 'light' ? 'light' : 'dark');

        themeToggle.addEventListener('click', () => {
            const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    /* ---------- Custom Cursor ---------- */
    const cursor = document.querySelector('.cursor');
    const cursorFollow = document.querySelector('.cursor-follow');
    if (cursor && cursorFollow) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                cursorFollow.style.left = e.clientX + 'px';
                cursorFollow.style.top = e.clientY + 'px';
            }, 50);
        });
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
    }

    /* ---------- Tilt Effect ---------- */
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll('.project-card, .achievement-card'), {
            max: 12, speed: 400, glare: true, "max-glare": 0.3
        });
    }

    /* ---------- Click Confetti ---------- */
    function spawnConfetti(x, y) {
        const colors = SITE_DATA.confettiColors;
        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.className = 'confetti';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const velocity = 60 + Math.random() * 90;
            p.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            p.style.setProperty('--ty', (Math.sin(angle) * velocity - 100) + 'px');
            p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    }
    document.addEventListener('click', (e) => spawnConfetti(e.clientX, e.clientY));
});
