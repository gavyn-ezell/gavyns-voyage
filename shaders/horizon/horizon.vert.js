export default 
`out vec2 texCoord;

void main() {
    texCoord = vec2(uv.x, uv.y);
    gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4( position, 1.0 );
}`;