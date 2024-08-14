import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { Timer } from 'three/addons/misc/Timer.js';
import {generateCloudTransformation, generateWindLinePosition} from './helpers.js';

//ALL SHADER IMPORTS
import waterVert from './shaders/water/water.vert.js';
import waterFrag from './shaders/water/water.frag.js';
import distantWaterVert from './shaders/distantwater/distantwater.vert.js';
import distantWaterFrag from './shaders/distantwater/distantwater.frag.js';
import horizonVert from './shaders/horizon/horizon.vert.js';
import horizonFrag from './shaders/horizon/horizon.frag.js';

import sunVert from './shaders/sun/sun.vert.js';
import sunFrag from './shaders/sun/sun.frag.js';
import cloudVert from './shaders/cloud/cloud.vert.js';
import smallcloudFrag from './shaders/cloud/smallcloud.frag.js';
import windVert from './shaders/wind/wind.vert.js';
import windFrag from './shaders/wind/wind.frag.js';


//BASIC SETUP: RENDERER, CAMERA, SCENE, CONTROLS, LIGHITNG
const renderer = new THREE.WebGLRenderer( { antialias: true, precision: "lowp"});
renderer.autoClear = false;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4B8BE5)
scene.fog = new THREE.Fog(0x016fbe, 1, 40)
const outlinedScene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(70,45, 60)
const ambientlight = new THREE.AmbientLight( 0xffffff );

scene.add( directionalLight );
scene.add( ambientlight );
outlinedScene.add( directionalLight );
outlinedScene.add( ambientlight );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 );
camera.position.set( 0.0, 2, 5);

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)
controls.minDistance = 1;
controls.maxDistance = 1000;


//LOADERS
const textureLoader = new THREE.TextureLoader();
const objloader = new OBJLoader();
const gltfLoader = new GLTFLoader();

//BOAT
const fourTone = new THREE.TextureLoader().load('./textures/fourTone.jpg')
fourTone.minFilter = THREE.NearestFilter
fourTone.magFilter = THREE.NearestFilter
const boatTexture = new THREE.TextureLoader().load('./textures/boatTexture0.png')
let toyboat = new THREE.Object3D();
objloader.load(
	'./models/toyboat.obj',
	// called when resource is loaded
	function ( object ) {

		const boatMaterial = new THREE.MeshToonMaterial( {
			map: boatTexture,
			gradientMap: fourTone,
			side: THREE.FrontSide
		} );
		object.traverse((node) => {
			node.material = boatMaterial
		});
		toyboat.add(object);
		toyboat.scale.set(0.7, 0.7, 0.7)
		outlinedScene.add( toyboat );

	},
	// called when loading is in progresses
	function ( xhr ) {

		// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( error );

	}
);


//WATER
const waterTexture = textureLoader.load('./textures/water.png');
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const waterGeometry = new THREE.PlaneGeometry(125, 125, 20, 20 ); 
const waterMaterial = new THREE.ShaderMaterial(
	{
		fog: true,
		uniforms: THREE.UniformsUtils.merge( [
			THREE.UniformsLib[ 'fog' ],
  			{
				waterTexture: { value: waterTexture },
				iTime: { value: 0}
			},
		]		 ),
		vertexShader: waterVert,
		fragmentShader: waterFrag
	}
)
const water = new THREE.Mesh( waterGeometry, waterMaterial );
water.rotateX(-Math.PI / 2)
scene.add(water)

//DISTANT WATER
const distantWaterTexture = textureLoader.load('./textures/distantWater.png');
distantWaterTexture.magFilter = THREE.LinearFilter;
const distantWaterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1 ); 
const distantWaterMaterial = new THREE.ShaderMaterial(
	{
		uniforms: 
  		{
			distantWaterTexture: { value: distantWaterTexture },
		},
		vertexShader: distantWaterVert,
		fragmentShader: distantWaterFrag
	}
)
const distantWater = new THREE.Mesh( distantWaterGeometry, distantWaterMaterial );
distantWater.translateY(-2)
distantWater.rotateX(-Math.PI / 2)
scene.add(distantWater)

//HORIZON
const horizonTexture = textureLoader.load('./textures/horizon.png');
const horizonGeometry = new THREE.PlaneGeometry(1000, 150, 1, 1);
const horizonMaterial = new THREE.ShaderMaterial(
	{
		uniforms:
		{
			horizonTexture: {value : horizonTexture}
		},
		vertexShader: horizonVert,
		fragmentShader: horizonFrag
	}
)

const horizon = new THREE.InstancedMesh(horizonGeometry, horizonMaterial, 4)
for ( let i = 0; i < 4; i++ ) {

	let theta = i*Math.PI/2;
	let mat = new THREE.Matrix4()
	let rotationMat = (new THREE.Matrix4()).makeRotationY(theta)
	let translationMat = (new THREE.Matrix4()).makeTranslation(new THREE.Vector3(-500*Math.sin(theta),30,-500*Math.cos(theta)))
	mat.multiplyMatrices(translationMat, rotationMat);
	horizon.setMatrixAt( i, mat );

}
scene.add( horizon );



//LAND MASSES
// const landmassTexture = textureLoader.load('./textures/landmass0.png');
// landmassTexture.magFilter = THREE.LinearFilter;
// const landmassGeometry = new THREE.PlaneGeometry(700, 20, 20, 1)
// const landmassMaterial = new THREE.ShaderMaterial(
// 	{
// 		transparent: true,
// 		depthWrite: false,
// 		uniforms: {
// 			landmassTexture: { value: landmassTexture },
// 		},
// 		side: THREE.DoubleSide,
// 		vertexShader: landmassVert,
// 		fragmentShader: landmassFrag
// 	}
// )
// const landmass = new THREE.Mesh( landmassGeometry, landmassMaterial );

// landmass.translateZ(-1000)
// scene.add(landmass)

//SUN
const sunTexture = textureLoader.load('./textures/sun.png');
const sunGeometry = new THREE.PlaneGeometry(150, 150, 1, 1)
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
sun.translateY(400);
sun.translateZ(-100);
sun.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

//CLOUDS
const matrix = new THREE.Matrix4();
const cloudCount = 50;
const smallcloudTexture = textureLoader.load('./textures/smallcloud0.png');
const smallcloudGeometry = new THREE.PlaneGeometry( 130, 100 ); 
const smallcloudMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		uniforms: {
			smallcloudTexture: { value: smallcloudTexture },
			iTime: { value: 0}
		},
		vertexShader: cloudVert,
		fragmentShader: smallcloudFrag
	}
)
const smallcloudMesh = new THREE.InstancedMesh( smallcloudGeometry, smallcloudMaterial, cloudCount );

for ( let i = 0; i < cloudCount; i ++ ) {

	generateCloudTransformation( matrix, 0 );
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
const windCount = 1;
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

const effect = new OutlineEffect( renderer );
function animate() {
	renderer.clear()
	renderer.render( scene, camera );
	effect.render(outlinedScene, camera);
	
	time = timer.getElapsed()
	waterMaterial.uniforms.iTime.value = time;
	smallcloudMaterial.uniforms.iTime.value = time;
	windMaterial.uniforms.iTime.value = time;
	toyboat.setRotationFromAxisAngle(new THREE.Vector3(1,0,0),  (Math.PI / 10) * (0.2*Math.sin(time)))
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
			windLines[i].position.x += 0.7 - (i*0.2)
		}
	
	}

	controls.update();
}
