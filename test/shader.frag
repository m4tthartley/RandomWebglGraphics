precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
out vec4 frag;

#include "../math.glsl"

void main() {
  vec2 uv = uv+0.5;
  frag = vec4(fbm(vec3(uv*10.0, t)), 0, 0, 1);
}