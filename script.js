// ========================================
// PORTFOLIO WEBSITE - INTERACTIVE FEATURES
// Ajay Chodankar
// ========================================

// === PARTICLE ANIMATION ===
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connections = [];
        this.maxDistance = 150;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / this.maxDistance)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// === DYNAMIC TYPING EFFECT ===
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.text = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        this.element.textContent = this.text;

        let typeSpeed = 150;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === SCROLL ANIMATIONS ===
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        this.observeElements();
    }

    observeElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => this.observer.observe(el));
    }
}

// === NAVBAR SCROLL EFFECT ===
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScroll = 0;

        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    }
}

// === SMOOTH SCROLL FOR NAVIGATION ===
class SmoothScroller {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// === SKILL ANIMATION ===
class SkillAnimations {
    constructor() {
        this.skillCategories = document.querySelectorAll('.skill-category');
        this.init();
    }

    init() {
        this.skillCategories.forEach((category, index) => {
            category.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// === CURSOR TRAIL EFFECT (Optional Enhancement) ===
class CursorTrail {
    constructor() {
        this.coords = { x: 0, y: 0 };
        this.circles = [];
        this.colors = [
            'rgba(99, 102, 241, 0.3)',
            'rgba(139, 92, 246, 0.3)',
            'rgba(6, 182, 212, 0.3)'
        ];

        // Create circles
        for (let i = 0; i < 20; i++) {
            const circle = document.createElement('div');
            circle.className = 'cursor-circle';
            circle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                background: ${this.colors[i % this.colors.length]};
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(circle);
            this.circles.push(circle);
        }

        window.addEventListener('mousemove', (e) => {
            this.coords.x = e.clientX;
            this.coords.y = e.clientY;
        });

        this.animateCircles();
    }

    animateCircles() {
        let x = this.coords.x;
        let y = this.coords.y;

        this.circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(this.circles.length - index) / this.circles.length})`;

            const nextCircle = this.circles[index + 1] || this.circles[0];
            x += (parseFloat(nextCircle.style.left) - x) * 0.3;
            y += (parseFloat(nextCircle.style.top) - y) * 0.3;
        });

        requestAnimationFrame(() => this.animateCircles());
    }
}

// === STATS COUNTER ANIMATION ===
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.speed = 200;

        if (this.counters.length > 0) {
            this.observeCounters();
        }
    }

    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const increment = target / this.speed;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }
}

// === PROJECT CARD TILT EFFECT ===
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .glass-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    }

    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// === INITIALIZE ALL FEATURES ===
document.addEventListener('DOMContentLoaded', () => {
    // Particle System
    new ParticleSystem();

    // Dynamic Typing Effect
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        const words = [
            'AI Researcher & Software Engineer',
            'Agentic AI Specialist',
            'Computer Vision Expert',
            'Cloud Solutions Architect',
            'Innovation Enthusiast'
        ];
        new TypeWriter(typedElement, words);
    }

    // Scroll Animations
    new ScrollAnimations();

    // Navbar Controller
    new NavbarController();

    // Smooth Scrolling
    new SmoothScroller();

    // Skill Animations
    new SkillAnimations();

    // Stats Counter (if stats section exists)
    new StatsCounter();

    // Tilt Effect for Cards
    new TiltEffect();

    // Optional: Cursor Trail (uncomment if desired)
    // if (window.innerWidth > 768) {
    //     new CursorTrail();
    // }

    // Add loading animation complete
    document.body.classList.add('loaded');

    console.log('🚀 Portfolio website loaded successfully!');
    console.log('💼 Ajay Chodankar - AI Researcher & Software Engineer');
});

// === PERFORMANCE OPTIMIZATION ===
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
window.addEventListener('resize', debounce(() => {
    console.log('Window resized - recalculating layouts...');
}, 250));

// === ACCESSIBILITY ENHANCEMENTS ===
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close modals or reset state
    if (e.key === 'Escape') {
        // Handle escape key functionality
        console.log('Escape key pressed');
    }
});

// === THEME PREFERENCE (Future Enhancement) ===
// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// === SERVICE WORKER FOR OFFLINE SUPPORT (Optional) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(err => console.log('SW registration failed:', err));
    });
}
