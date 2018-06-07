export default () => `
  // given a point and a bounding box, returns the point's position
  // within the box normalized from 0 to 1
  vec2 pointInBBox(vec2 point, vec4 bbox) {
    return vec2(
      (point.x - bbox[0]) / (bbox[2] - bbox[0]),
      (point.y - bbox[1]) / (bbox[3] - bbox[1])
    );
  }
`
