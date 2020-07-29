uniform sampler2D tex;
uniform float aspect;
layout(location = 0) in vec3 pos;
out vec2 uv;
out vec2 uvsq;

void main() {
  vec4 p = vec4(pos*2.0, 1.0);
  gl_Position = p;
  uv = p.xy * vec2(aspect, 1.0);
  uvsq  = pos.xy;
}