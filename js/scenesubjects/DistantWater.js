import * as THREE from 'three';

import distantWaterVert from '../shaders/distantwater/distantwater.vert.js';
import distantWaterFrag from '../shaders/distantwater/distantwater.frag.js';

const uniforms = {
    horizon: [new THREE.Vector3(0.624, 0.902, 1),new THREE.Vector3(0.051, 0.094, 0.204)],
    water: [new THREE.Vector3(0.0039, 0.4353, 0.7451), new THREE.Vector3(0.051, 0.094, 0.204)]
}
export class DistantWater {
    constructor(scene, textureLoader) {
        const distantWaterTexture = textureLoader.load('./textures/distantWater.png');
        distantWaterTexture.magFilter = THREE.LinearFilter;
        const distantWaterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1 ); 
        this.distantWaterMaterial = new THREE.ShaderMaterial(
            {
                uniforms: 
                {
                    distantWaterTexture: { value: distantWaterTexture },
                    horizon: { value: uniforms.horizon[0] },
                    water: { value: uniforms.water[0] },
    
                },
                vertexShader: distantWaterVert,
                fragmentShader: distantWaterFrag
            }
        )
        const distantWater = new THREE.Mesh( distantWaterGeometry, this.distantWaterMaterial );
        distantWater.translateY(-2)
        distantWater.rotateX(-Math.PI / 2)
        scene.add(distantWater)
    }
    update() {

    }
    toggleMode(mode) {
        this.distantWaterMaterial.uniforms.horizon.value = uniforms.horizon[mode]
        this.distantWaterMaterial.uniforms.water.value = uniforms.water[mode]
    }
}