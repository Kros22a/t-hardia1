// Animación 3D básica con Three.js
let scene, camera, renderer, particles;

function initThreeJS() {
    // Crear escena
    scene = new THREE.Scene();
    
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
    
    // Iniciar animación
    animate();
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
}

function createParticles() {
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createHardwareGeometry() {
    // Crear formas geométricas que representen componentes de hardware
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.1),
        new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32),
        new THREE.TorusGeometry(0.4, 0.1, 16, 100)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x4ecdc4, wireframe: true }),
        new THREE.MeshBasicMaterial({ color: 0x45b7d1, wireframe: true })
    ];
    
    for (let i = 0; i < 5; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        mesh.rotationSpeed = {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02,
            z: Math.random() * 0.02
        };
        
        scene.add(mesh);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotar partículas
    if (particles) {
        particles.rotation.y += 0.001;
    }
    
    // Rotar geometrías de hardware
    scene.children.forEach(child => {
        if (child.rotationSpeed) {
            child.rotation.x += child.rotationSpeed.x;
            child.rotation.y += child.rotationSpeed.y;
            child.rotation.z += child.rotationSpeed.z;
        }
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', initThreeJS);
