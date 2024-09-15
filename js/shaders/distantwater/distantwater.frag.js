export default /* glsl */`
uniform sampler2D distantWaterTexture;
uniform vec3 horizon;
uniform vec3 water;
in vec2 texCoord;

void main() {
    vec2 uv = texCoord;
    
    vec4 mask = texture2D(distantWaterTexture, uv);
    
    vec3 finalColor = mix(horizon, water, mask.r);
    gl_FragColor = vec4(finalColor, 1.0);
}`;