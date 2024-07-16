out vec2 texCoord;
uniform mat4 cameraRotation;
void main() {
	texCoord = vec2(uv.x, uv.y);
	gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * cameraRotation * vec4( position, 1.0 );

}