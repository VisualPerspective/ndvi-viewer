import atlasUV from '@app/gl/shaders/functions/atlasUV'
import atlasSample from '@app/gl/shaders/functions/atlasSample'

export default ({
  rasterHeight,
  noDataThreshold,
}: {
  rasterHeight: number,
  noDataThreshold: number,
}) => `
  precision highp float;
  uniform sampler2D widthGather;
  uniform int imagesWide;
  uniform int imagesHigh;
  uniform vec2 imageSize;
  varying vec2 vUv;

  ${atlasUV()}
  ${atlasSample()}

  void main () {
    float total = 0.0, pixels = 0.0;

    for (int i = 0; i < ${rasterHeight}; i++) {
      vec2 uv = vec2(
        (vUv.x + 0.5) / float(imagesWide),
        (vUv.y + (float(i) / ${rasterHeight}.0)) * imageSize.y
      );

      vec4 sample = texture2D(widthGather, uv);

      total += step(${noDataThreshold}, sample.r) * sample.r;
      pixels += sample.g;
    }

    gl_FragColor = vec4(
      total,
      pixels,
      0.0,
      1.0
    );
  }
`
