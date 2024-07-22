const frag = 
`uniform sampler2D windTexture;
in vec2 texCoord;

void main() {
    vec4 color = texture2D( windTexture, texCoord);
    gl_FragColor = color;
}`;

export default frag;