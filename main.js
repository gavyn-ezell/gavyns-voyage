import * as THREE from 'three';
import * as helpers from './helpers.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

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

let camera, scene, outlinedScene, effect, clock, renderer, target;
let mode, sceneUniforms;
let listener, song0, song1, sound;
let sunMaterial, horizonMaterial, distantWaterMaterial, waterMaterial, smallcloudMaterial, windMaterial, depthMaterial;

let toyboat, outlinedtoyboat, 
sharkfin, outlinedsharkfin, 
windLine, windLineSpawnPoint,
outlinedplane,
water,foamInteractObjects, 
smallcloudMesh, horizon;

init();
renderer.setAnimationLoop( animate );


function init() {
    
    renderer = new THREE.WebGLRenderer( { antialias: true, precision: "lowp"});
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect = new OutlineEffect( renderer ); 

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4B8BE5)
    scene.fog = new THREE.Fog(0x016fbe, 20, 80)
    outlinedScene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ); directionalLight.position.set(70,45, 60);
    const ambientlight = new THREE.AmbientLight( 0xffffff );
    // scene.add( directionalLight );
    // scene.add( ambientlight );
    outlinedScene.add( directionalLight.clone());
    outlinedScene.add( ambientlight.clone());

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1100 );
    clock = new THREE.Clock(true);

    const loadScreen = document.getElementById("loadscreen");
	const fillElement = document.getElementById("progress-fill");
	const startButton = document.getElementById("start-button");
	startButton.addEventListener("click", () => {loadScreen.classList.add("fadeout"); inLoad = false;})
	loadScreen.addEventListener("transitionend", (e) => {e.target.remove()})
    
	const loadManager = new THREE.LoadingManager();
    loadManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
        // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    loadManager.onLoad = function ( ) {
        console.log( 'Loading complete!');
		document.getElementById("progress-bar").remove();


    };
    
    loadManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
		fillElement.style.width = Math.round(itemsLoaded*100 / itemsTotal) + '%';
    };
    
    loadManager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
    };

    //LOADING MODELS AND BUILDING SCENE
    const textureLoader = new THREE.TextureLoader(loadManager);
    const objloader = new OBJLoader(loadManager);
    const gltfloader = new GLTFLoader(loadManager);
    const audioLoader = new THREE.AudioLoader( loadManager );
    
    listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    song0 = new THREE.Audio( listener );
    song1 = new THREE.Audio(listener);
    sound = song0;

    // load a sound and set it as the Audio object's buffer
    audioLoader.load( '/audio/bubblaine.mp3', function( buffer ) {
        song0.setBuffer( buffer );
        song0.setLoop( true );
        song0.setVolume( 0.2 );
    });

    audioLoader.load( '/audio/bubblaine-underwater.mp3', function( buffer ) {
        song1.setBuffer( buffer );
        song1.setLoop( true );
        song1.setVolume( 0.2 );
    });

    mode = 0;
    sceneUniforms = {
        0:{
            background: new THREE.Color(0x4B8BE5),
            fog: new THREE.Fog(0x016fbe, 20, 80),
            sky: new THREE.Vector3(0.294, 0.545, 0.898),//new THREE.Color(0x4B8BE5),
            sun: new THREE.Vector3(1.0,0.988,0.788),
            horizon: new THREE.Vector3(0.624, 0.902, 1),
            water: new THREE.Vector3(0.0039, 0.4353, 0.7451),
            darkwater: new THREE.Vector3(0.01, 0.4118, 0.7176),
            foam: new THREE.Vector3(1.0, 1.0, 1.0),
            windOpacity: 0.5,

        },
        1: {
            background: new THREE.Color(0x192A58),
            fog: new THREE.Fog(0x0D1834, 10, 70),
            sky: new THREE.Vector3(0.098, 0.165, 0.345),
            sun: new THREE.Vector3(1.0, 1.0, 1.0),
            horizon: new THREE.Vector3(0.051, 0.094, 0.204),
            water: new THREE.Vector3(0.051, 0.094, 0.204),
            darkwater: new THREE.Vector3(0.047, 0.09, 0.2),
            foam: new THREE.Vector3(0.45, 0.45, 0.45),
            windOpacity: 0.1,

        }
    }
    
    foamInteractObjects = [];
    
    //BOAT
    const fourTone = textureLoader.load('./textures/fourTone.jpg')
    fourTone.minFilter = THREE.NearestFilter
    fourTone.magFilter = THREE.NearestFilter
    const boatTexture = textureLoader.load('./textures/boatTexture0.png')
    toyboat = new THREE.Object3D();
    outlinedtoyboat = new THREE.Object3D();
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
            object.scale.set(1.2, 1.2, 1.2)
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

            gltf.scene.scale.set(3, 3, 3);
            gltf.scene.rotateY(3.5*Math.PI/4)
            gltf.scene.position.set(4.5,-0.25, -2.5)
            
            
            island.add(gltf.scene);
            outlinedisland.add(gltf.scene.clone())
            
            foamInteractObjects.push(island)
            scene.add(island);
            outlinedScene.add( outlinedisland);

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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

            gltf.scene.scale.set(1.2, 1.2, 1.2)
            gltf.scene.translateY(-0.8)
            gltf.scene.rotateY(-Math.PI/2.1)
            gltf.scene.position.set(16, -0.8, 12)

            const californiaMaterial = new THREE.MeshToonMaterial( {
                color:0x228B22 ,
                gradientMap: fourTone,
                side: THREE.FrontSide
            } );
            
            gltf.scene.children[0].material = californiaMaterial
            scene.add(gltf.scene)
            outlinedScene.add(gltf.scene.clone())
            foamInteractObjects.push(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );
            console.log( error );

        }
    );

    //BEAR
    const bearTexture = textureLoader.load('./textures/BlackBear_BaseColor.png')
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
            

            object.scale.set(1.2, 1.2, 1.2)
            object.translateY(-0.8)
            object.rotateY(-Math.PI/2.1)
            object.position.set(15, -0.8, 11)
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
        './models/geisel.glb',
        function ( gltf ) {
            
            for (let i = 0; i < gltf.scene.children[0].children.length; i++)
            {
                gltf.scene.children[0].children[i].material = new THREE.MeshToonMaterial( {
                    color: geiselColors[i],
                    gradientMap: fourTone,
                    side: THREE.FrontSide
                } );
            }

            gltf.scene.scale.set(1.2, 1.2, 1.2)
            gltf.scene.position.set(18, -0.8, 14)

            outlinedScene.add(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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
            
            gltf.scene.scale.set(1.8, 1.8, 1.8)
            gltf.scene.rotateY(-Math.PI/2.1)
            gltf.scene.position.set(16, -2, 12)
            outlinedScene.add(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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
            
            gltf.scene.scale.set(1.5, 1.5, 1.5)
            gltf.scene.rotateY(-Math.PI/2.1)
            gltf.scene.position.set(18, -1.5, 14)
            outlinedScene.add(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );
            console.log( error );

        }
    );

    //PLANE
    outlinedplane = new THREE.Object3D();
    gltfloader.load(
        './models/plane.glb',
        function ( gltf ) {
            
            
            const planeMaterial = new THREE.MeshToonMaterial( {
                color: 0xffffff,
                gradientMap: fourTone,
                side: THREE.FrontSide
            } );
            gltf.scene.children[0].material = planeMaterial
            outlinedplane.add(gltf.scene.clone())
            outlinedScene.add( outlinedplane);

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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
            gltf.scene.rotateY(-Math.PI/4)
            gltf.scene.scale.set(1.5, 3.37, 1.5)
            gltf.scene.position.set(25, -1, 25)
            scene.add(gltf.scene)
            outlinedScene.add(gltf.scene.clone())
            foamInteractObjects.push(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );
            console.log( error );

        }
    );

    //SHARK FIN
    sharkfin = new THREE.Object3D();
    outlinedsharkfin = new THREE.Object3D();
    gltfloader.load(
        './models/sharkfin.glb',
        function ( gltf ) {
            
            gltf.scene.scale.set(0.3, 0.3, 0.3)
            gltf.scene.rotateX(0.15)
            sharkfin.add(gltf.scene);
            outlinedsharkfin.add(gltf.scene.clone())
            
            foamInteractObjects.push(sharkfin)
            scene.add(sharkfin);
            outlinedScene.add( outlinedsharkfin);

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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
            
            gltf.scene.rotateY(Math.PI/2.15)
            gltf.scene.scale.set(5,5,5)
            gltf.scene.position.set(40, -1, 27)
            scene.add(gltf.scene)
            outlinedScene.add(gltf.scene.clone())
            foamInteractObjects.push(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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
    const waterGeometry = new THREE.PlaneGeometry(300, 300, 40, 40 ); 
    waterMaterial = new THREE.ShaderMaterial(
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
                    iTime: { value: 0},
                    boatPos: { value: new THREE.Vector2()},
                    water: {value: sceneUniforms[mode].water},
                    darkwater: {value: sceneUniforms[mode].darkwater},
                    foam: {value: sceneUniforms[mode].foam}
                },
            ]		 ),
            vertexShader: waterVert,
            fragmentShader: waterFrag
        }
    )

    let dpr = renderer.getPixelRatio();
    target = new THREE.WebGLRenderTarget( window.innerWidth * dpr, window.innerHeight * dpr );
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;

    target.depthTexture = new THREE.DepthTexture();
    target.depthTexture.type = THREE.UnsignedShortType;
    target.depthTexture.minFilter = THREE.NearestFilter;
    target.depthTexture.maxFilter = THREE.NearestFilter;


    depthMaterial = new THREE.MeshDepthMaterial()
    depthMaterial.depthPacking = THREE.RGBADepthPacking;
    depthMaterial.blending = THREE.NoBlending;


    waterMaterial.uniforms.resolution.value.set(
    window.innerWidth * dpr,
    window.innerHeight * dpr,
    );
    waterMaterial.uniforms.tDepth.value = target.depthTexture;

    water = new THREE.Mesh( waterGeometry, waterMaterial );
    water.rotateX(-Math.PI / 2)
    scene.add(water)

    //DISTANT WATER
    const distantWaterTexture = textureLoader.load('./textures/distantWater.png');
    distantWaterTexture.magFilter = THREE.LinearFilter;
    const distantWaterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1 ); 
    distantWaterMaterial = new THREE.ShaderMaterial(
        {
            uniforms: 
            {
                distantWaterTexture: { value: distantWaterTexture },
                horizon: { value: sceneUniforms[mode].horizon },
                water: { value: sceneUniforms[mode].water },

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
    horizonMaterial = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                horizonTexture: {value : horizonTexture},
                horizon: {value: sceneUniforms[mode].horizon},
                sky: {value: sceneUniforms[mode].sky}
            },
            vertexShader: horizonVert,
            fragmentShader: horizonFrag
        }
    )


    horizon = new THREE.InstancedMesh(horizonGeometry, horizonMaterial, 4)
    for ( let i = 0; i < 4; i++ ) {

        let theta = i*Math.PI/2;
        let mat = new THREE.Matrix4()
        let rotationMat = (new THREE.Matrix4()).makeRotationY(theta)
        let translationMat = (new THREE.Matrix4()).makeTranslation(new THREE.Vector3(-500*Math.sin(theta),20,-500*Math.cos(theta)))
        mat.multiplyMatrices(translationMat, rotationMat);
        horizon.setMatrixAt( i, mat );

    }
    scene.add( horizon );

    //SUN
    const sunTexture = textureLoader.load('./textures/sun.png');
    const sunGeometry = new THREE.PlaneGeometry(125, 125, 1, 1)
    sunMaterial = new THREE.ShaderMaterial(
        {
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            uniforms: {
                sunTexture: { value: sunTexture },
                sun: {value: sceneUniforms[mode].sun},
                sky: {value: sceneUniforms[mode].sky}

            },
            vertexShader: sunVert,
            fragmentShader: sunFrag
        }
    )
    const sun = new THREE.Mesh( sunGeometry, sunMaterial );
    scene.add(sun)
    sun.translateY(200);
    sun.translateZ(-600);
    sun.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

    //CLOUDS
    const matrix = new THREE.Matrix4();
    const cloudCount = 50;
    const smallcloudTexture = textureLoader.load('./textures/smallcloud0.png');
    const smallcloudGeometry = new THREE.PlaneGeometry( 130, 100 ); 
    smallcloudMaterial = new THREE.ShaderMaterial(
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
    smallcloudMesh = new THREE.InstancedMesh( smallcloudGeometry, smallcloudMaterial, cloudCount );

    for ( let i = 0; i < cloudCount; i ++ ) {

        helpers.generateCloudTransformation( matrix );
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
    gradient.addColorStop( 0.5, 'rgba(255,255,255,16)' );
    gradient.addColorStop( 1.0, 'rgba(255,255,255,0)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, 64, 8 );

    const windTexture = new THREE.CanvasTexture( canvas );
    const windGeometry = new THREE.PlaneGeometry( 50, 0.015, 20, 1 );
    windMaterial = new THREE.ShaderMaterial(
        {
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            uniforms: {
                windTexture: { value: windTexture },
                iTime: { value: 0},
                windOpacity: {value: sceneUniforms[mode].windOpacity}
            },
            vertexShader: windVert,
            fragmentShader: windFrag
        }
    )

    windLine = new THREE.Mesh( windGeometry, windMaterial );
    scene.add(windLine);
    windLineSpawnPoint = new THREE.Object3D()
    camera.add(windLineSpawnPoint);
    windLineSpawnPoint.translateZ(-7);
    windLineSpawnPoint.translateX(-20);

    helpers.generateWindLineTransformation( windLine, windLineSpawnPoint);




}
let inLoad = true;
let time = 0.0;
let deltaTime = 0.0;
let last = 0.0
let inForward = false;
let inBackward = false;
let boatX = -20;
let boatOrientation = 0.75;
let boatSpeed = 3;
let rotationSpeed = 1.0;
let sharkCenter = new THREE.Vector3(25, -0.2, 25)
let planeCenter = new THREE.Vector3(16, 4, 8)
let windSpeed = 30.0;
let windDir = new THREE.Vector3(1,0,0)
const text = document.getElementById("voyage-text");

function animate() {
	renderer.clear()
	deltaTime = clock.getDelta()
	time = clock.getElapsedTime()
	
    //TODO FIX THIS GIANT CHUNK OF UNIFORM SETTING, DOESNT HAVE TO BE DONE IN EVERY CALL TO ANIMATE()
    sunMaterial.uniforms.sky.value = sceneUniforms[mode].sky
    sunMaterial.uniforms.sun.value = sceneUniforms[mode].sun
    
    horizonMaterial.uniforms.sky.value = sceneUniforms[mode].sky
    horizonMaterial.uniforms.horizon.value = sceneUniforms[mode].horizon;

    distantWaterMaterial.uniforms.horizon.value = sceneUniforms[mode].horizon;
    distantWaterMaterial.uniforms.water.value = sceneUniforms[mode].water;
    
    waterMaterial.uniforms.water.value = sceneUniforms[mode].water
    waterMaterial.uniforms.darkwater.value = sceneUniforms[mode].darkwater
    waterMaterial.uniforms.foam.value = sceneUniforms[mode].foam

    windMaterial.uniforms.windOpacity.value = sceneUniforms[mode].windOpacity

	
    
    waterMaterial.uniforms.iTime.value = time;
	smallcloudMaterial.uniforms.iTime.value = time;
	windMaterial.uniforms.iTime.value = time;
	
	//handling boat movement
	if(inForward && !inBackward)
	{
		if (boatOrientation < 1.0)
		{
			boatOrientation += deltaTime*rotationSpeed
		}
		else {
			boatOrientation = 1.0;
			boatX = Math.min(39.5, boatX+deltaTime*boatSpeed);
		}
	}
	else if(!inForward && inBackward)
	{
		if (boatOrientation > 0.0)
		{
			boatOrientation -= deltaTime*rotationSpeed
		}
		else {
			boatOrientation = 0;
			boatX = Math.max(-20, boatX-deltaTime*boatSpeed);
		}
	}

	//handling UI
	helpers.changeText(text, boatX)


	//handling boat position and orientation
	toyboat.position.copy(helpers.calculateBoatPosition(boatX, time))
	outlinedtoyboat.position.copy(helpers.calculateBoatPosition(boatX, time))


	let lookPos = toyboat.position.clone()
	helpers.calculateBoatOrientation(lookPos, boatX, time, boatOrientation)
	toyboat.lookAt(lookPos)
	outlinedtoyboat.lookAt(lookPos)

	//handling camera
    if (inLoad) 
    {
        camera.position.copy(new THREE.Vector3(25, 25, 25));
        camera.lookAt(new THREE.Vector3(25, 0, 25));
    }
    else {
        let cameraPos = toyboat.position.clone()
        cameraPos.y = 0;
        helpers.calculateCameraPosition(cameraPos, boatX, time)
        cameraPos.y += 4
        camera.position.copy(cameraPos)
    
        let cameraLook = toyboat.position.clone()
        cameraLook.y = 3
        camera.lookAt(cameraLook)
    }
   


	//handling wind
	if (last + 6  <= time)
	{	
        
        helpers.generateWindLineTransformation(windLine, windLineSpawnPoint);
		last = time;
	}
	else {
		windLine.translateOnAxis(windDir, windSpeed*deltaTime)
	}
	
	//handling sharkfin position and orientation
	let sharkPos = helpers.calculateSharkPosition(2.25,sharkCenter, time)
	sharkfin.position.copy(sharkPos)
	outlinedsharkfin.position.copy(sharkPos)

	let sharkLook = helpers.calculateSharkPosition(2.25, sharkCenter, time+0.1)
	sharkfin.lookAt(sharkLook)
	outlinedsharkfin.lookAt(sharkLook)

	//handling paper plane position and orientation
	let planePos = helpers.calculatePlanePosition(4, planeCenter, -time)
	outlinedplane.position.copy(planePos)
	let planeLook = helpers.calculatePlanePosition(4, planeCenter, -time-0.1)
	outlinedplane.lookAt(planeLook)


	
	//depth render
	water.visible = false;
	windLine.visible = false;
	for (let x in foamInteractObjects) { foamInteractObjects[x].visible = true;}
	scene.overrideMaterial = depthMaterial;
	renderer.setRenderTarget(target);
	renderer.render(scene, camera);

	//main render
	water.visible = true;
	windLine.visible = true;
	for (let x in foamInteractObjects) { foamInteractObjects[x].visible = false;}
	scene.overrideMaterial = null;
	renderer.setRenderTarget(null);
	renderer.render(scene, camera)

	//outline render
	effect.render(outlinedScene, camera);

}

const wrapper = document.getElementById("wrapper")
const renderElement = renderer.domElement;
renderElement.classList.add("in-wrapper");
wrapper.appendChild( renderer.domElement);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	let pixelRatio = renderer.getPixelRatio()
	target.setSize(window.innerWidth * pixelRatio, window.innerHeight *pixelRatio,)

	waterMaterial.uniforms.resolution.value.set(
		window.innerWidth * pixelRatio,
		window.innerHeight * pixelRatio,
	);

}

window.addEventListener( 'resize', onWindowResize, false );

//handling movement
window.addEventListener( "keydown", (event) => {
	if (event.key == "d")
	{
		inForward = true;
	}
	else if (event.key == "a")
	{
		inBackward = true;
	}}, false,
  );

window.addEventListener( "keyup", (event) => {
	if (event.key == "d")
	{
		inForward = false;
	}
	else if (event.key == "a")
	{
		inBackward = false;
	}}, false,
  );

let mute = true;
const musicButton = document.getElementsByTagName("img")[0]
musicButton.addEventListener("click", () => {
    mute = !mute;
    if (mute){
        musicButton.src = "/images/muteicon.png"
        sound.pause();
    }
    else{
        musicButton.src = "/images/volumeicon.png"
        sound.play();
    }
});

let light = true;
const modeButton = document.getElementsByTagName("img")[1]
modeButton.addEventListener("click", () => {
    light = !light;
    mode = 1 - mode;
    helpers.updateMode(mode, scene, smallcloudMesh, horizon, sceneUniforms)
    if (light){
        text.style.color = "rgb(35, 35, 35)"
        modeButton.src = "/images/darkicon.png"
        sound.pause();
        sound = song0;
        if (!mute)
        {
            sound.play();
        }
    }
    else{
        text.style.color = "rgb(230,230, 230)"
        modeButton.src = "/images/lighticon.png"
        sound.pause();
        sound = song1;
        if (!mute)
        {
            sound.play();
        }
    }
});


