import * as THREE from 'three';

const UP = new THREE.Vector3(0,1,0);
export class Boat {
    constructor(scene, outlinedscene, textureLoader, objLoader, foamInteractObjects) {
        //BOAT
        const fourTone = textureLoader.load('./textures/fourTone.jpg')
        fourTone.minFilter = THREE.NearestFilter
        fourTone.magFilter = THREE.NearestFilter
        const boatTexture = textureLoader.load('./textures/boatTexture0.png')
        
        this.toyboat = new THREE.Object3D();
        this.outlinedtoyboat = new THREE.Object3D();
        
        objLoader.load(
            './models/toyboat.obj',
            // called when resource is loaded
            ( object ) => {

                const boatMaterial = new THREE.MeshToonMaterial( {
                    map: boatTexture,
                    gradientMap: fourTone,
                    side: THREE.FrontSide
                } );
                object.traverse((node) => {
                    node.material = boatMaterial
                });
                object.scale.set(1.2, 1.2, 1.2)
                
                this.toyboat.add(object);
                this.outlinedtoyboat.add(object.clone())
                
                foamInteractObjects.push(this.toyboat)
                scene.add(this.toyboat);
                outlinedscene.add( this.outlinedtoyboat);

            },
            // called when loading is in progresses
            function ( xhr ) {


            },
            // called when loading has errors
            function ( error ) {

                console.log( error );

            }
        );
    }
    update(time, inLoad, camera, boatX, boatOrientation) {
        //handling boat position and orientation
	    this.toyboat.position.copy(calculateBoatPosition(boatX, time))
	    this.outlinedtoyboat.position.copy(calculateBoatPosition(boatX, time))


        let lookPos = this.toyboat.position.clone()
        calculateBoatOrientation(lookPos, boatX, time, boatOrientation)
        this.toyboat.lookAt(lookPos)
        this.outlinedtoyboat.lookAt(lookPos)

        if (inLoad) 
        {
            camera.position.copy(new THREE.Vector3(25, 25, 25));
            camera.lookAt(new THREE.Vector3(25, 0, 25));
        }
        else {
            let cameraPos = this.toyboat.position.clone();
            cameraPos.y = 0;
            calculateCameraPosition(cameraPos, boatX, time)
            cameraPos.y += 4
            camera.position.copy(cameraPos)
        
            let cameraLook = this.toyboat.position.clone();
            cameraLook.y = 3
            camera.lookAt(cameraLook)

        }
        
    }
    toggleMode(mode) {

    }
}


function waveFunction(inx, inz, iTime) {
    let x = inx + iTime;
    let z = inz + iTime;
    let y = 0.06*(Math.sin(0.2*x + 0.4*z) + 2.0 * Math.sin(0.1*x - 0.2*z));

    return y;
}
    
function sigmoidPath(x) {
    return 35.0*((1.0)/(1.0 + Math.E**(-0.15*(x-12))))
}
    
function calculateBoatPosition(x, time){
    let result = new THREE.Vector3();
    result.x = x
    result.z = sigmoidPath(x)
    result.y = waveFunction(x,result.z, time)-0.075
    return result
}

function calculateBoatOrientation(curr, x, time, orientation) {
    let vec = calculateBoatPosition(x+0.1, time)
    vec.sub(curr)
    vec.normalize()
    vec.applyAxisAngle(UP, -Math.PI/2-(1-orientation)*(Math.PI))
    curr.add(vec)
}

function calculateCameraPosition(curr, x, time) {
    let vec = calculateBoatPosition(x+0.001, time)
    vec.y = 0;
    vec.sub(curr)
    vec.normalize()
    vec.applyAxisAngle(UP, -Math.PI/2)
    vec.multiplyScalar(6)
    curr.add(vec)
}