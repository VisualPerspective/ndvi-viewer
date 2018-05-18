precision mediump float;
uniform vec4 color;
uniform sampler2D ndvi;
varying vec2 uv;

void main() {
  mediump float unscaled = texture2D(ndvi, uv).x;
  mediump float scaled = (unscaled + 0.2) / 1.2;
  if (unscaled < -1.0) {
    scaled = 0.0;
  }

  gl_FragColor = vec4(vec3(scaled), 1.0);
}
