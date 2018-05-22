precision mediump float;

$cool

uniform vec4 color;
uniform sampler2D ndvi;
varying vec2 uv;

void main() {
  mediump float unscaled = texture2D(ndvi, 1.0 - uv).x;
  mediump float scaled = (unscaled + 0.2) / 1.2;
  if (unscaled < -0.2) {
    gl_FragColor = vec4(vec3(1.0), 1.0);
  } else {
    gl_FragColor = cool(scaled);
  }
}
