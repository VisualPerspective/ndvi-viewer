import lngLatToMercator from '@app/gl/shaders/functions/lngLatToMercator'

export default () => `
  precision highp float;
  attribute vec2 position;
  uniform mat4 model, view, projection;
  uniform float scale;

  ${lngLatToMercator()}

  void main() {
    vec4 mercator = vec4(lngLatToMercator(position, scale), 0.0, 1.0);
    gl_Position = projection * view * mercator;
  }
`
