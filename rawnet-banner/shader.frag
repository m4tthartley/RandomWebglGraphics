precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
in vec2 uvsq;
in vec3 fragPos;
out vec4 frag;

#include "../math.glsl"

void main() {
  vec3 red = vec3(247.0/255.0, 33.0/255.0 * fragPos.z, 55.0/255.0);
  float fade = 1.0 - smoothstep(2.0, 3.5, -fragPos.z);
  frag = vec4(red * fade, 1);
}