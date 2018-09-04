export default () => `
  vec4 colorScale (float x, vec4[9] colors) {
    const float e0 = 0.0;
    const float e1 = 0.13;
    const float e2 = 0.25;
    const float e3 = 0.38;
    const float e4 = 0.5;
    const float e5 = 0.63;
    const float e6 = 0.75;
    const float e7 = 0.88;
    const float e8 = 1.0;
    float a0 = smoothstep(e0,e1,x);
    float a1 = smoothstep(e1,e2,x);
    float a2 = smoothstep(e2,e3,x);
    float a3 = smoothstep(e3,e4,x);
    float a4 = smoothstep(e4,e5,x);
    float a5 = smoothstep(e5,e6,x);
    float a6 = smoothstep(e6,e7,x);
    float a7 = smoothstep(e7,e8,x);
    return max(mix(colors[0],colors[1],a0)*step(e0,x)*step(x,e1),
      max(mix(colors[1],colors[2],a1)*step(e1,x)*step(x,e2),
      max(mix(colors[2],colors[3],a2)*step(e2,x)*step(x,e3),
      max(mix(colors[3],colors[4],a3)*step(e3,x)*step(x,e4),
      max(mix(colors[4],colors[5],a4)*step(e4,x)*step(x,e5),
      max(mix(colors[5],colors[6],a5)*step(e5,x)*step(x,e6),
      max(mix(colors[6],colors[7],a6)*step(e6,x)*step(x,e7),
      mix(colors[7],colors[8],a7)*step(e7,x)*step(x,e8)
    )))))));
  }
`
