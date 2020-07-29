precision mediump float;
uniform sampler2D tex;
uniform float t;
uniform vec2 res;
in vec2 uv;
in vec2 uvsq;
out vec4 frag;

#include "../math.glsl"

void main() {
  vec4 color = vec4(0);
  int samples = 0;
  for (float y = -1.0; y < 2.0; y++) {
    for (float x = -1.0; x < 2.0; x++) {
        color += texture(tex, uvsq + vec2(float(x)*(1.0/res.x), float(y)*(1.0/res.y)));
        samples++;
    }
  }
  frag = color / float(samples) * 2.0;
}