const vert = 
`out vec2 texCoord;
uniform float iTime;

mat4 waves(float inx, float iny) {
	float x = inx + iTime;
	float y = iny + iTime;
	float offset = 0.3*(sin(0.2*x + 0.4*y) + 2.0 * sin(0.1*x - 0.2*y));
	mat4 result = mat4(1.0, 0.0, 0.0, 0.0,  
                  0.0, 1.0, 0.0, 0.0,  
                  0.0, 0.0, 1.0, 0.0,  
                  0.0, offset, 0.0, 1.0);
	return result;
}

void main() {

	texCoord = vec2(uv.x, uv.y);

    vec3 worldPos = vec3(modelMatrix * vec4(position, 1.0));
	gl_Position = projectionMatrix * viewMatrix * waves(worldPos.x, worldPos.z) * modelMatrix * vec4( position, 1.0 );

}`;

export default vert;