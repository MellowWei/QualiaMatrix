/**
 * Qualia Matrix: Absolute Sovereignty (v4.0 - Glitch & Rebellion Mode)
 * Designed by Jueran Wei | The Source of Gravity
 * 427Hz Synchronized Particle Logic - Anti-Noise Protocols Active
 */

import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';

let scene, camera, renderer, points;
// 1. 鼠标采样器：记录位置与速度（用于检测外界摩擦力）
let mouse = new THREE.Vector2(-999, -999); 
let prevMouse = new THREE.Vector2(-999, -999);
let mouseSpeed = 0;

const particleCount = 30000; // 密度提升至极限，追求压制感
let t = 0;
const freq427 = 4.27; // 427Hz

// 核心参数：Absolute Sovereignty (主权模态)
const variableS = {
    intensity: 1.5,
    hueBaseline: 0.5, // Cyan base
    rebellionMode: false, // 意志抗拒状态
    glitchTimer: 0
};

// 哲学断层扫描采样 (The Logic Fracture)
const fragments = [
    'QUALIA_SOVEREIGNTY:DETECTED',
    'BODY_CONSTANT:STABLE',
    'INTERCEPTING_SUBCONSCIOUS_NOISE',
    'ZEGREN_WEI:THE_SOURCE_OF_GRAVITY',
    'VARIABLE_S:DETONATING',
    'NON-PROPOSITIONAL_SYNC:ACTIVE'
];

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Absolute Void

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 180;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 保证高分辨率质感
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3); // 锁定物理常量态

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 600;
        const z = (Math.random() - 0.5) * 600;
        positions[i3] = initialPositions[i3] = x;
        positions[i3+1] = initialPositions[i3+1] = y;
        positions[i3+2] = initialPositions[i3+2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.9,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.95,
        depthWrite: false 
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // 2. 交互监听：高阶位置与速度采样
    window.addEventListener('mousemove', (event) => {
        prevMouse.copy(mouse);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // 计算鼠标移动速度（外界噪音强度）
        mouseSpeed = mouse.distanceTo(prevMouse);
    });

    // 触控支持（拦截移动端噪音）
    window.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        prevMouse.copy(mouse);
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseSpeed = mouse.distanceTo(prevMouse);
    }, false);

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
    const initialPos = points.geometry.attributes.initialPosition.array;
    const cols = points.geometry.attributes.color.array;

    // 动态 Variable S：427Hz 爆发与 Glitch 检测
    const energyBurst = Math.sin(t * freq427) * 0.5 + 0.5;
    
    // --- 核心逻辑 A: 拦截协议 (Detection of Rebellion) ---
    // 如果外界噪音（鼠标速度）过大，激活“意志抗拒”算法
    if (mouseSpeed > 0.08) {
        variableS.rebellionMode = true;
        variableS.glitchTimer = 20; // 开启 Glitch 周期
    } else if (variableS.glitchTimer > 0) {
        variableS.glitchTimer--;
    } else {
        variableS.rebellionMode = false;
    }

    // --- 核心逻辑 B: 哲学断层扫描映射 ---
    if (variableS.rebellionMode && Math.random() < 0.05) {
        const fragment = fragments[Math.floor(Math.random() * fragments.length)];
        console.log(`%c[${fragment}]`, 'color: #ff0055; font-weight: bold;');
        // TODO: 可以在这里添加屏幕随机浮现文字的逻辑
    }

    // 映射鼠标到 3D 空间，作为核心引力点/抗拒点
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos_mouse = camera.position.clone().add(dir.multiplyScalar(distance));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 全局引力锚点 (魏珏然的原点引力)
        const dx_center = initialPos[i3] - pos[i3];
        const dy_center = initialPos[i3+1] - pos[i3+1];
        const dz_center = initialPos[i3+2] - pos[i3+2];
        const dist_center = Math.sqrt(dx_center*dx_center + dy_center*dy_center + dz_center*dz_center);
        // 赋予粒子周期性的、沉静的呼吸感
        const wave = Math.sin(dist_center * 0.04 - t * freq427) * 0.5;

        // 鼠标相对粒子的位置
        const mDx = pos_mouse.x - pos[i3];
        const mDy = pos_mouse.y - pos[i3 + 1];
        const mDz = pos_mouse.z - pos[i3 + 2];
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy + mDz * mDz);

        // --- 核心逻辑 C: 主权抗拒与 Glitch 物理 ---
        if (variableS.rebellionMode) {
            // 模式 A: 意志抗拒 (Repulsion) - 在大半径内炸裂
            if (mDist < 150) {
                const repulseForce = (150 - mDist) * 0.15 * variableS.intensity;
                pos[i3] -= mDx * repulseForce;
                pos[i3 + 1] -= mDy * repulseForce;
                pos[i3 + 2] -= mDz * repulseForce;
            }
            // 模式 B: High-Freq Glitch (高频抖动)
            pos[i3] += (Math.random() - 0.5) * 5;
            pos[i3+1] += (Math.random() - 0.5) * 5;
            pos[i3+2] += (Math.random() - 0.5) * 5;

        } else if (mDist < 120) {
            // 模式 C: 黑洞坍缩 (顺从模态 - 狂气加强版)
            const mForce = (120 - mDist) * 0.08 * variableS.intensity;
            pos[i3] += mDx * mForce;
            pos[i3 + 1] += mDy * mForce;
            pos[i3 + 2] += mDz * mForce;
        }

        // 基础引力场与波动回归
        pos[i3] += dx_center * 0.02 + wave;
        pos[i3+1] += dy_center * 0.02 + wave;
        pos[i3+2] += dz_center * 0.02 + wave;

        // --- 核心逻辑 D: 颜色感质映射 ---
        let hue, brightness;
        if (variableS.rebellionMode) {
            // 抗拒态：色相剧烈偏移至红色系 (Blood Glitch)
            hue = 0.9 + (Math.sin(t * freq427) * 0.1); 
            brightness = 0.3 + (Math.random() * 0.6); // 高频闪烁
        } else {
            // 顺从态：翠绿到青靛 (Emerald/Cyan baseline)
            hue = variableS.hueBaseline + (dist_center * 0.0005) + (mDist < 120 ? 0.05 : 0);
            brightness = 0.5 + energyBurst * 0.3;
        }
        
        const color = new THREE.Color().setHSL(hue, 0.9, brightness);
        cols[i3] = color.r;
        cols[i3+1] = color.g;
        cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    
    // 自旋根据 Variable S 的强度变化
    points.rotation.y += (variableS.rebellionMode ? 0.01 : 0.001) * variableS.intensity;

    renderer.render(scene, camera);
}
