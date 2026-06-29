// Particle Effect Setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const colors = [
    '#3b82f6', // Bright Blue
    '#60a5fa', // Light Blue
    '#1d4ed8', // Dark Blue
    '#0ea5e9', // Sky Blue
    '#06b6d4', // Cyan
    '#2563eb'  // Royal Blue
];

// Resize canvas to cover window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        
        // Random velocity in circular direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.gravity = 0.08;
        this.drag = 0.98;
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Sparkle particle that floats around
class Sparkle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.decay = Math.random() * 0.002 + 0.001;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;
        if (this.alpha <= 0 || this.y < -10) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize ambient sparkles
const sparkles = [];
for (let i = 0; i < 40; i++) {
    sparkles.push(new Sparkle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update ambient sparkles
    sparkles.forEach(sparkle => {
        sparkle.update();
        sparkle.draw();
    });

    // Draw and update explosion particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}
animate();

// Card interactivity
const card = document.getElementById('ideaCard');

// 1. Mouse Move Effect (3D Tilt & Spot Glow)
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set custom CSS properties for hover spotlight
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / 12; // tilt sensitivity
    const rotateY = (x - centerX) / 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
});

card.addEventListener('mouseleave', () => {
    card.style.transform = '';
});

// 2. Click Explosion Effect
card.addEventListener('click', (e) => {
    // Generate particle explosion at click coordinate
    const count = 40;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
    
    // Minor text bump effect
    const heading = document.getElementById('mainHeading');
    heading.style.transform = 'scale(0.95)';
    setTimeout(() => {
        heading.style.transform = '';
    }, 100);
});
