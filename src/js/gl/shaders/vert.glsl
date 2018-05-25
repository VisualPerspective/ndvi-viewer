precision highp float;
attribute vec2 position;
attribute vec2 uvs;
uniform mat4 model, view, projection;
uniform int atlasSize, rasterWidth, rasterHeight, imagesWide, imagesHigh;
uniform highp int timePeriod;
uniform float scale;
varying vec2 uv;

$lngLatToMercator

void main() {
  vec4 mercator = vec4(lngLatToMercator(position, scale), 0.0, 1.0);
  gl_Position = projection * view * mercator;
  float imageWidth = float(rasterWidth) / float(atlasSize);
  float imageHeight = float(rasterHeight) / float(atlasSize);
  uv = vec2(
    (uvs.x + float(timePeriod / 4)) * imageWidth,
    uvs.y * imageHeight
  );
}
