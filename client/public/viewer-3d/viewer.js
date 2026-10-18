import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#galaxy");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x020617, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 120, 260);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 30;
controls.maxDistance = 900;

scene.add(new THREE.AmbientLight(0x88aaff, 0.7));
const starCount = 18000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 40 + Math.pow(Math.random(), 0.55) * 500;
  const a = Math.random() * Math.PI * 2;
  const arm = Math.sin(a * 3.2) * 18;
  positions[i * 3] = Math.cos(a) * r + arm;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 18 * (1 - r / 650);
  positions[i * 3 + 2] = Math.sin(a) * r + arm;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0x9be7ff, size: 1.3, sizeAttenuation: true, transparent: true, opacity: 0.85 });
scene.add(new THREE.Points(geometry, material));

const systemGeometry = new THREE.SphereGeometry(2.2, 16, 16);
const systemMaterial = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
for (let i = 0; i < 180; i++) {
  const r = 35 + Math.random() * 360;
  const a = Math.random() * Math.PI * 2;
  const star = new THREE.Mesh(systemGeometry, systemMaterial.clone());
  star.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 12, Math.sin(a) * r);
  star.scale.setScalar(0.45 + Math.random() * 1.5);
  scene.add(star);
}
document.querySelector("#systems").textContent = "180 systems";
document.querySelector("#reset").addEventListener("click", () => { camera.position.set(0, 120, 260); controls.target.set(0, 0, 0); controls.update(); });

let frames = 0; let last = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  frames++;
  if (now - last > 1000) { document.querySelector("#fps").textContent = `${frames} FPS`; frames = 0; last = now; }
  controls.update();
  scene.rotation.y += 0.00008;
  renderer.render(scene, camera);
}
animate(performance.now());
addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
