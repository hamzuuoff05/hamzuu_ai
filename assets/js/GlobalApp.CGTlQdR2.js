import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Model loading function
async function loadModel(path) {
    const loader = new GLTFLoader();
    try {
        const gltf = await loader.loadAsync(path);
        return gltf.scene;
    } catch (error) {
        console.error('Error loading model:', error);
        return null;
    }
}

// Scene initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-wrapper').appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Set camera position
camera.position.z = 15;

const sceneConfig = {
    [Oe.HOMEPAGE]: {
        camera: { withCurve: true },
        scene: {
            cloudsVisible: true,
            mountainsVisible: true,
            skyVisible: true,
            flaresVisible: true,
            env: "homepage"
        },
        models: {
            airplane: { path: "/assets/models/airplane.glb" }
        }
    }
};

class HomepageScene extends THREE.Scene {
    constructor() {
        super();
        this.airplane = new THREE.Group();
        this.clouds = new THREE.Group();
    }

    async enter() {
        super.enter();
        E.webgl.mainScene.add(this.airplane);
        
        // Load and setup airplane
        const modelPath = '/assets/models/airplane.glb';
        const model = await loadModel(modelPath);
        if (model) {
            model.position.set(-15, 5, -10);
            model.scale.set(0.5, 0.5, 0.5);
            model.rotation.y = Math.PI / 2;
            this.airplane.add(model);

            // Add animation
            const animate = () => {
                if (model) {
                    // Move from left to right
                    model.position.x += 0.02;
                    
                    // Reset position when it reaches the right corner
                    if (model.position.x > 15) {
                        model.position.x = -15;
                    }
                    
                    // Gentle floating motion
                    model.position.y = 5 + Math.sin(Date.now() * 0.001) * 0.5;
                }
                requestAnimationFrame(animate);
            };
            animate();
        }
    }

    leave() {
        super.leave();
        E.webgl.mainScene.remove(this.airplane);
    }

    createScrollTimeline() {
        const timeline = super.createScrollTimeline();
        return timeline;
    }
}

// Add airplane animation to homepage
const airplaneModelPath = '/assets/models/airplane.glb';
const airplaneGroup = new THREE.Group();
E.webgl.mainScene.add(airplaneGroup);

loadModel(airplaneModelPath).then(model => {
  if (model) {
    model.position.set(-15, 5, -10);
    model.scale.set(0.5, 0.5, 0.5);
    model.rotation.y = Math.PI / 2;
    airplaneGroup.add(model);

    const animate = () => {
      if (model) {
        model.position.x += 0.02;
        if (model.position.x > 15) {
          model.position.x = -15;
        }
        model.position.y = 5 + Math.sin(Date.now() * 0.001) * 0.5;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 