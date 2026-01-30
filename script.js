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

// ==========================================
// FIGHT MODE - Lightsaber Destruction Mode
// ==========================================

(function() {
    const fightModeBtn = document.getElementById('fightModeBtn');
    if (!fightModeBtn) return;

    let fightModeActive = false;
    let isSlicing = false;
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

        // Convert angle to radians and normalize
        const angleRad = (angle || 0) * Math.PI / 180;

        // Calculate clip path points based on swipe angle
        // We create two triangular/polygon clips that follow the cut line
        const centerX = 50;
        const centerY = 50;

        // Perpendicular offset for the cut line
        const cutAngle = angle + 90; // Perpendicular to swipe direction
        const offsetX = Math.cos(cutAngle * Math.PI / 180) * 70;
        const offsetY = Math.sin(cutAngle * Math.PI / 180) * 70;

        // Create two pieces with angled clip paths
        const clips = [
            `polygon(${centerX - offsetX}% ${centerY - offsetY}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
            `polygon(${centerX + offsetX}% ${centerY + offsetY}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${centerX - offsetX}% ${centerY - offsetY}%)`
        ];

        for (let i = 0; i < 2; i++) {
            const piece = document.createElement('div');
            piece.className = 'sliced-piece';

            const clone = element.cloneNode(true);
            clone.style.margin = '0';
            clone.style.position = 'relative';
            clone.style.width = '100%';
            clone.style.height = '100%';

            // Determine which side of the cut this piece is on
            const isFirstHalf = i === 0;

            piece.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.top}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                overflow: visible;
                pointer-events: none;
                z-index: 10000;
                clip-path: ${isFirstHalf ?
                    `polygon(0% 0%, ${50 + offsetX}% ${50 + offsetY}%, ${50 - offsetX}% ${50 - offsetY}%, 0% 100%)` :
                    `polygon(100% 0%, 100% 100%, ${50 - offsetX}% ${50 - offsetY}%, ${50 + offsetX}% ${50 + offsetY}%)`
                };
            `;

            piece.appendChild(clone);
            document.body.appendChild(piece);

            // Animate falling - direction based on which half and cut angle
            const fallAngle = isFirstHalf ? angle - 90 : angle + 90;
            const fallX = Math.cos(fallAngle * Math.PI / 180) * (100 + Math.random() * 100);
            const fallY = window.innerHeight + Math.random() * 200;
            const rotation = (isFirstHalf ? -1 : 1) * (30 + Math.random() * 60);

            piece.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${fallX}px, ${fallY}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: 1200 + Math.random() * 800,
                easing: 'ease-in'
            }).onfinish = function() { piece.remove(); };
        }

        // Hide original
        element.style.visibility = 'hidden';
    }

    // Mouse events for slicing
    document.addEventListener('mousedown', function(e) {
        if (!fightModeActive) return;
        isSlicing = true;
        lastPos = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', function(e) {
        if (!fightModeActive || !isSlicing) return;

        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element && element.classList.contains('sliceable') && element.dataset.sliced !== 'true') {
            const angle = lastPos ? Math.atan2(e.clientY - lastPos.y, e.clientX - lastPos.x) * 180 / Math.PI : 0;
            createSlashEffect(e.clientX, e.clientY, angle);
            sliceElement(element, angle);
        }

        lastPos = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseup', function() {
        isSlicing = false;
        lastPos = null;
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
