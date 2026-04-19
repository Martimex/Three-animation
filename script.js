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
    },
    colorsHue: {
        "bar1": { hue: 0, rgb: null },
        "bar2": { hue: 45, rgb: null },
        "bar3": { hue: 90, rgb: null },
        "bar4": { hue: 135, rgb: null },
        "bar5": { hue: 180, rgb: null },
        "bar6": { hue: 225, rgb: null },
        "bar7": { hue: 270, rgb: null },
        "bar8": { hue: 315, rgb: null },
    }
}
gui.add(LILCONFIG.animationType, "normal");
gui.add(LILCONFIG.animationType, "desync");
gui.add(LILCONFIG.colorsHue.bar1, "hue").min(0).max(360).step(1).name("Bar-1 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 1}));
gui.add(LILCONFIG.colorsHue.bar2, "hue").min(0).max(360).step(1).name("Bar-2 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 2}));
gui.add(LILCONFIG.colorsHue.bar3, "hue").min(0).max(360).step(1).name("Bar-3 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 3}));
gui.add(LILCONFIG.colorsHue.bar4, "hue").min(0).max(360).step(1).name("Bar-4 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 4}));
gui.add(LILCONFIG.colorsHue.bar5, "hue").min(0).max(360).step(1).name("Bar-5 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 5}));
gui.add(LILCONFIG.colorsHue.bar6, "hue").min(0).max(360).step(1).name("Bar-6 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 6}));
gui.add(LILCONFIG.colorsHue.bar7, "hue").min(0).max(360).step(1).name("Bar-7 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 7}));
gui.add(LILCONFIG.colorsHue.bar8, "hue").min(0).max(360).step(1).name("Bar-8 color").onFinishChange((value) => changeBarColor({hueValue: value, barNo: 8}));

const CONFIG = {
    CURRENT_ANIMATION_MODE: "normal",
    objectsAmount: 8,
    positionDiff: 0.2,
    defaultBaseColorSaturation: 55,
    defaultBaseColorLightness: 55, 
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

function changeBarColor({hueValue, barNo}) {
    const groupsToAffect = [customGroup_1, customGroup_2, customGroup_3, customGroup_4];
    groupsToAffect.forEach((group, groupNo) => {
        group.children[barNo - 1].material.color.set(`hsl(${hueValue}, ${CONFIG.defaultBaseColorSaturation + (5 * groupNo)}%, ${CONFIG.defaultBaseColorLightness + (5 * groupNo)}%)`);
    });
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
            new THREE.MeshBasicMaterial({color: `hsl(${LILCONFIG.colorsHue[`bar${i+1}`].hue}, ${CONFIG.defaultBaseColorSaturation + (5 * repeatNo)}%, ${CONFIG.defaultBaseColorLightness + (5 * repeatNo)}%)`})
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