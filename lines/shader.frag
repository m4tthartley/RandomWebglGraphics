precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
out vec4 frag;

#include "../math.glsl"

void main() {
  vec3 yellow = vec3(0.8, 1.0, 0.2);
  frag = vec4(yellow * pow(fbm(vec3(uv.x * 100.0 + fbm(vec3(uv.y*20.0-25.0, 0.0, 0.0)), 0.0, t*0.2)), 3.0) * fbm(vec3(uv.x*10.0 + 10.0, 0.0, 0.0)), 1);
}