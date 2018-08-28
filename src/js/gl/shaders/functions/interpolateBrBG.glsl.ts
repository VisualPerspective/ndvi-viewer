export default () => `
  vec4 interpolateBrBG (float x) {
    const float e0 = 0.0;
    const vec4 v0 = vec4(0.328125,0.1875,0.01953125,1);
    const float e1 = 0.13;
    const vec4 v1 = vec4(0.59375,0.3671875,0.08203125,1);
    const float e2 = 0.25;
    const vec4 v2 = vec4(0.8046875,0.62890625,0.3359375,1);
    const float e3 = 0.38;
    const vec4 v3 = vec4(0.93359375,0.86328125,0.6875,1);
    const float e4 = 0.5;
    const vec4 v4 = vec4(0.9296875,0.94140625,0.9140625,1);
    const float e5 = 0.63;
    const vec4 v5 = vec4(0.69921875,0.87890625,0.85546875,1);
    const float e6 = 0.75;
    const vec4 v6 = vec4(0.35546875,0.6953125,0.65625,1);
    const float e7 = 0.88;
    const vec4 v7 = vec4(0.0703125,0.44921875,0.4140625,1);
    const float e8 = 1.0;
    const vec4 v8 = vec4(0,0.234375,0.1875,1);
    float a0 = smoothstep(e0,e1,x);
    float a1 = smoothstep(e1,e2,x);
    float a2 = smoothstep(e2,e3,x);
    float a3 = smoothstep(e3,e4,x);
    float a4 = smoothstep(e4,e5,x);
    float a5 = smoothstep(e5,e6,x);
    float a6 = smoothstep(e6,e7,x);
    float a7 = smoothstep(e7,e8,x);
    return max(mix(v0,v1,a0)*step(e0,x)*step(x,e1),
      max(mix(v1,v2,a1)*step(e1,x)*step(x,e2),
      max(mix(v2,v3,a2)*step(e2,x)*step(x,e3),
      max(mix(v3,v4,a3)*step(e3,x)*step(x,e4),
      max(mix(v4,v5,a4)*step(e4,x)*step(x,e5),
      max(mix(v5,v6,a5)*step(e5,x)*step(x,e6),
      max(mix(v6,v7,a6)*step(e6,x)*step(x,e7),mix(v7,v8,a7)*step(e7,x)*step(x,e8)
    )))))));
  }
`
