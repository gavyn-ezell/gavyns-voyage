export default /* glsl */`
uniform sampler2D windTexture;
uniform float windOpacity;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( windTexture, texCoord);
    color.a *= windOpacity;
    gl_FragColor = color;
}`;