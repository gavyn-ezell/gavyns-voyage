import * as THREE from 'three';

const sharkCenter = new THREE.Vector3(25, -0.2, 25)
export class Shark {
    constructor(scene, outlinedscene, gltfloader, foamInteractObjects) {
        this.sharkfin = new THREE.Object3D();
        this.outlinedsharkfin = new THREE.Object3D();
        gltfloader.load(
            './models/sharkfin.glb',
            ( gltf ) => {
                
                gltf.scene.scale.set(0.3, 0.3, 0.3)
                gltf.scene.rotateX(0.15)
                this.sharkfin.add(gltf.scene);
                this.outlinedsharkfin.add(gltf.scene.clone())
                
                foamInteractObjects.push(this.sharkfin)
                scene.add(this.sharkfin);
                outlinedscene.add( this.outlinedsharkfin);

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

    }

    update(time) {
        let sharkPos = calculateSharkPosition(2.25, sharkCenter, time)
	    this.sharkfin.position.copy(sharkPos)
	    this.outlinedsharkfin.position.copy(sharkPos)

        let sharkLook = calculateSharkPosition(2.25, sharkCenter, time+0.1)
	    this.sharkfin.lookAt(sharkLook)
	    this.outlinedsharkfin.lookAt(sharkLook)
    }
    toggleMode(mode) {}
}


function calculateSharkPosition(r, center, time){
    let result = new THREE.Vector3();
    result.x = center.x + r*Math.cos(0.6*time)
    result.z = center.z + r*Math.sin(0.6*time)
    result.y = center.y + waveFunction(result.x, result.z, time)
    return result
}
function waveFunction(inx, inz, iTime) {
    let x = inx + iTime;
    let z = inz + iTime;
    let y = 0.06*(Math.sin(0.2*x + 0.4*z) + 2.0 * Math.sin(0.1*x - 0.2*z));

    return y;
}