import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { Timer } from 'three/addons/misc/Timer.js';
import {generateCloudTransformation, generateWindLinePosition} from './helpers.js';

//SHADER IMPORTS
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



//BOILERPLATE SCENE SETUP
let camera, scene, outlinedScene, renderer, effect;
renderer = new THREE.WebGLRenderer( { antialias: true, precision: "lowp"});
renderer.autoClear = false;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );
effect = new OutlineEffect( renderer );



scene = new THREE.Scene();
scene.background = new THREE.Color(0x4B8BE5)
scene.fog = new THREE.Fog(0x016fbe, 1, 50)
outlinedScene = new THREE.Scene();
outlinedScene.fog = new THREE.Fog(0x016fbe, 1, 50)


const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ); directionalLight.position.set(70,45, 60);
const ambientlight = new THREE.AmbientLight( 0xffffff );
scene.add( directionalLight );
scene.add( ambientlight );
outlinedScene.add( directionalLight.clone());
outlinedScene.add( ambientlight.clone());

camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1100 );
camera.position.set( 0, 5, 10);


const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents(window)


//LOADERS
const textureLoader = new THREE.TextureLoader();
const objloader = new OBJLoader();
const gltfloader = new GLTFLoader();


const foamInteractObjects = [];
//BOAT
const fourTone = new THREE.TextureLoader().load('./textures/fourTone.jpg')
fourTone.minFilter = THREE.NearestFilter
fourTone.magFilter = THREE.NearestFilter
const boatTexture = new THREE.TextureLoader().load('./textures/boatTexture0.png')
const toyboat = new THREE.Object3D();
const outlinedtoyboat = new THREE.Object3D();
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
		outlinedtoyboat.add(object.clone())
		
		foamInteractObjects.push(toyboat)
		scene.add(toyboat);
		outlinedScene.add( outlinedtoyboat);

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

