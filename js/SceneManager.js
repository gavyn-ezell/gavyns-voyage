import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

import { Lights } from './scenesubjects/Lights.js'
import { Clouds } from './scenesubjects/Clouds.js'
import { Sounds } from './scenesubjects/Sounds.js'
import { Sun } from './scenesubjects/Sun.js'
import { Water } from './scenesubjects/Water.js'
import { DistantWater } from './scenesubjects/DistantWater.js'
import { Horizon } from './scenesubjects/Horizon.js'
import { Boat } from './scenesubjects/Boat.js'
import { Wind } from './scenesubjects/Wind.js'
import { Island } from './scenesubjects/Island.js'
import { California } from './scenesubjects/California.js'
import { Oilrig } from './scenesubjects/Oilrig.js'
import { Shark } from './scenesubjects/Shark.js'
import { FinalIsland } from './scenesubjects/FinalIsland.js'

const uniforms = {

    background: [new THREE.Color(0x4B8BE5), new THREE.Color(0x192A58)],
    fog: [new THREE.Fog(0x016fbe, 20, 80), new THREE.Fog(0x0D1834, 10, 70)],
} 
export class SceneManager {
    constructor() {
        //essential setup
        this.clock = new THREE.Clock(true);
        this.renderer = createRenderer();
        this.renderer.setAnimationLoop(this.animationLoop.bind(this))
        this.effect = new OutlineEffect( this.renderer ) 

        this.target = createTarget(this.renderer);

        this.depthMaterial = new THREE.MeshDepthMaterial()
        this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
        this.depthMaterial.blending = THREE.NoBlending;

        this.scene = createScene()
        this.outlinedscene = createOutlinedScene()

        this.camera = createCamera();
        this.camera.position.copy(new THREE.Vector3(25, 25, 25));
        this.camera.lookAt(new THREE.Vector3(25, 0, 25));
        this.inLoad = true;

        //audio setup
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener)

        this.mode = 0;
        this.mute = 1;
        this.foamInteractObjects = [];
        
        this.loadManager = createLoadingManager(this);
        
        this.textureLoader = new THREE.TextureLoader(this.loadManager);
        this.objLoader = new OBJLoader(this.loadManager);
        this.gltfLoader = new GLTFLoader(this.loadManager);
        this.audioLoader = new THREE.AudioLoader( this.loadManager );

        this.boatX = -20;
        this.boatOrientation = 1.0;
        this.velocity = 0;
        this.forwardKeyPressed = false;
        this.backKeyPressed = false;
        
        this.sceneSubjects = createSceneSubjects(
            this.scene, 
            this.outlinedscene, 
            this.camera,
            this.renderer.getPixelRatio(),
            this.target,
            this.textureLoader,
            this.listener, 
            this.audioLoader,
            this.objLoader,
            this.gltfLoader,
            this.foamInteractObjects
        );
    }
    animationLoop () {
        this.renderer.clear()
	    let deltaTime = this.clock.getDelta()
        let time = this.clock.getElapsedTime()
        
        this.sceneSubjects.clouds.update(time);
        this.sceneSubjects.water.update(time);
        
        if (this.forwardKeyPressed && !this.backKeyPressed) {
            this.velocity = 3.5;
        }
        else if (!this.forwardKeyPressed && this.backKeyPressed){
            this.velocity = -3.5;
        }


        //FORWARD
        if (this.velocity > 0.0) {
            this.velocity = Math.max(0.0, this.velocity - 15.0*deltaTime)
            if (this.boatOrientation < 1.0) {
                this.boatOrientation = Math.min(1.0, this.boatOrientation + this.velocity*deltaTime/4)
            }
            else {
                this.boatOrientation = 1.0;
                this.boatX = Math.min(39.5, this.boatX + this.velocity * deltaTime)
            }
        }
        else if (this.velocity < 0.0) {
            this.velocity = Math.min(0.0, this.velocity + 15.0*deltaTime)
            if (this.boatOrientation > 0.0) {
                this.boatOrientation = Math.max(0.0, this.boatOrientation + this.velocity*deltaTime/4)
            }
            else {
                this.boatOrientation = 0.0;
                this.boatX = Math.max(-20, this.boatX + this.velocity * deltaTime)
            }
        }

        this.sceneSubjects.boat.update(time, this.inLoad, this.camera, this.boatX, this.boatOrientation);
        
        
        this.sceneSubjects.wind.update(time, deltaTime)
        this.sceneSubjects.california.update(time);
        this.sceneSubjects.shark.update(time);


        //DEPTH RENDER
        this.sceneSubjects.water.water.visible = false;
        this.sceneSubjects.wind.windLine.visible = false;
        for (let x in this.foamInteractObjects) { this.foamInteractObjects[x].visible = true;}
        this.scene.overrideMaterial = this.depthMaterial;
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        //FOAM RENDER
        this.sceneSubjects.water.water.visible = true;
        this.sceneSubjects.wind.windLine.visible = true;
        for (let x in this.foamInteractObjects) { this.foamInteractObjects[x].visible = false;}
        this.scene.overrideMaterial = null;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera)

        //FINAL RENDER
        this.effect.render(this.outlinedscene, this.camera);
    }
    
    toggleSound(){
        this.mute = 1 - this.mute;
        this.sceneSubjects.sounds.toggleSound(this.mute);

    }
    
    toggleMode(){
        this.mode = 1 - this.mode;
        this.scene.background = uniforms.background[this.mode];
        this.scene.fog = uniforms.fog[this.mode];

        for (const [key, value] of Object.entries(this.sceneSubjects)) {
            if (key == "sounds") {
                value.toggleMode(this.mute, this.mode)
            }
            else
            {
                value.toggleMode(this.mode);
            }
        }

    }

    giveVelocity(velocity){
        this.velocity = velocity;
    }





    
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        let pixelRatio = this.renderer.getPixelRatio()
        this.target.setSize(window.innerWidth * pixelRatio, window.innerHeight *pixelRatio,)
    
        this.sceneSubjects.water.waterMaterial.uniforms.resolution.value.set(
        	window.innerWidth * pixelRatio,
        	window.innerHeight * pixelRatio,
        );
    
    }


}

