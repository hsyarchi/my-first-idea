// Particle Effect Setup
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#0ea5e9', // Sky Blue
    '#10b981'  // Emerald
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
        ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
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

// 3. 'Next Sentence' Button Click Logic
const nextBtn = document.getElementById('nextBtn');
const sentences = [
    {
        text: "오늘도 힘내세요!",
        start: "#a7f3d0", // Light Green / Emerald 200
        end: "#10b981", // Emerald 500
        hoverStart: "#064e3b", // Dark Green / Emerald 900
        hoverEnd: "#022c22", // Emerald 950
        glow: "rgba(16, 185, 129, 0.25)",
        glowHover: "rgba(6, 78, 59, 0.35)",
        textGlow: "rgba(16, 185, 129, 0.15)"
    },
    {
        text: "당신의 도전을 응원합니다.",
        start: "#86efac", // Light Green / Green 300
        end: "#22c55e", // Green 500
        hoverStart: "#14532d", // Dark Green / Green 900
        hoverEnd: "#052e16", // Green 950
        glow: "rgba(34, 197, 94, 0.25)",
        glowHover: "rgba(20, 83, 45, 0.35)",
        textGlow: "rgba(34, 197, 94, 0.15)"
    },
    {
        text: "할 수 있어요, 천천히 가도 괜찮아요.",
        start: "#67e8f9", // Light Mint/Cyan
        end: "#0d9488", // Teal 600
        hoverStart: "#115e59", // Dark Teal 800
        hoverEnd: "#0f766e", // Teal 700
        glow: "rgba(13, 148, 136, 0.25)",
        glowHover: "rgba(17, 94, 89, 0.35)",
        textGlow: "rgba(13, 148, 136, 0.15)"
    },
    {
        text: "오늘 하루도 멋지게 만들어봐요.",
        start: "#bef264", // Lime 300
        end: "#84cc16", // Lime 500
        hoverStart: "#3f6212", // Dark Lime 800
        hoverEnd: "#1a2e05", // Lime 950
        glow: "rgba(132, 204, 22, 0.25)",
        glowHover: "rgba(63, 98, 18, 0.35)",
        textGlow: "rgba(132, 204, 22, 0.15)"
    },
    {
        text: "가장 빛나는 별은 아직 뜨지 않았어요.",
        start: "#a7f3d0", // Emerald 200
        end: "#059669", // Emerald 600
        hoverStart: "#064e3b", // Emerald 900
        hoverEnd: "#022c22", // Emerald 950
        glow: "rgba(5, 150, 105, 0.25)",
        glowHover: "rgba(6, 78, 59, 0.35)",
        textGlow: "rgba(5, 150, 105, 0.15)"
    },
    {
        text: "당신의 아이디어는 위대합니다.",
        start: "#34d399", // Emerald 400
        end: "#047857", // Emerald 700
        hoverStart: "#0f172a", // Dark Slate 900
        hoverEnd: "#1e293b", // Slate 800
        glow: "rgba(52, 211, 153, 0.25)",
        glowHover: "rgba(15, 23, 42, 0.35)",
        textGlow: "rgba(52, 211, 153, 0.15)"
    }
];
let currentSentenceIndex = 0;

// Function to update the page theme colors dynamically
function updateTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--theme-color-start', theme.start);
    root.style.setProperty('--theme-color-end', theme.end);
    root.style.setProperty('--theme-hover-start', theme.hoverStart);
    root.style.setProperty('--theme-hover-end', theme.hoverEnd);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-glow-hover', theme.glowHover);
    root.style.setProperty('--theme-text-glow', theme.textGlow);
}

// Initial theme update for first sentence
updateTheme(sentences[0]);

nextBtn.addEventListener('click', (e) => {
    // Prevent triggering parent card click event (avoids double explosion)
    e.stopPropagation();
    
    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
    const currentTheme = sentences[currentSentenceIndex];
    const heading = document.getElementById('mainHeading');
    
    // Text scale & opacity change transition
    heading.style.transform = 'scale(0.9)';
    heading.style.opacity = '0';
    heading.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
    
    setTimeout(() => {
        heading.textContent = currentTheme.text;
        
        // Update variables before showing the text so the color transitions smoothly
        updateTheme(currentTheme);
        
        heading.style.transform = 'scale(1)';
        heading.style.opacity = '1';
    }, 150);
    
    // Generate celebration particles at button center
    const rect = nextBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const count = 30;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(btnCenterX, btnCenterY));
    }
});


