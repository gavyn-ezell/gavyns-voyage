const frag = 
`uniform sampler2D distantWaterTexture;
in vec2 texCoord;

void main() {
    vec2 uv = texCoord;
    
    vec4 mask = texture2D(distantWaterTexture, uv);
    
    vec3 windwakerBlue = vec3(0.0039, 0.4353, 0.7451);
    vec3 horizonColor = vec3(0.6235294117647059, 0.9019607843137255, 1.0);
    
    vec3 finalColor = mix(horizonColor, windwakerBlue, mask.r);
    gl_FragColor = vec4(finalColor, 1.0);
}`;

export default frag;