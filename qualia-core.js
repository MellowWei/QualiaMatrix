/**
 * Qualia Matrix: High-Intensity Attractor (v3.0 - Outbreak Mode)
 * Designed by Jueran Wei | The Sovereign Source of Gravity
 * 427Hz Synchronized Particle Logic - Aggressive Interaction
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.137.0';

let scene, camera, renderer, points;
let mouse = new THREE.Vector2(-999, -999); 
const particleCount = 20000; 
let t = 0;
const freq427 = 4.27; 

const variableS = {
    intensity: 1.5, // 初始强度提升
    gravity: 0.1,
    hueShift: 0.45 
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 500;
        positions[i3+1] = (Math.random() - 0.5) * 500;
        positions[i3+2] = (Math.random() - 0.5) * 500;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        depthWrite: false 
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    const pos = points.geometry.attributes.position.array;
    const cols = points.geometry.attributes.color.array;

    const energyBurst = Math.sin(t * freq427) * 0.5 + 0.5;
    variableS.intensity = 1.2 + energyBurst;

    // 映射鼠标到 3D 空间，作为核心黑洞
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos_mouse = camera.position.clone().add(dir.multiplyScalar(distance));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // --- 核心逻辑 A: 魏珏然的全局引力 ---
        const dx = -pos[i3];
        const dy = -pos[i3+1];
        const dz = -pos[i3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const force = (1.0 / (dist + 5)) * variableS.intensity * 2.0;

        // --- 核心逻辑 B: 鼠标黑洞坍缩 (狂气加强版) ---
        const mDx = pos_mouse.x - pos[i3];
        const mDy = pos_mouse.y - pos[i3 + 1];
        const mDz = pos_mouse.z - pos[i3 + 2];
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy + mDz * mDz);

        // 探测半径从 40 提升至 120，让感应极其灵敏
        if (mDist < 120) {
            // 坍缩力公式加强：(半径 - 距离) * 强度
            const mForce = (120 - mDist) * 0.06 * variableS.intensity;
            pos[i3] += mDx * mForce;
            pos[i3 + 1] += mDy * mForce;
            pos[i3 + 2] += mDz * mForce;
        }

        // --- 核心逻辑 C: 427Hz 呼吸波动 ---
        const wave = Math.sin(dist * 0.04 - t * freq427) * 0.4;

        pos[i3] += dx * force + wave;
        pos[i3+1] += dy * force + wave;
        pos[i3+2] += dz * force + wave;

        // 颜色：基于距离和能量突发的动态映射 (极致酷与美)
        const hue = 0.45 + (mDist < 120 ? 0.1 : 0) + (dist * 0.0005);
        const color = new THREE.Color().setHSL(hue, 0.9, 0.4 + energyBurst * 0.3);
        
        cols[i3] = color.r;
        cols[i3+1] = color.g;
        cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.y += 0.001; // 缓慢自旋，保持沉静

    renderer.render(scene, camera);
}
