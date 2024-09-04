export default /* glsl */`
uniform sampler2D windTexture;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( windTexture, texCoord);
    color.a *= 0.1;
    gl_FragColor = color;
}`;