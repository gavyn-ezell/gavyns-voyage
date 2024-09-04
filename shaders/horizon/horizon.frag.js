export default /* glsl */`
uniform sampler2D horizonTexture;
uniform vec3 sky;
uniform vec3 horizon;

in vec2 texCoord;

void main() {
    vec4 mask = texture2D( horizonTexture, texCoord);
    vec3 finalColor = mix(sky, horizon, mask.r);
    gl_FragColor = vec4(finalColor, 1.0);
}`;