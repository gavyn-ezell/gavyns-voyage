import * as THREE from 'three';
import sunVert from '../shaders/sun/sun.vert.js';
import sunFrag from '../shaders/sun/sun.frag.js';

const uniforms = {
    sun: [new THREE.Vector3(1.0,0.988,0.788), new THREE.Vector3(1.0, 1.0, 1.0)],
    sky: [new THREE.Vector3(0.294, 0.545, 0.898), new THREE.Vector3(0.098, 0.165, 0.345)]
}
export class Sun {
    constructor(scene, textureLoader) {
        const sunTexture = textureLoader.load('./textures/sun.png');
        const sunGeometry = new THREE.PlaneGeometry(125, 125, 1, 1)
        this.sunMaterial = new THREE.ShaderMaterial(
            {
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                uniforms: {
                    sunTexture: { value: sunTexture },
                    sun: {value: uniforms.sun[0]},
                    sky: {value: uniforms.sky[0]}

                },
                vertexShader: sunVert,
                fragmentShader: sunFrag
            }
        )
        const sun = new THREE.Mesh( sunGeometry, this.sunMaterial );
        scene.add(sun)
        sun.translateY(230);
        sun.translateZ(-600);
        sun.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
    }

    update() {

    }

    toggleMode(mode) {
        this.sunMaterial.uniforms.sun.value = uniforms.sun[mode];
        this.sunMaterial.uniforms.sky.value = uniforms.sky[mode];
    }


}