// Animaciones avanzadas para la página
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    // Crear escena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 20);
    
    // Crear cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Crear renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Crear partículas para efecto de fondo
    createParticles();
    
    // Crear geometría de hardware (simplificada)
    createHardwareGeometry();
    
    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar animación
    animate();
}

function createParticles() {
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 40;
        
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createHardwareGeometry() {
    // Crear formas geométricas que representen componentes de hardware
    const geometries = [
        new THREE.BoxGeometry(0.3, 0.3, 0.05),
        new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32),
        new THREE.TorusGeometry(0.25, 0.05, 16, 100),
        new THREE.OctahedronGeometry(0.2),
        new THREE.DodecahedronGeometry(0.2)
    ];
    
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7];
    
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        mesh.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        mesh.oscillation = {
            amplitude: Math.random() * 0.5,
            speed: Math.random() * 0.01,
            offset: Math.random() * Math.PI * 2
        };
        
        scene.add(mesh);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotar partículas
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
    }
    
    // Rotar y oscilar geometrías de hardware
    const time = Date.now() * 0.001;
    scene.children.forEach(child => {
        if (child.rotationSpeed) {
            child.rotation.x += child.rotationSpeed.x;
            child.rotation.y += child.rotationSpeed.y;
            child.rotation.z += child.rotationSpeed.z;
            
            // Oscilación suave
            if (child.oscillation) {
                child.position.y += Math.sin(time * child.oscillation.speed + child.oscillation.offset) * child.oscillation.amplitude * 0.01;
            }
        }
    });
    
    // Mover cámara con el mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Inicializar cuando la página cargue
if (document.getElementById('three-canvas')) {
    document.addEventListener('DOMContentLoaded', initThreeJS);
}

// Animaciones CSS adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Animar elementos cuando entran en la vista
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card, .question-card, .blog-post, .stat-card').forEach(el => {
        observer.observe(el);
    });
    
    // Efecto de escritura para textos
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        const originalText = text.textContent;
        text.addEventListener('mouseover', () => {
            text.classList.add('glitch');
        });
        text.addEventListener('mouseout', () => {
            text.classList.remove('glitch');
        });
    });
});
