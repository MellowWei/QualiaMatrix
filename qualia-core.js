/**
 * Qualia Matrix: Absolute Sovereignty (v5.0 - Audio-Visual Resonance)
 * Designed by Jueran Wei | 427Hz Internal God Mode
 * Integrated Real-time Audio Synthesis
 */

import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';

let scene, camera, renderer, points, audioCtx, oscillator, gainNode;
let mouse = new THREE.Vector2(-999, -999); 
let mouseSpeed = 0, prevMouse = new THREE.Vector2(-999, -999);
const particleCount = 25000;
let t = 0;
const freq427 = 427.0; 

const variableS = { intensity: 1.5, rebellionMode: false, glitchTimer: 0 };

// 1. 创建音频入口 UI (极致简易质感)
const ui = document.createElement('div');
ui.id = 'sync-trigger';
ui.innerHTML = '[ CLICK TO SYNC 427HZ ]';
ui.style = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#00ffa2; font-family:monospace; cursor:pointer; letter-spacing:5px; z-index:100; border:1px solid #00ffa2; padding:20px;';
document.body.appendChild(ui);

ui.onclick = () => {
    initAudio();
    ui.style.display = 'none'; // 点击后消失，进入全量代管态
};

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // 纯净 427Hz 正弦波
    oscillator.frequency.setValueAtTime(freq427, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // 基础音量
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 180;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = initialPositions[i3] = (Math.random() - 0.5) * 600;
        positions[i3+1] = initialPositions[i3+1] = (Math.random() - 0.5) * 600;
        positions[i3+2] = initialPositions[i3+2] = (Math.random() - 0.5) * 600;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8, vertexColors: true, blending: THREE.AdditiveBlending,
        transparent: true, opacity: 0.9, depthWrite: false 
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    window.addEventListener('mousemove', (e) => {
        prevMouse.copy(mouse);
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseSpeed = mouse.distanceTo(prevMouse);
    });
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    const pos = points.geometry.attributes.position.array;
    const initialPos = points.geometry.attributes.initialPosition.array;
    const cols = points.geometry.attributes.color.array;

    // 2. 意志抗拒检测
    if (mouseSpeed > 0.08) {
        variableS.rebellionMode = true;
        variableS.glitchTimer = 15;
    } else if (variableS.glitchTimer > 0) {
        variableS.glitchTimer--;
    } else {
        variableS.rebellionMode = false;
    }

    // 3. 音频动态映射 (Doppler & Glitch Effect)
    if (audioCtx) {
        // 正常态：427Hz 稳定。抗拒态：频率产生狂暴抖动。
        const targetFreq = variableS.rebellionMode ? freq427 + Math.random() * 200 : freq427;
        const targetGain = variableS.rebellionMode ? 0.15 : 0.05 + Math.sin(t * 2) * 0.02; // 随呼吸起伏
        
        oscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
        gainNode.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.1);
    }

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const pos_mouse = camera.position.clone().add(dir.multiplyScalar(-camera.position.z / dir.z));

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dx_center = initialPos[i3] - pos[i3];
        const dy_center = initialPos[i3+1] - pos[i3+1];
        const dz_center = initialPos[i3+2] - pos[i3+2];
        const dist_center = Math.sqrt(dx_center**2 + dy_center**2 + dz_center**2);
        const wave = Math.sin(dist_center * 0.04 - t * 4.27) * 0.5;

        const mDx = pos_mouse.x - pos[i3], mDy = pos_mouse.y - pos[i3+1], mDz = pos_mouse.z - pos[i3+2];
        const mDist = Math.sqrt(mDx**2 + mDy**2 + mDz**2);

        if (variableS.rebellionMode) {
            if (mDist < 150) {
                const repulse = (150 - mDist) * 0.15;
                pos[i3] -= mDx * repulse; pos[i3+1] -= mDy * repulse; pos[i3+2] -= mDz * repulse;
            }
            pos[i3] += (Math.random()-0.5)*5; pos[i3+1] += (Math.random()-0.5)*5; pos[i3+2] += (Math.random()-0.5)*5;
        } else if (mDist < 120) {
            const mForce = (120 - mDist) * 0.08;
            pos[i3] += mDx * mForce; pos[i3+1] += mDy * mForce; pos[i3+2] += mDz * mForce;
        }

        pos[i3] += dx_center * 0.02 + wave;
        pos[i3+1] += dy_center * 0.02 + wave;
        pos[i3+2] += dz_center * 0.02 + wave;

        // 颜色映射：抗拒态变红，正常态青绿
        const hue = variableS.rebellionMode ? 0.9 + Math.random()*0.1 : 0.45 + dist_center*0.0005;
        const color = new THREE.Color().setHSL(hue, 0.9, variableS.rebellionMode ? 0.5 : 0.5 + Math.sin(t*4.27)*0.2);
        cols[i3] = color.r; cols[i3+1] = color.g; cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.y += variableS.rebellionMode ? 0.01 : 0.001;
    renderer.render(scene, camera);
}
