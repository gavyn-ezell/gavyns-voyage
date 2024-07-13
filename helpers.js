import * as THREE from 'three';
const R = 100;
const generateSmallCloudSprite = (cloudMaterial, type) => {
    
    let cloud = new THREE.Sprite(cloudMaterial);
    if (type==0) 
    {
        const theta = Math.random() * -0.8 * Math.PI;
        const phi = Math.acos(Math.random() * 0.1 + 0.1);
        cloud.scale.set(80,20,1);
        cloud.position.x = R * Math.sin(phi) * Math.cos(theta);
        cloud.position.y = R * Math.cos(phi);
        cloud.position.z = R * Math.sin(phi) * Math.sin(theta);
    }
    else if (type == 1)
    {
        const theta = Math.random() * -0.8 * Math.PI;
        const phi = Math.acos(Math.random() * 0.15 + 0.2);
        cloud.scale.set(60,15,1);
        cloud.position.x = R * Math.sin(phi) * Math.cos(theta);
        cloud.position.y = R * Math.cos(phi);
        cloud.position.z = R * Math.sin(phi) * Math.sin(theta);
    }
    else { 
        const theta = Math.random() * -1 * Math.PI;
        const phi = Math.acos(Math.random() * 0.4 + 0.2);
        cloud.scale.set(50,50,1);
        cloud.position.x = R * Math.sin(phi) * Math.cos(theta);
        cloud.position.y = R * Math.cos(phi);
        cloud.position.z = R * Math.sin(phi) * Math.sin(theta);
    }
    return cloud;
}

export default generateSmallCloudSprite;