import * as THREE from "three";

const canvas = document.querySelector('#webgl-canvas');
const SIZES = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    SIZES.width = window.innerWidth;
    SIZES.height = window.innerHeight;
    camera.aspect = SIZES.width / SIZES.height;
    camera.updateProjectionMatrix();
    renderer.setSize(SIZES.width, SIZES.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    const fullScreenEl = document.fullscreenElement || document.webkitFullscreenElement;
    if(!fullScreenEl) {
        if(canvas.requestFullscreen) canvas.requestFullscreen();
        else if(canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    } else {
        if(document.exitFullscreen) document.exitFullscreen();
        else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
});

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


const loop = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();
