precision highp float;
attribute vec2 position;
attribute vec2 uvs;
uniform mat4 model, view, projection;
uniform int atlasSize, rasterWidth, rasterHeight, imagesWide, imagesHigh;
uniform highp int timePeriod;
varying vec2 uv;

void main() {
  gl_Position = projection * view * model * vec4(position, 0, 1);
  float imageWidth = float(rasterWidth) / float(atlasSize);
  float imageHeight = float(rasterHeight) / float(atlasSize);
  uv = vec2(
    (uvs.x + float(timePeriod / 4)) * imageWidth,
    uvs.y * imageHeight
  );
}
