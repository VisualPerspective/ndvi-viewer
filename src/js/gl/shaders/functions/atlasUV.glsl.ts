export default () => `
  // Transforms a standard UV to a UV within the appropriate
  // sub-image of an image atlas. The image within the atlas
  // is specified by 'index'
  vec2 atlasUV(
    vec2 uv,
    int index,
    int imagesWide,
    int imagesHigh,
    vec2 imageSize
  ) {
    const float numChannels = 4.0;
    vec2 start = vec2(floor(float(index) / numChannels), 0.0);
    return vec2(
      (clamp(uv.x, 0.0, 0.999) + start.x) * imageSize.x,
      (1.0 - (clamp(uv.y, 0.0, 0.999) + start.y)) * imageSize.y
    );
  }
`
