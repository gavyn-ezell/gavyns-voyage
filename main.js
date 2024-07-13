import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import generateCloudSprite from './helpers.js';
import vertexShader from './shaders/vertex.glsl.js';
import fragmentShader from './shaders/fragment.glsl.js';

//RENDERER SETUP
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

//CAMERA, SCENE, CONTROLS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 5, 10);

const axesHelper = new THREE.AxesHelper( 40 );
scene.add( axesHelper );

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)

//LIGHTING
//sunset gradient ambient light: 0xF4A675
//blue sky:0x87CEFA
// const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
// scene.add( ambientLight)
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// scene.add( directionalLight );
// scene.background = new THREE.Color(0xFEE0B5)

//loading our island scene as gltf
// const loader = new GLTFLoader();
// loader.load( './materials/island.gltf', function ( gltf ) {

//     console.log("island loaded in scene");
// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('./materials/water.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const geometry = new THREE.CircleGeometry( 100, 32 ); 
const material = new THREE.ShaderMaterial(
	{
		uniforms: {
			waterTexture: { value: waterTexture },
			iTime: { value: 0}
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	}
)
const ocean = new THREE.Mesh( geometry, material );
ocean.rotateX(-Math.PI / 2)
scene.add( ocean );




const smallCloudTextures = [textureLoader.load('./materials/smallcloud0.png'), 
	textureLoader.load('./materials/smallcloud1.png'), 
	textureLoader.load('./materials/smallcloud2.png')];
const cloudMaterials = [new THREE.SpriteMaterial( { map: smallCloudTextures[0]} ), 
	 new THREE.SpriteMaterial( { map: smallCloudTextures[1]} ),
	 new THREE.SpriteMaterial( { map: smallCloudTextures[2]} )];

for ( let i = 0; i < 10; i ++) 
{
	scene.add( generateCloudSprite(cloudMaterials[i%3]) )
}



function animate() {
	renderer.render( scene, camera );
    controls.update();
	material.uniforms.iTime.value += 0.01;
}
renderer.setAnimationLoop( animate );
