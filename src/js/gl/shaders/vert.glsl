precision mediump float;
attribute vec2 position;
attribute vec2 uvs;
uniform mat4 model, view, projection;
varying vec2 uv;

void main() {
  gl_Position = projection * view * model * vec4(position, 0, 1);
  uv = uvs;
}
