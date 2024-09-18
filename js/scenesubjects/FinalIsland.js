import * as THREE from 'three';

export class FinalIsland {
    constructor(scene, outlinedscene, gltfloader, foamInteractObjects) {
        //FINAL ISLAND
        gltfloader.load(
            './models/finalisland.glb',
            function ( gltf ) {
                
                gltf.scene.rotateY(Math.PI/2.15)
                gltf.scene.scale.set(5,5,5)
                gltf.scene.position.set(40, -1, 27)
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