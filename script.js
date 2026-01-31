// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Lightsaber Color Picker
const saberPickerBtn = document.getElementById('saberPickerBtn');
const saberDropdown = document.getElementById('saberDropdown');
const saberColors = document.querySelectorAll('.saber-color');

// Load saved saber color or default to green
const savedSaber = localStorage.getItem('saberColor') || 'green';
document.body.classList.add(`saber-${savedSaber}`);
document.querySelector(`.saber-color.${savedSaber}`)?.classList.add('active');

// Toggle dropdown
saberPickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    saberDropdown.classList.toggle('active');
});

// Handle color selection
saberColors.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = btn.dataset.color;

        // Remove all saber classes and active states
        document.body.className = document.body.className.replace(/saber-\w+/g, '');
        saberColors.forEach(b => b.classList.remove('active'));

        // Apply new color
        document.body.classList.add(`saber-${color}`);
        btn.classList.add('active');
        localStorage.setItem('saberColor', color);

        // Close dropdown
        saberDropdown.classList.remove('active');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    saberDropdown.classList.remove('active');
});

// Saber Trail Effect with Canvas
const saberTrailCanvas = document.createElement('canvas');
saberTrailCanvas.id = 'saberTrailCanvas';
document.body.appendChild(saberTrailCanvas);

const ctx = saberTrailCanvas.getContext('2d');
let trailPoints = [];
const trailDuration = 500; // Trail fades over 0.5 seconds
const bladeLength = 18; // Length of the blade in pixels
const bladeAngle = -30 * (Math.PI / 180); // -30 degrees in radians

// Saber colors
const saberColorMap = {
    green: { core: '#ffffff', glow: '#22c55e' },
    blue: { core: '#ffffff', glow: '#3b82f6' },
    red: { core: '#ffffff', glow: '#ef4444' },
    purple: { core: '#ffffff', glow: '#a855f7' },
    gold: { core: '#ffffff', glow: '#e8c547' }
};

