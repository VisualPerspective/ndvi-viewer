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
    float imagesPerRow = numChannels * float(imagesWide);
    vec2 start = vec2(
      floor(mod(float(index) / numChannels, float(imagesWide))),
      floor(float(index) / imagesPerRow)
    );
    return vec2(
      (clamp(uv.x, 0.0, 0.999) + start.x) * imageSize.x,
      (clamp(uv.y, 0.0, 0.999) + start.y) * imageSize.y
    );
  }
`
