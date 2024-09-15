import * as THREE from 'three';

export class Oilrig {
    constructor(scene, outlinedscene, gltfloader, foamInteractObjects) {
        //OIL RIG
        gltfloader.load(
            './models/oilrig.glb',
            function ( gltf ) {
                
                gltf.scene.translateY(-0.2)
                gltf.scene.rotateY(-Math.PI/4)
                gltf.scene.scale.set(1.5, 3.37, 1.5)
                gltf.scene.position.set(25, -1, 25)
                scene.add(gltf.scene)
                outlinedscene.add(gltf.scene.clone())
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
        
    }
    toggleMode(mode) {

    }
}