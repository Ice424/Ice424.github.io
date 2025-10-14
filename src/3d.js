import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const camera = new THREE.PerspectiveCamera(90, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(-5, 6, -5);
  camera.lookAt(0, 3, 0);

  const base_rotation = camera.rotation.clone();
  const scene = new THREE.Scene();

  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);

  const gltfLoader = new GLTFLoader();
  

  let mixer; // will control animations
  const clock = new THREE.Clock(); // keeps consistent animation timing

  gltfLoader.load("/model/Origins5E.glb", (gltf) => {
    const root = gltf.scene;
    scene.add(root);

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(root);

      // Play first animation (you can loop through gltf.animations to see more)
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
      action.setLoop(THREE.LoopRepeat); // ensures looping
    }
  });

  let panx = 0;
  let pany = 0;

  document.addEventListener('mousemove', updatePanCursorPos);
  document.addEventListener('scroll', updatePanCursorPos);

  function updatePanCursorPos(event) {
    const rect = canvas.getBoundingClientRect();
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;

    const normX = ((relX / rect.width) - 0.5) * 2;
    const normY = ((relY / rect.height) - 0.5) * 2;

    panx = normX * 0.01;
    pany = normY * 0.02;
  }

  function render() {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta); // advance animation

    const new_rotation = new THREE.Euler(
      base_rotation.x + pany,
      base_rotation.y + panx,
      base_rotation.z,
      'XYZ'
    );

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, new_rotation.x, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, new_rotation.y, 0.05);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, new_rotation.z, 0.05);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
