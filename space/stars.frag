precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
out vec4 frag;

#include "../math.glsl"

// vec3 normals(in vec2 uv) {
//     // uv = fract(uv)*2.0-1.0;
//     vec3 ret;
//     ret.xy = sqrt(uv * uv) * sign(uv);
//     ret.z = sqrt(abs(1.0 - dot(ret.xy,ret.xy)));
//     ret = ret * 0.5 + 0.5;
//     return mix(vec3(0.0), ret, smoothstep(1.0,0.98,dot(uv,uv)) );
// }

vec3 normals(vec2 uv) {
  return vec3(
    uv.x,
    uv.y,
    sqrt(1.0 - (uv.x*uv.x + uv.y*uv.y))
  );
}

vec3 rotate(vec3 a, float r) {
  return a * mat3(
    cos(r),  0, sin(r), 
    0,       1, 0,      
    -sin(r), 0, cos(r)
  );
}

void main() {
  // vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  // vec3 normal = rotate(normals(uv*2.0), t*0.5);
  // vec3 texture = max(vec3(0.4, 0.2, 0.9) * (fbm(normal*2.0)*0.7 + fbm(normal*10.0)*0.3), 0.0);
  // float planetMask = clamp(smoothstep(0.0, 0.02, -length(uv)+0.5), 0.0, 1.0);
  // vec3 planet = max(dot(normal, light), 0.1) * texture;
  float stars = smoothstep(0.995, 1.0, random(uv))/* fbm(vec3(uv*1.0, 1.0)) */;
  // vec3 color = /* max(planet, 0.0) * max(planetMask, 0.0) + 0.5 */ /* + vec3(stars)*(1.0-planetMask) */ mix(vec3(stars), planet, planetMask);
  // color = vec3(1.0-planetMask);
  // color = texture;
  frag = vec4(vec3(stars), 1);
}