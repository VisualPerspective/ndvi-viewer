precision highp float;

$cool

uniform highp int timePeriod;
uniform sampler2D raster;
varying vec2 uv;

void main() {
  float timeComponent = mod(float(timePeriod), 4.0);
  vec4 sample = texture2D(raster, uv);
  float unscaled =
    (1.0 - step(0.1, abs(0.0 - timeComponent))) * sample.r +
    (1.0 - step(0.1, abs(1.0 - timeComponent))) * sample.g +
    (1.0 - step(0.1, abs(2.0 - timeComponent))) * sample.b +
    (1.0 - step(0.1, abs(3.0 - timeComponent))) * sample.a;

  float scaled = (unscaled + 0.2) / 1.2;
  if (unscaled < -0.2) {
    gl_FragColor = vec4(vec3(1.0), 1.0);
  } else {
    gl_FragColor = cool(scaled);
  }
}
