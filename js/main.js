import * as THREE from 'https://cdn.skypack.dev/three@0.155.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader';

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// === Camera ===
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('three-canvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === Lighting ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-10, 10, 10);
scene.add(dirLight);

// === Grid + Ground ===
const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === Car Model ===
const loader = new GLTFLoader();
let car;
loader.load('assets/car.glb', (gltf) => {
  car = gltf.scene;
  car.position.set(0, 0, 0);
  car.scale.set(1.5, 1.5, 1.5);
  scene.add(car);
});

// === Locations ===
const locations = {
  about: new THREE.Vector3(10, 0, 0),
  projects: new THREE.Vector3(-10, 0, 0),
  contact: new THREE.Vector3(0, 0, -10)
};

// === Markers ===
function addMarker(position, name, color = 0x00ff00) {
  const marker = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color })
  );
  marker.position.copy(position);
  marker.name = name;
  scene.add(marker);
}

addMarker(locations.about, 'about-marker', 0xff5555);
addMarker(locations.projects, 'projects-marker', 0x55ff55);
addMarker(locations.contact, 'contact-marker', 0x5555ff);

// === Raycasting Setup ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let intersect of intersects) {
    const name = intersect.object.name;
    if (name === 'about-marker') {
      moveCarTo(locations.about, 'about');
    } else if (name === 'projects-marker') {
      moveCarTo(locations.projects, 'projects');
    } else if (name === 'contact-marker') {
      moveCarTo(locations.contact, 'contact');
    }
  }
});

// === Move Car + Load Page ===
function moveCarTo(destination, pageName) {
  if (!car) return;
  const speed = 0.05;
  const interval = setInterval(() => {
    car.position.lerp(destination, speed);
    if (car.position.distanceTo(destination) < 0.1) {
      clearInterval(interval);
      loadPage(pageName);
    }
  }, 16);
}

function loadPage(page) {
  import(`./pages/${page}.js`).then(module => {
    document.getElementById('page-content').innerHTML = module.default;
  });
}

// === Handle Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
