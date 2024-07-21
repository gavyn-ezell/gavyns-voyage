import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {generateCloudPosition} from './helpers.js';

//ALL SHADER IMPORTS
import waterVert from './shaders/water/water.vert.js';
import waterFrag from './shaders/water/water.frag.js';

import smallcloudVert from './shaders/smallcloud/smallcloud.vert.js';
import smallcloudFrag from './shaders/smallcloud/smallcloud.frag.js';
import mediumcloudVert from './shaders/mediumcloud/mediumcloud.vert.js';
import mediumcloudFrag from './shaders/mediumcloud/mediumcloud.frag.js';

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

//LIGHTING, FOG
const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
scene.add( ambientLight)
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
scene.background = new THREE.Color(0x4B8BE5)
scene.fog = new THREE.Fog( 0xcccccc, 70, 150);

//loading our island scene as gltf
const loader = new GLTFLoader();
loader.load( './materials/island.gltf', function ( gltf ) {

	gltf.scene.rotation.set(0, Math.PI, 0);
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//ADDING
const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('./materials/water.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.magFilter = THREE.LinearFilter;
const waterGeometry = new THREE.PlaneGeometry( 125, 125, 50, 50 ); 
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
scene.add( water);




const matrix = new THREE.Matrix4();
const billboardMatrix = new THREE.Matrix4();
const cloudCount = 50;
const smallcloudTexture = textureLoader.load('./materials/smallcloud0.png');
const smallcloudGeometry = new THREE.PlaneGeometry( 35, 35 ); 
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


//WIND LINE STUFF
var canvas = document.createElement( 'CANVAS' );
    canvas.width = 64;
    canvas.height = 8;

var context = canvas.getContext( '2d' );

var gradient = context.createLinearGradient( 0, 0, 64, 0 );
		gradient.addColorStop( 0.0, 'rgba(255,255,255,0)' );
		gradient.addColorStop( 0.5, 'rgba(255,255,255,128)' );
		gradient.addColorStop( 1.0, 'rgba(255,255,255,0)' );
		context.fillStyle = gradient;
    context.fillRect( 0, 0, 64, 8 );

var texture = new THREE.CanvasTexture( canvas );

const windGeometry = new THREE.PlaneGeometry( 5, 0.05, 20, 1 );
const windMaterial = new THREE.MeshBasicMaterial( {map: texture, transparent: true, depthWrite: false, color: 0xffffff, side: THREE.DoubleSide} );
const windLine = new THREE.Mesh( windGeometry, windMaterial );
scene.add( windLine );
windLine.position.y += 2;
windLine.position.z -= 2;

let vertices = windGeometry.attributes.position.array;
let ogVals = [];
for (let i = 0; i < windGeometry.attributes.position.count; i ++)
	{

		ogVals.push(vertices[ i * 3 ])
		ogVals.push(vertices[ i * 3 + 1])
		ogVals.push(vertices[ i * 3 + 2])
	}


function waveFunction(inx, iny, time) {
	let x = inx + time*2.5;
	let y = iny + time*2.5;
	let offset = 0.5*(Math.sin(0.2*x + 0.3*y) + 1.5 * Math.sin(0.1*x - 0.2*y));

	return offset;
}


let globalTime = 0.0;
function animate() {
    controls.update();
	waterMaterial.uniforms.iTime.value += 0.01;
	smallcloudMaterial.uniforms.iTime.value += 0.01;
	globalTime += 0.01;

	for (let i = 0; i < windGeometry.attributes.position.count; i ++)
	{
		vertices[ i * 3 + 1 ] = ogVals[i * 3 + 1] + waveFunction(ogVals[i * 3 ], ogVals[i * 3 + 1 ], globalTime)
	}
	windGeometry.attributes.position.needsUpdate = true;

	
	controls.update();
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
