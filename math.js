// math
function vec2(x, y) {
  return {x, y}
}
function vec3(x, y, z) {
  return {x, y, z}
}
function vec4(x, y, z, w) {
  return {x, y, z, w}
}

function add(a, b) {
  return {
    x: a.x+b.x,
    y: a.y+b.y,
    z: a.z+b.z,
  }
}
function sub(a, b) {
  return {
    x: a.x-b.x,
    y: a.y-b.y,
    z: a.z-b.z,
  }
}
function mul(a, b) {
  return {
    x: a.x*b.x,
    y: a.y*b.y,
    z: a.z*b.z,
  }
}
function div(a, b) {
  return {
    x: a.x/b.x,
    y: a.y/b.y,
    z: a.z/b.z,
  }
}

function length(v) {
  return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z)
}

function normalize(v) {
  const len = length(v)
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len,
  }
}

function cross(a, b) {
  const result = {
    x: a.y*b.z - a.z*b.y,
    y: a.z*b.x - a.x*b.z,
    z: a.x*b.y - a.y*b.x,
  }
  return normalize(result);
}

function perspective(fov, aspect, near, far) {
  if (near < 0) console.error('perspective: near should be above 0')
  const f = 1.0 / Math.tan((fov/180.0*Math.PI) / 2.0)
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2.0 * far * near) / (near - far), 0,
  ]
}
function ortho(left, top, right, bottom, n, f) {
  return [
    2 / (right-left), 0, 0, 0,
    0, 2 / (top-bottom), 0, 0,
    0, 0, -2 / (f-n), 0,
    -((right+left) / (right-left)), -((top+bottom) / (top-bottom)), -((f+n) / (f-n)), 1,
  ]
}
function translate(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]
}
function rotatex(rads) {
  const s = Math.sin(rads)
  const c = Math.cos(rads)
  return [
    1, 0,  0, 0,
    0, c, -s, 0,
    0, s, c,  0,
    0, 0, 0,  1,
  ]
}
function rotatey(rads) {
  const s = Math.sin(rads)
  const c = Math.cos(rads)
  return [
    c,  0, s, 0,
    0,  1, 0, 0,
    -s, 0, c, 0,
    0,  0, 0, 1,
  ]
}
function rotatez(rads) {
  const s = Math.sin(rads)
  const c = Math.cos(rads)
  return [
    c, -s, 0, 0,
    s, c,  0, 0,
    0, 0,  1, 0,
    0, 0,  0, 1,
  ]
}

// graphics
let gl
// let _canvas_size
let screenWidth = 800
let screenHeight = 600
let quad
let quadi
let MSAA = false
function gl_init(/*c, w = 0, h = 0*/ el = null) {
  // _canvas_size = { x: w, y: h }
  let canvas = el
  if (!canvas) {
    canvas = document.createElement('canvas')//document.querySelector(c)
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    document.body = document.createElement('body')
    document.body.appendChild(canvas)
  }

  gl = canvas.getContext('webgl2', {antialias:MSAA, preserveDrawingBuffer:true})
  gl.getExtension('EXT_color_buffer_float')

  screenWidth = window.innerWidth
  screenHeight = window.innerHeight
  canvas.width = screenWidth
  canvas.height = screenHeight
  window.addEventListener('resize', function() {
    screenWidth = window.innerWidth
    screenHeight = window.innerHeight
    canvas.width = screenWidth
    canvas.height = screenHeight
  })

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // gl.clear(gl.COLOR_BUFFER_BIT/*  | gl.DEPTH_BUFFER_BIT */)
  gl.viewport(0, 0, canvas.width, canvas.height)

  quad = create_array_buffer([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
  ])
  quadi = create_element_array_buffer([
    0, 1, 2,
    0, 2, 3,
  ])
}

function clear(r, g, b, a, depth = false) {
  gl.clearColor(r, g, b, a)
  let mask = gl.COLOR_BUFFER_BIT
  if (depth) mask |= gl.DEPTH_BUFFER_BIT
  gl.clear(mask)
}

function depth(on) {
  if (on) {
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
  } else {
    gl.disable(gl.DEPTH_TEST)
  }
}

let _current_shader = 0
function use_shader(shader) {
  _current_shader = shader
  gl.useProgram(shader)
}

