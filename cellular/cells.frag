precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
flat in int id;
out vec4 frag;

#include "../math.glsl"

void main() {
  // int cells = 100;
  float d = 100.0;
  vec2 p = uv;
  vec2 ist = floor(uv*15.0);
  vec2 fst = fract(uv*15.0);
  for (int i = -1; i < 2; i++)
  for (int v = -1; v < 2; v++) {
    vec2 grid = vec2(float(i), float(v));
    vec2 cell = random2(vec2(ist + grid));
    d = min(d, pow(distance(grid + cell, fst), 1.0));
  }

  float d2 = 100.0;
  p = uv;
  ist = floor(uv*2.0 + t*0.1);
  fst = fract(uv*2.0 + t*0.1);
  for (int i = -1; i < 2; i++)
  for (int v = -1; v < 2; v++) {
    vec2 grid = vec2(float(i), float(v));
    vec2 cell = random2(vec2(ist + grid));
    d2 = min(d2, distance(grid + cell, fst));
  }

  vec3 blue = vec3(0.1, 0.6, 0.9);
  vec3 green = vec3(0.5, 0.8, 0.2);
  vec3 yellow = vec3(1.0, 0.9, 0.1);
  // vec3 darkGreen = green*0.5;

  float fade = pow(fbm(vec3((uv+20.0)*2.0, 0.0)), 1.5);
  // float fade2 = fade*0.5 + 0.5;
  vec3 greenMix = mix(green*0.2 * fade, green*0.9 * fade, pow(d, 1.5));
  vec3 yellowMix = mix(yellow*0.1 * fade, yellow*1.0 * fade, pow(d2, 1.5));
  frag = vec4(greenMix + yellowMix, 1);
}