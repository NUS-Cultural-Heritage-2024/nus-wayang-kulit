import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';
import { setupEventListeners } from './common/EventHandlers.js';


// Function to load the JSON configuration
async function loadPuppetConfig(puppetName) {
    const response = await fetch(`./assets/${puppetName}/${puppetName}.json`);
    if (!response.ok) {
        throw new Error(`Failed to load config for puppet: ${puppetName}`);
    }
    return await response.json();
}

async function init(puppetName) {
    try {
        const config = await loadPuppetConfig(puppetName);
        
        // Initialize the body, arm, and hand using data from the JSON file
        const body = new PuppetPart3D(config.body.path, config.body.material, ...config.body.scale);
        const arm = new PuppetPart3D(config.arm.path, config.arm.material, ...config.arm.scale);
        const hand = new PuppetPart3D(config.hand.path, config.hand.material, ...config.hand.scale);
        
        const armPivot = new THREE.Group();
        const handPivot = new THREE.Group();
        
        const armPivotHelper = new THREE.AxesHelper(0.1);
        const handPivotHelper = new THREE.AxesHelper(0.1);
        
        armPivot.add(armPivotHelper);
        handPivot.add(handPivotHelper); 
        
        body.onReady = () => {
            body.addToScene(scene);
            body.setPosition(...config.body.position);
            body.setRotation(...config.body.rotation);
            
            arm.onReady = () => {
                armPivot.add(arm.mesh);
                arm.mesh.position.set(...config.arm.position);
                armPivot.position.set(...config.arm.pivotPosition);
                arm.setRotation(...config.arm.rotation);
                body.mesh.add(armPivot);
                
                hand.onReady = () => {
                    handPivot.add(hand.mesh);
                    hand.mesh.position.set(...config.hand.position);
                    handPivot.position.set(...config.hand.pivotPosition);
                    hand.setRotation(...config.hand.rotation);
                    armPivot.add(handPivot);
                };
            };
        };
        
        setupEventListeners({
            body, armPivot, handPivot, renderer, camera
        }, config.limits);

    } catch (error) {
        console.error(error);
        alert(`Failed to load puppet: ${puppetName}`);
    }
}

const puppetName = 'puppet_01';  // Hardcoded puppet name
init(puppetName)
//const puppetName = prompt("Enter the puppet name (e.g., 'puppet_01'):");

/*if (puppetName) {
    init(puppetName);
} else {
    alert('Puppet name is required!');
}*/


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Color and intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();


// -------------------------------------------
// Place the simulation code below this line
// -------------------------------------------

// Helper function to simulate key events
function simulateKeyEvent(key, eventType = 'keydown') {
    const event = new KeyboardEvent(eventType, { key });
    document.dispatchEvent(event);
}

// Example: Simulate a sequence of key presses (up, down, left, right)
function runTestSequence() {
    console.log('Running test sequence...');

    // Simulate pressing 'ArrowUp', 'ArrowDown', 'h', and 'k'
    simulateKeyEvent('ArrowUp');
    setTimeout(() => simulateKeyEvent('ArrowDown'), 500);
    setTimeout(() => simulateKeyEvent('h'), 1000);
    setTimeout(() => simulateKeyEvent('k'), 1500);

    // Simulate releasing the keys
    setTimeout(() => simulateKeyEvent('ArrowUp', 'keyup'), 2000);
    setTimeout(() => simulateKeyEvent('ArrowDown', 'keyup'), 2500);
    setTimeout(() => simulateKeyEvent('h', 'keyup'), 3000);
    setTimeout(() => simulateKeyEvent('k', 'keyup'), 3500);
}

// Trigger the test sequence 3 seconds after the page loads
window.addEventListener('load', () => {
    setTimeout(runTestSequence, 2000);
});