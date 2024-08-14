export default 
`uniform sampler2D longcloudTexture;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( longcloudTexture, texCoord);
    color.a *= 0.4;
    gl_FragColor = color;
}`;