export default () => `
  precision highp float;
  uniform vec4 color;

  void main() {
    gl_FragColor = vec4(color);
  }
`
