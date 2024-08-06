import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
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
const renderer = new THREE.WebGLRenderer( { antialias: true, precision: "lowp"});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4B8BE5)
scene.fog = new THREE.Fog(0x016fbe, 1, 60)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(70,45, 60)
scene.add( directionalLight );
const ambientlight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientlight );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1100 );
camera.position.set( 0.0, 2, 5);

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)

//LOADERS
const textureLoader = new THREE.TextureLoader();
const objloader = new OBJLoader();
const gltfLoader = new GLTFLoader();


//IMPORTED MODELS
//BOAT
const fourTone = new THREE.TextureLoader().load('./materials/fourTone.jpg')
fourTone.minFilter = THREE.NearestFilter
fourTone.magFilter = THREE.NearestFilter
const boatTexture = new THREE.TextureLoader().load('./materials/boatTexture0.png')
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
		scene.add( toyboat );

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


//NON IMPORTED MODELS
//WATER
const waterTexture = textureLoader.load('./materials/water.png');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
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

const distantWaterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1 ); 
const distantWaterMaterial = new THREE.MeshBasicMaterial({color: 0x016fbe})
const distantWater = new THREE.Mesh( distantWaterGeometry, distantWaterMaterial );
distantWater.translateY(-2)
distantWater.rotateX(-Math.PI / 2)
scene.add(distantWater)

// const geometry = new THREE.PlaneGeometry(2, 2, 1, 1 ); 
// const material = new THREE.MeshBasicMaterial({color: 0x016fbe, side: THREE.DoubleSide})
// const plane = new THREE.Mesh( geometry, material );
// plane.translateY(3)
// scene.add(plane)



//LAND MASSES
// const landmassTexture = textureLoader.load('./materials/landmass0.png');
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
renderer.compile(scene, camera);
function animate() {
	
	time = timer.getElapsed()
	waterMaterial.uniforms.iTime.value = time;
	smallcloudMaterial.uniforms.iTime.value = time;
	windMaterial.uniforms.iTime.value = time;
	timer.update()
	toyboat.setRotationFromAxisAngle(new THREE.Vector3(0,0,1),  (Math.PI / 16) * (0.2*Math.sin(time)))
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
	renderer.render( scene, camera );
}
