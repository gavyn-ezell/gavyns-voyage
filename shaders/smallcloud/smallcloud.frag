uniform sampler2D smallcloudTexture;
uniform float iTime;
in vec2 texCoord;

const float PI = 3.14159265359;

float displacementFunction(float x) {
    return (sin(x) + sin(2.2 * x + 5.52) + sin(2.9 * x + 0.93) + sin(4.6 * x + 8.94)) / 4.0;
}

void main() {
    gl_FragColor = texture(smallcloudTexture, texCoord);
}