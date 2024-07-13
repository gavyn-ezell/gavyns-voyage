import * as THREE from 'three';
const R = 100;
const generateCloudSprite = (cloudMaterial) => {
    // Generate random azimuthal angle (theta) between 0 and 2π
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random());
    
    let cloud = new THREE.Sprite(cloudMaterial);
    cloud.scale.set(20,20,1);
    cloud.position.x = R * Math.sin(phi) * Math.cos(theta);
    cloud.position.y = R * Math.cos(phi);
    cloud.position.z = R * Math.sin(phi) * Math.sin(theta);
    return cloud;
}

export default generateCloudSprite;