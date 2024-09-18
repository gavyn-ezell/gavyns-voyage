import * as THREE from 'three';

import windVert from '../shaders/wind/wind.vert.js';
import windFrag from '../shaders/wind/wind.frag.js';

const WINDSPEED = 35.0;
const WINDDIRECTION = new THREE.Vector3(1,0,0)
const uniforms = {
    windOpacity: [0.5, 0.1]
}
export class Wind {
    constructor(scene, camera) {
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
        const windGeometry = new THREE.PlaneGeometry( 30, 0.015, 20, 1 );
        const windMaterial = new THREE.ShaderMaterial(
            {
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                uniforms: {
                    windTexture: { value: windTexture },
                    iTime: { value: 0},
                    windOpacity: {value: uniforms.windOpacity[0]}
                },
                vertexShader: windVert,
                fragmentShader: windFrag
            }
        )

        this.windLine = new THREE.Mesh( windGeometry, windMaterial );
        scene.add(this.windLine);
        this.windLineSpawnPoint = new THREE.Object3D()
        camera.add(this.windLineSpawnPoint);
        this.windLineSpawnPoint.translateZ(-7);
        this.windLineSpawnPoint.translateX(-20);

        generateWindLineTransformation( this.windLine, this.windLineSpawnPoint);

        this.last = 0;
    }

    update(time, deltaTime) {
        //handling wind
        if (this.last + 6 <= time)
            {	
                
                generateWindLineTransformation(this.windLine, this.windLineSpawnPoint);
                this.last = time;
            }
            else {
                this.windLine.translateOnAxis(WINDDIRECTION, WINDSPEED*deltaTime)
            }
    }
    toggleMode(mode) {
        
    }
}

function generateWindLineTransformation( windLine, windLineSpawnPoint) {
    let v = new THREE.Vector3();
    windLineSpawnPoint.getWorldPosition(v);
    v.y += 1.2 + Math.random() * 0.6
    windLine.position.set(v.x,v.y,v.z)
    
    let q = new THREE.Quaternion();
    windLineSpawnPoint.getWorldQuaternion(q)
    windLine.quaternion.set(q.x, q.y, q.z, q.w);

}