function resizeCanvas() {
    saberTrailCanvas.width = window.innerWidth;
    saberTrailCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getCurrentSaberColor() {
    const bodyClasses = document.body.className;
    const match = bodyClasses.match(/saber-(\w+)/);
    return match ? match[1] : 'green';
}

function drawTrail() {
    const now = Date.now();
    ctx.clearRect(0, 0, saberTrailCanvas.width, saberTrailCanvas.height);

    // Remove points older than trailDuration
    trailPoints = trailPoints.filter(p => now - p.time < trailDuration);

    if (trailPoints.length < 2) {
        requestAnimationFrame(drawTrail);
        return;
    }

    const color = saberColorMap[getCurrentSaberColor()];

    // Draw the glowing trail
    for (let i = 1; i < trailPoints.length; i++) {
        const prev = trailPoints[i - 1];
        const curr = trailPoints[i];

        // Calculate alpha based on age (newer = more opaque)
        const age = now - curr.time;
        const alpha = 1 - (age / trailDuration);

        if (alpha <= 0) continue;

        // Calculate blade start and end points based on cursor position
        const tipX = curr.x;
        const tipY = curr.y;
        const baseX = tipX - Math.sin(bladeAngle) * bladeLength;
        const baseY = tipY + Math.cos(bladeAngle) * bladeLength;

        const prevTipX = prev.x;
        const prevTipY = prev.y;
        const prevBaseX = prevTipX - Math.sin(bladeAngle) * bladeLength;
        const prevBaseY = prevTipY + Math.cos(bladeAngle) * bladeLength;

        // Draw glow layer (wider, more transparent)
        ctx.beginPath();
        ctx.moveTo(prevTipX, prevTipY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(baseX, baseY);
        ctx.lineTo(prevBaseX, prevBaseY);
        ctx.closePath();
        ctx.fillStyle = color.glow + Math.floor(alpha * 90).toString(16).padStart(2, '0');
        ctx.shadowColor = color.glow;
        ctx.shadowBlur = 15;
        ctx.fill();

        // Draw core (brighter, thinner)
        ctx.beginPath();
        ctx.moveTo(prevTipX, prevTipY);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = color.core + Math.floor(alpha * 120).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.stroke();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(drawTrail);
}

drawTrail();

document.addEventListener('mousemove', (e) => {
    trailPoints.push({ x: e.clientX, y: e.clientY, time: Date.now() });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    // Get the submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API endpoint)
    // For now, we'll just simulate a delay and show success
    try {
        // TODO: Replace this with your actual form submission logic
        // Example with Formspree:
        // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     body: formData,
        //     headers: { 'Accept': 'application/json' }
        // });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#d4af37';
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);

    } catch (error) {
        // Show error message
        submitBtn.textContent = 'Error! Try again';
        submitBtn.style.background = '#ef4444';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add initial styles and observe project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.transition = 'none';
    });
}

// Video Carousel
(function() {
    const videos = document.querySelectorAll('.rowing-video');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.video-dots');

    if (!videos.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    // Create dots
    videos.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'video-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Video ${i + 1}`);
        dot.addEventListener('click', () => goToVideo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.video-dot');

    function goToVideo(index) {
        // Pause current video
        videos[currentIndex].pause();
        videos[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Update index
        currentIndex = index;
        if (currentIndex < 0) currentIndex = videos.length - 1;
        if (currentIndex >= videos.length) currentIndex = 0;

        // Play new video
        videos[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        videos[currentIndex].currentTime = 0;
        videos[currentIndex].play();
    }

    prevBtn.addEventListener('click', () => goToVideo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToVideo(currentIndex + 1));

    // Auto-play first video when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videos[currentIndex].play();
            } else {
                videos[currentIndex].pause();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.video-container'));

    // Loop videos
    videos.forEach((video, i) => {
        video.addEventListener('ended', () => {
            goToVideo(i + 1);
        });
    });
})();

// ==========================================
// FIGHT MODE - Lightsaber Destruction Mode
// ==========================================

(function() {
    const fightModeBtn = document.getElementById('fightModeBtn');
    if (!fightModeBtn) return;

    let fightModeActive = false;
    let lastPos = null;

    // Get current saber color for slash effects
    function getSlashColor() {
        const colors = {
            green: '#22c55e',
            blue: '#3b82f6',
            red: '#ef4444',
            purple: '#a855f7',
            gold: '#e8c547'
        };
        const currentSaber = localStorage.getItem('saberColor') || 'green';
        return colors[currentSaber];
    }

    // Toggle Fight Mode
    fightModeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        fightModeActive = !fightModeActive;

        if (fightModeActive) {
            fightModeBtn.classList.add('active');
            document.body.classList.add('fight-mode');
            markSliceableElements();
            console.log('Fight Mode: ON');
        } else {
            fightModeBtn.classList.remove('active');
            document.body.classList.remove('fight-mode');
            resetPage();
            console.log('Fight Mode: OFF');
        }
    });

    // Mark elements that can be sliced
    function markSliceableElements() {
        const selectors = 'h1, h2, h3, h4, p, li, img, .experience-card, .recognition-card, .favorites-card';
        document.querySelectorAll(selectors).forEach(function(el) {
            if (!el.closest('.navbar') && !el.closest('.fight-mode-btn') && !el.closest('.saber-picker')) {
                el.classList.add('sliceable');
                el.style.cursor = 'crosshair';
            }
        });
    }

    // Create slash visual effect
    function createSlashEffect(x, y, angle) {
        const slash = document.createElement('div');
        slash.className = 'slash-effect';
        slash.style.cssText = `
            position: fixed;
            left: ${x - 50}px;
            top: ${y}px;
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, transparent, ${getSlashColor()}, transparent);
            box-shadow: 0 0 20px ${getSlashColor()}, 0 0 40px ${getSlashColor()};
            transform: rotate(${angle}deg);
            pointer-events: none;
            z-index: 9999;
            animation: slashAnim 0.3s ease-out forwards;
        `;
        document.body.appendChild(slash);
        setTimeout(function() { slash.remove(); }, 300);
    }

    // Slice an element into pieces at an angle
    function sliceElement(element, angle) {
        if (!element || !element.classList.contains('sliceable') || element.dataset.sliced === 'true') return;

        element.dataset.sliced = 'true';
        const rect = element.getBoundingClientRect();

        // Normalize angle for clip-path (perpendicular to swipe)
        const cutAngle = (angle + 90) * Math.PI / 180;
        const dx = Math.cos(cutAngle) * 100;
        const dy = Math.sin(cutAngle) * 100;

        // Two clip paths - one for each half
        const clip1 = `polygon(${50 + dx}% ${50 + dy}%, ${50 - dx}% ${50 - dy}%, -50% -50%, -50% 150%, 150% 150%, 150% -50%)`;
        const clip2 = `polygon(${50 + dx}% ${50 + dy}%, ${50 - dx}% ${50 - dy}%, 150% 150%, 150% -50%, -50% -50%, -50% 150%)`;

        for (let i = 0; i < 2; i++) {
            const piece = document.createElement('div');
            const clone = element.cloneNode(true);

            clone.style.cssText = 'margin:0; width:100%; height:100%;';

            piece.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                pointer-events: none;
                z-index: 10000;
                clip-path: ${i === 0 ? clip1 : clip2};
                overflow: hidden;
            `;

            piece.appendChild(clone);
            document.body.appendChild(piece);

            // Each piece falls in opposite directions based on cut angle
            const dir = i === 0 ? 1 : -1;
            const fallX = dir * Math.cos(cutAngle) * 150;
            const fallY = window.innerHeight;
            const spin = dir * (45 + Math.random() * 45);

            piece.animate([
                { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${fallX}px, ${fallY}px) rotate(${spin}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-in'
            }).onfinish = () => piece.remove();
        }

        element.style.visibility = 'hidden';
    }

    // Slicing happens on mouse move - no click needed
    document.addEventListener('mousemove', function(e) {
        if (!fightModeActive) return;

        // Calculate angle from last position
        let angle = 0;
        if (lastPos) {
            const dx = e.clientX - lastPos.x;
            const dy = e.clientY - lastPos.y;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                angle = Math.atan2(dy, dx) * 180 / Math.PI;
            }
        }

        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element && element.classList.contains('sliceable') && element.dataset.sliced !== 'true') {
            createSlashEffect(e.clientX, e.clientY, angle);
            sliceElement(element, angle);
        }

        lastPos = { x: e.clientX, y: e.clientY };
    });

    // Reset page
    function resetPage() {
        document.querySelectorAll('.sliceable').forEach(function(el) {
            el.classList.remove('sliceable');
            el.style.visibility = '';
            el.style.cursor = '';
            el.dataset.sliced = '';
        });
        document.querySelectorAll('.sliced-piece, .slash-effect').forEach(function(el) {
            el.remove();
        });
    }

    // Escape key to exit
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fightModeActive) {
            fightModeActive = false;
            fightModeBtn.classList.remove('active');
            document.body.classList.remove('fight-mode');
            resetPage();
        }
    });
})();

// Rowing Boat Parallax - Show only in Experience section
(function() {
    const rowingBoat = document.querySelector('.rowing-boat-bg');
    const experienceSection = document.getElementById('experience');

    if (!rowingBoat || !experienceSection) return;

    function checkVisibility() {
        const rect = experienceSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Show boat only when Experience section is mostly in view
        // Top of section is in upper half of screen AND bottom is still visible
        if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.3) {
            rowingBoat.classList.add('visible');
        } else {
            rowingBoat.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
})();
