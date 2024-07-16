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


const cloudCount = 40;
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
const waterGeometry = new THREE.CircleGeometry( 100, 16 ); 
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

const smallcloudTexture = textureLoader.load('./materials/smallcloud0.png');
const smallcloudGeometry = new THREE.PlaneGeometry( 40, 40 ); 
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

const mediumcloudTexture = textureLoader.load('./materials/mediumcloud01.png');
const mediumcloudGeometry = new THREE.PlaneGeometry( 80, 20 ); 
const mediumcloudMaterial = new THREE.ShaderMaterial(
	{
		transparent: true,
		depthWrite: false,
		side: THREE.DoubleSide,
		uniforms: {
			mediumcloudTexture: { value: mediumcloudTexture },
			cameraRotation: {value: billboardMatrix}, 
			iTime: { value: 0}
		},
		vertexShader: mediumcloudVert,
		fragmentShader: mediumcloudFrag
	}
)
const mediumcloudMesh = new THREE.InstancedMesh( mediumcloudGeometry, mediumcloudMaterial, cloudCount );



for ( let i = 0; i < cloudCount; i ++ ) {

	generateCloudPosition( matrix, 2 );
	smallcloudMesh.setMatrixAt( i, matrix );

	generateCloudPosition( matrix, 1 );
	mediumcloudMesh.setMatrixAt( i, matrix );

}
scene.add( smallcloudMesh );
scene.add( mediumcloudMesh );



function animate() {
    controls.update();
	waterMaterial.uniforms.iTime.value += 0.01;
	smallcloudMaterial.uniforms.iTime.value += 0.01;
	mediumcloudMaterial.uniforms.iTime.value += 0.01;

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