function createRenderer() {
   
    let renderer = new THREE.WebGLRenderer( { antialias: true, precision: "lowp"});
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;

}

function createScene() {
    
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4B8BE5)
    scene.fog = new THREE.Fog(0x016fbe, 20, 80);

    return scene;

}

function createOutlinedScene() {

    return new THREE.Scene();
}

function createCamera() {

    let camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1100 );
    return camera
}

function createLoadingManager(scenemanager) {
    let manager = new THREE.LoadingManager();
    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    };
    manager.onLoad = () => {
		document.getElementById("progress-bar").remove();
        scenemanager.inLoad = false;

    };
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        let fillElement = document.getElementById("progress-fill");
		fillElement.style.width = Math.round(itemsLoaded*100 / itemsTotal) + '%';
    };
    
    manager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
    };
    return manager;


}

function createTarget(renderer) {
    let dpr = renderer.getPixelRatio();
    let target = new THREE.WebGLRenderTarget( window.innerWidth * dpr, window.innerHeight * dpr );
    target.texture.minFilter = THREE.NearestFilter;
    target.texture.magFilter = THREE.NearestFilter;

    target.depthTexture = new THREE.DepthTexture();
    target.depthTexture.type = THREE.UnsignedShortType;
    target.depthTexture.minFilter = THREE.NearestFilter;
    target.depthTexture.maxFilter = THREE.NearestFilter;
    return target;


}

function createSceneSubjects(scene, outlinedscene, camera, 
                            dpr, target, 
                            textureLoader, listener, audioLoader, objLoader, gltfLoader,
                            foamInteractObjects) {
    const subjects = {
        lights: new Lights(outlinedscene),
        clouds: new Clouds(scene, textureLoader),
        sounds: new Sounds(listener, audioLoader),
        sun: new Sun(scene, textureLoader),
        water: new Water(scene, camera, dpr, target, textureLoader),
        horizon: new Horizon(scene, textureLoader),
        distantwater: new DistantWater(scene, textureLoader),
        boat: new Boat(scene, outlinedscene, textureLoader, objLoader, foamInteractObjects),
        wind: new Wind(scene, camera),
        island: new Island(scene, outlinedscene, gltfLoader, foamInteractObjects),
        california: new California(scene, outlinedscene, textureLoader, gltfLoader, objLoader, foamInteractObjects),
        oilrig: new Oilrig(scene, outlinedscene, gltfLoader, foamInteractObjects),
        shark: new Shark(scene, outlinedscene, gltfLoader, foamInteractObjects),
        finalisland: new FinalIsland(scene, outlinedscene, gltfLoader, foamInteractObjects)
    }

    return subjects;
}


