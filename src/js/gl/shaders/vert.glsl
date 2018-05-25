precision highp float;
attribute vec2 position;
attribute vec2 uvs;
uniform mat4 model, view, projection;
uniform highp int timePeriod;
uniform float scale;
varying vec2 lngLat;

$lngLatToMercator

void main() {
  vec4 mercator = vec4(lngLatToMercator(position, scale), 0.0, 1.0);

  lngLat = position;
  gl_Position = projection * view * mercator;
}
