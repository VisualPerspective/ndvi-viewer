import mercatorToLngLat from '@app/gl/shaders/functions/mercatorToLngLat'
import isPointInBBox from '@app/gl/shaders/functions/isPointInBBox'

export default () => `
  precision highp float;
  uniform vec4 selectedColor;
  uniform vec4 unselectedColor;
  uniform float scale;
  uniform vec4 selectedBBoxLngLat;
  varying vec2 mercator;

  ${mercatorToLngLat()}
  ${isPointInBBox()}

  void main() {
    vec2 lngLat = mercatorToLngLat(mercator, scale);
    float selected = isPointInBBox(lngLat, selectedBBoxLngLat);

    gl_FragColor = mix(unselectedColor, selectedColor, selected);
  }
`
