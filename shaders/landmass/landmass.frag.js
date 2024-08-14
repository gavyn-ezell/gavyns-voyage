export default 
`
uniform sampler2D landmassTexture;
in vec2 texCoord;

void main() {
    
	vec3 base = vec3(0.3, 0.3, 0.3);
	vec4 mask = texture2D(landmassTexture, texCoord);
	
	gl_FragColor = vec4(base, mask.a);
}`;