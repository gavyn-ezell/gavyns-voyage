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
// scene.add( axesHelper );

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)

//LIGHTING, FOG
const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
scene.add( ambientLight)
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
scene.background = new THREE.Color(0x4B8BE5)
scene.fog = new THREE.Fog( 0xcccccc, 70, 150);

//loading our island scene as gltf
// const loader = new GLTFLoader();
// loader.load( './materials/island.gltf', function ( gltf ) {

// 	gltf.scene.rotation.set(0, Math.PI, 0);
// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );


const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('./materials/water.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const geometry = new THREE.CircleGeometry( 100, 16 ); 
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



//GENERATING CLOUDS
const smallCloudTextures = [textureLoader.load('./materials/smallcloud0.png'), 
	textureLoader.load('./materials/smallcloud1.png'), 
	textureLoader.load('./materials/smallcloud2.png')];
const mediumCloudTexture = textureLoader.load('./materials/mediumcloud0.png');
const longCloudTextures = [textureLoader.load('./materials/longcloud0.png'),
	textureLoader.load('./materials/longcloud1.png')];

for ( let i = 0; i < 10; i++) 
{
	let longMat = new THREE.SpriteMaterial( { map: longCloudTextures[i%2]} ) 
	longMat.opacity = Math.random() * (0.3) + 0.5;
	scene.add( generateCloudSprite(longMat, 0) )
}

for ( let i = 0; i < 10; i++) 
{
	let mediumMat= new THREE.SpriteMaterial( { map: mediumCloudTexture } ) 
	mediumMat.opacity = Math.random() * (0.3) + 0.5;
	scene.add( generateCloudSprite(mediumMat, 1) )
}

for ( let i = 0; i < 10; i++) 
{
	let smallMat = new THREE.SpriteMaterial( { map: smallCloudTextures[i%3]} ) 
	smallMat.opacity = Math.random() * (0.3) + 0.5;
	scene.add( generateCloudSprite(smallMat, 2) )
}



function animate() {
	renderer.render( scene, camera );
    controls.update();
	material.uniforms.iTime.value += 0.01;
}
renderer.setAnimationLoop( animate );
