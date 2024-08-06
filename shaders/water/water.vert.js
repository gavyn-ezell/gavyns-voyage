const vert = 
`out vec2 texCoord;
uniform float iTime;
#include <fog_pars_vertex>

mat4 waves(float inx, float iny) {
	float x = inx + iTime;
	float y = iny + iTime;
	float offset = 0.2*(sin(0.2*x + 0.4*y) + 2.0 * sin(0.1*x - 0.2*y));
	mat4 result = mat4(1.0, 0.0, 0.0, 0.0,  
                  0.0, 1.0, 0.0, 0.0,  
                  0.0, 0.0, 1.0, 0.0,  
                  0.0, offset, 0.0, 1.0);
	return result;
}

mat4 offset() {
	float x = iTime;
	float y = iTime;
	float offset = 0.2*(sin(0.2*x + 0.4*y) + 2.0 * sin(0.1*x - 0.2*y));
	mat4 result = mat4(1.0, 0.0, 0.0, 0.0,  
                  0.0, 1.0, 0.0, 0.0,  
                  0.0, 0.0, 1.0, 0.0,  
                  0.0, -offset, 0.0, 1.0);
	return result;
}





void main() {
	#include <begin_vertex>
	#include <project_vertex>
	#include <fog_vertex>
	texCoord = 1.5*vec2(uv.x, uv.y);
	vec3 worldPos = vec3(modelMatrix * vec4(position, 1.0));
	gl_Position = projectionMatrix * viewMatrix *offset() * waves(worldPos.x, worldPos.z)* modelMatrix * vec4( position, 1.0 );
}`;

export default vert;