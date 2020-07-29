uniform sampler2D tex;
uniform float aspect;
uniform mat4 camera;
uniform mat4 rotatey;
uniform mat4 rotatex;
layout(location = 0) in vec3 pos;
out vec2 uv;
out vec2 uvsq;
out vec3 fragPos;

void main() {
  vec4 p = vec4(pos, 1.0);
  fragPos = pos;
  gl_Position = camera * (rotatey * p);
  uv = p.xy * vec2(aspect, 1.0);
  uvsq  = pos.xy;
}