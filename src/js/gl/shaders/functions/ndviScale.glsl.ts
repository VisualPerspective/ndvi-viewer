// Converts a value from 0-1 to the NDVI -0.2 to 1.0 scale
export default () => `
  float ndviScale(float value) {
    return value * 1.2 - 0.2;
  }
`
