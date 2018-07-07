export default () => `
  // given a point and a bounding box, returns 1 if the point is
  // in the bbox, else 0
  float isPointInBBox(vec2 point, vec4 bbox) {
    if (
      point.x > bbox[0] && point.x < bbox[2] &&
      point.y > bbox[1] && point.y < bbox[3]
    ) {
      return 1.0;
    }
    else {
      return 0.0;
    }
  }
`
