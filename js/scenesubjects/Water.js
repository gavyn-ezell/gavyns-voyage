import * as THREE from 'three';

import waterVert from '../shaders/water/water.vert.js';
import waterFrag from '../shaders/water/water.frag.js';

const uniforms = {
    water: [new THREE.Vector3(0.0039, 0.4353, 0.7451), new THREE.Vector3(0.051, 0.094, 0.204)],
    darkwater: [new THREE.Vector3(0.01, 0.4118, 0.7176), new THREE.Vector3(0.047, 0.09, 0.2)],
    foam: [new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.45, 0.45, 0.45)]
}

export class Water {
    constructor(scene, camera, dpr, target, textureLoader){
        const waterTexture = textureLoader.load('./textures/water.png');
        waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
        waterTexture.magFilter = THREE.LinearFilter;
        const waterGeometry = new THREE.PlaneGeometry(300, 300, 40, 40 ); 
        this.waterMaterial = new THREE.ShaderMaterial(
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
                        water: {value: uniforms.water[0]},
                        darkwater: {value: uniforms.darkwater[0]},
                        foam: {value: uniforms.foam[0]}
                    },
                ]),
                vertexShader: waterVert,
                fragmentShader: waterFrag
            }
        )

        const depthMaterial = new THREE.MeshDepthMaterial()
        depthMaterial.depthPacking = THREE.RGBADepthPacking;
        depthMaterial.blending = THREE.NoBlending;


        this.waterMaterial.uniforms.resolution.value.set(
            window.innerWidth * dpr,
            window.innerHeight * dpr,
        );
        this.waterMaterial.uniforms.tDepth.value = target.depthTexture;

        this.water = new THREE.Mesh( waterGeometry, this.waterMaterial );
        this.water.rotateX(-Math.PI / 2)
        scene.add(this.water)

    }

    update(time) {
        this.waterMaterial.uniforms.iTime.value = time;
    }

    toggleMode(mode){
        this.waterMaterial.uniforms.water.value = uniforms.water[mode];
        this.waterMaterial.uniforms.darkwater.value = uniforms.darkwater[mode];
        this.waterMaterial.uniforms.foam.value = uniforms.foam[mode];
    }
}