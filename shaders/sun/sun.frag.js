export default 
`uniform sampler2D sunTexture;
in vec2 texCoord;

void main() {
	vec3 sky = vec3(0.294,0.545,0.898);
 	vec3 orange = vec3(1.,0.988,0.788);
    
    vec4 mask = texture2D(sunTexture, texCoord);
	vec3 finalColor = mix(sky, orange, mask.r);
    
	gl_FragColor = vec4(finalColor, mask.a);
}`;