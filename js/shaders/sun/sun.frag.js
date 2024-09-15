export default /* glsl */`
uniform sampler2D sunTexture;
uniform vec3 sun;
uniform vec3 sky;
in vec2 texCoord;

void main() {
    
    vec4 mask = texture2D(sunTexture, texCoord);
	vec3 finalColor = mix(sky, sun, mask.r);
    
	gl_FragColor = vec4(finalColor, mask.a);
}`;