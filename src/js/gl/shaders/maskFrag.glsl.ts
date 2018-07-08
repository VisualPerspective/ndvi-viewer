import sinusoidalToLngLat from '@app/gl/shaders/functions/sinusoidalToLngLat'
import isPointInBBox from '@app/gl/shaders/functions/isPointInBBox'

export default () => `
  precision highp float;

  ${sinusoidalToLngLat()}
  ${isPointInBBox()}

  uniform vec4 rasterBBoxMeters;
  uniform vec4 selectedBBoxLngLat;
  uniform float rasterWidth;
  uniform float rasterHeight;
  varying vec2 vUv;

  void main() {
    vec2 uv = vec2(vUv.x / rasterWidth, vUv.y / rasterHeight);

    vec2 meters = vec2(
      rasterBBoxMeters[0] + uv.x * (rasterBBoxMeters[2] - rasterBBoxMeters[0]),
      rasterBBoxMeters[1] + uv.y * (rasterBBoxMeters[3] - rasterBBoxMeters[1])
    );

    vec2 lngLat = sinusoidalToLngLat(meters);

    gl_FragColor = vec4(vec3(isPointInBBox(lngLat, selectedBBoxLngLat)), 1.0);
    // gl_FragColor = vec4(meters.x + 880503.0, meters.y - 7221936.5, 0.0, 1.0);
    // gl_FragColor = vec4(lngLat.x + 18.7, lngLat.y - 64.94, 0.0, 1.0);
  }
`
