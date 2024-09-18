import * as THREE from 'three';

import horizonVert from '../shaders/horizon/horizon.vert.js';
import horizonFrag from '../shaders/horizon/horizon.frag.js';

const uniforms = {
    horizon: [new THREE.Vector3(0.624, 0.902, 1), new THREE.Vector3(0.051, 0.094, 0.204)],
    sky: [new THREE.Vector3(0.294, 0.545, 0.898), new THREE.Vector3(0.098, 0.165, 0.345)]

}
export class Horizon {
    constructor(scene,textureLoader){
        const horizonTexture = textureLoader.load('./textures/horizon.png');
        const horizonGeometry = new THREE.PlaneGeometry(1000, 150, 1, 1);
        this.horizonMaterial = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                horizonTexture: {value : horizonTexture},
                horizon: {value: uniforms.horizon[0]},
                sky: {value: uniforms.sky[0]}
            },
            vertexShader: horizonVert,
            fragmentShader: horizonFrag
        }
    )


    const horizon = new THREE.InstancedMesh(horizonGeometry, this.horizonMaterial, 4)
    for ( let i = 0; i < 4; i++ ) {

        let theta = i*Math.PI/2;
        let mat = new THREE.Matrix4()
        let rotationMat = (new THREE.Matrix4()).makeRotationY(theta)
        let translationMat = (new THREE.Matrix4()).makeTranslation(new THREE.Vector3(-500*Math.sin(theta),20,-500*Math.cos(theta)))
        mat.multiplyMatrices(translationMat, rotationMat);
        horizon.setMatrixAt( i, mat );

    }
    scene.add( horizon );
    }
    toggleMode(mode) {
        this.horizonMaterial.uniforms.horizon.value = uniforms.horizon[mode];
        this.horizonMaterial.uniforms.sky.value = uniforms.sky[mode];
    }
}