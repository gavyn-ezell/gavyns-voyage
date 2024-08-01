import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import {generateCloudPosition, generateWindLinePosition} from './helpers.js';

//ALL SHADER IMPORTS
import waterVert from './shaders/water/water.vert.js';
import waterFrag from './shaders/water/water.frag.js';
import smallcloudVert from './shaders/smallcloud/smallcloud.vert.js';
import smallcloudFrag from './shaders/smallcloud/smallcloud.frag.js';
import windVert from './shaders/wind/wind.vert.js';
import windFrag from './shaders/wind/wind.frag.js';
import sunVert from './shaders/sun/sun.vert.js';
import sunFrag from './shaders/sun/sun.frag.js';
import landmassVert from './shaders/landmass/landmass.vert.js';
import landmassFrag from './shaders/landmass/landmass.frag.js';


//BASIC SETUP: RENDERER, CAMERA, SCENE, CONTROLS, LIGHITNG
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4B8BE5)

// const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
// scene.add( ambientLight)
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
// scene.add( directionalLight );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 1.5, 4);
// const axesHelper = new THREE.AxesHelper( 40 );
// // scene.add( axesHelper );
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)


//OBJECT SETUP

//ISLAND
// const loader = new GLTFLoader();
// loader.load( './materials/island.gltf', function ( gltf ) {

// 	gltf.scene.rotation.set(0, Math.PI, 0);
// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

//WATER
const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('./materials/water.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const waterGeometry = new THREE.PlaneGeometry(400, 400, 20, 20 ); 
const waterMaterial = new THREE.ShaderMaterial(
	{

		uniforms: {
			waterTexture: { value: waterTexture },
			iTime: { value: 0}
		},
		vertexShader: waterVert,
		fragmentShader: waterFrag
	}
)
const water = new THREE.Mesh( waterGeometry, waterMaterial );
water.rotateX(-Math.PI / 2)
water.translateY(20)
scene.add( water);

//LAND MASSES
const landmassTexture = textureLoader.load('./materials/landmass0.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const landmassGeometry = new THREE.PlaneGeometry(700, 20, 20, 1)
// for(let i = 0; i < landmassGeometry.attributes.position.count; i++) {
// 	let x = landmassGeometry.attributes.position.array[ i * 3 ]
// 	landmassGeometry.attributes.position.array[ i * 3 + 2 ] = -Math.sqrt(8100.0 - x*x);
//   }

const landmassMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		wireframe: false,
		uniforms: {
			landmassTexture: { value: landmassTexture },
		},
		side: THREE.DoubleSide,
		vertexShader: landmassVert,
		fragmentShader: landmassFrag
	}
)
const landmass = new THREE.Mesh( landmassGeometry, landmassMaterial );

landmass.translateY(5);
landmass.translateZ(-200)
scene.add(landmass)

//SUN
const sunTexture = textureLoader.load('./materials/sun.png');
const sunGeometry = new THREE.PlaneGeometry(30, 30, 1, 1)
const sunMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide,
		uniforms: {
			sunTexture: { value: sunTexture },
		},
		vertexShader: sunVert,
		fragmentShader: sunFrag
	}
)
const sun = new THREE.Mesh( sunGeometry, sunMaterial );
scene.add(sun)
sun.translateY(75);
sun.translateZ(-30);
sun.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

//CLOUDS
const matrix = new THREE.Matrix4();
const billboardMatrix = new THREE.Matrix4();
const cloudCount = 40;
const smallcloudTexture = textureLoader.load('./materials/smallcloud0.png');
const smallcloudGeometry = new THREE.PlaneGeometry( 30, 25 ); 
const smallcloudMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide,
		uniforms: {
			smallcloudTexture: { value: smallcloudTexture },
			cameraRotation: {value: billboardMatrix}, 
			iTime: { value: 0}
		},
		vertexShader: smallcloudVert,
		fragmentShader: smallcloudFrag
	}
)
const smallcloudMesh = new THREE.InstancedMesh( smallcloudGeometry, smallcloudMaterial, cloudCount );

for ( let i = 0; i < cloudCount; i ++ ) {

	generateCloudPosition( matrix, 2 );
	smallcloudMesh.setMatrixAt( i, matrix );

}
scene.add( smallcloudMesh );


//WIND
const canvas = document.createElement( 'CANVAS' );
    canvas.width = 64;
    canvas.height = 8;

const context = canvas.getContext( '2d' );

const gradient = context.createLinearGradient( 0, 0, 64, 0 );
gradient.addColorStop( 0.0, 'rgba(255,255,255,0)' );
gradient.addColorStop( 0.5, 'rgba(255,255,255,32)' );
gradient.addColorStop( 1.0, 'rgba(255,255,255,0)' );
context.fillStyle = gradient;
context.fillRect( 0, 0, 64, 8 );

const windTexture = new THREE.CanvasTexture( canvas );
const windGeometry = new THREE.PlaneGeometry( 30, 0.025, 20, 1 );
const windMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide,
		uniforms: {
			windTexture: { value: windTexture },
			iTime: { value: 0}
		},
		vertexShader: windVert,
		fragmentShader: windFrag
	}
)
const windCount = 2;
const windLines = [];

const timer = new Timer()
let last = 0.0
var time = 0.0;

for (let i = 0; i < windCount; i ++)
{
	let windLine = new THREE.Mesh( windGeometry, windMaterial );
	scene.add( windLine );
	windLines.push(windLine)
	generateWindLinePosition(windLine)
}
function animate() {
	
	time = timer.getElapsed()
	waterMaterial.uniforms.iTime.value = time;
	smallcloudMaterial.uniforms.iTime.value = time;
	windMaterial.uniforms.iTime.value = time;

	// camera.translateX(0.1);
	
	timer.update()
	if (last + 4 <= time)
	{	
		//clear old
		while (windLines.length > 0)
		{
			scene.remove(windLines.pop())
		}
		//add new
		for (let i = 0; i < windCount; i ++)
		{
			let windLine = new THREE.Mesh( windGeometry, windMaterial );
			scene.add( windLine );
			windLines.push(windLine)
			generateWindLinePosition(windLine)
		}
		last = time
	}
	else {
		for (let i = 0; i < windCount; i ++)
		{
			windLines[i].position.x += 0.75 - (i*0.15)
		}
	
	}

	controls.update();
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
