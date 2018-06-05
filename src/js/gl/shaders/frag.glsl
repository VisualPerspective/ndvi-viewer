precision highp float;

$cool
$viridis
$lngLatToSinusoidal

uniform highp int timePeriod;
uniform sampler2D raster;
uniform vec4 rasterBBoxMeters;
uniform int atlasSize, rasterWidth, rasterHeight;

varying vec2 lngLat;

void main() {
  float timeComponent = mod(float(timePeriod), 4.0);

  vec2 meters = lngLatToSinusoidal(lngLat);
  vec2 projectedUv = vec2(
    (meters.x - rasterBBoxMeters[0]) / (rasterBBoxMeters[2] - rasterBBoxMeters[0]),
    (meters.y - rasterBBoxMeters[1]) / (rasterBBoxMeters[3] - rasterBBoxMeters[1])
  );

  float imageWidth = float(rasterWidth) / float(atlasSize);
  float imageHeight = float(rasterHeight) / float(atlasSize);
  vec4 sample = texture2D(raster, vec2(
    (clamp(projectedUv.x, 0.0, 0.99) + floor(float(timePeriod) / 4.0)) * imageWidth,
    (1.0 - clamp(projectedUv.y, 0.0, 1.0)) * imageHeight
  ));

  float unscaled =
    (1.0 - step(0.1, abs(0.0 - timeComponent))) * sample.r +
    (1.0 - step(0.1, abs(1.0 - timeComponent))) * sample.g +
    (1.0 - step(0.1, abs(2.0 - timeComponent))) * sample.b +
    (1.0 - step(0.1, abs(3.0 - timeComponent))) * sample.a;

  float scaled = (unscaled + 0.2) / 1.2;
  if (unscaled < -0.2) {
    gl_FragColor = vec4(vec3(0.8), 1.0);
  } else {
    gl_FragColor = viridis(scaled);
  }
}
