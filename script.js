/**
 * ════════════════════════════════════════════
 * SNEHASIS NASKAR — PREMIUM INTERACTIVE ENGINE
 * ════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── CORE SELECTORS ──
    const video = document.getElementById('bg-video');
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const nav = document.querySelector('nav');

    // ── ENGINE STATE ──
    const isMobile = window.innerWidth < 768;
    let targetTime = 0;
    let actualTime = 0;
    let mouseX = 0, mouseY = 0;
    let smoothX = 0, smoothY = 0;

    // ════════════════════════════════════════
    // 1. LOADER — Progress bar + Smooth dismiss
    // ════════════════════════════════════════
    const hideLoader = () => {
        if (loader && !loader.classList.contains('hidden')) {
            // Flash bar to 100% before fade-out
            if (loaderBar) loaderBar.style.width = '100%';
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.visibility = 'hidden';
                    loader.classList.add('hidden');
                }, 900);
            }, 300);
        }
    };

    if (!isMobile && video) {
        // Track buffering progress
        video.addEventListener('progress', () => {
            if (video.buffered.length > 0 && video.duration) {
                const pct = (video.buffered.end(0) / video.duration) * 100;
                if (loaderBar) loaderBar.style.width = `${Math.min(pct, 99)}%`;
            }
        });

        // Dismiss conditions
        video.addEventListener('loadedmetadata', hideLoader);
        video.addEventListener('canplaythrough', hideLoader);
    } else {
        // Mobile fallback: dismiss immediately
        hideLoader();
    }

    // Safety fallback
    setTimeout(hideLoader, 5000);

    // ════════════════════════════════════════
    // 2. SCROLL ENGINE — Scrubbing & Nav
    // ════════════════════════════════════════
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;

        // Map scroll to video timeline
        if (!isMobile && video && video.duration) {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = Math.max(0, Math.min(1, sy / Math.max(1, maxScroll)));
            targetTime = scrollFraction * video.duration;
        }

        // Nav Glassmorphism state
        if (sy > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');

    }, { passive: true });

    // ════════════════════════════════════════
    // 3. MOUSE PARALLAX — Vector normalization
    // ════════════════════════════════════════
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1; // Range: -1 to +1
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
    }

    // ════════════════════════════════════════
    // 4. RENDER LOOP — High-performance Tick
    // ════════════════════════════════════════
    function render() {
        if (!isMobile && video) {

            // A. Smooth Time Scrubbing (LERP 0.08)
            actualTime += (targetTime - actualTime) * 0.08;

            // Update DOM only if visibility changes (Optimization)
            if (Math.abs(actualTime - video.currentTime) > 0.001) {
                try {
                    video.currentTime = actualTime;
                } catch (e) { /* Buffer safety */ }
            }

            // B. Smooth Parallax (LERP 0.05)
            smoothX += (mouseX - smoothX) * 0.05;
            smoothY += (mouseY - smoothY) * 0.05;

            const panX = smoothX * 20; // Max pan: 20px
            const panY = smoothY * 20;

            // Combined transform for performance
            video.style.transform =
                `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(1.15)`;
        }

        requestAnimationFrame(render);
    }

    // Start engine
    requestAnimationFrame(render);

    // ════════════════════════════════════════
    // 5. TYPED EFFECT — ORIGINAL LOGIC
    // ════════════════════════════════════════
    const phrases = [
        'Aspiring Web Developer',
        'Front-End Enthusiast',
        'CSE Student @ Brainware',
        'Builder of Digital Realities'
    ];
    let pi = 0, ci = 0, deleting = false;
    const typedEl = document.getElementById('typed');

    function typeLoop() {
        if (!typedEl) return;
        const phrase = phrases[pi];
        if (!deleting) {
            typedEl.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            typedEl.textContent = phrase.slice(0, --ci);
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
            }
        }
        setTimeout(typeLoop, deleting ? 45 : 80);
    }
    setTimeout(typeLoop, 1200);

    // ════════════════════════════════════════
    // 6. SCROLL REVEAL — INTERSECTION OBSERVER
    // ════════════════════════════════════════
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    const revealSelectors = [
        '.timeline-item', '.stat-card', '.skill-group',
        '.edu-card', '.ach-card', '.section-title'
    ];

    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => revealObserver.observe(el));
    });

});
