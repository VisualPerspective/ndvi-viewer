precision mediump float;
attribute vec2 position;
uniform mat4 model, view, projection;

void main() {
  gl_Position = projection * view * model * vec4(position, 0, 1);
}
