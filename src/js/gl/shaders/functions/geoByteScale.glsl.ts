// Given a non-zero 8-bit value from a geoTIFF whose nodata value is 0,
// returns the value scaled to the range 0-1
export default () => `
  float geoByteScale(float byteValue) {
    return (byteValue - (1.0 / 255.0)) * (255.0 / 254.0);
  }
`
