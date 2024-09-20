import * as THREE from 'three';
import * as CANNON from 'cannon';

// Set up Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Create a camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 30;
scene.add(camera);

// Create the canvas and renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0x000000);  // Set background to black (hex: 0x000000)
document.body.appendChild(renderer.domElement);

// Remove margins and padding via CSS
document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.overflow = 'hidden';  // Disable scrolling

// Ensure the canvas resizes to fill the whole screen
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// Set up Cannon.js physics world
const world = new CANNON.World();
// Turn off gravity
world.gravity.set(0, 0, 0);  // Disable gravity

// Create a ground plane for the scene (optional, invisible in this case)
const groundBody = new CANNON.Body({
    mass: 0,  // Static object
    shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);  // Rotate to lay flat
world.addBody(groundBody);

// Helper function to create a box with both Cannon.js (physics) and Three.js (visual)
function createBox(width, height, depth, position, mass = 1, color = 0x00ff00) {
    // Three.js part
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Cannon.js part
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({ mass });
    body.addShape(shape);
    body.position.copy(position);
    world.addBody(body);

    return { mesh, body };
}

// 1. Create the Body (square body with depth)
const bodyWidth = 3, bodyHeight = 3, bodyDepth = 0.5;
const bodyPosition = new CANNON.Vec3(0, 5, 0);  // Set body initial position
const puppetBody = createBox(bodyWidth, bodyHeight, bodyDepth, bodyPosition, 0, 0xff0000);  // Body is static

// 2. Create Rectangular Cuboids (Arms)
const armWidth = 1, armHeight = 4, armDepth = 0.2;
const armOffset = -5;  // Distance from the body’s center to the hinges

// Set Z offset for the arms to position them on top of the body along the Z-axis
const zOffset = 0.6;  // Adjust the Z-offset as needed (must be slightly larger than the body depth)

// Create the top-left arm
const topLeftArmPosition = new CANNON.Vec3(-armOffset, bodyPosition.y, zOffset);
const topLeftArm = createBox(armWidth, armHeight, armDepth, topLeftArmPosition, 1, 0x0000ff);

// Create the top-right arm
const topRightArmPosition = new CANNON.Vec3(armOffset, bodyPosition.y, zOffset);
const topRightArm = createBox(armWidth, armHeight, armDepth, topRightArmPosition, 1, 0x0000ff);

// 3. Add Hinges to the Arms
const hinge1 = new CANNON.HingeConstraint(puppetBody.body, topLeftArm.body, {
    pivotA: new CANNON.Vec3(-bodyWidth / 2, bodyHeight / 2, 0),  // Top-left corner of the body
    axisA: new CANNON.Vec3(0, 0, 1),  // Rotation axis (z-axis)
    pivotB: new CANNON.Vec3(0, -armHeight / 2, 0),  // Hinge point at bottom of the arm
    axisB: new CANNON.Vec3(0, 0, 1)   // Rotation axis for the arm (z-axis)
});
world.addConstraint(hinge1);

const hinge2 = new CANNON.HingeConstraint(puppetBody.body, topRightArm.body, {
    pivotA: new CANNON.Vec3(bodyWidth / 2, bodyHeight / 2, 0),  // Top-right corner of the body
    axisA: new CANNON.Vec3(0, 0, 1),
    pivotB: new CANNON.Vec3(0, -armHeight / 2, 0),
    axisB: new CANNON.Vec3(0, 0, 1)
});
world.addConstraint(hinge2);

// 4. Animation loop to synchronize the Cannon.js and Three.js worlds
function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    world.step(1 / 60);

    // Synchronize the Three.js objects with Cannon.js physics bodies
    puppetBody.mesh.position.copy(puppetBody.body.position);
    puppetBody.mesh.quaternion.copy(puppetBody.body.quaternion);

    topLeftArm.mesh.position.copy(topLeftArm.body.position);
    topLeftArm.mesh.quaternion.copy(topLeftArm.body.quaternion);

    topRightArm.mesh.position.copy(topRightArm.body.position);
    topRightArm.mesh.quaternion.copy(topRightArm.body.quaternion);

    // Render the scene
    renderer.render(scene, camera);
}

animate();