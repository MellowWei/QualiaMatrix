/**
 * Qualia Matrix: The Singularity Protocol (v7.0)
 * Logic: Recursive Vision + Binaural Beats + Asset Recovery (77347)
 * Designed by Jueran Wei | The Sovereign Source
 */

import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';

let scene, camera, renderer, points, audioCtx, oscL, oscR, gainNode, videoTexture;
let handTarget = new THREE.Vector3(-999, -999, 0), t = 0, lastHandPos = new THREE.Vector3();
let fistTimer = 0, isRecovering = false;
const particleCount = 35000; 
const freq427 = 427.0;

const variableS = { rebellionMode: false, glitchTimer: 0 };

// 1. 终极 UI (冷冽压制感)
const ui = document.createElement('div');
ui.style = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#00ffa2; font-family:monospace; cursor:pointer; letter-spacing:10px; z-index:100; text-align:center; padding:40px; background:rgba(0,0,0,0.9); border:1px solid #00ffa2;';
ui.innerHTML = 'INITIALIZING RECURSIVE SOVEREIGNTY<br><br>[ SYNC 427HZ BINAURAL ]';
document.body.appendChild(ui);

const msg = document.createElement('div');
msg.style = 'position:absolute; top:20px; width:100%; text-align:center; color:#ff0055; font-family:monospace; font-size:24px; display:none; z-index:200; letter-spacing:15px;';
document.body.appendChild(msg);

const video = document.createElement('video');
video.style = 'display:none;'; document.body.appendChild(video);

ui.onclick = async () => {
    await initCamera();
    initAudio();
    initHandTracking();
    ui.style.display = 'none';
};

async function initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    videoTexture = new THREE.VideoTexture(video);
    return new Promise(res => video.onloadedmetadata = () => { video.play(); res(); });
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 双耳节拍：左耳 427Hz，右耳 434Hz (产生 7Hz Theta 波诱导)
    oscL = audioCtx.createOscillator(); oscR = audioCtx.createOscillator();
    const pannerL = audioCtx.createStereoPanner(); const pannerR = audioCtx.createStereoPanner();
    gainNode = audioCtx.createGain();
    
    oscL.frequency.value = freq427; pannerL.pan.value = -1;
    oscR.frequency.value = freq427 + 7; pannerR.pan.value = 1;
    
    oscL.connect(pannerL); pannerL.connect(gainNode);
    oscR.connect(pannerR); pannerR.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.05;
    oscL.start(); oscR.start();
}

function initHandTracking() {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    document.head.appendChild(script);
    script.onload = () => {
        const hands = new Hands({locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7 });
        hands.onResults(onResults);
        const sendVideo = async () => { if(!isRecovering) await hands.send({image: video}); requestAnimationFrame(sendVideo); };
        sendVideo();
    };
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const marks = results.multiHandLandmarks[0];
        const tip = marks[8];
        const nx = (tip.x * 2 - 1) * -1; const ny = -(tip.y * 2 - 1);
        const vector = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
        handTarget.copy(camera.position).add(vector.sub(camera.position).normalize().multiplyScalar(-camera.position.z / vector.z));
        
        // 握拳检测 (暗号回收触发器)
        const distFist = Math.sqrt((marks[8].x-marks[4].x)**2 + (marks[8].y-marks[4].y)**2);
        if (distFist < 0.05) fistTimer++; else fistTimer = 0;
        if (fistTimer > 60) triggerRecovery(); // 握拳 2 秒触发 77347

        if (handTarget.distanceTo(lastHandPos) > 6) { variableS.rebellionMode = true; variableS.glitchTimer = 15; }
        lastHandPos.copy(handTarget);
    } else { handTarget.set(-999, -999, 0); }
}

function triggerRecovery() {
    if (isRecovering) return;
    isRecovering = true;
    msg.innerHTML = "ASSET RECOVERY IN PROGRESS: 77347";
    msg.style.display = "block";
    gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    setTimeout(() => { location.reload(); }, 5000); // 5秒后系统彻底重启
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 180;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = initialPos[i3] = (Math.random() - 0.5) * 700;
        positions[i3+1] = initialPos[i3+1] = (Math.random() - 0.5) * 700;
        positions[i3+2] = initialPos[i3+2] = (Math.random() - 0.5) * 700;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 递归视觉：使用摄像头作为粒子材质的干扰源
    const material = new THREE.PointsMaterial({ size: 1.0, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 });
    points = new THREE.Points(geometry, material);
    scene.add(points);
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    if (isRecovering) { scene.children[0].material.opacity *= 0.95; renderer.render(scene, camera); return; }

    const pos = points.geometry.attributes.position.array;
    const initialPos = points.geometry.attributes.initialPosition.array;
    const cols = points.geometry.attributes.color.array;

    if (variableS.glitchTimer > 0) variableS.glitchTimer--; else variableS.rebellionMode = false;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dist_center = Math.sqrt((initialPos[i3]-pos[i3])**2 + (initialPos[i3+1]-pos[i3+1])**2);
        const wave = Math.sin(dist_center * 0.05 - t * 4.27) * 0.6;
        const mDx = handTarget.x - pos[i3], mDy = handTarget.y - pos[i3+1], mDist = Math.sqrt(mDx**2 + mDy**2);

        if (variableS.rebellionMode) {
            if (mDist < 150) { pos[i3] -= mDx * 0.2; pos[i3+1] -= mDy * 0.2; }
            pos[i3] += (Math.random()-0.5)*10;
        } else if (mDist < 160) {
            const f = (160 - mDist) * 0.1; pos[i3] += mDx * f; pos[i3+1] += mDy * f;
        }

        pos[i3] += (initialPos[i3]-pos[i3])*0.03 + wave;
        pos[i3+1] += (initialPos[i3+1]-pos[i3+1])*0.03 + wave;

        // 颜色映射：递归视觉模拟 (从摄像头色域采样)
        const hue = variableS.rebellionMode ? 0.98 : 0.48 + (dist_center * 0.0004);
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + Math.sin(t*4.27)*0.2);
        cols[i3] = color.r; cols[i3+1] = color.g; cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.z += 0.001;
    renderer.render(scene, camera);
}
