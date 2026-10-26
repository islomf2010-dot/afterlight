import{b as E,u as D,j as p,E as ne,B as se,V as ie,g as X,N as le}from"./r3f-CAIdFP5s.js";import{b as m}from"./react-DE8NN6kS.js";import{D as y,p as v,h as k,M as ce,v as _,N as ue,F as $,l as pe,u as fe,T as ve,B as H,c as de,t as j,y as N}from"./index-CApK0vR9.js";import{V as K,h as A,G as me,H as U,i as he,Z as xe,a as ge}from"./three-CuITrT85.js";const G={current:null},Ie=({running:t})=>(E((a,e)=>{const o=Math.min(e,.05);v.x=k(v.x,v.targetX,3.2,o),v.y=k(v.y,v.targetY,3.2,o),v.vx=k(v.vx,0,4,o),v.vy=k(v.vy,0,4,o),v.activity=k(v.activity,v.lastMoveAt?0:1,1.2,o),ce(t?o:0)}),null),Oe=({target:t})=>{const a=m.useRef(0);return E((e,o)=>{a.current=k(a.current,t,2.2,Math.min(o,.05)),_.exposure=a.current}),null},Le=()=>{const t=D(r=>r.gl),a=D(r=>r.scene),e=D(r=>r.camera),o=m.useRef(y.captureToken);return E(()=>{if(y.captureToken===o.current)return;o.current=y.captureToken;const r=t.domElement,s=l=>{y.captureError=l,y.captureSeq+=1},c=l=>{if(!l||l.size===0){s("The frame could not be encoded — the canvas produced no data.");return}const f=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),d=ue(l,`afterlight-frame-${f}.png`);s(d?null:"The browser blocked the download. Check this site’s download permissions.")};try{if(r.width<2||r.height<2){s("The frame is too small to capture. Resize the window and try again.");return}if(typeof r.toBlob!="function"){s("This browser does not support canvas capture (toBlob).");return}G.current?G.current.render(1/60):t.render(a,e),r.toBlob(c,"image/png")}catch(l){s(l instanceof Error?l.message:"Capture failed for an unknown reason.")}}),null},je=()=>{const t=m.useRef(y.captureSeq);return E(()=>{if(y.captureSeq===t.current)return;t.current=y.captureSeq;const a=y.captureError;a?$.getState().resolveCapture("error",a):$.getState().resolveCapture("success","Frame captured and downloaded.")}),null},Be=()=>{const t=m.useRef({frames:0,elapsed:0});return E((a,e)=>{const o=t.current;o.frames+=1,o.elapsed+=e,_.frames+=1,o.elapsed>=.5&&(_.fps=o.frames/o.elapsed,o.frames=0,o.elapsed=0)}),null},Q=3,Ve=()=>{const t=D(e=>e.gl),a=m.useRef(0);return E(()=>{if(a.current>=Q||(a.current+=1,a.current<Q))return;const e=t.info.programs?.length??0;pe.complete("shaders",`${e} GLSL program${e===1?"":"s"} linked`)}),null},qe=()=>{const t=fe(),a=$(o=>o.params.bloom),e=m.useCallback(o=>{G.current=o??null},[]);return t.post?p.jsxs(ne,{ref:e,multisampling:0,enableNormalPass:!1,children:[p.jsx(se,{intensity:a,luminanceThreshold:.2,luminanceSmoothing:.34,mipmapBlur:!0,radius:t.highPost?.78:.62,levels:t.highPost?7:5}),p.jsx(ie,{offset:.26,darkness:.7,eskil:!1,blendFunction:X.NORMAL}),p.jsx(le,{premultiply:!0,opacity:.026,blendFunction:X.OVERLAY})]}):null},Ne=({onContextLost:t,onContextRestored:a})=>{const e=D(o=>o.gl);return m.useEffect(()=>{const o=e.domElement,r=c=>{c.preventDefault(),t()},s=()=>a();return o.addEventListener("webglcontextlost",r,!1),o.addEventListener("webglcontextrestored",s,!1),()=>{o.removeEventListener("webglcontextlost",r,!1),o.removeEventListener("webglcontextrestored",s,!1)}},[e,t,a]),null},Ue=({active:t=!0})=>p.jsxs("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-0 overflow-hidden",children:[p.jsx("div",{className:"absolute inset-0",style:{background:"radial-gradient(120% 80% at 50% 108%, rgba(28,32,38,0.95) 0%, rgba(5,5,5,0) 62%), radial-gradient(70% 50% at 22% 18%, rgba(20,24,29,0.8) 0%, rgba(5,5,5,0) 70%), linear-gradient(180deg, #050505 0%, #08090b 55%, #050505 100%)"}}),t?p.jsx("div",{className:"al-animated absolute inset-0 opacity-70",style:{background:"radial-gradient(40% 30% at 50% 46%, rgba(243,242,238,0.06) 0%, rgba(5,5,5,0) 65%)",animation:"al-flicker 9s var(--al-ease-in-out) infinite"}}):null,p.jsx("div",{className:"absolute inset-x-0 bottom-0 h-[38%] opacity-60",style:{background:"linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.95) 92%)"}})]}),$e=()=>p.jsx("div",{role:"status",className:"pointer-events-none absolute inset-x-0 top-[calc(var(--al-nav-h)+1.5rem)] z-20 mx-auto w-fit max-w-[min(34rem,92vw)]",children:p.jsxs("div",{className:"panel-surface flex flex-col items-start gap-3 p-4",children:[p.jsx(ve,{tone:"warn",dot:!0,children:"Static mode"}),p.jsx("p",{className:"text-sm leading-relaxed text-[color:var(--al-text-muted)]",children:"This browser cannot open a WebGL context, so the film is playing as written frames. Every scene, the laboratory controls and the archive remain available."}),p.jsxs("div",{className:"flex flex-wrap gap-3",children:[p.jsx(H,{variant:"technical",size:"sm",to:"/archive",children:"Read the log"}),p.jsx(H,{variant:"technical",size:"sm",to:"/lab",children:"Laboratory"})]}),p.jsxs("p",{className:"font-mono text-2xs text-[color:var(--al-text-quiet)]",children:["renderer: ",de.renderer]})]})}),ye=`
  // Integer-free hash → [0,1). Cheap, stable across drivers (no bitwise ops).
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
  }
`,we=`
  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    // Quintic interpolation keeps the derivative continuous → no visible grid.
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float n000 = hash33(i + vec3(0.0, 0.0, 0.0)).x;
    float n100 = hash33(i + vec3(1.0, 0.0, 0.0)).x;
    float n010 = hash33(i + vec3(0.0, 1.0, 0.0)).x;
    float n110 = hash33(i + vec3(1.0, 1.0, 0.0)).x;
    float n001 = hash33(i + vec3(0.0, 0.0, 1.0)).x;
    float n101 = hash33(i + vec3(1.0, 0.0, 1.0)).x;
    float n011 = hash33(i + vec3(0.0, 1.0, 1.0)).x;
    float n111 = hash33(i + vec3(1.0, 1.0, 1.0)).x;

    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  /**
   * 2D value noise — four hashes instead of the eight a 3D octave costs.
   *
   * The corridor walls are planar and cover the whole viewport, so per-pixel
   * noise there is the single most expensive thing in the scene. On a surface
   * with a known plane there is no visual reason to pay for the third axis.
   */
  float vnoise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float n00 = hash21(i);
    float n10 = hash21(i + vec2(1.0, 0.0));
    float n01 = hash21(i + vec2(0.0, 1.0));
    float n11 = hash21(i + vec2(1.0, 1.0));

    return mix(mix(n00, n10, f.x), mix(n01, n11, f.x), f.y);
  }

  float fbm3(vec3 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      sum += amp * vnoise3(p);
      // Rotate between octaves so the lattice never lines up into stripes.
      p = p * 2.02 + vec3(11.3, 7.1, 3.7);
      amp *= 0.5;
    }
    return sum;
  }
`,J=`
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`,be=`
  vec3 srgbToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
  }

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  // Filmic-ish tonemap. Keeps highlights from clipping to flat white while
  // preserving the low-contrast palette the art direction depends on.
  vec3 tonemap(vec3 x) {
    const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }
`,I=`${ye}${we}${be}`,ee=(t,a)=>({uFogColor:{value:t.clone()},uFogDensity:{value:a}}),B=`
  uniform vec3 uFogColor;
  uniform float uFogDensity;

  // viewDepth is the distance from the camera in metres, matching three's
  // FogExp2 convention of the negated view-space Z axis.
  float fogFactorExp2(float viewDepth) {
    float d = uFogDensity * viewDepth;
    return 1.0 - clamp(exp(-d * d), 0.0, 1.0);
  }

  vec3 applyFog(vec3 color, float viewDepth) {
    return mix(color, uFogColor, fogFactorExp2(viewDepth));
  }
`,te=t=>{let a=t>>>0;return()=>{a=a+1831565813>>>0;let e=a;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}},Y=t=>((t()+t()+t())/3-.5)*2,W=(t,a)=>{let e,o,r;do e=t()*2-1,o=t()*2-1,r=e*e+o*o;while(r>=1||r===0);const s=2*Math.sqrt(1-r);a.x=e*s,a.y=o*s,a.z=1-2*r},h={x:0,y:0,z:0},Pe=(t,a,e)=>{switch(a){case"shell":{W(t,e);const o=.82+t()*.18;e.x*=o,e.y*=o,e.z*=o;break}case"column":{const o=t()*Math.PI*2,r=Math.sqrt(t());e.x=Math.cos(o)*r,e.z=Math.sin(o)*r,e.y=Y(t);break}case"plate":{const o=t()*Math.PI*2,r=Math.sqrt(t());e.x=Math.cos(o)*r,e.z=Math.sin(o)*r,e.y=Y(t)*.08;break}case"halo":{const o=t()*Math.PI*2,r=.78+Math.sqrt(t())*.22;e.x=Math.cos(o)*r,e.y=(t()-.5)*.42,e.z=Math.sin(o)*r;break}default:{W(t,e);const o=t()**(1/3);e.x*=o,e.y*=o,e.z*=o;break}}},ze=t=>{const{count:a,extent:e,seed:o,distribution:r}=t,[s,c]=t.sizeRange??[.45,1.6],l=te(o),f=new Float32Array(a*3),d=new Float32Array(a),g=new Float32Array(a);for(let x=0;x<a;x+=1){Pe(l,r,h),l()<.3&&(h.x*=.35,h.y*=.35,h.z*=.35);const w=x*3;f[w]=h.x*e[0],f[w+1]=h.y*e[1],f[w+2]=h.z*e[2],d[x]=s+(c-s)*l()**2.2,g[x]=l()}return{count:a,positions:f,scales:d,phases:g}},Se=.92,Ge=t=>{const{count:a,seed:e,size:o,scatterRadius:r}=t,s=te(e),c=new Float32Array(a*3),l=new Float32Array(a*3),f=new Float32Array(a*3),d=new Float32Array(a*3),g=new Float32Array(a),x=new Float32Array(a),[w,b,O]=o;for(let P=0;P<a;P+=1){const u=P*3,T=s(),C=s(),M=s(),V=Math.floor(s()*6),n=.035,i=(T-.5)*(1-n*2),R=(C-.5)*(1-n*2);let z=0,S=0,F=0;switch(V){case 0:z=.5-n,S=i,F=R;break;case 1:z=-.5+n,S=i,F=R;break;case 2:z=i,S=.5-n,F=R;break;case 3:z=i,S=-.5+n,F=R;break;case 4:z=i,S=R,F=.5-n;break;default:z=i,S=R,F=-.5+n;break}c[u]=z*w*2,c[u+1]=S*b*2,c[u+2]=F*O*2;const ae=.35+(c[u+1]+b)/(2*b)*.9;W(s,h);const L=r*(.35+s()*.85)*ae;l[u]=c[u]+h.x*L,l[u+1]=c[u+1]+h.y*L*.75+L*.15,l[u+2]=c[u+2]+h.z*L,f[u]=(s()-.5)*3.2,f[u+1]=(s()-.5)*3.2,f[u+2]=(s()-.5)*3.2;const q=.055+s()**2.6*.16;d[u]=q,d[u+1]=q*(.6+s()*.9),d[u+2]=q*(.6+s()*.9);const re=(c[u+1]+b)/(2*b);g[P]=Math.min(Se,Math.max(0,re*.72+(s()-.5)*.22)),x[P]=M}return{count:a,rest:c,scatter:l,spin:f,scales:d,delays:g,phases:x}},Fe=(t="#cfd6dc",a="#ffffff")=>({...ee(new A("#05070a"),.018),uTime:{value:0},uSize:{value:2.2},uColor:{value:new A(t)},uAccent:{value:new A(a)},uOpacity:{value:.9},uPixelRatio:{value:1},uPointer:{value:new K(0,0,0)},uPointerInfluence:{value:1},uPointerRadius:{value:3.2},uDistortion:{value:.4},uSpeed:{value:1},uDrift:{value:.35},uBounds:{value:40}}),De=`
  attribute float aScale;
  attribute float aPhase;

  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerInfluence;
  uniform float uPointerRadius;
  uniform float uDistortion;
  uniform float uSpeed;
  uniform float uDrift;
  uniform float uBounds;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  // Pointer proximity measured at the *displaced* position, so a particle
  // lights up as it is pushed rather than before. Clamped to 0..1 so the
  // fragment stage can use it as a mix factor.
  float falloffProxy(vec3 pointer, vec3 pos, float radius, float influence) {
    if (influence <= 0.001) return 0.0;
    float d = distance(pos, pointer);
    float falloff = 1.0 - smoothstep(0.0, max(radius, 0.001), d);
    return clamp(falloff * influence * 0.6, 0.0, 1.0);
  }

  void main() {
    float t = uTime * uSpeed;
    vec3 pos = position;

    // Seeded drift: each particle owns a phase, so the cloud never pulses
    // in unison and no two particles share a trajectory.
    float s = aPhase;
    pos.x += sin(t * 0.21 + s * 6.283) * uDrift;
    pos.y += cos(t * 0.17 + s * 4.712) * uDrift * 0.72;
    pos.z += sin(t * 0.13 + s * 3.141) * uDrift * 0.9;

    // Curl-ish warp driven by value noise. This is the "distortion" control:
    // at 0 the field is a clean volume, at 1 it churns.
    if (uDistortion > 0.001) {
      vec3 np = pos * 0.12 + vec3(0.0, t * 0.06, 0.0);
      float n1 = vnoise3(np);
      float n2 = vnoise3(np * 2.7 + 17.3);
      vec3 warp = vec3(n1 - 0.5, n2 - 0.5, vnoise3(np.zxy + 5.1) - 0.5);
      pos += warp * uDistortion * 2.4;
    }

    // Pointer field: particles are pushed radially away from the pointer and
    // swirled slightly, with a smooth falloff so there is no hard boundary.
    if (uPointerInfluence > 0.001) {
      vec3 toPointer = pos - uPointer;
      float dist = length(toPointer);
      float falloff = 1.0 - smoothstep(0.0, uPointerRadius, dist);
      if (falloff > 0.001) {
        vec3 dir = dist > 0.0001 ? toPointer / dist : vec3(0.0, 1.0, 0.0);
        pos += dir * falloff * falloff * uPointerInfluence * 1.5;
        // Tangential component gives the field a swirl rather than a bulge.
        pos += cross(dir, vec3(0.0, 1.0, 0.0)) * falloff * uPointerInfluence * 0.45;
      }
    }

    // Soft containment: wrap the field inside its bounds instead of letting
    // particles drift out of frame when drift is dialled up.
    if (uBounds > 0.001) {
      pos = mod(pos + uBounds, uBounds * 2.0) - uBounds;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewDepth = -mv.z;
    gl_Position = projectionMatrix * mv;

    // Perspective-correct point size. The clamp is deliberately low: a large
    // point sprite is a large quad, and a cloud of them turns into bokeh blobs
    // rather than dust while also destroying fill rate on mobile GPUs.
    float size = uSize * aScale * uPixelRatio * (180.0 / max(vViewDepth, 0.6));
    gl_PointSize = clamp(size, 0.7, 7.5 * uPixelRatio);

    // Fade in the distance and very close to the camera; keeps the field from
    // popping when the scroll-linked camera passes through it.
    vFade = smoothstep(0.4, 2.4, vViewDepth) * (1.0 - smoothstep(38.0, 74.0, vViewDepth));
    vEnergy = falloffProxy(uPointer, pos, uPointerRadius, uPointerInfluence);
    vSeed = aPhase;
  }
`,oe=`
  ${I}
  ${De}
`,Ee=oe,Re=oe,ke=`
  ${I}
  ${B}

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  void main() {
    // Analytic disc: gl_PointCoord is centred on the sprite.
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float soft = 1.0 - smoothstep(0.04, 0.25, d);

    vec3 tint = mix(uColor, uAccent, vEnergy * 0.7 + vSeed * 0.18);
    float alpha = soft * vFade * uOpacity * (0.35 + vSeed * 0.5);
    vec3 colour = applyFog(tint, vViewDepth);
    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`,Ae=`
  ${I}
  ${B}

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vFade;
  varying float vEnergy;
  varying float vViewDepth;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;

    float soft = pow(1.0 - smoothstep(0.0, 0.25, d), 1.6);
    // A thin bright ring reads as a lens artefact and gives the field depth.
    float ring = smoothstep(0.16, 0.22, d) * (1.0 - smoothstep(0.22, 0.25, d));

    float energy = clamp(vEnergy, 0.0, 1.0);
    vec3 tint = mix(uColor, uAccent, energy * 0.85);
    float alpha = soft * vFade * uOpacity * (0.28 + vSeed * 0.42) + ring * vFade * energy * 0.55;

    vec3 colour = applyFog(tint * (1.0 + energy * 0.8), vViewDepth);
    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`,We=({count:t,extent:a,distribution:e,seed:o,variant:r="dust",color:s="#c8d0d8",accent:c="#ffffff",size:l=2.2,opacity:f=.9,bounds:d=0,pointerRadius:g=3.2,liveControls:x=!1,pointerTarget:w,pointerDistance:b=8,still:O=!1})=>{const P=D(n=>n.gl),u=D(n=>n.camera),T=m.useMemo(()=>{const n=ze({count:Math.max(1,Math.floor(t)),extent:a,seed:o,distribution:e}),i=new me;return i.setAttribute("position",new U(n.positions,3)),i.setAttribute("aScale",new U(n.scales,1)),i.setAttribute("aPhase",new U(n.phases,1)),i.computeBoundingSphere(),i},[t,a,e,o]),C=m.useMemo(()=>Fe(s,c),[]),M=m.useMemo(()=>new he({uniforms:C,vertexShader:r==="dust"?Ee:Re,fragmentShader:r==="dust"?ke:Ae,transparent:!0,depthWrite:!1,depthTest:!0,blending:xe}),[C,r]),V=m.useRef({color:"",accent:"",size:-1,opacity:-1,bounds:-1,radius:-1});return E(()=>{const n=C,i=V.current;i.color!==s&&(n.uColor.value.set(s),i.color=s),i.accent!==c&&(n.uAccent.value.set(c),i.accent=c),i.size!==l&&(n.uSize.value=l,i.size=l),i.opacity!==f&&(n.uOpacity.value=f,i.opacity=f),i.bounds!==d&&(n.uBounds.value=d,i.bounds=d),i.radius!==g&&(n.uPointerRadius.value=g,i.radius=g),n.uTime.value=j.elapsed,n.uPixelRatio.value=P.getPixelRatio(),n.uOpacity.value=f*_.exposure,x?(n.uDistortion.value=N.distortion,n.uPointerInfluence.value=N.pointerInfluence,n.uSpeed.value=O?0:N.speed*j.running):n.uSpeed.value=O||_.reducedMotion?0:j.speed*j.running,w?n.uPointer.value.copy(w):v.present?(Z.set(v.x,v.y,-1).applyQuaternion(u.quaternion).normalize().multiplyScalar(b).add(u.position),n.uPointer.value.lerp(Z,.3)):n.uPointer.value.set(0,0,-9999)}),m.useEffect(()=>()=>T.dispose(),[T]),m.useEffect(()=>()=>M.dispose(),[M]),p.jsx("points",{geometry:T,material:M,frustumCulled:!1,renderOrder:2})},Z=new K,Xe=(t="#e8eef4",a="#8ea3b5")=>({...ee(new A("#05070a"),.02),uTime:{value:0},uOpen:{value:1},uDistortion:{value:.5},uPointer:{value:new ge(0,0)},uPointerInfluence:{value:1},uSpeed:{value:1},uCore:{value:new A(t)},uRim:{value:new A(a)},uAspect:{value:1},uSeed:{value:3.7}}),He=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Qe=`
  ${I}
  ${J}
  ${B}

  uniform float uTime;
  uniform float uOpen;
  uniform float uDistortion;
  uniform vec2 uPointer;
  uniform float uPointerInfluence;
  uniform float uSpeed;
  uniform vec3 uCore;
  uniform vec3 uRim;
  uniform float uAspect;
  uniform float uSeed;

  varying vec2 vUv;

  void main() {
    float t = uTime * uSpeed;

    // Aspect-corrected centred coordinates → a circular aperture on any screen.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    // The pointer drags the aperture centre; this is the interaction that makes
    // the portal feel like an object rather than a decal.
    vec2 pointerOffset = uPointer * uPointerInfluence * 0.18;
    p -= pointerOffset;

    float r = length(p);
    float angle = atan(p.y, p.x);

    // Aperture radius: closed state is a hairline, open state is a disc that
    // nearly fills the quad. The rim is the visible "glass" edge.
    float aperture = mix(0.04, 0.46, uOpen);
    float rimWidth = mix(0.02, 0.055, uOpen);
    float disc = smoothstep(aperture, aperture - rimWidth, r);

    // --- Refracted interior -------------------------------------------------
    // Domain-warped polar coordinates. warping is what sells "looking through
    // something" instead of "looking at a disc".
    float warp = uDistortion;
    vec2 q = vec2(angle / 3.14159265 + 0.5, r / max(aperture, 0.001));
    q += vec2(snoise(vec3(q * 3.0, t * 0.35 + uSeed)), snoise(vec3(q * 3.0 + 19.0, t * 0.28))) * warp * 0.35;

    float rings = sin(q.y * 26.0 - t * 1.6 + snoise(vec3(q * 2.0, t * 0.2)) * 4.0) * 0.5 + 0.5;
    rings = pow(rings, mix(6.0, 1.6, warp));

    float swirl = snoise(vec3(q * 4.5, t * 0.45)) * 0.5 + 0.5;

    // Chromatic separation grows toward the rim — the lens edge bends light most.
    float chroma = smoothstep(0.0, aperture, r) * 0.08 * (0.3 + warp);
    float bandR = sin((q.y + chroma) * 26.0 - t * 1.6) * 0.5 + 0.5;
    float bandB = sin((q.y - chroma) * 26.0 - t * 1.6) * 0.5 + 0.5;

    vec3 interior = vec3(rings * 0.55 + swirl * 0.35);
    interior.r *= mix(1.0, bandR, chroma * 6.0);
    interior.b *= mix(1.0, bandB, chroma * 6.0);
    interior *= mix(0.35, 1.0, smoothstep(aperture, 0.0, r));

    // Core: a soft white-hot centre with a hard falloff, only present when open.
    float core = pow(clamp(1.0 - r / max(aperture, 0.001), 0.0, 1.0), 3.4);
    vec3 colour = uCore * interior * 0.9 + uCore * core * (0.55 + uOpen * 0.5);

    // --- Rim ----------------------------------------------------------------
    float rim = smoothstep(aperture - rimWidth * 1.6, aperture, r) * (1.0 - smoothstep(aperture, aperture + rimWidth * 0.8, r));
    colour += uRim * rim * (0.9 + 0.6 * sin(t * 1.1 + angle * 3.0));

    // Outer bloom halo so the aperture glows into the fog around it.
    float halo = exp(-pow(max(r - aperture, 0.0) * 9.0, 1.4)) * 0.35;
    colour += uRim * halo * uOpen;

    float alpha = clamp(disc * (0.55 + core * 0.45) + rim + halo * 0.6, 0.0, 1.0);
    colour = tonemap(colour * 1.1);
    colour = applyFog(colour, 12.0);

    gl_FragColor = vec4(colour, alpha);
    #include <colorspace_fragment>
  }
`,Ye=`
  ${I}
  ${J}
  ${B}

  uniform float uTime;
  uniform float uDistortion;
  uniform float uSpeed;
  uniform vec2 uPointer;
  uniform float uPointerInfluence;
  uniform float uAspect;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  /** 0 disables the triple-sample chromatic pass on weak devices. */
  uniform float uAberration;

  varying vec2 vUv;

  // The "source image" is generated, not sampled: a horizon, a monolith
  // silhouette and a star field, i.e. the film's own vocabulary.
  vec3 sourceImage(vec2 uv, float t) {
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
    vec3 col = mix(uPaper * 0.55, uInk, smoothstep(0.42, -0.3, p.y));

    // Monolith: a slab standing on the horizon line.
    vec2 mono = vec2(p.x - 0.06 * sin(t * 0.2), p.y + 0.06);
    float slab = (1.0 - smoothstep(0.055, 0.075, abs(mono.x))) * step(-0.32, mono.y) * step(mono.y, 0.06);
    col = mix(col, uInk * 0.35, slab);

    // Horizon line + its reflection.
    float horizon = exp(-pow(abs(p.y + 0.06) * 42.0, 1.3));
    col += uPaper * horizon * 0.16;
    float mirror = step(p.y, -0.06) * exp(-pow(abs(p.y + 0.06) * 18.0, 1.2)) * 0.05;
    col += uPaper * mirror;

    // Sparse star field, deterministic per cell.
    vec2 cell = floor(p * 42.0);
    float star = step(0.995, hash21(cell)) * (0.5 + 0.5 * sin(t * 2.0 + hash21(cell + 3.7) * 30.0));
    col += uPaper * star * 0.28 * smoothstep(0.0, 0.4, p.y);

    return col;
  }

  void main() {
    float t = uTime * uSpeed;
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    // Two-stage domain warp: the classic IQ "water ripple" formulation. Each
    // stage feeds the next, which is what produces the folded, glassy look.
    float k = 0.55 + uDistortion * 5.5;
    vec2 q = vec2(
      snoise(vec3(p * 1.4, t * 0.3)),
      snoise(vec3(p * 1.4 + 5.2, t * 0.26))
    );
    vec2 r2 = vec2(
      snoise(vec3(p * 1.9 + q * k + 1.7, t * 0.34)),
      snoise(vec3(p * 1.9 + q * k + 9.2, t * 0.28))
    );

    // Pointer applies a local lens: a radial pull toward the cursor.
    vec2 toPointer = p - uPointer * vec2(uAspect, 1.0) * 0.5;
    float pd = length(toPointer);
    vec2 pull = (pd > 0.0001 ? toPointer / pd : vec2(0.0)) *
                (1.0 - smoothstep(0.0, 0.45, pd)) * uPointerInfluence * uDistortion * 0.32;

    vec2 warped = p + (r2 * k * 0.16 + pull);

    // Chromatic aberration scales with warp strength and radial distance.
    // On the low tier uAberration is 0 and the single-sample path is taken —
    // a uniform branch, so the whole warp stays coherent.
    float ab = (0.004 + uDistortion * 0.03) * smoothstep(0.0, 0.7, length(p));
    vec3 col;
    if (uAberration > 0.0005) {
      col = vec3(
        sourceImage(warped + ab, t).r,
        sourceImage(warped, t).g,
        sourceImage(warped - ab, t).b
      );
    } else {
      vec3 single = sourceImage(warped, t);
      col = single;
    }

    // Scanline + vignette keeps it inside the film's visual language.
    col *= 0.92 + 0.08 * sin(vUv.y * 900.0);
    float vignette = 1.0 - smoothstep(0.35, 1.05, length(p) * 1.25);
    col *= mix(0.25, 1.0, vignette);

    col = tonemap(col);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`,Ze=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;export{Ne as C,Ye as D,Oe as E,Be as F,ye as H,qe as P,Ve as S,we as V,$e as W,Ie as a,Le as b,je as c,I as d,B as e,ee as f,We as g,Xe as h,Qe as i,He as j,Ge as k,Ue as l,Ze as m};
