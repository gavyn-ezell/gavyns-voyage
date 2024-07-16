uniform sampler2D waterTexture;
uniform float iTime;
in vec2 texCoord;

const float PI = 3.14159265359;

float displacementFunction(float x) {
    return (sin(x) + sin(2.2 * x + 5.52) + sin(2.9 * x + 0.93) + sin(4.6 * x + 8.94)) / 4.0;
}

void main() {
    vec2 uv = texCoord;
    
    // Apply displacement
    float displaceAmount = 0.012; // Adjust this to control the intensity of the effect
    float xOffset = iTime * 0.1; // Control the speed of the effect
    
    // Apply displacement to both x and y for a 2D effect
    uv.x += displaceAmount * displacementFunction(uv.y * 10.0 + xOffset);
    uv.y += displaceAmount * displacementFunction(uv.x * 10.0 + xOffset);


    vec4 darkblueMask = texture2D(waterTexture, 25.0 * (uv+ vec2(0.27, 0.78)));
    vec4 whiteMask = texture2D(waterTexture, 25.0 * uv);
    
    vec3 windwakerBlue = vec3(0.0039, 0.4353, 0.7451);
    vec3 darkBlue = vec3(0.0, 0.4118, 0.7176);
    vec3 white = vec3(0.8039, 0.9922, 0.9647);
    
    vec3 finalColor = mix(windwakerBlue, darkBlue, darkblueMask.r);
    finalColor = mix(finalColor, white, whiteMask.r);
    gl_FragColor = vec4(finalColor, 1.0);
}