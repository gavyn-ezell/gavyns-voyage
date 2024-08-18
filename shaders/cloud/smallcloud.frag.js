export default /* glsl */`
uniform sampler2D smallcloudTexture;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( smallcloudTexture, texCoord);
    color.a *= 0.8;
    gl_FragColor = color;
}`;