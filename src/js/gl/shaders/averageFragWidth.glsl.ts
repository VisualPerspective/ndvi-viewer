export default ({
  dataSize,
  noDataThreshold,
}: {
  dataSize: number,
  noDataThreshold: number,
}) => `
  precision highp float;
  uniform sampler2D data_texture;
  varying vec2 vUv;

  void main () {
    float total = 0.0, pixels = 0.0;
    for (int i = 0; i < ${dataSize}; i++) {
      float value = texture2D(data_texture, vec2(
        (float(i) + 0.5) / ${dataSize}.0,
        vUv.y
      )).r;

      total += step(${noDataThreshold}, value) * value;
      pixels += step(${noDataThreshold}, value);
    }

    gl_FragColor = vec4(
      total,
      pixels,
      0.0,
      0.0
    );
  }
`
