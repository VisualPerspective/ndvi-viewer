vec2 lngLatToMercator(vec2 position, float scale) {
  const float PI = 3.141592653589793;
  const float PI_4 = PI / 4.0;
  const float DEGREES_TO_RADIANS = PI / 180.0;
  float lambda2 = position.x * DEGREES_TO_RADIANS;
  float phi2 = position.y * DEGREES_TO_RADIANS;
  float x = scale * (lambda2 + PI) / (2.0 * PI);
  float y = scale * (PI - log(tan(PI_4 + phi2 * 0.5))) / (2.0 * PI);
  return vec2(x, y);
}