function create_shader(vertex_shader, fragment_shader) {
  let vs = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vs, vertex_shader)
  gl.compileShader(vs)
  let fs = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fs, fragment_shader)
  gl.compileShader(fs)
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(vs))
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(fs))
  let shader = gl.createProgram()
  gl.attachShader(shader, vs)
  gl.attachShader(shader, fs)
  gl.linkProgram(shader)
  if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) console.error('Shader link error')
  use_shader(shader)
  return shader
}

function create_array_buffer(floats) {
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floats), gl.STATIC_DRAW)
  return buf
}

function create_element_array_buffer(indices) {
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
  return buf
}

function vertex_pointer(buf, attrib, components, stride = 0, offset = 0) {
  const a = gl.getAttribLocation(_current_shader, attrib)
  gl.enableVertexAttribArray(a)
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.vertexAttribPointer(a, components, gl.FLOAT, false, stride, offset)
}

function uniform(uniform, x, y, z, w) {
  switch (arguments.length) {
    case 2:
      gl.uniform1f(gl.getUniformLocation(_current_shader, uniform), x)
      break
    case 3:
      gl.uniform2f(gl.getUniformLocation(_current_shader, uniform), x, y)
      break
    case 4:
      gl.uniform3f(gl.getUniformLocation(_current_shader, uniform), x, y, z)
      break
    case 5:
      gl.uniform4f(gl.getUniformLocation(_current_shader, uniform), x, y, z, w)
      break
    default:
      console.error('Wrong number of parameters')
      break
  }
}

function uniform_matrix(uniform, mat) {
  gl.uniformMatrix4fv(gl.getUniformLocation(_current_shader, uniform), false, new Float32Array(mat))
}

function draw_call(vertex_count) {
  gl.drawArrays(gl.TRIANGLES, 0, vertex_count)
}

function draw_call_lines(vertex_count) {
  gl.drawArrays(gl.LINES, 0, vertex_count)
}

function indexed_draw_call(buf, index_count) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf)
  gl.drawElements(gl.TRIANGLES, index_count, gl.UNSIGNED_SHORT, 0)
}

// Test
// gl_init('canvas', 800, 600)
// const shader = create_shader(`
//  attribute vec3 pos;
//  void main() {
//    gl_Position = vec4(pos, 1.0);
//  }
// `, `
//  void main() {
//    gl_FragColor = vec4(1, 0, 0, 1);
//  }
// `
// )

// const quad = create_array_buffer([
//  -0.5, -0.5,
//  0.5, -0.5,
//  0.5, 0.5,
  
//  -0.5, -0.5,
//  0.5, 0.5,
//  -0.5, 0.5,
// ])
// const quad2 = create_array_buffer([
//  -0.5, -0.5,
//  0.5, -0.5,
//  0.5, 0.5,
//  -0.5, 0.5,
// ])
// const quadi = create_element_array_buffer([
//  0, 1, 2,
//  0, 2, 3,
// ])

// function draw() {
//  gl.clearColor(0, 0, 0, 1)
//  gl.clear(gl.COLOR_BUFFER_BIT)
//  gl.viewport(0, 0, 800, 600)
  
//  vertex_pointer(quad2, 'pos', 2)
//  // draw_call(6)
//  indexed_draw_call(quadi, 6)
  
//  window.requestAnimationFrame(draw)
// }
// draw()

function createFramebuffer(width, height) {
  const result = {
    width,
    height
  }
  result.texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, result.texture)
  result.buffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, result.buffer)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, result.texture, 0)
  return result
}
function bindRenderTarget(fb) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb ? fb.buffer : null)
  if (fb) {
    gl.viewport(0, 0, fb.width, fb.height)
  } else {
    gl.viewport(0, 0, screenWidth, screenHeight)
  }
}
function uniformRenderTarget(name, fb) {
  gl.bindTexture(gl.TEXTURE_2D, fb ? fb.texture : null)
  if (fb) {
    gl.uniform1i(gl.getUniformLocation(_current_shader, name), fb.texture)
  }
}

function renderQuad() {
  vertex_pointer(quad, 'pos', 3)
  indexed_draw_call(quadi, 6)
}

function renderLine(a, b) {

}