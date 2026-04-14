import * as THREE from "three";

const canvas = document.querySelector('#webgl-canvas');
const SIZES = {
    width: 800,
    height: 600,
}

const scene = new THREE.Scene();

const sphereMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: "hsl(66, 65%, 70%)"})
);

const camera = new THREE.PerspectiveCamera(65, SIZES.width / SIZES.height, 0.1, 100);
camera.position.z = 3;
camera.position.y = 0;

const renderer = new THREE.WebGLRenderer({
    canvas,
})

scene.add(sphereMesh);
scene.add(camera);
renderer.setSize(SIZES.width, SIZES.height);
renderer.render(scene, camera);
