export default /* glsl */`
#include <common>
#include <packing>
#include <fog_pars_fragment>

uniform sampler2D waterTexture;
uniform float iTime;
in vec2 texCoord;

uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform vec2 resolution;
uniform float threshold;
uniform vec3 water;
uniform vec3 darkwater;
uniform vec3 foam;


float displacementFunction(float x) {
    return (sin(x) + sin(2.2 * x + 5.52) + sin(2.9 * x + 0.93) + sin(4.6 * x + 8.94)) / 4.0;
}

float getDepth( const in vec2 screenPosition ) {
    return texture2D( tDepth, screenPosition ).x;
}

float getViewZ( const in float depth ) {
    return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
}

void main() {
    vec2 uv = texCoord;
    
    // Apply displacement
    float displaceAmount = 0.01; // Adjust this to control the intensity of the effect
    float xOffset = iTime * 0.12; // Control the speed of the effect
    
    // Apply displacement to both x and y for a 2D effect
    uv.x += displaceAmount * displacementFunction(uv.y * 10.0  + xOffset);
    uv.y += displaceAmount * displacementFunction(uv.x * 10.0 + xOffset);


    vec2 screenUV = gl_FragCoord.xy / resolution;
    float fragmentLinearEyeDepth = getViewZ( gl_FragCoord.z );
    float linearEyeDepth = getViewZ( getDepth( screenUV ) );
    float diff = clamp(fragmentLinearEyeDepth - linearEyeDepth, 0.0, 1.0 );
    float thickness = 0.25;

    vec4 darkblueMask = texture2D(waterTexture, 25.0 * (uv+ vec2(0.27, 0.78)));
    vec4 whiteMask = texture2D(waterTexture, 25.0 * uv);
    
    vec3 finalColor = mix(water, darkwater, darkblueMask.r);
    finalColor = mix(finalColor, foam, whiteMask.r);
    gl_FragColor.rgb = mix( foam, finalColor, step( threshold / (0.1 / thickness), diff ) );
    gl_FragColor.a = 1.0;
    #include <fog_fragment>
}`;