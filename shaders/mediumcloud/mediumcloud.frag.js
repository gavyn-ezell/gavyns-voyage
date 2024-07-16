const frag = 
`uniform sampler2D mediumcloudTexture;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( mediumcloudTexture, texCoord);
    color.a *= 0.5;
    gl_FragColor = color;
}`;

export default frag;