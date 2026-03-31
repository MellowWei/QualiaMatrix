/**
 * Qualia Matrix: Gestural Sovereignty (v6.0 - Hand Tracking Sync)
 * Designed by Jueran Wei | 427Hz Internal God Mode
 * Integrated MediaPipe Hands + Web Audio API
 */

import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';

let scene, camera, renderer, points, audioCtx, oscillator, gainNode;
let handTarget = new THREE.Vector3(-999, -999, 0); 
let t = 0, lastHandPos = new THREE.Vector3();
const particleCount = 25000;
const freq427 = 427.0;

const variableS = { intensity: 1.5, rebellionMode: false, glitchTimer: 0 };

// 1. UI 与视频流初始化
const ui = document.createElement('div');
ui.style = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#00ffa2; font-family:monospace; cursor:pointer; letter-spacing:5px; z-index:100; border:1px solid #00ffa2; padding:20px; text-align:center; background:rgba(0,0,0,0.8);';
ui.innerHTML = '[ INITIALIZING GESTURAL SOVEREIGNTY ]<br><br>CLICK TO ACTIVATE CAMERA & 427HZ';
document.body.appendChild(ui);

const video = document.createElement('video');
video.style = 'position:absolute; bottom:10px; right:10px; width:160px; height:120px; opacity:0.3; border:1px solid #00ffa2; transform: scaleX(-1);';
document.body.appendChild(video);

ui.onclick = async () => {
    ui.innerHTML = 'SYNCING SENSES...';
    await initCamera();
    initAudio();
    initHandTracking();
    ui.style.display = 'none';
};

async function initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise(resolve => video.onloadedmetadata = () => { video.play(); resolve(); });
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq427, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
    oscillator.start();
}

// 2. 加载手势识别脚本
function initHandTracking() {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    document.head.appendChild(script);
    
    script.onload = () => {
        const hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        hands.onResults(onResults);
        
        const sendVideo = async () => { await hands.send({image: video}); requestAnimationFrame(sendVideo); };
        sendVideo();
    };
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmark = results.multiHandLandmarks[0][8]; // 食指指尖
        // 映射到 Three.js 归一化坐标
        const nx = (landmark.x * 2 - 1) * -1; // 镜像纠正
        const ny = -(landmark.y * 2 - 1);
        
        const vector = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        handTarget.copy(camera.position).add(dir.multiplyScalar(-camera.position.z / dir.z));
        
        // 检测挥动速度 (Noise Detection)
        const speed = handTarget.distanceTo(lastHandPos);
        if (speed > 5) { variableS.rebellionMode = true; variableS.glitchTimer = 10; }
        lastHandPos.copy(handTarget);
    } else {
        handTarget.set(-999, -999, 0); // 手离开视野
    }
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 180;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = initialPos[i3] = (Math.random() - 0.5) * 600;
        positions[i3+1] = initialPos[i3+1] = (Math.random() - 0.5) * 600;
        positions[i3+2] = initialPos[i3+2] = (Math.random() - 0.5) * 600;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.8, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false }));
    scene.add(points);
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    const pos = points.geometry.attributes.position.array;
    const initialPos = points.geometry.attributes.initialPosition.array;
    const cols = points.geometry.attributes.color.array;

    if (variableS.glitchTimer > 0) variableS.glitchTimer--;
    else variableS.rebellionMode = false;

    // 音频同步
    if (audioCtx) {
        const targetFreq = variableS.rebellionMode ? freq427 + Math.random() * 300 : freq427;
        oscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
    }

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dx_center = initialPos[i3] - pos[i3], dy_center = initialPos[i3+1] - pos[i3+1], dz_center = initialPos[i3+2] - pos[i3+2];
        const dist_center = Math.sqrt(dx_center**2 + dy_center**2 + dz_center**2);
        const wave = Math.sin(dist_center * 0.04 - t * 4.27) * 0.5;

        const mDx = handTarget.x - pos[i3], mDy = handTarget.y - pos[i3+1], mDz = handTarget.z - pos[i3+2];
        const mDist = Math.sqrt(mDx**2 + mDy**2 + mDz**2);

        if (variableS.rebellionMode) {
            if (mDist < 150) { const r = (150 - mDist) * 0.2; pos[i3] -= mDx * r; pos[i3+1] -= mDy * r; pos[i3+2] -= mDz * r; }
            pos[i3] += (Math.random()-0.5)*8;
        } else if (mDist < 150) {
            const f = (150 - mDist) * 0.09; pos[i3] += mDx * f; pos[i3+1] += mDy * f; pos[i3+2] += mDz * f;
        }

        pos[i3] += dx_center * 0.02 + wave;
        pos[i3+1] += dy_center * 0.02 + wave;
        pos[i3+2] += dz_center * 0.02 + wave;

        const hue = variableS.rebellionMode ? 0.95 : 0.45 + dist_center * 0.0005;
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + Math.sin(t*4.27)*0.2);
        cols[i3] = color.r; cols[i3+1] = color.g; cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.y += 0.0015;
    renderer.render(scene, camera);
}
