import * as THREE from 'three';
import cloudVert from '../shaders/cloud/cloud.vert.js';
import smallcloudFrag from '../shaders/cloud/smallcloud.frag.js';

const CLOUD_COUNT = 50;
const CLOUD_WIDTH = 130;
const CLOUD_HEIGHT = 100;
const CLOUD_RADIUS = 470;

const uniforms = {
    cloudOpac: [0.7, 0.3]
}
export class Clouds {
    constructor(scene, textureLoader) {
        
        this.matrix = new THREE.Matrix4();
        const smallcloudTexture = textureLoader.load('./textures/smallcloud0.png');
        const smallcloudGeometry = new THREE.PlaneGeometry( CLOUD_WIDTH, CLOUD_HEIGHT ); 

        this.smallcloudMaterial = new THREE.ShaderMaterial(
        {
            transparent: true,
            depthWrite: false,
            uniforms: {
                smallcloudTexture: { value: smallcloudTexture },
                iTime: { value: 0},
                cloudOpacity: {value: uniforms.cloudOpac[0]}
            },
            vertexShader: cloudVert,
            fragmentShader: smallcloudFrag
        })
        
        const smallcloudMesh = new THREE.InstancedMesh( smallcloudGeometry, this.smallcloudMaterial, CLOUD_COUNT );

        for ( let i = 0; i < CLOUD_COUNT; i ++ ) {

            generateCloudTransformation( this.matrix );
            smallcloudMesh.setMatrixAt( i, this.matrix );

        }
        
        scene.add( smallcloudMesh );


    }
    
    update(time) {
        this.smallcloudMaterial.uniforms.iTime.value = time;

    }
    
    toggleMode(mode) {
        this.smallcloudMaterial.uniforms.cloudOpacity.value = uniforms.cloudOpac[mode]
    }
}

function generateCloudTransformation(matrix) {
    
    let theta = Math.random()  * -2 * Math.PI;
    let phi = Math.acos(Math.random()  * 0.7 + 0.08);
    
    matrix.makeTranslation( CLOUD_RADIUS * Math.sin(phi) * Math.cos(theta), CLOUD_RADIUS * Math.cos(phi), CLOUD_RADIUS * Math.sin(phi) * Math.sin(theta));

}