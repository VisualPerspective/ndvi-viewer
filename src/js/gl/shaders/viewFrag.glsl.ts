import luma from '@app/gl/shaders/functions/luma'
import viridis from '@app/gl/shaders/functions/viridis'
import interpolateBrBG from '@app/gl/shaders/functions/interpolateBrBG'
import lngLatToSinusoidal from '@app/gl/shaders/functions/lngLatToSinusoidal'
import mercatorToLngLat from '@app/gl/shaders/functions/mercatorToLngLat'
import pointInBBox from '@app/gl/shaders/functions/pointInBBox'
import atlasUV from '@app/gl/shaders/functions/atlasUV'
import atlasSample from '@app/gl/shaders/functions/atlasSample'
import geoByteScale from '@app/gl/shaders/functions/geoByteScale'

export default ({
  noDataThreshold,
  colorScale,
}: {
  noDataThreshold: number,
  colorScale: string,
}) => `
  precision highp float;

  ${luma()}
  ${viridis()}
  ${interpolateBrBG()}
  ${lngLatToSinusoidal()}
  ${mercatorToLngLat()}
  ${pointInBBox()}
  ${atlasUV()}
  ${atlasSample()}
  ${geoByteScale()}

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
    float scaled = geoByteScale(unscaled);

    float hasdata = step(${noDataThreshold}, unscaled);
    vec4 color = mix(vec4(0.0), ${colorScale}(scaled), hasdata);
    vec4 grayscale = mix(vec4(0.0), vec4(vec3(luma(color)) * 0.7, 1.0), hasdata);

    gl_FragColor = mix(grayscale, color, maskSample);
  }
`
