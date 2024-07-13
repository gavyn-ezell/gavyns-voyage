const vertexShader = 
`out vec2 texCoord;
void main() {
	texCoord = 2.0 * vec2(uv.x, uv.y);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

export default vertexShader;