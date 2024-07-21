import * as THREE from 'three';
const generateCloudPosition = (matrix, type) => {

    let r = 90
    let theta = Math.random() * -2 * Math.PI;
    let phi = Math.acos(Math.random() * 0.6 + 0.13);

    // let r;
    // let theta;
    // let phi;
    // if (type==0) 
    // {
    //     r = 90
    //     theta = Math.random() * -0.8 * Math.PI;
    //     phi = Math.acos(Math.random() * 0.1 + 0.1);
    // }
    // if (type == 1)
    // {
    //     r = 100
    //     theta = Math.random() * -2 * Math.PI;
    //     phi = Math.acos(Math.random() * 0.15 + 0.1);
    // }
    // else { 
    // }
    
    matrix.makeTranslation( r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}


export { generateCloudPosition };