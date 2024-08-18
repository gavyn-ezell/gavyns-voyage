import * as THREE from 'three';
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

export const generateWindLinePosition = (windLine) => {

    let r = Math.random() * 0.25;
    let theta = Math.random() * 2 * Math.PI;
    
    windLine.position.set(-(Math.random() * 10 + 20), 3 + r * Math.sin(theta), -7 + r * Math.cos(theta));
}

export const calculateBoatHeight = (inx, inz, iTime) => 
{
    let x = inx + iTime;
	let z = inz + iTime;
	let y = 0.1*(Math.sin(0.2*x + 0.4*z) + 2.0 * Math.sin(0.1*x - 0.2*z));

    return y;
}


export const sigmoidPath = (x) => 
    {
        return 28.0*((1.0)/(1.0 + Math.E**(-0.2*(x-12))))
    }