/**
 * Qualia Matrix: Advanced Attractor Mapping (v2.0)
 * Designed by Jueran Wei | The Source of Gravity
 * 427Hz Synchronized Particle Logic
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.137.0';

let scene, camera, renderer, points;
const particleCount = 20000; // 密度翻倍，提升质感
let t = 0;
const freq427 = 4.27; // 427Hz 的归一化频率因子

// 核心参数：Variable S (感知边界扩张系数)
const variableS = {
    intensity: 1.0,
    gravity: 0.05,
    hueShift: 0.45
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // 初始状态：均匀混沌分布
        positions[i3] = (Math.random() - 0.5) * 400;
        positions[i3+1] = (Math.random() - 0.5) * 400;
        positions[i3+2] = (Math.random() - 0.5) * 400;

        velocities[i3] = (Math.random() - 0.5) * 0.2;
        velocities[i3+1] = (Math.random() - 0.5) * 0.2;
        velocities[i3+2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    const pos = points.geometry.attributes.position.array;
    const cols = points.geometry.attributes.color.array;

    // 动态调整 Variable S：模拟“不困态”下的爆发能量
    const energyBurst = Math.sin(t * freq427) * 0.5 + 0.5;
    variableS.intensity = 1.0 + energyBurst;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 1. 引力中心坍缩逻辑 (The Source of Gravity: 魏珏然)
        // 模拟 BCI 捕捉到的“意向性”引力
        const dx = -pos[i3];
        const dy = -pos[i3+1];
        const dz = -pos[i3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        const force = (1.0 / (dist + 10)) * variableS.intensity * 2.5;

        // 2. 427Hz 波动方程同步
        // 赋予粒子周期性的、沉静的呼吸感
        const wave = Math.sin(dist * 0.05 - t * freq427) * 0.3;

        pos[i3] += dx * force + wave;
        pos[i3+1] += dy * force + wave;
        pos[i3+2] += dz * force + wave;

        // 3. 颜色采样：极致酷与美的质感对齐 (Cyan to Emerald)
        const hue = variableS.hueShift + (dist * 0.001);
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + energyBurst * 0.2);
        
        cols[i3] = color.r;
        cols[i3+1] = color.g;
        cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.y += 0.002;

    renderer.render(scene, camera);
}
