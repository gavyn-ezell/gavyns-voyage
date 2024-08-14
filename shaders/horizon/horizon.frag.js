export default 
`uniform sampler2D horizonTexture;
in vec2 texCoord;

void main() {
    vec4 mask = texture2D( horizonTexture, texCoord);
    vec3 sky = vec3(0.29411764705,0.5450980392156862, 0.8980392156862745);
    vec3 horizon = vec3(0.6235294117647059, 0.9019607843137255, 1.0);
    vec3 finalColor = mix(sky, horizon, mask.r);
    gl_FragColor = vec4(finalColor, 1.0);
}`;