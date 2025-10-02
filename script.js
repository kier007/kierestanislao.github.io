// Cursor Trail Effect
class TrailParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 3;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            { r: 0, g: 240, b: 255 },     // Cyan
            { r: 255, g: 0, b: 255 },     // Magenta
            { r: 0, g: 255, b: 136 },     // Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.life})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.life})`;
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0 || this.size <= 0.5;
    }
}

let trailParticles = [];
let mouseX = 0;
let mouseY = 0;
let lastParticleTime = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const now = Date.now();
    if (now - lastParticleTime > 16) { // ~60fps
        // Create multiple particles for denser trail
        for (let i = 0; i < 3; i++) {
            trailParticles.push(new TrailParticle(
                mouseX + (Math.random() - 0.5) * 5,
                mouseY + (Math.random() - 0.5) * 5
            ));
        }
        lastParticleTime = now;
    }
});

// Three.js 3D Computer Model
const computerContainer = document.getElementById('computer-model');

if (computerContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    computerContainer.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00f0ff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x00ff88, 0.6, 100);
    pointLight3.position.set(0, 10, -10);
    scene.add(pointLight3);
    
    // Create a stylized computer/laptop
    const computerGroup = new THREE.Group();
    
    // Laptop base (keyboard)
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 3);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a2e,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.1,
        shininess: 100
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.1;
    computerGroup.add(base);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(3.8, 2.5, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0a0a0f,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.3,
        shininess: 100
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.5, -1.4);
    screen.rotation.x = -0.2;
    computerGroup.add(screen);
    
    // Screen glow/display
    const displayGeometry = new THREE.PlaneGeometry(3.5, 2.2);
    const displayMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.3
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 1.5, -1.35);
    display.rotation.x = -0.2;
    computerGroup.add(display);
    
    // Screen frame
    const frameGeometry = new THREE.BoxGeometry(3.9, 2.6, 0.05);
    const frameMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 1.5, -1.45);
    frame.rotation.x = -0.2;
    computerGroup.add(frame);
    
    // Keyboard keys (decorative)
    const keyGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.15);
    const keyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a3e,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.05
    });
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(-1.4 + i * 0.4, 0.1, -0.8 + j * 0.4);
            computerGroup.add(key);
        }
    }
    
    // Holographic particles around computer
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    computerGroup.add(particlesMesh);
    
    scene.add(computerGroup);
    
    // Position camera
    camera.position.z = 6;
    camera.position.y = 1;
    
    // Animation
    let time = 0;
    function animateComputer() {
        requestAnimationFrame(animateComputer);
        
        time += 0.01;
        
        // Rotate computer group slowly
        computerGroup.rotation.y = Math.sin(time * 0.3) * 0.3;
        computerGroup.rotation.x = Math.sin(time * 0.2) * 0.1;
        
        // Animate particles
        particlesMesh.rotation.y += 0.001;
        
        // Pulse the display
        display.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
        
        // Animate lights
        pointLight1.intensity = 1 + Math.sin(time) * 0.3;
        pointLight2.intensity = 0.8 + Math.sin(time * 1.5) * 0.2;
        
        renderer.render(scene, camera);
    }
    
    animateComputer();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Mathematical Background Animation
const canvas = document.getElementById('mathCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mathematical symbols and equations
const mathSymbols = [
    'π', 'Σ', '∫', '∂', '∞', 'α', 'β', 'γ', 'θ', 'λ', 'μ', 'Δ', '∇',
    '∑', '∏', '√', '∛', '≈', '≠', '≤', '≥', '±', '∓', '×', '÷',
    'sin', 'cos', 'tan', 'log', 'ln', 'lim', 'f(x)', 'dx', 'dy',
    '∈', '∉', '⊂', '⊃', '∪', '∩', '∅', 'ℝ', 'ℂ', 'ℕ', 'ℤ'
];

// Particle class for math symbols
class MathParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        this.speed = 0.2 + Math.random() * 0.5;
        this.size = 12 + Math.random() * 8;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += this.rotationSpeed;

        // Reset particle when it goes off screen
        if (this.y > canvas.height + 50) {
            this.y = -50;
            this.x = Math.random() * canvas.width;
            this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px 'Orbitron', monospace`;
        ctx.fillStyle = '#00f0ff';
        ctx.textAlign = 'center';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
    }
}

// Create particles
const particles = [];
const particleCount = 80;

for (let i = 0; i < particleCount; i++) {
    particles.push(new MathParticle());
}

// Animation loop with trail particles
function animateWithTrail() {
    // Create fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw math particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connecting lines between math particles
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Update and draw trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        trailParticles[i].update();
        trailParticles[i].draw(ctx);
        
        if (trailParticles[i].isDead()) {
            trailParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateWithTrail);
}

animateWithTrail();

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

// Active navigation highlight on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and animated elements
document.querySelectorAll('.about-card, .skill-category, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Typing effect for subtitle
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

// Skill bars animation on scroll
const skillBars = document.querySelectorAll('.progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 200);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.home-content');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Glitch effect on hover
const glitchElements = document.querySelectorAll('.glitch');
glitchElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.animation = 'glitch 0.3s infinite';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.animation = 'glitch 3s infinite';
    });
});

// Project cards hover effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = '#00f0ff';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(0, 240, 255, 0.3)';
    });
});

// Add particle interaction with mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseXCanvas = e.clientX - rect.left;
    const mouseYCanvas = e.clientY - rect.top;

    particles.forEach(particle => {
        const dx = mouseXCanvas - particle.x;
        const dy = mouseYCanvas - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }
    });
});

// Console easter egg
console.log('%c Welcome to Kier Estanislao\'s Portfolio! ', 'background: #00f0ff; color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c AI Engineer & Developer ', 'background: #0a0a0f; color: #00f0ff; font-size: 16px; padding: 5px;');
console.log('%c Check out my projects on GitHub! ', 'color: #00ff88; font-size: 14px;');
