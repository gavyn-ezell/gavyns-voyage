
const generateCloudTransformation = (matrix, type) => {

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

const generateWindLinePosition = (windLine) => {

    let r = Math.random() * 0.25;
    let theta = Math.random() * 2 * Math.PI;
    
    windLine.position.set(-(Math.random() * 10 + 20), 3 + r * Math.sin(theta), -7 + r * Math.cos(theta));
}

const generateGeiselMaterials = (geisel) => {
    const geiselColors = []
}

export { generateCloudTransformation, generateWindLinePosition};