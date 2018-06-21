import viridis from '@app/gl/shaders/functions/viridis'
import lngLatToSinusoidal from '@app/gl/shaders/functions/lngLatToSinusoidal'
import pointInBBox from '@app/gl/shaders/functions/pointInBBox'
import atlasUV from '@app/gl/shaders/functions/atlasUV'
import atlasSample from '@app/gl/shaders/functions/atlasSample'

export default () => `
  precision highp float;

  ${viridis()}
  ${lngLatToSinusoidal()}
  ${pointInBBox()}
  ${atlasUV()}
  ${atlasSample()}

  uniform highp int timePeriod;
  uniform sampler2D raster;
  uniform vec4 rasterBBoxMeters;
  uniform vec2 imageSize;
  uniform int imagesWide;

  varying vec2 lngLat;

  void main() {
    float timeComponent = mod(float(timePeriod), 4.0);

    vec2 meters = lngLatToSinusoidal(lngLat);
    vec2 projectedUV = pointInBBox(vec2(
      meters.x + 1000.0,
      meters.y + 3500.0
    ), rasterBBoxMeters);

    vec4 sample = texture2D(raster, atlasUV(
      projectedUV,
      timePeriod,
      imagesWide,
      imageSize
    ));

    float unscaled = atlasSample(timeComponent, sample);

    float scaled = (unscaled + 0.2) / 1.2;
    if (unscaled < -0.2) {
      gl_FragColor = vec4(0.0);
    } else {
      gl_FragColor = viridis(scaled);
    }
  }
`
