precision mediump float;
uniform sampler2D tex;
uniform float t;
in vec2 uv;
in vec2 uvsq;
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
  vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  vec3 normal = rotate(normals(uv*2.0), t*0.5);
  vec3 planetTexture = max(vec3(0.4, 0.2, 0.9) * (fbm(normal*2.0)*0.7 + fbm(normal*10.0)*0.3), 0.0);

  // float lon = uv.x * 2.0 * PI;
  // float lat = (uv.y*2.0-1.0) * 2.0 * PI;
  // vec3 planetTexture = texture(tex, vec2(lon, lat)/* vec3(cos(lon)*cos(lat), sin(lon)*cos(lat), sin(lat)) */).xyz;
  vec3 v = normalize(vec3(uvsq, -1.0));
  vec2 _uv = vec2(atan(v.z, v.x), asin(v.y));
  _uv *= vec2(0.1591, 0.3183);
  _uv += 0.5;
  _uv.y *= -1.0;
  // vec3 planetTexture = texture(tex, _uv).rgb;

  float planetMask = clamp(smoothstep(0.0, 0.02, -length(uv)+0.5), 0.0, 1.0);
  vec3 planet = max(dot(normal, light), 0.1) * planetTexture;

    vec2 screen = vec2(2.0*(16.0/9.0), 2.0);
    vec2 xy = ((uv+0.5)*screen) - screen/2.0;
    float z = screen.y / tan(radians(70.0)/2.0);
    vec3 ray_dir = /* camera.mat *  */normalize(vec3(xy, -z));
  vec3 n = rotate(ray_dir, t*0.5)*1.0;
  // vec3 stars = vec3(smoothstep(0.999, 1.0, fbm(n*50.0) - 0.5)); //texture(tex, fract((uvsq+0.5) * vec2(0.5, 1.0) + vec2(-t*0.1, 0.0))).rgb;
  vec3 stars = vec3(smoothstep(1.0, 1.5, fbm(n*2.0))*0.5 * (fbm(n*5.0)*vec3(0.8, 0.2, 0.2)*0.5+fbm(n*10.0)*vec3(0.2, 0.8, 0.2)*0.5));

  // vec3 stars = vec3(smoothstep(0.995, 1.0, random(uv)));
  vec3 color = /* max(planet, 0.0) * max(planetMask, 0.0) + 0.5 */ /* + vec3(stars)*(1.0-planetMask) */ mix(stars, planet, planetMask);
  // color = vec3(1.0-planetMask);
  // color = planetTexture;
  frag = vec4(color, 1);
}