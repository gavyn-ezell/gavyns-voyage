const vert = 
`out vec2 texCoord;
uniform float iTime;

mat4 waveFunction(float inx, float iny) {
	float x = inx + iTime;
	float y = iny + iTime;
	float offset = 0.2*(sin(0.2*x + 0.3*y) + 1.5 * sin(0.1*x - 0.2*y));
	mat4 result = mat4(1.0, 0.0, 0.0, 0.0,  
                  0.0, 1.0, 0.0, 0.0,  
                  0.0, 0.0, 1.0, 0.0,  
                  0.0, offset, 0.0, 1.0);
	return result;
}


void main() {
	texCoord = 4.0 * vec2(uv.x, uv.y);
	vec3 worldPos = vec3(modelMatrix * vec4(position, 1.0));
	mat4 waveTranslation = waveFunction(worldPos.x, worldPos.y);
	gl_Position = projectionMatrix * viewMatrix * waveTranslation * modelMatrix * vec4( position, 1.0 );
}`;

export default vert;