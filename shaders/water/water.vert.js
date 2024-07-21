const vert = 
`out vec2 texCoord;
uniform float iTime;

vec3 waveFunction(float inx, float iny) {
	float x = inx + iTime*2.5;
	float y = iny + iTime*2.5;
	float offset = 0.2*(sin(0.2*x + 0.3*y) + 1.5 * sin(0.1*x - 0.2*y));

	return vec3(0.0, 0.0, offset);
}



void main() {
	texCoord = 2.0 * vec2(uv.x, uv.y);

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position+waveFunction(position.x, position.y), 1.0 );
}`;

export default vert;