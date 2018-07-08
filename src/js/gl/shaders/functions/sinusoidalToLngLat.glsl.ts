export default () => `
  vec2 sinusoidalToLngLat(vec2 position) {
    const float PI = 3.141592653589793;
    const float EARTH_CIRCUMFERENCE = 6371007.0 * PI * 2.0;

    float normalizedY = position.y / EARTH_CIRCUMFERENCE * 2.0 + 0.5;
    float scaledX = position.x / sin(PI * normalizedY);
    float normalizedX = scaledX / EARTH_CIRCUMFERENCE * 2.0 + 0.5;

    return vec2(
      (normalizedX - 0.5) * 180.0,
      (normalizedY - 0.5) * 180.0
    );
  }
`
