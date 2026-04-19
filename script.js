import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

const gui = new GUI({ title: "Controls - press H key to toggle" });
window.addEventListener("keydown", () => {
    gui.show(gui._hidden);
});

const canvas = document.querySelector('#webgl-canvas');

const LILCONFIG = {
    animationType: {
        normal: () => CONFIG.CURRENT_ANIMATION_MODE = "normal",
        desync: () => CONFIG.CURRENT_ANIMATION_MODE = "desync",
    }
}
gui.add(LILCONFIG.animationType, "normal");
gui.add(LILCONFIG.animationType, "desync");

const CONFIG = {
    CURRENT_ANIMATION_MODE: "normal",
    objectsAmount: 8,
    positionDiff: 0.2,
    defaultRotationSpeed: 0.0066,
    onDesyncRotationSpeed: {
        "tier1": 0.0066,
        "tier2": 0.0070,
        "tier3": 0.0074,
        "tier4": 0.0078
    }
}



const posObj = {
    xPos: [0,   -2.5,   -4,     -2.5,     0,      2.5,      4,      2.5],
    yPos: [4,   2.5,     0,     -2.5,    -4,     -2.5,      0,      2.5]
}

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


const [customGroup_1, customGroup_2, customGroup_3, customGroup_4] = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
const parentGroup = new THREE.Group();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(65, SIZES.width / SIZES.height, 0.1, 100);
camera.position.z = 10;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.zoomSpeed = 0.35;
controls.enableRotate = false;
controls.maxDistance = 10;
controls.minDistance = 6;
controls.enabled = true;

const renderer = new THREE.WebGLRenderer({
    canvas,
})

parentGroup.add(customGroup_1, customGroup_2, customGroup_3, customGroup_4);
scene.add(parentGroup);
scene.add(camera);
renderer.setSize(SIZES.width, SIZES.height);


const loop = () => {
    runAnimationFrame(CONFIG.CURRENT_ANIMATION_MODE);
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

spawnGroups(4);
loop();

/*  ---  */

function runAnimationFrame(animationMode) {
    switch(animationMode) {
        case "normal": {
            parentGroup.rotation.z += CONFIG.defaultRotationSpeed;
            break;
        }
        case "desync" : {
            customGroup_1.rotation.z += CONFIG.onDesyncRotationSpeed.tier1;
            customGroup_2.rotation.z += CONFIG.onDesyncRotationSpeed.tier2;
            customGroup_3.rotation.z += CONFIG.onDesyncRotationSpeed.tier3;
            customGroup_4.rotation.z += CONFIG.onDesyncRotationSpeed.tier4;
            break;
        }
    }
}

function spawnGroups(amount) {
    for(let amountNo=0; amountNo<amount; amountNo++) {
        factory(amountNo);
    }
}

function factory(repeatNo) {
    for(let i=0; i<CONFIG.objectsAmount; i++) {
        const newCube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: `hsl(${i * (360 / CONFIG.objectsAmount)}, ${55 + (5 * repeatNo)}%, ${55 + (5 * repeatNo)}%)`})
        );
        newCube.position.x = posObj.xPos[(i) % posObj.xPos.length] / 2 ;
        newCube.position.y = posObj.yPos[(i) % posObj.yPos.length] / 2 ;
        
        newCube.position.z = (repeatNo + 1) * 2;

        addToCorrectGroup(repeatNo, newCube);
    }
}

function addToCorrectGroup(no, object) {
    switch(no) {
        case 0:
            customGroup_1.add(object);
            break;
        case 1:
            customGroup_2.add(object);
            break;
        case 2:
            customGroup_3.add(object);
            break;
        case 3:
            customGroup_4.add(object);
            break;
    }
}