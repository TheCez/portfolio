// PORTFOLIO WEBSITE - NEURAL NETWORK VISUALIZATION
// Ajay Chodankar

console.log('🚀 Script loaded!');

// === ADVANCED NEURAL NETWORK WITH BOKEH ===
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        // Layers for depth
        this.backgroundNodes = [];  // Blurred, distant
        this.midgroundNodes = [];   // Main network
        this.foregroundNodes = [];  // Blurred, close
        this.dustParticles = [];    // Atmospheric shimmer

        this.setCanvasSize();
        this.createAllLayers();
        this.animate();

        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.createAllLayers();
        });

        console.log('✅ Neural network initialized');
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createAllLayers() {
        // Background layer - large, blurred nodes (bokeh effect)
        this.backgroundNodes = [];
        for (let i = 0; i < 30; i++) {
            this.backgroundNodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                radius: Math.random() * 6 + 4,
                opacity: Math.random() * 0.15 + 0.05
            });
        }

        // Main midground layer - sharp network
        this.midgroundNodes = [];
        for (let i = 0; i < 100; i++) {
            this.midgroundNodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2.5 + 1,
                brightness: Math.random() * 0.5 + 0.5
            });
        }

        // Foreground layer - large blurred nodes (bokeh)
        this.foregroundNodes = [];
        for (let i = 0; i < 15; i++) {
            this.foregroundNodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 10 + 8,
                opacity: Math.random() * 0.1 + 0.03
            });
        }

        // Dust particles - atmospheric shimmer
        this.dustParticles = [];
        for (let i = 0; i < 80; i++) {
            this.dustParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: Math.random() * 1 + 0.3,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }

    updateNode(node) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -50) node.x = this.canvas.width + 50;
        if (node.x > this.canvas.width + 50) node.x = -50;
        if (node.y < -50) node.y = this.canvas.height + 50;
        if (node.y > this.canvas.height + 50) node.y = -50;
    }

    animate() {
        // Deep space gradient background
        const bgGradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
        );
        bgGradient.addColorStop(0, '#0d1a2d');
        bgGradient.addColorStop(0.5, '#0a1525');
        bgGradient.addColorStop(1, '#050a12');

        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // === LAYER 1: Background blurred nodes (bokeh) ===
        this.backgroundNodes.forEach(node => {
            this.updateNode(node);

            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 4
            );
            gradient.addColorStop(0, `rgba(100, 150, 255, ${node.opacity})`);
            gradient.addColorStop(0.5, `rgba(80, 120, 220, ${node.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(50, 100, 200, 0)');

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        // === LAYER 2: Atmospheric dust ===
        const time = Date.now() * 0.001;
        this.dustParticles.forEach(dust => {
            this.updateNode(dust);

            const twinkle = Math.sin(time * 3 + dust.twinklePhase) * 0.5 + 0.5;
            const alpha = twinkle * 0.4;

            this.ctx.beginPath();
            this.ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(180, 210, 255, ${alpha})`;
            this.ctx.fill();
        });

        // === LAYER 3: Main network connections ===
        const maxDist = 180;
        for (let i = 0; i < this.midgroundNodes.length; i++) {
            for (let j = i + 1; j < this.midgroundNodes.length; j++) {
                const dx = this.midgroundNodes[i].x - this.midgroundNodes[j].x;
                const dy = this.midgroundNodes[i].y - this.midgroundNodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDist) {
                    const opacity = 0.5 * (1 - distance / maxDist);

                    // Create gradient line
                    const lineGrad = this.ctx.createLinearGradient(
                        this.midgroundNodes[i].x, this.midgroundNodes[i].y,
                        this.midgroundNodes[j].x, this.midgroundNodes[j].y
                    );
                    lineGrad.addColorStop(0, `rgba(100, 180, 255, ${opacity})`);
                    lineGrad.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.7})`);
                    lineGrad.addColorStop(1, `rgba(0, 200, 255, ${opacity})`);

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.midgroundNodes[i].x, this.midgroundNodes[i].y);
                    this.ctx.lineTo(this.midgroundNodes[j].x, this.midgroundNodes[j].y);
                    this.ctx.strokeStyle = lineGrad;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        // === LAYER 4: Main network nodes with glow ===
        this.midgroundNodes.forEach(node => {
            this.updateNode(node);

            // Node glow
            const glowGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 6
            );
            glowGradient.addColorStop(0, `rgba(150, 200, 255, ${node.brightness * 0.8})`);
            glowGradient.addColorStop(0.3, `rgba(100, 150, 255, ${node.brightness * 0.4})`);
            glowGradient.addColorStop(1, 'rgba(50, 100, 200, 0)');

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
            this.ctx.fillStyle = glowGradient;
            this.ctx.fill();

            // Bright core
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(220, 240, 255, ${node.brightness})`;
            this.ctx.fill();
        });

        // === LAYER 5: Foreground blurred nodes (bokeh) ===
        this.foregroundNodes.forEach(node => {
            this.updateNode(node);

            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 3
            );
            gradient.addColorStop(0, `rgba(120, 180, 255, ${node.opacity})`);
            gradient.addColorStop(0.4, `rgba(100, 150, 255, ${node.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(80, 120, 220, 0)');

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// === NAVBAR SCROLL ===
class NavbarController {
    constructor() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }
}

// === SMOOTH SCROLL ===
class SmoothScroller {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
    }
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork();
    new NavbarController();
    new SmoothScroller();
    console.log('🚀 Portfolio loaded!');
});
