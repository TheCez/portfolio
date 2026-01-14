// PORTFOLIO WEBSITE - INTERACTIVE FEATURES
// Ajay Chodankar

console.log('🚀 Script loaded!');

// === BEAUTIFUL PARTICLE NETWORK ANIMATION ===
class ParticleNetwork {
    constructor() {
        console.log('Initializing particle network...');
        this.canvas = document.getElementById('particles-canvas');

        if (!this.canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 120;
        this.maxDistance = 200;

        // Set canvas size
        this.setCanvasSize();

        // Create gradient background
        this.createBackground();

        // Initialize particles
        this.createParticles();

        // Start animation
        this.animate();

        // Event listeners
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.createBackground();
            this.createParticles();
        });

        console.log('✅ Particle network initialized with', this.particleCount, 'particles');
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBackground() {
        // Create a beautiful gradient background
        this.bgGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        this.bgGradient.addColorStop(0, '#0a0f1a');
        this.bgGradient.addColorStop(0.3, '#0f172a');
        this.bgGradient.addColorStop(0.6, '#1a1f3a');
        this.bgGradient.addColorStop(1, '#0f172a');
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1,
                brightness: Math.random() * 0.5 + 0.5
            });
        }
    }

    animate() {
        // Clear canvas completely with gradient background
        this.ctx.fillStyle = this.bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update particle positions
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges smoothly
            if (particle.x < 0) { particle.x = 0; particle.vx *= -1; }
            if (particle.x > this.canvas.width) { particle.x = this.canvas.width; particle.vx *= -1; }
            if (particle.y < 0) { particle.y = 0; particle.vy *= -1; }
            if (particle.y > this.canvas.height) { particle.y = this.canvas.height; particle.vy *= -1; }
        });

        // Draw connections first (behind particles)
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.maxDistance) {
                    const opacity = 0.6 * (1 - distance / this.maxDistance);

                    // Create gradient line
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity})`);
                    gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles with glow
        this.particles.forEach(particle => {
            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 6
            );
            glowGradient.addColorStop(0, `rgba(99, 102, 241, ${particle.brightness * 0.8})`);
            glowGradient.addColorStop(0.3, `rgba(139, 92, 246, ${particle.brightness * 0.4})`);
            glowGradient.addColorStop(0.6, `rgba(6, 182, 212, ${particle.brightness * 0.1})`);
            glowGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
            this.ctx.fillStyle = glowGradient;
            this.ctx.fill();

            // Bright core
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(200, 210, 255, ${particle.brightness})`;
            this.ctx.fill();
        });

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

        let typeSpeed = 100;

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
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => this.observer.observe(el));
    }
}

// === NAVBAR SCROLL EFFECT ===
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// === SMOOTH SCROLL ===
class SmoothScroller {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');

    // Particle Network
    new ParticleNetwork();

    // Typing Effect
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        new TypeWriter(typedElement, [
            'AI Researcher & Software Engineer',
            'Agentic AI Specialist',
            'Computer Vision Expert',
            'Cloud Solutions Architect'
        ]);
    }

    // Other effects
    new ScrollAnimations();
    new NavbarController();
    new SmoothScroller();

    console.log('🚀 Portfolio loaded!');
});
