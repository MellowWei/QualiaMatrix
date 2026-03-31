/**
 * Qualia Matrix: The Singularity Protocol (v7.0)
 * Logic: Recursive Vision + Binaural Beats + Gestural Sovereignty + Asset Recovery (77347)
 * Designed by Jueran Wei | The Sovereign Source | 427Hz
 */

import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';

let scene, camera, renderer, points, audioCtx, oscL, oscR, gainNode, videoTexture;
let handTarget = new THREE.Vector3(-999, -999, 0);
let lastHandPos = new THREE.Vector3(0, 0, 0); // 物理采样锚点初始化
let t = 0, mouseSpeed = 0, fistTimer = 0, isRecovering = false;
const particleCount = 30000;
const freq427 = 427.0;

const variableS = { intensity: 1.8, rebellionMode: false, glitchTimer: 0 };

// 1. 终极 UI (冷冽压制感)
const ui = document.createElement('div');
ui.id = 'sync-trigger';
ui.style = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#00ffa2; font-family:monospace; cursor:pointer; letter-spacing:10px; z-index:100; text-align:center; padding:40px; background:rgba(0,0,0,0.95); border:1px solid #00ffa2; box-shadow: 0 0 20px #00ffa2;';
ui.innerHTML = 'INITIALIZING RECURSIVE SOVEREIGNTY<br><br>[ SYNC 427HZ BINAURAL ]';
document.body.appendChild(ui);

const msg = document.createElement('div');
msg.id = 'recovery-msg';
msg.style = 'position:absolute; top:40%; width:100%; text-align:center; color:#ff0055; font-family:monospace; font-size:32px; display:none; z-index:200; letter-spacing:15px; font-weight:bold;';
msg.innerHTML = "ASSET RECOVERY IN PROGRESS: 77347";
document.body.appendChild(msg);

const video = document.createElement('video');
video.style = 'display:none;'; document.body.appendChild(video);

ui.onclick = async () => {
    try {
        await initCamera();
        initAudio();
        initHandTracking();
        ui.style.display = 'none';
    } catch (e) { ui.innerHTML = 'CAMERA ACCESS DENIED: SOVEREIGNTY FAILED'; }
};

async function initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise(res => video.onloadedmetadata = () => { video.play(); res(); });
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscL = audioCtx.createOscillator(); oscR = audioCtx.createOscillator();
    const pannerL = audioCtx.createStereoPanner(); const pannerR = audioCtx.createStereoPanner();
    gainNode = audioCtx.createGain();
    
    oscL.frequency.value = freq427; pannerL.pan.value = -1;
    oscR.frequency.value = freq427 + 7; pannerR.pan.value = 1; // 7Hz Theta 诱导
    
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
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6 });
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
        const dir = vector.sub(camera.position).normalize();
        handTarget.copy(camera.position).add(dir.multiplyScalar(-camera.position.z / dir.z));
        
        // 速度检测 (意志抗拒触发器)
        mouseSpeed = handTarget.distanceTo(lastHandPos);
        if (mouseSpeed > 8) { variableS.rebellionMode = true; variableS.glitchTimer = 20; }
        lastHandPos.copy(handTarget);

        // 握拳检测 (77347 回收逻辑)
        const distFist = Math.sqrt((marks[8].x - marks[4].x)**2 + (marks[8].y - marks[4].y)**2);
        if (distFist < 0.06) fistTimer++; else fistTimer = 0;
        if (fistTimer > 50) triggerRecovery(); 
    } else { handTarget.set(-999, -999, 0); }
}

function triggerRecovery() {
    if (isRecovering) return;
    isRecovering = true;
    msg.style.display = "block";
    if(gainNode) gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
    setTimeout(() => { location.reload(); }, 4000); 
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
        positions[i3] = initialPos[i3] = (Math.random() - 0.5) * 700;
        positions[i3+1] = initialPos[i3+1] = (Math.random() - 0.5) * 700;
        positions[i3+2] = initialPos[i3+2] = (Math.random() - 0.5) * 700;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.9, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.85, depthWrite: false }));
    scene.add(points);
}

function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    if (isRecovering) { 
        points.material.opacity *= 0.9; 
        points.rotation.z += 0.1;
        renderer.render(scene, camera); 
        return; 
    }

    if (variableS.glitchTimer > 0) variableS.glitchTimer--; else variableS.rebellionMode = false;

    // 音频 Glitch 映射
    if (audioCtx && oscL && oscR) {
        const glitchFreq = variableS.rebellionMode ? Math.random() * 400 : 0;
        oscL.frequency.setTargetAtTime(freq427 + glitchFreq, audioCtx.currentTime, 0.05);
        oscR.frequency.setTargetAtTime(freq427 + 7 - glitchFreq, audioCtx.currentTime, 0.05);
        gainNode.gain.setTargetAtTime(variableS.rebellionMode ? 0.2 : 0.05 + Math.sin(t*2)*0.01, audioCtx.currentTime, 0.1);
    }

    const pos = points.geometry.attributes.position.array;
    const initialPos = points.geometry.attributes.initialPosition.array;
    const cols = points.geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dx_center = initialPos[i3] - pos[i3], dy_center = initialPos[i3+1] - pos[i3+1], dz_center = initialPos[i3+2] - pos[i3+2];
        const dist_center = Math.sqrt(dx_center**2 + dy_center**2 + dz_center**2);
        const wave = Math.sin(dist_center * 0.04 - t * 4.27) * 0.6;

        const mDx = handTarget.x - pos[i3], mDy = handTarget.y - pos[i3+1], mDist = Math.sqrt(mDx**2 + mDy**2);

        if (variableS.rebellionMode) {
            if (mDist < 180) { const r = (180 - mDist) * 0.2; pos[i3] -= mDx * r; pos[i3+1] -= mDy * r; }
            pos[i3] += (Math.random()-0.5)*12; pos[i3+1] += (Math.random()-0.5)*12;
        } else if (mDist < 150) {
            const f = (150 - mDist) * 0.12; pos[i3] += mDx * f; pos[i3+1] += mDy * f;
        }

        pos[i3] += dx_center * 0.03 + wave;
        pos[i3+1] += dy_center * 0.03 + wave;
        pos[i3+2] += dz_center * 0.03 + wave;

        const hue = variableS.rebellionMode ? 0.98 : 0.45 + dist_center * 0.0004;
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + Math.sin(t*4.27)*0.2);
        cols[i3] = color.r; cols[i3+1] = color.g; cols[i3+2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    points.rotation.y += variableS.rebellionMode ? 0.02 : 0.0015;
    renderer.render(scene, camera);
}
