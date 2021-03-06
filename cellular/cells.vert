uniform sampler2D tex;
uniform float aspect;
layout(location = 0) in vec3 pos;
out vec2 uv;
flat out int id;

void main() {
  vec4 p = vec4(pos*2.0, 1.0);

  gl_Position = p;

  uv = p.xy;
}