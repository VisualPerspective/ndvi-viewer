vec2 lngLatToSinusoidal(vec2 position) {
 const float PI = 3.141592653589793;
 const float EARTH_CIRCUMFERENCE = 6371007.0 * PI * 2.0;

 float latFactor = cos(position.y * PI / 180.0);

 float y = position.y / 360.0 * EARTH_CIRCUMFERENCE;
 float x = position.x / 360.0 * EARTH_CIRCUMFERENCE * latFactor;
 return vec2(x, y);
}
