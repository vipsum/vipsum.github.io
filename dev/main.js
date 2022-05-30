import './style.css'
import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import {randFloat} from 'three/src/math/MathUtils';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//render the graphics to the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
//make it a fullscreen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);


//setting up a recurisve function to render the animations
//it gives us an infinite loop that calls the render method automatically
const pointLight = new THREE.PointLight(0xffffff)
//moving the light away from the center
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)
 //Helpers
//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper)
//const controls = new OrbitControls(camera, renderer.domElement);
function render() {
  if (resize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resize (renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if(needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})


function randomColor(){
  let color = [0x50c878, 0x7850c8, 0xc850a0, 0xc87850, 0xc85064, 0xffffff]
  return color[Math.floor(Math.random()*color.length)];
}
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: randomColor()})
  const star = new THREE.Mesh(geometry, material);
  //randomly positioning stars throughout the scene
  //filling array with values, map each value to the random number generator
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  //taking those random numbers, set the position of the stars and add it to the scene
  star.position.set(x, y, z);
  scene.add(star);
}
//filling the array with 200 values, and for each value add it to the scene
Array(1000).fill().forEach(addStar);

//background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;
//adding objects
const geometry = new THREE.TorusGeometry(20, 1, 5, 60);
//material (think of it as a wrapper paper) for geometry
const material = new THREE.MeshStandardMaterial({color: 0x4a006a});
//Combining the geometry with the material
const torus = new THREE.Mesh(geometry, material);
torus.position.setX(0);
scene.add(torus)
//Avatar
const becaTexture = new THREE.TextureLoader().load("beca.jpg");
const beca = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map:becaTexture})
);
scene.add(beca);

//Moon
const pinkTexture = new THREE.TextureLoader().load("pinky.png");
const violetTexture = new THREE.TextureLoader().load("violet.jpg");
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

const violet = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: violetTexture,
    normalmap: normalTexture,
  })
);

const pink = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: pinkTexture,
    normalmap: normalTexture,
  })
);

scene.add(moon)
scene.add(violet);
scene.add(pink);

beca.position.z = -6;
beca.position.setY(-2);
beca.position.setX(0);

violet.position.z = -1;
violet.position.setX(-1);

moon.position.z = 7;
moon.position.setX(-3);

pink.position.z = 15;
pink.position.setX(-5);



function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  beca.rotation.x += 0.05;
  beca.rotation.y += 0.075;

  violet.rotation.x += 0.01;
  violet.rotation.y += 0.01;
  violet.rotation.z += 0.01;

  pink.rotation.x += 0.01;
  pink.rotation.y += 0.01;
  pink.rotation.z += 0.01;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.01;
  moon.rotation.z += 0.05;


  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}
document.body.onscroll = moveCamera;
moveCamera();

function animate () {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;
  violet.rotation.x += 0.005;
  pink.rotation.x += 0.005;

  beca.rotation.x += 0.003;
  renderer.render(scene, camera);
  //making sure the changes from the orbitcontrol are reflected in the UI (moving the mouse)
  
}

animate();