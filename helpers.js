const generateCloudPosition = (matrix, type) => {

    let r = 90
    let theta = Math.random() * -2 * Math.PI;
    let phi = Math.acos(Math.random() * 0.7 + 0.12);
    
    matrix.makeTranslation( r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const generateWindLinePosition = (windLine) => {

    let r = Math.random() * 2.5;
    let theta = Math.random() * 2 * Math.PI;
    windLine.position.set(-(Math.random() * 10 + 20), 2.35 + r * Math.sin(theta), -3.58 + r * Math.cos(theta));
}

export { generateCloudPosition, generateWindLinePosition};