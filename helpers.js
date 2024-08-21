import * as THREE from 'three';

const UP = new THREE.Vector3(0,1,0)
export const generateCloudTransformation = (matrix, type) => {

    let r;
    let theta;
    let phi;
    if (type == 0) {
        r = 400
        theta = Math.random()  * -2 * Math.PI;
        phi = Math.acos(Math.random()  * 0.7 + 0.08);
    }
    else{
        r = 450
        theta = Math.random()  * -2 * Math.PI;
        phi = Math.acos(Math.random()  * 0.1 + 0.05);
    }
    
    matrix.makeTranslation( r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

export const generateWindLinePosition = (windLine, boatX) => {

    let r = Math.random() * 0.25;
    let theta = Math.random() * 2 * Math.PI;
    
    windLine.position.set(-(Math.random() * 10 + 20), 3 + r * Math.sin(theta), -7 + sigmoidPath(boatX) + r * Math.cos(theta));
}

export const waveFunction = (inx, inz, iTime) => 
{
    let x = inx + iTime;
	let z = inz + iTime;
	let y = 0.08*(Math.sin(0.2*x + 0.4*z) + 2.0 * Math.sin(0.1*x - 0.2*z));

    return y;
}

export const sigmoidPath = (x) => 
    {
        return 28.0*((1.0)/(1.0 + Math.E**(-0.2*(x-12))))
    }

export const calculateBoatPosition = (x, time) =>
{
    let result = new THREE.Vector3();
    result.x = x
    result.z = sigmoidPath(x)
    result.y = waveFunction(x,result.z, time)
    return result
}
export const calculateBoatOrientation = (curr, x, time, orientation) => 
    {
        let vec = calculateBoatPosition(x+0.1, time)
        vec.sub(curr)
        vec.normalize()
        vec.applyAxisAngle(UP, -Math.PI/2-(1-orientation)*(Math.PI))
        curr.add(vec)
    }

export const calculateSharkPosition = (r, center, time) =>
    {
        let result = new THREE.Vector3();
        result.x = center.x + r*Math.cos(0.6*time)
        result.z = center.z + r*Math.sin(0.6*time)
        result.y = center.y + waveFunction(result.x, result.z, time)
        return result
    }

export const calculatePlanePosition = (r, center, time) =>
    {
        let result = new THREE.Vector3();
        result.x = center.x + r*Math.cos(0.6*time)
        result.z = center.z + r*Math.sin(0.6*time)
        result.y = center.y + Math.cos(0.6*time)
        return result
    }


