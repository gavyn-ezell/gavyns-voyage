import * as THREE from 'three';


let planeCenter = new THREE.Vector3(16, 4, 8)
export class California {
    constructor(scene, outlinedscene, textureLoader, gltfloader, objloader, foamInteractObjects) {
        const fourTone = textureLoader.load('./textures/fourTone.jpg')
        fourTone.minFilter = THREE.NearestFilter
        fourTone.magFilter = THREE.NearestFilter
        //CALIFORNIA
        gltfloader.load(
            './models/cali.glb',
            function ( gltf ) {

                gltf.scene.scale.set(1.2, 1.2, 1.2)
                gltf.scene.translateY(-0.8)
                gltf.scene.rotateY(-Math.PI/2.1)
                gltf.scene.position.set(16, -0.8, 12)

                const californiaMaterial = new THREE.MeshToonMaterial( {
                    color:0x00580C,
                    gradientMap: fourTone,
                    side: THREE.FrontSide
                } );
                
                gltf.scene.children[0].material = californiaMaterial
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

        //BEAR
        const bearTexture = textureLoader.load('./textures/BlackBear_BaseColor.png')
        objloader.load(
            './models/bear.obj',
            // called when resource is loaded
            function ( object ) {

                const bearMaterial = new THREE.MeshToonMaterial( {
                    color: 0x999999,
                    map: bearTexture,
                    gradientMap: fourTone,
                    side: THREE.FrontSide
                } );
                object.traverse((node) => {
                    node.material = bearMaterial
                });
                

                object.scale.set(1.2, 1.2, 1.2)
                object.translateY(-0.8)
                object.rotateY(-Math.PI/2.1)
                object.position.set(15, -0.8, 11)
                outlinedscene.add(object)



            },
            // called when loading is in progresses
            function ( xhr ) {

                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( error );

            }
        );

        //GEISEL
    const geiselColors = [0x8C9091, 0xA5A9AA, 0xA5A9AA, 0xA5A9AA, 0x222222, 0x94C1D8];
    gltfloader.load(
        './models/geisel.glb',
        function ( gltf ) {
            
            for (let i = 0; i < gltf.scene.children[0].children.length; i++)
            {
                gltf.scene.children[0].children[i].material = new THREE.MeshToonMaterial( {
                    color: geiselColors[i],
                    gradientMap: fourTone,
                    side: THREE.FrontSide
                } );
            }

            gltf.scene.scale.set(1.2, 1.2, 1.2)
            gltf.scene.position.set(18, -0.8, 14)

            outlinedscene.add(gltf.scene)

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

    //FLAG
    gltfloader.load(
        './models/flag.glb',
        function ( gltf ) {
            
            gltf.scene.scale.set(1.8, 1.8, 1.8)
            gltf.scene.rotateY(-Math.PI/2.1)
            gltf.scene.position.set(16, -2, 12)
            outlinedscene.add(gltf.scene)

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

    //UCSD FLAG
    gltfloader.load(
        './models/ucsdflag.glb',
        function ( gltf ) {
            
            gltf.scene.scale.set(1.5, 1.5, 1.5)
            gltf.scene.rotateY(-Math.PI/2.1)
            gltf.scene.position.set(18, -1.5, 14)
            outlinedscene.add(gltf.scene)

        },
        // called while loading is progressing
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    //PLANE
    this.outlinedplane = new THREE.Object3D();
    gltfloader.load(
        './models/plane.glb',
        ( gltf )=> {
            
            
            const planeMaterial = new THREE.MeshToonMaterial( {
                color: 0xffffff,
                gradientMap: fourTone,
                side: THREE.FrontSide
            } );
            gltf.scene.children[0].material = planeMaterial
            this.outlinedplane.add(gltf.scene.clone())
            outlinedscene.add( this.outlinedplane);

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
        let planePos = calculatePlanePosition(4, planeCenter, -time)
        this.outlinedplane.position.copy(planePos)
        let planeLook = calculatePlanePosition(4, planeCenter, -time-0.1)
        this.outlinedplane.lookAt(planeLook)
    }

    toggleMode(mode) {
        
    }
}

function calculatePlanePosition(r, center, time) {
    let result = new THREE.Vector3();
    result.x = center.x + r*Math.cos(0.6*time)
    result.z = center.z + r*Math.sin(0.6*time)
    result.y = center.y + Math.cos(0.6*time)
    return result
}