//ISLAND
const island = new THREE.Object3D();
const outlinedisland = new THREE.Object3D();
gltfloader.load(
	'./models/island.glb',
	function ( gltf ) {

		gltf.scene.scale.set(2.5, 2.5, 2.5);
		gltf.scene.rotateY(-Math.PI)
		gltf.scene.translateY(-0.2)
		gltf.scene.translateX(-5)
		gltf.scene.translateZ(6.5)
		
		
		island.add(gltf.scene);
		outlinedisland.add(gltf.scene.clone())
		
		foamInteractObjects.push(island)
		scene.add(island);
		outlinedScene.add( outlinedisland);

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);


//CALIFORNIA
gltfloader.load(
	'./models/cali.glb',
	function ( gltf ) {

		gltf.scene.translateY(-0.5)
		gltf.scene.rotateY(-Math.PI/2.1)
		gltf.scene.position.set(16, -0.6, 8)
		scene.add(gltf.scene)
		outlinedScene.add(gltf.scene.clone())
		foamInteractObjects.push(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);
//BEAR
const bearTexture = new THREE.TextureLoader().load('./textures/BlackBear_BaseColor.png')
objloader.load(
	'./models/bear.obj',
	// called when resource is loaded
	function ( object ) {

		const bearMaterial = new THREE.MeshToonMaterial( {
			color: 0x999999,
			map: bearTexture,
			gradientMap: fourTone,
			side: THREE.FrontSide
		} );
		object.traverse((node) => {
			node.material = bearMaterial
		});
		
		object.translateY(-0.5)
		object.rotateY(-Math.PI/2.1)
		object.position.set(16, -0.6, 8)
		outlinedScene.add(object)



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

//GEISEL
const geiselColors = [0x8C9091, 0xA5A9AA, 0xA5A9AA, 0xA5A9AA, 0x222222, 0x94C1D8];
gltfloader.load(
	'./models/geisel.gltf',
	function ( gltf ) {
		
		for (let i = 0; i < gltf.scene.children[0].children.length; i++)
		{
			gltf.scene.children[0].children[i].material = new THREE.MeshToonMaterial( {
				color: geiselColors[i],
				gradientMap: fourTone,
				side: THREE.FrontSide
			} );
		}

		gltf.scene.translateY(-0.5)
		gltf.scene.rotateY(-Math.PI/2.1)
		gltf.scene.position.set(16, -0.6, 8)

		outlinedScene.add(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);

//FLAG
gltfloader.load(
	'./models/flag.glb',
	function ( gltf ) {
		
		gltf.scene.translateY(-0.5)
		gltf.scene.rotateY(-Math.PI/2.1)
		gltf.scene.position.set(16, -0.6, 8)
		outlinedScene.add(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);

//UCSD FLAG
gltfloader.load(
	'./models/ucsdflag.glb',
	function ( gltf ) {
		
		gltf.scene.translateY(-0.5)
		gltf.scene.rotateY(-Math.PI/2.1)
		gltf.scene.position.set(16, -0.6, 8)
		outlinedScene.add(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);



//OIL RIG
gltfloader.load(
	'./models/oilrig.glb',
	function ( gltf ) {
		
		gltf.scene.translateY(-0.2)
		gltf.scene.scale.set(1.2, 1.8, 1.2)
		gltf.scene.position.set(25, 0.0, 20)
		scene.add(gltf.scene)
		outlinedScene.add(gltf.scene.clone())
		foamInteractObjects.push(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
		console.log( error );

	}
);

//FINAL ISLAND
gltfloader.load(
	'./models/finalisland.glb',
	function ( gltf ) {
		
		gltf.scene.rotateY(Math.PI/2)
		gltf.scene.scale.set(4,4,4)
		gltf.scene.position.set(40, -0.5, 20)
		scene.add(gltf.scene)
		outlinedScene.add(gltf.scene.clone())
		foamInteractObjects.push(gltf.scene)

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
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
				threshold: {
					value: 0.025
				  },
				  tDepth: {
					value: null
				  },
				  cameraNear: {
					value: camera.near
				  },
				  cameraFar: {
					value: camera.far
				  },
				  resolution: {
					value: new THREE.Vector2()
				  },
				iTime: { value: 0}
			},
		]		 ),
		vertexShader: waterVert,
		fragmentShader: waterFrag
	}
)

let dpr = renderer.getPixelRatio();
const target = new THREE.WebGLRenderTarget( window.innerWidth * dpr, window.innerHeight * dpr );
target.texture.minFilter = THREE.NearestFilter;
target.texture.magFilter = THREE.NearestFilter;

target.depthTexture = new THREE.DepthTexture();
target.depthTexture.type = THREE.UnsignedShortType;
target.depthTexture.minFilter = THREE.NearestFilter;
target.depthTexture.maxFilter = THREE.NearestFilter;


const depthMaterial = new THREE.MeshDepthMaterial()
depthMaterial.depthPacking = THREE.RGBADepthPacking;
depthMaterial.blending = THREE.NoBlending;


waterMaterial.uniforms.resolution.value.set(
window.innerWidth * dpr,
window.innerHeight * dpr,
);
waterMaterial.uniforms.tDepth.value = target.depthTexture;

const water = new THREE.Mesh( waterGeometry, waterMaterial );
water.translateX(20)
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
const windGeometry = new THREE.PlaneGeometry( 40, 0.025, 20, 1 );
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

function animate() {
	renderer.clear()

	//depth render
	water.visible = false;
	windLines[0].visible = false;
	for (let x in foamInteractObjects) { foamInteractObjects[x].visible = true;}
	scene.overrideMaterial = depthMaterial;
	renderer.setRenderTarget(target);
	renderer.render(scene, camera);

	//main render
	water.visible = true;
	windLines[0].visible = true;
	for (let x in foamInteractObjects) { foamInteractObjects[x].visible = false;}
	scene.overrideMaterial = null;
	renderer.setRenderTarget(null);
	renderer.render(scene, camera)

	//outline render
	effect.render(outlinedScene, camera);
	
	time = timer.getElapsed()
	waterMaterial.uniforms.iTime.value = time;
	smallcloudMaterial.uniforms.iTime.value = time;
	windMaterial.uniforms.iTime.value = time;
	toyboat.setRotationFromAxisAngle(new THREE.Vector3(1,0,0),  (Math.PI / 10) * (0.2*Math.sin(time)))
	outlinedtoyboat.setRotationFromAxisAngle(new THREE.Vector3(1,0,0),  (Math.PI / 10) * (0.2*Math.sin(time)))
	timer.update()
	if (last + 6 <= time)
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
