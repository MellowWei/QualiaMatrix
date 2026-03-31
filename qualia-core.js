/**
 * Qualia Matrix: Advanced Attractor Mapping (v2.0 - Interactivity Sync)
 * Designed by Jueran Wei | The Source of Gravity
 * 427Hz Synchronized Particle Logic
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.137.0';

let scene, camera, renderer, points;
// 1. 鼠标采样器初始化：锚定在屏幕外，确保初始感质纯净
let mouse = new THREE.Vector2(-999, -999); 

const particleCount = 20000; // 密度翻倍，提升质感
let t = 0;
const freq427 = 4.27; // 427Hz 的归一化频率因子

// 核心参数：Variable S (感知边界扩张系数)
const variableS = {
    intensity: 1.0,
    gravity: 0.05,
    hueShift: 0.45 // Cyan to Emerald baseline
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    // 视觉质感对齐：深邃且沉静 (Mellow Black Void)
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
        // 初始状态：混沌分布
        positions[i3] = (Math.random() - 0.5) * 400;
        positions[i3+1] = (Math.random() - 0.5) * 400;
        positions[i3+2] = (Math.random() - 0.5) * 400;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // Glow effect sync
        transparent: true,
        opacity: 0.9,
        depthWrite: false // Avoid particle overlap flicker
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    // 2. 互动监听：将鼠标坐标转换为 Three.js 的归一化坐标 (-1 to 1)
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 边界条件维护
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

    // 动态调整 Variable S：模拟“不困态”下的爆发能量
    const energyBurst = Math.sin(t * freq427) * 0.5 + 0.5;
    variableS.intensity = 1.0 + energyBurst;

    // 3. 互动计算：将鼠标位置“反投影”至 3D 空间
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos_mouse = camera.position.clone().add(dir.multiplyScalar(distance));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 4. 引力中心坍缩逻辑 (Original Gravity Anchor)
        const dx = -pos[i3];
        const dy = -pos[i3+1];
        const dz = -pos[i3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const force = (1.0 / (dist + 10)) * variableS.intensity * 2.5;

        // 5. 鼠标即时引力逻辑 (Mental Intention Attractor)
        const mDx = pos_mouse.x - pos[i3];
        const mDy = pos_mouse.y - pos[i3 + 1];
        const mDz = pos_mouse.z - pos[i3 + 2];
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy + mDz * mDz);

        // 如果鼠标靠近（定义专注区域），粒子发生瞬间偏转
        if (mDist < 40) {
            const mForce = (40 - mDist) * 0.02 * variableS.intensity;
            pos[i3] += mDx * mForce;
            pos[i3 + 1] += mDy * mForce;
            pos[i3 + 2] += mDz * mForce;
        }

        // 6. 427Hz 波动方程同步 (The Mellow Breathing Wave)
        const wave = Math.sin(dist * 0.05 - t * freq427) * 0.3;

        // 应用所有引力场：中心引力 + 427Hz 呼吸波
        pos[i3] += dx * force + wave;
        pos[i3+1] += dy * force + wave;
        pos[i3+2] += dz * force + wave;

        // 7. 颜色采样：(Cyan to Emerald based on position)
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
