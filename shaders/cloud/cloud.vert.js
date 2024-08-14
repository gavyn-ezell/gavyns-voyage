export default 
`out vec2 texCoord;
uniform float iTime;

mat4 lookAt(vec3 eye, vec3 target) {
	vec3 up = vec3(0.0, 1.0, 0.0);
    
	vec3 zaxis = normalize(eye - target);
    vec3 xaxis = normalize(cross(normalize(up), zaxis));
    vec3 yaxis = cross(zaxis, xaxis);

    mat4 viewMatrix = mat4(
        vec4(xaxis, 0),
        vec4(yaxis, 0),
        vec4(zaxis, 0),
        vec4(-dot(xaxis, eye), -dot(yaxis, eye), -dot(zaxis, eye), 1)
    );

    return viewMatrix;
}

mat4 circularRotation(float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    
    return mat4(
        cosAngle, 0.0, sinAngle, 0.0,
        0.0,     1.0, 0.0,     0.0,
        -sinAngle, 0.0, cosAngle, 0.0,
        0.0,     0.0, 0.0,     1.0
    );
}


void main() {

	texCoord = vec2(uv.x, uv.y);

	//we want to make the orientation rotation first
	vec3 world_pos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
	mat4 rotation = lookAt(vec3(0.0,0.0,0.0), world_pos);


	gl_Position = projectionMatrix * viewMatrix * circularRotation(0.008 * iTime) * instanceMatrix * rotation *  vec4( position, 1.0 );



}`;