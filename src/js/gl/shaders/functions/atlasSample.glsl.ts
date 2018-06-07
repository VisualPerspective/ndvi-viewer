export default () => `
  // Returns a sample value from a data atlas where data
  // elements are packed sequentially across RGBA channels
  float atlasSample(float index, vec4 sample) {
    return
      (1.0 - step(0.1, abs(0.0 - index))) * sample.r +
      (1.0 - step(0.1, abs(1.0 - index))) * sample.g +
      (1.0 - step(0.1, abs(2.0 - index))) * sample.b +
      (1.0 - step(0.1, abs(3.0 - index))) * sample.a;
  }
`
