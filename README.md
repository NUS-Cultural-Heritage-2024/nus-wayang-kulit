# Wayang Kulit Interface
An interactive digital wayang kulit prototype built with [Threejs](https://threejs.org).

## Overview
This project is an attempt at virtualizing the Wayang Kulit practise, using in-browser locally run javascript together with a machine vision object detection model in python to simulate a wayang kulit puppet show in the absence of physical puppets. 

<img width="550" align="right" alt="image" src="https://github.com/user-attachments/assets/9e5e0f86-15d6-44f7-85ab-f973e17aaa5f" />

This `README` only covers the interface (front-end) side of the project. The machine learning (back-end) of the project is yet to be integrated into the final application.

### Credits
- Project Director: [MIGUEL ESCOBAR VARELA](https://github.com/villaorlado), Centre for Computational Social Science and Humanities, NUS (@
- Software Engineer: [C MAHIDHARAH RAJENDRAN](https://github.com/Mahidharah), School of Computing, NUS (@Mahidharah)
- Software Engineer: [RUBESH SURESH](https://github.com/sp4ce-cowboy), College of Design and Engineering, NUS (@sp4ce-cowboy)

## 1. User Guide
### 1.1. Installation Prerequisites
- Node.js and npm (for package management and running scripts)
- A modern web browser (for testing and running the application)
- A code editor (e.g., Visual Studio Code)

You need a development environment with npm installed before proceeding to the installation steps below.

### 1.2. Installation
1. Clone the repository
```bash
git clone <repository-url>
cd nus-wayang-kulit
cd src
```
2. Within the src folder, run the package installation commands to install the dependencies.
```bash
npm install
```
3. Run the development server. Access the URL entered to visit the rendered web application.
```bash
npm run dev
```
4. If the puppet seems to be missing some body parts, simply reload the webpage. This is caused by a suspected bug from WebGL renderer.

### 1.3. Control Panel
The `src/common/ControlPanel.js` file contains some user-configurable settings.

```js
export const IS_SIMULATION_ACTIVE = false; // Set to false to disable the simulation
export const IS_MANUAL_PUPPET_INPUT = false; // Set to true to input custom puppets
export const SHOW_HELPERS = false; // Set to true to show pivot helpers
```

These settings are boolean values that allow certain code functionality to be turned on and turned off.
  
- The `IS_SIMULATION_ACTIVE` flag will enable or disable the simulated movements as indicated under the `runTestSequence()` function inside `src/tests/Simulation.js`
<img width="450" align="right" alt="image" src="https://github.com/user-attachments/assets/1cc579e1-24cc-455c-8bb7-115776f3da37" />

- The `SHOW_HELPERS` flag will allow for the pivot helpers to be shown during the rendering, which will be useful for calibration of a new puppet as mentioned below.

- The `IS_MANUAL_PUPPET_INPUT` flag will ask each time for a puppet to be entered with a pop-up as shown on the right. If this is set to false, the default `puppet_01` will be loaded.


### 1.4. Manual Controls
By default, the renderer uses inverse kinematics to calculate the position of the armature angles dependent upon the mouse cursor position. However, it is possible to individually control the arms using pre-defined keybindings. These keybindings operate concurrently and independently of each other, which means that you can move the puppet in all 9-directions if you wish, whch is not available with the cursor tracking alternative.

- `up, down, left, right` arrow keys move the puppet across the screen accordingly, within the limits imposed in the puppet's defining json file (explained below).
- `.` and `,` move the puppet closer to and away from the screen accordingly, with the same limits applying.
- `W` and `S` rotate the puppet across the axis running horizontally parallel to the screen.
- `A` and `D` rotate the puppet across the axis running vertically parallel to the screen.
- `Q` and `E` rotate the puppet across the axis running "into" the screen, perpendicular to both axes mentioned above.
- `H` and `L` rotate the arm of the puppet, when mouse input is disabled.
- `J` and `K` rotate the hand of the puppet, when mouse input is disabled.
- `X` resets the puppet back to it's original state and empties all currently active keybindings. (i.e. if `X` is pressed at any time, the puppet resets and ignores all other keys being presses at that time.

For the dimensions that are not involved with cursor tracking, such as moving the whole puppet "into" and "out" of the screen, or up, down, left and right of the screen, the keyboard inputs can be used concurrently with the cursor movements. For keys that manipulate the arm and hand of the puppet, they are only active when the cursor tracking is disabled, which is not currently possible through the Control Panel.

The configurations for these keybindings can be found in `src/common/EventHandlers.js` which can be modified as desired.

### 1.5. Custom Puppet Calibration
#### 1.5.1 Assets Directory
The `src/assets` directory contains all the information required for each puppet to be rendered properly. The files must be placed in accordance with the requirements herein specified to ensure that all the models load properly, and no path issues arise. The `archived_assets` folder contains useful assets that do not correspond to any specific puppet.

#### 1.5.2 Folder Structure Example
```text
puppet_01
├── images
│   ├── arm.png
│   ├── body.png
│   ├── hand.png
│   └── stick.png
├── models
│   ├── arm
│   │   ├── Image_0.jpg
│   │   ├── arm.mtl
│   │   ├── arm.obj
│   │   └── puppet_01_arm.png
│   ├── body
│   │   ├── Image_0.png
│   │   ├── body.mtl
│   │   └── body.obj
│   └── hand
│       ├── Image_0.jpg
│       ├── hand.mtl
│       ├── hand.obj
│       └── hand.png
└── puppet_01.json
```

#### 1.5.3 Folder Structure Explanation

Within the assets folder, all resources relevant to a particular puppet shall be constrainted to a folder called `puppet_XX` where XX is the id of the puppet, which is arbitrary and assigned sequentially for now.

Within the `puppet_XX` folder, there are 2 sub-directories which are `images` and `models`.

Inside `images` are the `png` files for each component of the puppet. Currently, these are the arm, hand, body, and optionally, the stick. They shall be titled simply as shown above.

Inside `models` are 3 more sub-directories, corresponding to the arm, body, and hand. Within those directories are all the files needed for their `.obj` rendering including all material files and image files associated with those materials. Make copies of image files wherever possible to the relevant folder, and ensure that within the `mtl` file, all image references are local and no absolute paths are used.

Inside each sub-folder within `models`, there minimally must be 2 files:

1. `part.obj`
2. `part.mtl`

These two files must be named exactly the same as their folders.

#### 1.5.4 JSON file Explanation

Within each `puppet_XX` folder, there is a `puppet_xx.json` file at the root level. This file dictates specific positioning constants that are dependent on the specfic 3d model used. When a new 3d-model is imported, this file needs to be adjusted firstly with the correct paths and names, and secondly with manual adjustments of the relevant positions and rotations.

```json
{
    "body": {
        "path": "./assets/puppet_01/models/body/body.obj",
        "material": "./assets/puppet_01/models/body/body.mtl",
        "scale": [1, 1, 1],
        "position": [0, 0, 0],
        "rotation": [1.7, 0, 0]
    },
    "arm": {
        "path": "./assets/puppet_01/models/arm/arm.obj",
        "material": "./assets/puppet_01/models/arm/arm.mtl",
        "scale": [0.07, 0.07, 0.05],
        "position": [0, 0, 0.05],
        "rotation": [-1.7, -1.7, -0.2],
        "pivotPosition": [-0.08, 0.01, -0.07],
        "pivotRotation": [0, 0, 0]
    },
    "hand": {
        "path": "./assets/puppet_01/models/hand/hand.obj",
        "material": "./assets/puppet_01/models/hand/hand.mtl",
        "scale": [0.08, 0.08, 0.07],
        "position": [-0.025, 0.01, 0.055],
        "rotation": [-1.7, -1.7, -0.2],
        "pivotPosition": [0, 0, 0.11],
        "pivotRotation": [0, 0, 0]
    },
    "limits": {
        "x": { "min": -10, "max": 10 },
        "y": { "min": -5, "max": 5 },
        "z": { "min": -50, "max": 35 }
    }
}
```

## 2. Developer Guide
### 2.1. Technical Environment
This project is a web-based application that involves handling events and rendering for a simulation or animation system. It uses HTML5, some CSS, and JavaScript for the front-end development. The project is structured to handle various events, perform inverse kinematics calculations, and render 2D models in a 3D space, with possible expansion for movements beyond 2 dimensions.

### 2.2. Repo Structure & Core Files
```text
src/
└── styles.css (main css styling, primarily use to disable scrolling)
├── index.html (main UI and injection point for main script)
├── main.js (main javascript invoked by index.html)
├── assets/
│   └── ... (images, models, and other static assets)
├── common/
|   ├── Constants.js (Project constant values)
|   ├── ControlPanel.js  (As mentioned above)
|   ├── EventHandlers.js (Keybindings and cursor handling)
|   ├── InfoDisplay.js (Contains all logic for information rendering in html)
│   └── InverseKinematics.js (As mentioned above)
├── src/
│   ├── js/
│   │   └── style.css
│   │   ├── EventHandlers.js
│   │   ├── EventHandlersIK.js
│   │   ├── EventHandlerOld.js
│   │   ├── InverseKinematics.js
│   │   ├── main.js
│   │   ├── MouseTracker.js
│   │   ├── PuppetPart2D.js
│   │   └── ControlPanel.js
│   └── index.html
├── tests/
│   └── Simulation.js
├── ...
```

### 2.3. Vite Configuration
Within the `src` folder, the current Vite configuration is given in `vite.config.js`.
```javascript
export default {
  server: {
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 5174 // or your specified port
  }
}
```
This configuration allows for the application to be discovered on any browser-capable device connected to the same Network. Simply enter the IP address and port number indicated by Vite in the terminal after running `npm run dev` into the URL bar of the browser on the other device. 

### 2.4. The Puppet Class
In line with OOP principles, the following class encapsulates all logic required for an operational puppet, including such asynchronously loading commonly present in code the involves 3d-model rendering.

```javascript
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';

/**
* PuppetPart class to load and display 3D objects with materials.
*/
export class PuppetPart3D {
    constructor(objPath, mtlPath, scaleFactorX = 1, scaleFactorY = 1, scaleFactorZ = 1) {
        this.objPath = objPath;
        this.mtlPath = mtlPath;
        this.mtlLoader = new MTLLoader();
        this.objLoader = new OBJLoader();
        this.scaleFactorX = scaleFactorX;
        this.scaleFactorY = scaleFactorY;
        this.scaleFactorZ = scaleFactorZ;
        this.mesh = null;
        
        this.loadModel(() => {
            this.onReady(); // Trigger the callback when the model is ready
        });
    }
    
    loadModel(callback) {
        this.mtlLoader.load(
            this.mtlPath,
            (materials) => {
                materials.preload();
                this.objLoader.setMaterials(materials);
                this.objLoader.load(
                    this.objPath,
                    (object) => {
                        this.mesh = object;
                        this.mesh.scale.set(this.scaleFactorX, this.scaleFactorY, this.scaleFactorZ);
                        
                        // Ensure the materials are properly applied to all child meshes
                        this.mesh.traverse((child) => {
                            if (child.isMesh) {
                                child.material = materials.materials[child.name] || child.material;
                                child.material.needsUpdate = true; // Force update
                            }
                        });
                        callback(); // Call the callback after the model is loaded
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading the OBJ model:', error);
                    }
                );
            },
            undefined,
            (error) => {
                console.error('Error loading the MTL file:', error);
            }
        );
    }
    
    onReady() {
        // This method can be overridden when the model is ready
    }
    
    addToParent(parent) {
        if (this.mesh) {
            parent.add(this.mesh);  // Add this mesh to the parent group
        }
    }
    
    addToScene(scene) {
        if (this.mesh) {
            scene.add(this.mesh);
        }
    }
    
    setPosition(x, y, z) {
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }
    
    setRotation(x, y, z) {
        if (this.mesh) {
            this.mesh.rotation.set(x, y, z);
        }
    }

    getYRotation() {
        if (this.mesh) {
            return this.mesh.rotation.y;
        } else {
            return 0
        }
    }
    
    move(x, y, z) {
        if (this.mesh) {
            this.mesh.position.x += x;
            this.mesh.position.y += y;
            this.mesh.position.z += z;
        }
    }
    
    rotate(x, y, z) {
        if (this.mesh) {
            this.mesh.rotation.x += x;
            this.mesh.rotation.y += y;
            this.mesh.rotation.z += z;
        }
    }
}
```

### 2.5. Inverse Kinematics
The logic for the inverse kinematics functions are as follows.

1. Find mouse position on screen.
2. Determine if this mouse position is within max radius
   1. If it is not, find the max position possible and return this
   2. If it is not, then just return
3. Take the value from 2 and calculate the distance between the shoulder joint and this position
4. Use this value, together with the length of the arm and the hand
5. Once the 3 distances have been determined, use cosine rule to find armAngle and handAngle
6. **Apply the angle rotations at the arm, and the hand. (i.e. ArmPivot and HandPivot)**
7. Put this whole thing in a loop upon mouse movement.

This translates to code like this: (as can be found in the `src/common/InverseKinematics.js` file.
```js
import * as THREE from 'three';

import {
    mousePosition,
    armToEndDistance,
    armToHandDistance,
    handToEndDistance
} from './EventHandlers.js';

export function applyInverseKinematics(customMousePosition, targetDistance, armPivot, handPivot, body) {
    //console.log('Initial state of body:', body);
    const armAngle = calculateAngleWithCosineRule(armToHandDistance, targetDistance, handToEndDistance);
    const handAngle = calculateAngleWithCosineRule(handToEndDistance, armToHandDistance, targetDistance);

    let bodyAngle = body.getYRotation();

    const offsetArmAngle = getOffsetAngleForArmPivot(customMousePosition, armPivot);
    const totalArmAngle = armAngle + offsetArmAngle + Math.PI / 2 - bodyAngle;
    const totalHandAngle = handAngle - Math.PI; // + Math.PI // + (3 * Math.PI / 4);

    //const totalHandAngle = handAngle + armAngle + Math.PI;

    displayAngle(totalArmAngle, totalHandAngle, bodyAngle);

    armPivot.rotation.y = totalArmAngle;
    handPivot.rotation.y = totalHandAngle;
}

export function calculateAngleWithCosineRule(leftA, rightB, oppositeC) {
    // Ensure distances are valid
    const numerator = Math.pow(leftA, 2) + Math.pow(rightB, 2) - Math.pow(oppositeC, 2);
    const denominator = 2 * leftA * rightB;

    // Handle potential precision issues
    let cosAngleFraction = numerator / denominator;

    // Clamp the value to avoid NaN errors due to floating-point precision
    cosAngleFraction = Math.min(1, Math.max(-1, cosAngleFraction));

    const angle = Math.acos(cosAngleFraction); // Angle in radians

    return angle;
}

export function getOffsetAngleForArmPivot(targetPosition, armPivot) {
    const armPivotPosition = new THREE.Vector3();
    armPivot.getWorldPosition(armPivotPosition);

    // Calculate the vector from the arm pivot to the target position
    targetPosition = new THREE.Vector3().subVectors(targetPosition, armPivotPosition);

    const angle = Math.atan2(targetPosition.y, targetPosition.x);
    return angle
}
...
```
## 3. Project Reflections
- Some challenges we faced and how we solve
  - Getting the math right
  - Learning new tools (Blender)
  - Lack of available tools for inverse kinematics (having to make do)
  - Technical Problems (Problem Space) & Technical Solutions (Solution Space)

