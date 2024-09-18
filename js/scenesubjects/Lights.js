import * as THREE from 'three';

//uniforms
const LIGHTMODE = 1.0;
const DARKMODE_DIRECTIONAL = 0.3;
const DARKMODE_AMBIENT = 0.7

const uniforms = {
    light: [LIGHTMODE, DARKMODE_DIRECTIONAL],
    ambientLight: [LIGHTMODE, DARKMODE_AMBIENT]
}

const DIRECTIONAL_VECTOR = new THREE.Vector3(70, 45, 60);
export class Lights {
    constructor(outlinedscene) {
        
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ); 
        this.directionalLight.position.set(70, 45, 60);
        this.ambientLight = new THREE.AmbientLight( 0xffffff );
        
        outlinedscene.add(this.directionalLight);
        outlinedscene.add(this.ambientLight);
    }
    
    update() {

    }
    
    toggleMode(mode) {
        this.directionalLight.intensity = uniforms.light[mode];
        this.ambientLight.intensity = uniforms.ambientLight[mode];
    }
}