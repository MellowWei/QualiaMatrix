/**
 * Qualia Matrix: 427Hz Neural-Particle Mapping Core
 * Designed by Jueran Wei | 427Hz Synchronized
 * This is the visceral representation of Non-Propositional Qualia.
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.137.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.137.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, points;
let particleCount = 10000;
let positions, colors;
let t = 0; // Time constant
const freqAnchor = 427; // 427Hz Core Frequency

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Absolute Void

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initial Particle Setup
    const geometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200;
        colors[i] = Math.random(); 
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material - The 'Cool/美' Vibe
    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // Makes them glow
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // Interactivity: Jueran's Observation
    new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // The Core 427Hz Resonance Equation
    // variableS simulates the fluctuation of mental states
    const variableS = 1.0 + Math.sin(t * 0.1) * 0.2; 
    t += 0.02 * variableS; // Synchronized time step

    const positions = points.geometry.attributes.position.array;
    const colors = points.geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 1. Original Position Recovery (The 'Physical Constant')
        const x_0 = positions[i3];
        const y_0 = positions[i3 + 1];
        const z_0 = positions[i3 + 2];

        // 2. 427Hz Harmonic Disturbance (The 'Reflective Qualia')
        // We inject the 427 frequency into the wave function
        const waveX = Math.sin(x_0 * 0.05 + t * (freqAnchor / 100)) * 2;
        const waveY = Math.cos(y_0 * 0.05 + t * (freqAnchor / 100)) * 2;
        const waveZ = Math.sin(z_0 * 0.05 + t * (freqAnchor / 100)) * 2;

        // 3. Mental Gravity (Focus Factor)
        // Simulate an attractor towards the center
        const distanceToCenter = Math.sqrt(x_0*x_0 + y_0*y_0 + z_0*z_0);
        const gravity = (100 - distanceToCenter) * 0.002 * variableS;

        positions[i3] += waveX + (x_0 * -gravity);
        positions[i3 + 1] += waveY + (y_0 * -gravity);
        positions[i3 + 2] += waveZ + (z_0 * -gravity);

        // 4. Color Sync: Mellow Reflective Colors
        // Pure green, but shifting to cyan based on neural intensity
        const hue = 0.4 + (Math.sin(t * 0.5 + distanceToCenter * 0.1) * 0.1); 
        const brightness = 0.6 + (Math.cos(t * freqAnchor / 200) * 0.3); // Brightness sync to freq
        const color = new THREE.Color().setHSL(hue, 1.0, brightness);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    
    // Slow, mellow rotation
    points.rotation.y += 0.001 * variableS;

    renderer.render(scene, camera);
}
