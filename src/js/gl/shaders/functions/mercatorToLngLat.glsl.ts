export default () => `
  vec2 mercatorToLngLat(vec2 position, float scale) {
    const float PI = 3.141592653589793;
    const float PI_4 = PI / 4.0;
    const float RADIANS_TO_DEGREES = 180.0 / PI;

    float lambda2 = (position.x / scale) * (2.0 * PI) - PI;
    float phi2 = 2.0 * (atan(exp(PI - (position.y / scale) * (2.0 * PI))) - PI_4);
    return vec2(lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES);
  }
`
