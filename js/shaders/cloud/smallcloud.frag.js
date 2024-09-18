export default /* glsl */`
uniform sampler2D smallcloudTexture;
uniform float cloudOpacity;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( smallcloudTexture, texCoord);
    color.a *= cloudOpacity;
    gl_FragColor = color;
}`;