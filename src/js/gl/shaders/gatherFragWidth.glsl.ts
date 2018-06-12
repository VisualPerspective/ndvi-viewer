import atlasUV from '@app/gl/shaders/functions/atlasUV'
import atlasSample from '@app/gl/shaders/functions/atlasSample'

export default ({
  rasterWidth,
  noDataThreshold,
}: {
  rasterWidth: number,
  noDataThreshold: number,
}) => `
  precision highp float;
  uniform sampler2D raster;
  uniform vec2 imageSize;
  uniform int imagesWide;
  uniform float targetHeight;
  varying vec2 vUv;

  ${atlasUV()}
  ${atlasSample()}

  void main () {
    float total = 0.0, pixels = 0.0;
    float imageRow = floor((vUv.y / targetHeight) / imageSize.y);
    float index = floor(imageRow * float(imagesWide) * 4.0) + vUv.x;

    for (int i = 0; i < ${rasterWidth}; i++) {
      vec2 relativeUV = vec2(
        (float(i) + 0.5) / ${rasterWidth}.0,
        mod(vUv.y / targetHeight, imageSize.y) / imageSize.y
      );

      vec2 uv = atlasUV(
        relativeUV,
        int(index),
        imagesWide,
        imageSize
      );

      vec4 sample = texture2D(raster, uv);
      float value = atlasSample(mod(index, 4.0), sample);

      total += step(${noDataThreshold}, value) * value;
      pixels += step(${noDataThreshold}, value);
    }

    gl_FragColor = vec4(
      total,
      pixels,
      0.0,
      1.0
    );
  }
`
