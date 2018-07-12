import lngLatToMercator from '@app/gl/shaders/functions/lngLatToMercator'

export default () => `
  precision highp float;
  attribute vec2 position;
  uniform mat4 model, view, projection;
  uniform float scale;
  varying vec2 mercator;

  ${lngLatToMercator()}

  void main() {
    mercator = lngLatToMercator(position, scale);
    gl_Position = projection * view * vec4(mercator, 0.0, 1.0);
  }
`
