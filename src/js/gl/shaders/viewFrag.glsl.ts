import luma from '@app/gl/shaders/functions/luma'
import viridis from '@app/gl/shaders/functions/viridis'
import lngLatToSinusoidal from '@app/gl/shaders/functions/lngLatToSinusoidal'
import mercatorToLngLat from '@app/gl/shaders/functions/mercatorToLngLat'
import pointInBBox from '@app/gl/shaders/functions/pointInBBox'
import isPointInBBox from '@app/gl/shaders/functions/isPointInBBox'
import atlasUV from '@app/gl/shaders/functions/atlasUV'
import atlasSample from '@app/gl/shaders/functions/atlasSample'

export default () => `
  precision highp float;

  ${luma()}
  ${viridis()}
  ${lngLatToSinusoidal()}
  ${mercatorToLngLat()}
  ${pointInBBox()}
  ${isPointInBBox()}
  ${atlasUV()}
  ${atlasSample()}

  uniform highp int timePeriod;
  uniform float scale;
  uniform sampler2D raster;
  uniform sampler2D mask;
  uniform vec4 rasterBBoxMeters;
  uniform vec4 selectedBBoxLngLat;
  uniform vec2 imageSize;
  uniform int imagesWide;

  varying vec2 mercator;

  void main() {
    float timeComponent = mod(float(timePeriod), 4.0);

    vec2 lngLat = mercatorToLngLat(mercator, scale);
    vec2 meters = lngLatToSinusoidal(lngLat);
    vec2 projectedUV = pointInBBox(meters, rasterBBoxMeters);

    float maskSample = texture2D(mask, projectedUV).r;

    vec4 sample = texture2D(raster, atlasUV(
      projectedUV,
      timePeriod,
      imagesWide,
      imageSize
    ));

    float unscaled = atlasSample(timeComponent, sample);
    float scaled = (unscaled + 0.2) / 1.2;
    float hasdata = step(-0.2, unscaled);
    vec4 color = mix(vec4(0.0), viridis(scaled), hasdata);
    vec4 grayscale = mix(vec4(0.0), vec4(vec3(luma(color)) * 0.7, 1.0), hasdata);

    gl_FragColor = mix(grayscale, color, maskSample);
  }
`
