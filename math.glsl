#define PI 3.14159265359
#define PI2 (3.14159265359*2.0)

float hash(float n) {
  return fract(sin(n)*753.5453123);
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix(hash(n+0.0), hash(n+1.0), f.x), mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
               mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+270.0), hash(n+271.0), f.x), f.y), f.z);
}

float fbm(vec3 x) {
    float a = noise(x);
    a += noise(x * 2.0) / 2.0;
    a += noise(x * 4.0) / 4.0;
    a += noise(x * 8.0) / 8.0;
    a += noise(x * 16.0) / 16.0;
    return a;
}

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

vec2 random2( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// float clamp(float a) {
//   return max(min(a, 0.0), 0.0);
// }

vec3 equirect(sampler2D tex, vec3 n) {
  vec3 v = n;
  vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
  uv *= vec2(0.1591, 0.3183);
  uv += 0.5;
  uv.y *= -1.0;
  return texture(tex, uv).rgb;
}