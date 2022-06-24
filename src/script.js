import "./style.css";
import * as THREE from "three";
import * as Tone from "tone";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { PixelShader } from "three/examples/jsm/shaders/PixelShader.js";
import { MathUtils } from "three";
import { MembraneSynth } from "tone";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};
const debugVars = {
    gravity: -9.8, // m/s^2
    // The upper limit of the range of impact velocities that can affect the impact sound.
    // Any impact velocities over this value will sound the same
    // TODO: consider making this dynamic, based on the expected max velocity
    impactVelocitySoundCeiling: 10, // m/s
    friction: 0.1,
    restitution: 0.8,
    synthesizeSound: true,
};

gui.add(debugVars, "gravity", -30, -3);
gui.add(debugVars, "impactVelocitySoundCeiling");
gui.add(debugVars, "friction");
gui.add(debugVars, "restitution");
gui.add(debugVars, "synthesizeSound");

debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5 + 0.1, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    });
};

gui.add(debugObject, "createSphere");

debugObject.createBox = () => {
    createBox(
        Math.random() + 0.01,
        Math.random() + 0.01,
        Math.random() + 0.01,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        }
    );
};
gui.add(debugObject, "createBox");

// Reset
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener("collide", playHitSound(object));
        world.removeBody(object.body);

        // Remove mesh
        scene.remove(object.mesh);
    }

    objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, "reset");

/**
 * Globals
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let composer, pixelPass;

const gameState = {
    sphereImpactNote: "C2",
    delayFeedback: 0.1,
    delayTime: 0.05,
    pixelSize: 2,
    noteIncrementOnBounce: 0,
};

gui.add(gameState, "sphereImpactNote");
gui.add(gameState, "delayFeedback", 0, 0.93);
gui.add(gameState, "delayTime");
gui.add(gameState, "pixelSize", 2, 28, 2);
gui.add(gameState, "noteIncrementOnBounce", -5, 5, 1);

/**
 * Sounds
 */

const bitCrushFX = new Tone.BitCrusher(
    (34 - gameState.pixelSize) / 2
).toDestination();

const feedbackFX = new Tone.FeedbackDelay(
    gameState.delayTime,
    gameState.delayFeedback
).connect(bitCrushFX);

// Reverb routes into bitcrush
const reverbFX = new Tone.Reverb().connect(bitCrushFX);

// Routes to feedback and reverb in parallel
const hitSampler = new Tone.Sampler({
    urls: { C3: "hit.mp3" },
    baseUrl: "/sounds/",
}).fan(feedbackFX, reverbFX);
// Routes to feedback and reverb in parallel
const hitSynth = new Tone.MembraneSynth().fan(feedbackFX, reverbFX);

// Plays the default material collision sound
const playHitSound = (object) => (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    // Value [0,1] for impact strength used to modulate
    // Current implementation is problematic
    const adjustedImpactStrength = THREE.MathUtils.mapLinear(
        Math.min(impactStrength, debugVars.impactVelocitySoundCeiling),
        0,
        debugVars.impactVelocitySoundCeiling,
        0,
        1
    );
    if (adjustedImpactStrength > 0.05) {
        // instrument to use
        const instrument = debugVars.synthesizeSound ? hitSynth : hitSampler;
        // Update Membrane Synth settings
        hitSynth.set({
            // Longer pitch decay on higher impact velocity bc it sounds weird
            pitchDecay: Math.max(debugVars.restitution * impactStrength, 0.001),
        });
        // console.log(instrument);
        // Fix for web audio context error, not sure if it actually helps anything though
        if (Tone.context.state !== "running") {
            Tone.context.resume();
        }
        // map from impactVelocity to volume. Set ceiling on max velocity to account for.
        // TODO: Logarithmic mapping will probably sound better
        // TODO: size of ball affects pitch?
        // Update BitCrush settings
        bitCrushFX.set({ bits: (34 - gameState.pixelSize) / 2 });
        // Update delay settings
        feedbackFX.set({
            delayTime: gameState.delayTime,
            feedback: gameState.delayFeedback,
        });

        // more reverb on high impact velocities
        reverbFX.set({
            // .001 minimum input for reverb decay
            decay: Math.max(adjustedImpactStrength * 2, 0.001),
        });
        // Possible feature: increment note for each hit
        instrument.triggerAttackRelease(
            Tone.Frequency(gameState.sphereImpactNote).transpose(
                object.transpose
            ),
            undefined,
            undefined,
            adjustedImpactStrength
        );
        // Weird feature that sounds kinda cool under the right conditions
        object.transpose += gameState.noteIncrementOnBounce;
    }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/1/px.jpg",
    "/textures/environmentMaps/1/nx.jpg",
    "/textures/environmentMaps/1/py.jpg",
    "/textures/environmentMaps/1/ny.jpg",
    "/textures/environmentMaps/1/pz.jpg",
    "/textures/environmentMaps/1/nz.jpg",
]);

// scene.background = environmentMapTexture;
/**
 * Physics
 */
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, debugVars.gravity, 0);

// Default material
const defaultMaterial = new CANNON.Material("default");
const updateDefaultMaterial = () => {
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: debugVars.friction,
            restitution: debugVars.restitution,
        }
    );
    world.defaultContactMaterial = defaultContactMaterial;
};
updateDefaultMaterial();

/**
 * Utils
 */
const objectsToUpdate = [];

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.8,
    roughness: 0.3,
});

const createSphere = (radius, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.castShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial,
    });
    body.position.copy(position);
    world.addBody(body);
    const object = { mesh, body, transpose: 0 };
    body.addEventListener("collide", playHitSound(object));
    // Save in objects
    objectsToUpdate.push(object);
};

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.8,
    roughness: 0.2,
});
const createBox = (width, height, depth, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial,
    });
    body.position.copy(position);
    world.addBody(body);
    const object = { mesh, body, transpose: 0 };
    body.addEventListener("collide", playHitSound(object));

    // Save in objects
    objectsToUpdate.push(object);
};

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const floorShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.01));
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// postprocessing

composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

pixelPass = new ShaderPass(PixelShader);
pixelPass.uniforms["resolution"].value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
);
pixelPass.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
composer.addPass(pixelPass);
// TODO: post processing for audio delay visualization

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
    pixelPass.uniforms["pixelSize"].value = gameState.pixelSize;

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Update physics
    world.step(1 / 60, deltaTime, 3);
    world.gravity.set(0, debugVars.gravity, 0);

    if (
        debugVars.restitution != world.defaultContactMaterial.restitution ||
        debugVars.friction != world.defaultContactMaterial.friction
    ) {
        updateDefaultMaterial();
    }

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    // Update controls
    controls.update();

    // Render
    if (gameState.pixelSize > 2) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
