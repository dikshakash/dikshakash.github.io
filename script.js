// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, .info-item, .timeline-item');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Slight delay for follower
    setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }, 50);
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
    });
});

// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// --- Typing Effect ---
const typingText = document.querySelector('.typing-text');
const skills = ["Python Developer", "Data Analyst", "Machine Learning Enthusiast", "Problem Solver"];
let skillIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentSkill = skills[skillIndex];
    
    if (isDeleting) {
        typingText.textContent = currentSkill.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentSkill.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentSkill.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        skillIndex = (skillIndex + 1) % skills.length;
        typeSpeed = 500; // Pause before typing next
    }
    
    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    if(typingText) setTimeout(typeEffect, 1000);
});


// --- Animated Counters ---
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
};

// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Trigger counters when About section in view
ScrollTrigger.create({
    trigger: '#about',
    start: 'top 70%',
    onEnter: animateCounters,
    once: true
});

// Animate Sections
const sectionsToAnimate = ['#about', '#skills', '#projects', '#experience', '#education', '#contact'];

sectionsToAnimate.forEach(sec => {
    gsap.from(sec + ' .section-title', {
        scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Animate project cards stagger
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '#projects',
        start: 'top 70%',
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Animate timeline items
gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.fromTo(item, 
        { opacity: 0, x: item.classList.contains('right') ? 50 : -50 },
        {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out'
        }
    );
});


// --- Vanilla Tilt Init ---
// Will be initialized via the CDN automatically with 'data-tilt' attributes


// --- Three.js Background Canvas Setup ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across a wide area
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x3b82f6, // Neon Blue
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 15;

// Mouse tracking for subtle parallax on particles
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation loop background
const clock = new THREE.Clock();

const animateBackground = () => {
    requestAnimationFrame(animateBackground);
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate particles slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;
    
    // Interactive parallax
    particlesMesh.position.x += (mouseX * 5 - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (-mouseY * 5 - particlesMesh.position.y) * 0.05;

    renderer.render(scene, camera);
};

animateBackground();


// --- Three.js Skills Sphere Setup ---
const initSkillsSphere = () => {
    const container = document.getElementById('skills-canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const sceneSkill = new THREE.Scene();
    const cameraSkill = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderSkill = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderSkill.setSize(width, height);
    renderSkill.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderSkill.domElement);

    // Create a wireframe sphere or abstract 3D object to represent skills
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    // Edges geometry for futuristic wireframe look
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3b82f6, 
        linewidth: 2,
        transparent: true,
        opacity: 0.7
    });
    const icosahedron = new THREE.LineSegments(edges, lineMaterial);
    
    // Inner glows
    const innerGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x0f172a, // Navy Blue
        transparent: true,
        opacity: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    
    const group = new THREE.Group();
    group.add(icosahedron);
    group.add(innerMesh);
    
    sceneSkill.add(group);

    cameraSkill.position.z = 4;

    const animateSkills = () => {
        requestAnimationFrame(animateSkills);
        
        group.rotation.x += 0.005;
        group.rotation.y += 0.01;
        
        // Add subtle floating effect
        group.position.y = Math.sin(Date.now() * 0.001) * 0.2;

        renderSkill.render(sceneSkill, cameraSkill);
    };

    animateSkills();

    // Resize handler for skills sphere
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        cameraSkill.aspect = newWidth / newHeight;
        cameraSkill.updateProjectionMatrix();
        renderSkill.setSize(newWidth, newHeight);
    });
};

initSkillsSphere();


// --- Global Resize Handler ---
window.addEventListener('resize', () => {
    // Update main background canvas
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Form submission handler
const form = document.getElementById('contact-form');
if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn span');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 3000);
        }, 1500);
    });
}
