import * as THREE from 'three';

export class Island {
    constructor(scene, outlinedscene, gltfloader, foamInteractObjects) {
        //ISLANDx
        const island = new THREE.Object3D();
        const outlinedisland = new THREE.Object3D();
        gltfloader.load(
            './models/island.glb',
            function ( gltf ) {

                gltf.scene.scale.set(3, 3, 3);
                gltf.scene.rotateY(3.5*Math.PI/4)
                gltf.scene.position.set(4.5,-0.25, -2.5)
                
                
                island.add(gltf.scene);
                outlinedisland.add(gltf.scene.clone())
                
                foamInteractObjects.push(island)
                scene.add(island);
                outlinedscene.add( outlinedisland);

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