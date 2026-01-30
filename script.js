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

const fightModeBtn = document.getElementById('fightModeBtn');
let fightModeActive = false;
let isSlicing = false;
let sliceStart = null;

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
fightModeBtn.addEventListener('click', () => {
    fightModeActive = !fightModeActive;
    fightModeBtn.classList.toggle('active', fightModeActive);
    document.body.classList.toggle('fight-mode', fightModeActive);

    if (fightModeActive) {
        markSliceableElements();
    } else {
        resetPage();
    }
});

// Mark elements that can be sliced
function markSliceableElements() {
    const selectors = 'h1, h2, h3, p, li, .about-photo, .experience-card, .recognition-card, .favorites-card, .section-title';
    document.querySelectorAll(selectors).forEach(el => {
        if (!el.closest('.navbar') && !el.closest('.fight-mode-btn')) {
            el.classList.add('sliceable');
        }
    });
}

// Create slash visual effect
function createSlashEffect(x, y, angle) {
    const slash = document.createElement('div');
    slash.className = 'slash-effect';
    slash.style.left = x - 50 + 'px';
    slash.style.top = y + 'px';
    slash.style.setProperty('--slash-color', getSlashColor());
    slash.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(slash);

    setTimeout(() => slash.remove(), 300);
}

// Slice an element into pieces
function sliceElement(element, sliceX, sliceY) {
    if (!element.classList.contains('sliceable') || element.dataset.sliced) return;

    element.dataset.sliced = 'true';
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);

    // Create two pieces
    const piece1 = document.createElement('div');
    const piece2 = document.createElement('div');

    piece1.className = 'sliced-piece';
    piece2.className = 'sliced-piece';

    // Clone the element's appearance
    const clone1 = element.cloneNode(true);
    const clone2 = element.cloneNode(true);

    // Style piece 1 (top/left portion)
    piece1.style.left = rect.left + 'px';
    piece1.style.top = rect.top + 'px';
    piece1.style.width = rect.width + 'px';
    piece1.style.height = rect.height / 2 + 'px';
    piece1.style.overflow = 'hidden';
    piece1.style.background = styles.background;
    piece1.style.setProperty('--rotation', (Math.random() * 60 - 30) + 'deg');
    piece1.style.animationDuration = (1.5 + Math.random()) + 's';
    clone1.style.position = 'relative';
    piece1.appendChild(clone1);

    // Style piece 2 (bottom/right portion)
    piece2.style.left = rect.left + 'px';
    piece2.style.top = (rect.top + rect.height / 2) + 'px';
    piece2.style.width = rect.width + 'px';
    piece2.style.height = rect.height / 2 + 'px';
    piece2.style.overflow = 'hidden';
    piece2.style.background = styles.background;
    piece2.style.setProperty('--rotation', (Math.random() * 60 - 30) + 'deg');
    piece2.style.animationDuration = (1.5 + Math.random()) + 's';
    clone2.style.position = 'relative';
    clone2.style.top = -(rect.height / 2) + 'px';
    piece2.appendChild(clone2);

    document.body.appendChild(piece1);
    document.body.appendChild(piece2);

    // Hide original element
    element.style.visibility = 'hidden';

    // Remove pieces after animation
    setTimeout(() => {
        piece1.remove();
        piece2.remove();
    }, 3000);
}

// Handle slicing interaction
document.addEventListener('mousedown', (e) => {
    if (!fightModeActive) return;
    isSlicing = true;
    sliceStart = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', (e) => {
    if (!fightModeActive || !isSlicing) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.classList.contains('sliceable')) {
        const angle = Math.atan2(e.clientY - sliceStart.y, e.clientX - sliceStart.x) * 180 / Math.PI;
        createSlashEffect(e.clientX, e.clientY, angle);
        sliceElement(element, e.clientX, e.clientY);
    }

    sliceStart = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
    isSlicing = false;
    sliceStart = null;
});

// Reset page to original state
function resetPage() {
    // Remove sliceable class
    document.querySelectorAll('.sliceable').forEach(el => {
        el.classList.remove('sliceable');
        el.style.visibility = '';
        delete el.dataset.sliced;
    });

    // Remove any remaining pieces
    document.querySelectorAll('.sliced-piece').forEach(el => el.remove());
}

// Press Escape to exit fight mode
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fightModeActive) {
        fightModeActive = false;
        fightModeBtn.classList.remove('active');
        document.body.classList.remove('fight-mode');
        resetPage();
    }
});
