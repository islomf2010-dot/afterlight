const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./EchoesScene-BKCGWBN7.js","./r3f-CAIdFP5s.js","./react-DE8NN6kS.js","./three-CuITrT85.js","./index-CApK0vR9.js","./motion-BqM_xKjl.js","./index-aZ6gD3AJ.css","./ExhibitBackdrop-3NsNeXHH.js","./portal-CzQPYAJz.js"])))=>i.map(i=>d[i]);
import{_ as ae,j as e,C as Ze,u as Z,b as j}from"./r3f-CAIdFP5s.js";import{b as s}from"./react-DE8NN6kS.js";import{A as Ke,a as xe,h as b,V as E,X as Se,Y as Pe,i as H,t as pe,s as Fe,Z as ee,_ as De}from"./three-CuITrT85.js";import{C as Qe,a as Je,E as et,F as tt,S as ot,b as rt,c as at,P as st,d as Le,e as nt,f as it,H as Ie,V as Oe,g as ve,h as lt,i as ct,j as ut,k as dt,l as mt,W as ft}from"./portal-CzQPYAJz.js";import{c as Me,l as Y,u as ne,a as pt,b as be,d as A,E as vt,e as ht,T as R,f as Ee,g as gt,B as P,s as xt,h as V,p as _,i as yt,j as bt,S as se,k as We,m as Ve,n as Ce,o as S,q as N,r as $e,t as w,v as D,w as I,x as Ae,y as K,z as Ge,A as ie,C as wt,D as jt}from"./index-CApK0vR9.js";const G={void:()=>ae(()=>Promise.resolve().then(()=>Kt),void 0,import.meta.url),fracture:()=>ae(()=>Promise.resolve().then(()=>ho),void 0,import.meta.url),threshold:()=>ae(()=>Promise.resolve().then(()=>lo),void 0,import.meta.url),echoes:()=>ae(()=>import("./EchoesScene-BKCGWBN7.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url),afterlight:()=>ae(()=>Promise.resolve().then(()=>jo),void 0,import.meta.url)},ye=Object.keys(G),St={void:s.lazy(()=>G.void()),fracture:s.lazy(()=>G.fracture()),threshold:s.lazy(()=>G.threshold()),echoes:s.lazy(()=>G.echoes()),afterlight:s.lazy(()=>G.afterlight())},Mt={awakening:{fog:"#050505",density:.04},void:{fog:"#080a0d",density:.0135},fracture:{fog:"#0a0b0e",density:.017},threshold:{fog:"#070809",density:.029},echoes:{fog:"#06070a",density:.019},afterlight:{fog:"#030304",density:.034}},At=()=>{const t=A(r=>r.activeScene),o=St[t];return o?e.jsx(s.Suspense,{fallback:null,children:e.jsx(o,{})}):null},kt=({scene:t})=>{const{fog:o,density:r}=Mt[t];return e.jsxs(e.Fragment,{children:[e.jsx("fogExp2",{attach:"fog",args:[o,r]}),e.jsx("color",{attach:"background",args:[o]})]})},Et=({className:t})=>{const o=ne(),r=pt(),a=be(u=>u.pauseWhenHidden),l=A(u=>u.entered),i=A(u=>u.activeScene),[n,c]=s.useState(!1),d=a&&r,f=[1,o.dpr],m=s.useCallback(()=>c(!0),[]),v=s.useCallback(()=>c(!1),[]);return!Me.webgl||n?null:e.jsx("div",{className:t,"data-testid":"journey-canvas",children:e.jsxs(Ze,{frameloop:d?"never":"always",dpr:f,gl:{antialias:o.highPost,alpha:!1,stencil:!1,depth:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1},camera:{fov:42,near:.1,far:900,position:[0,3,18]},onCreated:({gl:u})=>{u.toneMapping=Ke,u.toneMappingExposure=1.25,Y.complete("webgl",u.capabilities.isWebGL2?"WebGL2 context granted":"WebGL1 context granted")},children:[e.jsx(Qe,{onContextLost:m,onContextRestored:v}),e.jsx(kt,{scene:i}),e.jsx(Je,{running:!d}),e.jsx(et,{target:l?1:0}),e.jsx(tt,{}),e.jsx(ot,{}),e.jsx(rt,{}),e.jsx(at,{}),e.jsx(At,{}),e.jsx(vt,{children:e.jsx(st,{})})]})})},Ct=()=>{const t=s.useRef(!1);s.useEffect(()=>{if(t.current)return;t.current=!0,Me.webgl||(Y.skip("webgl","No WebGL context — static mode"),Y.skip("shaders","No shaders to compile"));let o=!1;return Y.start("scenes"),(async()=>{let r=0;await Promise.all(ye.map(async a=>{try{await G[a]()}catch(l){console.warn(`[AFTERLIGHT] scene chunk "${a}" unavailable`,l)}r+=1,o||Y.setProgress("scenes",r/ye.length)})),o||Y.complete("scenes",`${ye.length} chunks streamed`)})(),()=>{o=!0}},[])},_t=()=>{const t=ht(),o=A(p=>p.enter),r=be(p=>p.soundEnabled),a=be(p=>p.motion==="reduced"),[l,i]=s.useState(()=>Date.now()),[n,c]=s.useState(r),d=s.useRef(null);s.useEffect(()=>{const p=window.setInterval(()=>i(Date.now()),1e3);return()=>window.clearInterval(p)},[]),s.useEffect(()=>{if(a)return;let p=0;const k={current:0},x={current:0},z=()=>{p=requestAnimationFrame(z),k.current=V(k.current,_.targetX,3,1/60),x.current=V(x.current,_.targetY,3,1/60),d.current&&(d.current.style.transform=`translate3d(${k.current*18}px, ${x.current*12}px, 0)`)};return p=requestAnimationFrame(z),()=>cancelAnimationFrame(p)},[a]);const f=s.useMemo(()=>{const p=Math.floor(l/1e3),k=12+Math.sin(p/37)*.614,x=-48+Math.cos(p/53)*.614,z=4180+Math.sin(p/29)*12.5;return{lat:k,lon:x,alt:z}},[l]),m=t.tasks.every(p=>p.state==="done"||p.state==="error"),v=t.done||m,u=Math.round(t.overall*100),M=()=>{v&&(!n&&!r&&(xt(!0),c(!0)),o())};return e.jsxs("div",{className:"fixed inset-0 z-[75] flex items-center justify-center bg-obsidian px-[var(--al-gutter)]",children:[e.jsx("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-0",style:{background:"radial-gradient(60% 50% at 50% 50%, rgba(20,22,26,0.55) 0%, rgba(5,5,5,0) 70%), radial-gradient(120% 100% at 50% 120%, rgba(12,14,17,0.9), rgba(5,5,5,1) 60%)"}}),e.jsxs("div",{className:"relative z-10 flex w-full max-w-[min(44rem,100%)] flex-col items-center gap-10 text-center",children:[e.jsx("div",{className:"relative grid h-32 w-32 place-items-center",children:e.jsxs("div",{ref:d,className:"relative grid h-32 w-32 place-items-center",children:[e.jsx("span",{"aria-hidden":"true",className:"absolute h-24 w-24 rounded-full border border-[color:rgba(191,197,202,0.12)]",style:{animation:a?void 0:"al-pulse-dot 6s var(--al-ease-in-out) infinite"}}),e.jsx("span",{"aria-hidden":"true",className:"absolute h-14 w-14 rounded-full border border-[color:rgba(191,197,202,0.2)]",style:{animation:a?void 0:"al-pulse-dot 6s var(--al-ease-in-out) infinite 0.4s"}}),e.jsx("span",{"aria-hidden":"true",className:"block h-[3px] w-[3px] rounded-full bg-ivory shadow-[0_0_22px_6px_rgba(243,242,238,0.45)]"})]})}),e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(R,{tone:"muted",children:"A film that renders itself"}),e.jsxs("h1",{className:"display-title text-2xl sm:text-3xl",children:["AFTERLIGHT",e.jsx("span",{className:"mt-4 block text-[0.32em] font-normal tracking-[0.42em] text-[color:var(--al-text-muted)]",children:"THE WORLD BETWEEN FRAMES"})]})]}),e.jsxs("dl",{className:"grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-2xs text-[color:var(--al-text-faint)] sm:grid-cols-4",children:[e.jsx(me,{label:"LAT",value:Ee(f.lat)}),e.jsx(me,{label:"LON",value:Ee(f.lon)}),e.jsx(me,{label:"ALT",value:`${f.alt.toFixed(1)} M`}),e.jsx(me,{label:"T+00:00",value:gt(l)})]}),e.jsxs("div",{className:"w-full max-w-[30rem]",children:[e.jsxs("div",{className:"flex items-baseline justify-between pb-3",children:[e.jsx(R,{tone:v?"live":"muted",dot:!0,children:v?"Systems nominal":`Loading · ${u}%`}),e.jsxs("span",{className:"font-mono text-2xs tabular-nums text-[color:var(--al-text-quiet)]",children:[u.toString().padStart(3," "),"%"]})]}),e.jsx("div",{className:"h-px w-full bg-[color:var(--al-line)]",children:e.jsx("div",{className:"h-px bg-ivory transition-[width] duration-500 ease-[var(--al-ease-out)]",style:{width:`${u}%`}})}),e.jsx("ul",{className:"mt-4 flex flex-col gap-1 text-left",children:t.tasks.map(p=>e.jsxs("li",{className:"flex items-baseline justify-between gap-4 font-mono text-2xs",children:[e.jsx("span",{className:["uppercase tracking-[0.24em]",p.state==="done"?"text-[color:var(--al-text-faint)]":p.state==="error"?"text-[color:var(--al-danger)]":"text-[color:var(--al-text-muted)]"].join(" "),children:p.label}),e.jsx("span",{className:"flex-1 truncate text-right text-[color:var(--al-text-quiet)]",children:(p.state==="error",p.detail)})]},p.id))})]}),e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(P,{variant:"primary",size:"lg",onClick:M,disabled:!v,"aria-describedby":"awakening-audio-hint",children:"Enter"}),e.jsx("p",{id:"awakening-audio-hint",className:"max-w-[34ch] text-2xs leading-relaxed text-[color:var(--al-text-quiet)]",children:r||n?"Sound starts with the film. Use the toggle at any time.":"Pressing Enter also starts the ambient sound. You can mute it at any time."}),e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-4 pt-2",children:e.jsx(P,{variant:"ghost",size:"sm",to:"/archive",children:"Read the log instead"})})]})]})]})},me=({label:t,value:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1 sm:items-start",children:[e.jsx("dt",{className:"label-mono opacity-50",children:t}),e.jsx("dd",{className:"tabular-nums text-[color:var(--al-text-muted)]",children:o})]}),we=t=>{if(t==="awakening"){We();return}Ve(`[data-scene="${t}"]`,{offset:-2})},Nt=()=>{const t=A(n=>n.activeScene),o=A(n=>n.entered),r=A(n=>n.transition),a=yt(),l=bt(t),i=o&&r==="idle";return a?e.jsxs("nav",{"aria-label":"Scene navigation",className:["fixed inset-x-0 bottom-0 z-[90] flex items-center justify-between gap-1 border-t border-[color:var(--al-line)] bg-[color:rgba(5,5,5,0.7)] px-[var(--al-gutter)] py-2 backdrop-blur-sm","transition-transform duration-700 ease-[var(--al-ease-out)]",i?"translate-y-0":"translate-y-full"].join(" "),style:{paddingBottom:"calc(0.5rem + env(safe-area-inset-bottom))"},children:[e.jsxs(R,{tone:"muted",className:"min-w-0 shrink truncate",children:[l.numeral," · ",l.title]}),e.jsx("ul",{className:"flex min-w-0 flex-1 items-center justify-end gap-0.5",children:se.map(n=>e.jsx("li",{children:e.jsx("button",{type:"button",onClick:()=>we(n.id),"aria-label":`Go to scene ${n.numeral}: ${n.title}`,"aria-current":n.id===t?"true":void 0,className:["grid h-[var(--al-control-track)] min-w-[var(--al-control-tap)] max-w-[var(--al-control-tap)] flex-1 place-items-center transition-colors duration-300",n.id===t?"text-ivory":"text-[color:var(--al-text-quiet)] hover:text-[color:var(--al-text-muted)]"].join(" "),children:e.jsx("span",{"aria-hidden":"true",className:["block h-px w-full transition-all duration-300",n.id===t?"h-[2px] bg-ivory":"bg-current"].join(" ")})})},n.id))})]}):e.jsxs("nav",{"aria-label":"Scene navigation",className:["fixed bottom-[var(--al-space-6)] right-[var(--al-gutter)] z-[90] flex flex-col items-end gap-4","transition-[opacity,transform] duration-700 ease-[var(--al-ease-out)]",i?"translate-y-0 opacity-100":"pointer-events-none translate-y-4 opacity-0"].join(" "),children:[e.jsx("ol",{className:"flex flex-col items-end gap-0",children:se.map(n=>{const c=n.id===t;return e.jsx("li",{children:e.jsxs("button",{type:"button",onClick:()=>we(n.id),"aria-label":`Scene ${n.numeral}: ${n.title}`,"aria-current":c?"true":void 0,className:"group flex min-h-[var(--al-control-tap)] min-w-[var(--al-control-tap)] items-center gap-3 py-1.5 text-right",children:[e.jsx("span",{className:["label-mono transition-colors duration-300",c?"text-ivory":"text-[color:var(--al-text-quiet)] group-hover:text-[color:var(--al-text-muted)]"].join(" "),children:n.numeral}),e.jsx("span",{"aria-hidden":"true",className:["block h-px transition-all duration-500 ease-[var(--al-ease-out)]",c?"w-8 bg-ivory":"w-4 bg-[color:var(--al-line-strong)] group-hover:w-6 group-hover:bg-[color:var(--al-silver)]"].join(" ")})]})},n.id)})}),e.jsx("div",{className:"flex flex-col items-end gap-1 border-r border-[color:var(--al-line)] pr-3",children:e.jsx(R,{tone:"muted",live:!0,children:l.telemetry})})]})},Rt=(t,o,r={})=>{const{trackAsScene:a=!0,enabled:l=!0}=r;s.useEffect(()=>{const i=t.current;if(!i||!l)return;const n=Ce.create({trigger:i,start:"top bottom",end:"bottom top",onUpdate:m=>{S.write(o,m.progress,m.getVelocity()/900)},onToggle:m=>{S.setActive(o,m.isActive)}}),c=m=>{a&&m&&A.getState().setActiveScene(o)},d=Ce.create({trigger:i,start:"top center",end:"bottom center",onToggle:m=>c(m.isActive),onEnter:()=>c(!0),onEnterBack:()=>c(!0)}),f=requestAnimationFrame(()=>{const m=i.getBoundingClientRect(),u=m.top+m.height/2<=window.innerHeight/2&&m.bottom>=window.innerHeight/2;c(u)});return()=>{cancelAnimationFrame(f),n.kill(),d.kill(),S.setActive(o,!1)}},[t,o,a,l])},zt=(t,o=20)=>{const[r,a]=s.useState({value:0,bucket:0});return s.useEffect(()=>{let l=0,i=-1;const n=()=>{l=requestAnimationFrame(n);const c=S.value(t),d=Math.round(c*o);d!==i&&(i=d,a(f=>f.bucket===d?f:{value:c,bucket:d}))};return l=requestAnimationFrame(n),()=>cancelAnimationFrame(l)},[t,o,a]),r},Tt=()=>({...it(new b("#0a0c10"),.0125),uTime:{value:0},uDeep:{value:new b("#04060a")},uShallow:{value:new b("#10151b")},uSkyTop:{value:new b("#04060a")},uSkyHorizon:{value:new b("#1d232b")},uSunDir:{value:new E(-.42,.16,-.89).normalize()},uMonolith:{value:new xe(0,-52)},uMonolithSize:{value:new xe(11,54)},uWaveEnergy:{value:1},uSpeed:{value:1},uPointer:{value:new xe(0,0)}}),Pt=`
  ${Le}

  uniform float uTime;
  uniform float uWaveEnergy;
  uniform float uSpeed;
  uniform vec2 uPointer;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vCrest;
  varying float vViewDepth;

  // dir.xy, steepness, speed multiplier — one entry per wave.
  // Wavelengths are deliberately incommensurate so the surface never tiles.
  const vec4 WAVE_A = vec4( 0.92,  0.39, 0.055, 1.00);
  const vec4 WAVE_B = vec4(-0.42,  0.91, 0.032, 1.31);
  const vec4 WAVE_C = vec4( 0.68, -0.73, 0.019, 1.79);
  const vec4 WAVE_D = vec4(-0.88, -0.47, 0.011, 2.43);

  // Accumulates displacement and the two height-derivative gradients used to
  // rebuild the normal. grad holds d(height)/d(x) and d(height)/d(z).
  vec3 gerstner(vec4 wave, float wavelength, vec2 p, float t, inout vec2 grad) {
    vec2 d = normalize(wave.xy);
    float k = 6.28318530718 / wavelength;
    // Deep-water phase speed: sqrt(g / k). Gives each wavelength its own speed.
    float c = sqrt(9.81 / k);
    float f = k * (dot(d, p) - c * wave.w * t);
    float a = wave.z / k;

    grad += d * (wave.z * cos(f));
    return vec3(d * (a * cos(f)), a * sin(f));
  }

  void main() {
    vec3 pos = position;

    // Radial LOD: displacement is faded out with distance so far vertices do
    // not alias into noise. Together with the exponential fog this keeps the
    // horizon clean at any tessellation level.
    float radial = length(pos.xz);
    float lodFade = 1.0 - smoothstep(110.0, 460.0, radial);

    float t = uTime * uSpeed;
    // The pointer drags a local swell through the surface.
    vec2 drag = uPointer * 2.2;
    vec2 p = pos.xz + drag * (1.0 - lodFade * 0.45);

    vec2 grad = vec2(0.0);
    vec3 disp = vec3(0.0);
    disp += gerstner(WAVE_A, 38.0, p, t, grad);
    disp += gerstner(WAVE_B, 19.0, p, t, grad);
    disp += gerstner(WAVE_C, 9.5,  p, t, grad);
    disp += gerstner(WAVE_D, 4.75, p, t, grad);

    float energy = uWaveEnergy * lodFade;
    pos += disp * energy;

    // Height-field normal: n = normalize(-dh/dx, 1, -dh/dz).
    vNormal = normalize(vec3(-grad.x * energy, 1.0, -grad.y * energy));

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = world.xyz;
    vCrest = clamp(disp.y * 2.2 + 0.5, 0.0, 1.0);

    vec4 mv = viewMatrix * world;
    vViewDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`,Ft=`
  ${Le}
  ${nt}

  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uSunDir;
  uniform vec2 uMonolith;
  uniform vec2 uMonolithSize;
  uniform float uTime;
  uniform float uSpeed;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vCrest;
  varying float vViewDepth;

  // Analytic sky: a horizon glow biased toward the sun azimuth.
  vec3 skyColour(vec3 dir) {
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uSkyHorizon, uSkyTop, pow(h, 0.7));
    float sunAmount = pow(max(dot(normalize(dir), uSunDir), 0.0), 26.0);
    col += vec3(0.32, 0.34, 0.38) * sunAmount * 0.5;
    return col;
  }

  // Silhouette of the monolith, reflected. The monolith is treated as a
  // vertical slab standing on the plane z = uMonolith.y; we intersect the
  // reflected ray with that plane and test the horizontal extent.
  float monolithMask(vec3 origin, vec3 dir) {
    float dz = dir.z;
    if (abs(dz) < 1e-4) return 0.0;
    float t = (uMonolith.y - origin.z) / dz;
    if (t <= 0.0) return 0.0;
    float hitX = origin.x + dir.x * t;
    // Only draw the slab above the horizon: a ray reflected upward should not
    // pick up a "reflection" of something below the waterline.
    float hitY = origin.y + dir.y * t;
    if (hitY < 0.0) return 0.0;
    float d = abs(hitX - uMonolith.x) - uMonolithSize.x * 0.5;
    float vertical = smoothstep(0.0, 6.0, min(hitY, uMonolithSize.y));
    return (1.0 - smoothstep(0.0, 3.2, max(d, 0.0))) * vertical;
  }

  void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    vec3 n = normalize(vNormal);

    // Fine ripple detail layered over the geometric waves: two scrolling
    // noise fields at different scales break the "rubber sheet" look.
    float rippleA = fbm3(vec3(vWorldPosition.xz * 0.24, uTime * uSpeed * 0.13), 3);
    float rippleB = fbm3(vec3(vWorldPosition.zx * 0.21 + 4.7, uTime * uSpeed * 0.10), 3);
    float rippleStrength = 0.34 * (1.0 - smoothstep(60.0, 240.0, length(vWorldPosition.xz - cameraPosition.xz)));
    vec3 rippleNormal = normalize(vec3((rippleA - 0.5) * rippleStrength, 1.0, (rippleB - 0.5) * rippleStrength));
    n = normalize(mix(n, rippleNormal, 0.7));

    vec3 reflected = reflect(viewDir, n);
    reflected.y = abs(reflected.y) * 0.9 + 0.025;

    vec3 reflection = skyColour(reflected);
    float mask = monolithMask(vWorldPosition, reflected);
    reflection = mix(reflection, vec3(0.010, 0.012, 0.016), mask * 0.94);

    float fresnel = pow(clamp(1.0 - dot(-viewDir, n), 0.0, 1.0), 4.4);
    fresnel = mix(0.03, 1.0, fresnel);

    vec3 body = mix(uDeep, uShallow, vCrest * 0.65 + rippleA * 0.35);

    // Blinn-Phong glint, tightly exponentiated so it reads as a distant light
    // source rather than a hotspot on the water.
    vec3 halfVec = normalize(uSunDir - viewDir);
    float ndh = max(dot(n, halfVec), 0.0);
    // Tight glint plus a much fainter wide lobe. The wide lobe is what turns a
    // distant light source into a sheet of whitewash across the water.
    float spec = pow(ndh, 320.0) * 0.7 + pow(ndh, 60.0) * 0.012;

    vec3 colour = mix(body, reflection, fresnel) + vec3(spec);

    // Crest highlight: a thin silver line where the swell breaks.
    colour += vec3(0.055, 0.07, 0.085) * smoothstep(0.9, 1.0, vCrest) * 0.5;

    colour = tonemap(colour);
    colour = applyFog(colour, vViewDepth);

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`,Dt=`
  varying vec3 vAlWorld;
  varying vec3 vAlObjectNormal;
`,Lt=`
  vAlWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vAlObjectNormal = normalize(objectNormal);
`,It=`
  ${Ie}
  ${Oe}

  uniform float uDetail;
  uniform vec3 uRimColor;
  uniform float uRimStrength;
  uniform float uTime;

  varying vec3 vAlWorld;
  varying vec3 vAlObjectNormal;
`,ke=(t,o,r,a)=>{const l={uDetail:{value:1},uRimColor:{value:new b("#cfd8e0")},uRimStrength:{value:.35},uTime:{value:0}};return t.onBeforeCompile=i=>{Object.assign(i.uniforms,l),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
${Dt}`).replace("#include <begin_vertex>",`#include <begin_vertex>
${Lt}`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
${It}`).replace("#include <map_fragment>",`#include <map_fragment>
${r}`),a&&(i.fragmentShader=i.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
${a}`))},t.customProgramCacheKey=()=>o,{material:t,uniforms:l,dispose:()=>t.dispose()}},Ot=()=>{const t=new Se({color:new b("#252c34"),roughness:.62,metalness:.18,emissive:new b("#05070a"),emissiveIntensity:1}),a=ke(t,"afterlight-monolith-v1",`
    // Vertical striations: noise stretched 14× along Y reads as sediment layers.
    float strata = fbm3(vec3(vAlWorld.x * 0.42, vAlWorld.y * 0.035, vAlWorld.z * 0.42), 4);
    float fine = vnoise3(vAlWorld * 2.4);
    float band = smoothstep(0.34, 0.66, strata);
    diffuseColor.rgb *= mix(0.72, 1.24, band) * uDetail;
    diffuseColor.rgb += vec3(0.012, 0.014, 0.017) * fine * uDetail;

    // The slab is darker toward its base, as if wet.
    float heightFade = smoothstep(-2.0, 34.0, vAlWorld.y);
    diffuseColor.rgb *= mix(0.62, 1.0, heightFade);
  `,`
    float alFacing = abs(dot(normalize(normal), normalize(vViewPosition)));
    float alRim = pow(1.0 - alFacing, 1.9);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `);return a.uniforms.uRimStrength.value=.5,a},Be=()=>{const t=new Se({color:new b("#0a0c0f"),roughness:.74,metalness:.1}),a=ke(t,"afterlight-corridor-v1",`
    float panel = smoothstep(0.02, 0.0, abs(fract(vAlWorld.z * 0.22) - 0.5) - 0.48);
    float grain = vnoise2(vAlWorld.xy * 1.7 + vAlWorld.zz * 0.35);
    diffuseColor.rgb *= mix(0.78, 1.1, grain) * uDetail;
    diffuseColor.rgb *= 1.0 - panel * 0.35;

    // A single travelling band of extra light, very low contrast.
    float scan = exp(-pow((fract(uTime * 0.04) * 220.0 - vAlWorld.z) * 0.035, 2.0));
    diffuseColor.rgb += vec3(0.02, 0.024, 0.03) * scan;
  `,`
    float alRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 4.2);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `);return a.uniforms.uRimStrength.value=.28,a},Wt=()=>{const t=new Se({color:new b("#5c6773"),roughness:.38,metalness:.46}),a=ke(t,"afterlight-fragment-v1",`
    // Per-facet value shift: without it a thousand small boxes read as one flat
    // silhouette instead of a structure made of pieces.
    float facet = vnoise3(vAlObjectNormal * 6.0 + vAlWorld * 0.35);
    diffuseColor.rgb *= mix(0.52, 1.4, facet) * uDetail;
  `,`
    float alRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.6);
    totalEmissiveRadiance += uRimColor * alRim * uRimStrength;
  `);return a.uniforms.uRimStrength.value=.9,a},he=t=>{const{frames:o,progress:r=0,getProgress:a,parallax:l=1.2,parallaxLook:i=.6,damping:n=3.4,aspectAdjust:c=!0,enabled:d=!0}=t,f=Z(M=>M.camera),m=s.useRef({progress:r,x:0,y:0}),v=s.useRef(!1),u=s.useMemo(()=>({position:new E,target:new E,right:new E,up:new E(0,1,0),offset:new E,forward:new E}),[]);j((M,p)=>{if(!d||o.length===0)return;const k=N(a?a():r),x=m.current;x.progress=v.current?V(x.progress,k,n,p):k,v.current=!0;const z=N(x.progress),te=o.length-1,ce=z*te,q=Math.min(Math.floor(ce),te-1),O=ce-q,g=$e(O),y=o[Math.max(0,q)],T=o[Math.min(q+1,o.length-1)];u.position.set(y.position[0]+(T.position[0]-y.position[0])*g,y.position[1]+(T.position[1]-y.position[1])*g,y.position[2]+(T.position[2]-y.position[2])*g),u.target.set(y.lookAt[0]+(T.lookAt[0]-y.lookAt[0])*g,y.lookAt[1]+(T.lookAt[1]-y.lookAt[1])*g,y.lookAt[2]+(T.lookAt[2]-y.lookAt[2])*g);const L=(y.fov??45)+((T.fov??45)-(y.fov??45))*g,U=(y.roll??0)+((T.roll??0)-(y.roll??0))*g;x.x=V(x.x,_.x,2.6,p),x.y=V(x.y,_.y,2.6,p),u.forward.copy(u.target).sub(u.position).normalize(),u.right.crossVectors(u.forward,u.up).normalize(),u.offset.copy(u.right).multiplyScalar(x.x*l).addScaledVector(u.up,-x.y*l*.62),f.position.copy(u.position).add(u.offset),u.target.addScaledVector(u.right,-x.x*i),u.target.addScaledVector(u.up,x.y*i*.5);let X=1;if(c){const W=f.aspect||1;if(W<1){const re=1-W;X=1+re*.22;const de=f.position.distanceTo(u.target);u.offset.addScaledVector(u.forward,de*re*.55)}else W>2.1&&u.offset.addScaledVector(u.forward,-2.2*(W-2.1))}f.lookAt(u.target),U!==0&&f.rotateZ(U);const $=f,oe=L*X;Math.abs($.fov-oe)>.001&&($.fov=oe,$.updateProjectionMatrix())})},J={focus:0,hit:!1},He="void",Vt="#080a0d",$t=.0135,Q=[0,0,-52],F=[11,54,11],Gt=[{position:[12,13,212],lookAt:[0,24,-52],fov:33},{position:[-16,16,132],lookAt:[0,25,-52],fov:35},{position:[9,20,62],lookAt:[0,26,-52],fov:39},{position:[15,31,2],lookAt:[0,30,-52],fov:44},{position:[0,46,-32],lookAt:[0,38,-52],fov:50}],Bt=()=>{const t=ne();he({frames:Gt,getProgress:()=>I(S.value(He)),parallax:1.6,parallaxLook:.9,damping:3.1});const o=t.density>.85?128:t.density>.55?96:56,r=Math.round(1800*t.dust);return e.jsxs("group",{children:[e.jsx(Ht,{}),e.jsx(qt,{}),e.jsx(Xt,{segments:o}),e.jsx(ve,{count:r,extent:[150,44,170],distribution:"column",seed:6221072,variant:"dust",color:"#9fb0bd",accent:"#ffffff",size:1.1,opacity:.34,bounds:100,pointerRadius:16,pointerDistance:38}),e.jsx(Yt,{})]})},Ht=()=>{const t=s.useRef(null),o=s.useRef(null);return j(()=>{const r=w.elapsed;t.current&&t.current.position.set(-40+Math.sin(r*.05)*6,46,30),o.current&&o.current.position.set(38,18,-80+Math.cos(r*.037)*8)}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.1,color:"#2c3944"}),e.jsx("directionalLight",{ref:t,intensity:.85,color:"#8fa8bd",position:[-40,46,30]}),e.jsx("directionalLight",{ref:o,intensity:.34,color:"#43586b",position:[38,18,-80]}),e.jsx("pointLight",{position:[0,3,-46],intensity:42,distance:76,decay:2,color:"#c8d6e2"})]})},qt=()=>{const t=s.useRef(null),o=s.useMemo(()=>Ot(),[]);return s.useEffect(()=>o.dispose,[o]),j(()=>{const r=I(S.value(He)),a=Ae(N(r*6))*D.exposure,l=J.focus;if(o.uniforms.uTime.value=w.elapsed,o.uniforms.uRimStrength.value=(.12+l*.85)*a,o.uniforms.uDetail.value=.85+r*.35,t.current){const i=1+Math.sin(w.elapsed*.22)*.004;t.current.scale.set(i,i,i),t.current.position.y=Math.sin(w.elapsed*.09)*.35}}),e.jsxs("group",{ref:t,position:Q,children:[e.jsx("mesh",{material:o.material,position:[0,F[1]/2-4,0],children:e.jsx("boxGeometry",{args:F})}),e.jsx(Ut,{})]})},Ut=()=>{const t=s.useMemo(()=>new H({uniforms:{uTime:{value:0},uColor:{value:new b("#8ea7bd")},uIntensity:{value:.5},uPulse:{value:0}},vertexShader:`
          varying vec3 vLocal;
          varying float vViewDepth;
          void main() {
            vLocal = position;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vViewDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uPulse;
          varying vec3 vLocal;
          varying float vViewDepth;
          void main() {
            // Fade toward the top of the slab; a soft band travels up it.
            float up = 1.0 - smoothstep(-4.0, 52.0, vLocal.y + 4.0);
            float band = exp(-pow((vLocal.y - uPulse * 56.0) * 0.14, 2.0));
            float body = up * (0.35 + band * 0.8);
            // Kept very low: this is light bleeding off an edge, not a lamp.
            float a = body * uIntensity * 0.115;
            a *= 1.0 - smoothstep(70.0, 220.0, vViewDepth);
            gl_FragColor = vec4(uColor * (1.0 + band), a);
          }
        `,transparent:!0,depthWrite:!1,blending:ee,side:Fe}),[]);return s.useEffect(()=>()=>t.dispose(),[t]),j(()=>{t.uniforms.uTime.value=w.elapsed,t.uniforms.uIntensity.value=D.exposure*(.5+J.focus*1.2),t.uniforms.uPulse.value=w.elapsed*.08%1}),e.jsx("mesh",{material:t,position:[0,F[1]/2-4,0],scale:[1.3,1.1,1.3],children:e.jsx("boxGeometry",{args:F})})},Xt=({segments:t})=>{const o=s.useMemo(()=>{const l=new Pe(1800,1800,t,t);return l.rotateX(-Math.PI/2),l},[t]),r=s.useMemo(()=>{const l=Tt();return l.uFogColor.value=new b(Vt),l.uFogDensity.value=$t,l.uMonolith.value.set(Q[0],Q[2]),l.uMonolithSize.value.set(F[0],F[1]),l},[]),a=s.useMemo(()=>new H({uniforms:r,vertexShader:Pt,fragmentShader:Ft,side:pe}),[r]);return s.useEffect(()=>()=>o.dispose(),[o]),s.useEffect(()=>()=>a.dispose(),[a]),j(()=>{r.uTime.value=w.elapsed,r.uSpeed.value=D.reducedMotion?0:K.speed*w.running,r.uPointer.value.set(_.x,_.y),r.uWaveEnergy.value=.85+K.distortion*.6}),e.jsx("mesh",{geometry:o,material:a,position:[0,-.15,-60],renderOrder:0})},Yt=()=>{const t=Z(n=>n.camera),o=Z(n=>n.raycaster),r=Z(n=>n.pointer),a=s.useRef(0),l=s.useRef(0),i=s.useRef(0);return j((n,c)=>{a.current+=1,a.current%5===0&&(o.setFromCamera(r,t),l.current=Zt(o.ray.origin,o.ray.direction)?1:0,J.hit=l.current===1),i.current=V(i.current,l.current,6,c),J.focus=N(i.current)}),null},Zt=(t,o)=>{const r={x:-F[0]/2,y:-4,z:-F[2]/2},a={x:F[0]/2,y:F[1]-4,z:F[2]/2},l={x:t.x-Q[0],y:t.y-Q[1],z:t.z-Q[2]},i=[[l.x,o.x,r.x,a.x],[l.y,o.y,r.y,a.y],[l.z,o.z,r.z,a.z]];let n=0,c=1/0;for(const[d,f,m,v]of i){if(Math.abs(f)<1e-6){if(d<m||d>v)return!1;continue}let u=(m-d)/f,M=(v-d)/f;if(u>M){const p=u;u=M,M=p}if(n=Math.max(n,u),c=Math.min(c,M),n>c)return!1}return c>0},Kt=Object.freeze(Object.defineProperty({__proto__:null,default:Bt,voidRuntime:J},Symbol.toStringTag,{value:"Module"})),ge="threshold",Qt="#070809",_e=.029,Ne=13,je=9,Jt=26,eo=[{position:[0,2.4,46],lookAt:[0,3.4,-20],fov:46},{position:[1.6,3.2,12],lookAt:[0,4.2,-60],fov:44},{position:[-1.8,4.6,-28],lookAt:[0,5.4,-120],fov:42},{position:[1.2,6.4,-72],lookAt:[0,6.8,-190],fov:38},{position:[0,7.2,-112],lookAt:[0,7.2,-260],fov:34}],C={depth:0,aperture:0,proximity:0},to=()=>{const t=ne();return he({frames:eo,getProgress:()=>I(S.value(ge)),parallax:1.1,parallaxLook:.5,damping:3.6}),e.jsxs("group",{children:[e.jsx(oo,{}),e.jsx(ro,{count:t.rings}),e.jsx(ao,{}),e.jsx(so,{distance:-268}),e.jsx(ve,{count:Math.round(1500*t.dust),extent:[24,18,120],distribution:"volume",seed:7999973,variant:"dust",color:"#8e9aa8",accent:"#e6edf3",size:1.5,opacity:.5,bounds:80,pointerRadius:12,pointerDistance:22}),e.jsx(io,{})]})},oo=()=>e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.05,color:"#39434d"}),e.jsx("directionalLight",{intensity:.4,color:"#93a6b6",position:[6,18,20]}),e.jsx("pointLight",{position:[0,7,-250],intensity:1400,distance:260,decay:2,color:"#dbe6ef"}),e.jsx("pointLight",{position:[0,6,-60],intensity:200,distance:110,decay:2,color:"#6f8496"})]}),ro=({count:t})=>{const o=s.useRef(null),r=s.useMemo(()=>Be(),[]);s.useEffect(()=>r.dispose,[r]);const a=s.useMemo(()=>new De,[]),l=Math.max(12,t),i=s.useMemo(()=>Array.from({length:l},(n,c)=>30-c*Ne),[l]);return s.useEffect(()=>{const n=o.current;n&&(Re(a,n,i,0),n.instanceMatrix.needsUpdate=!0)},[i,l]),j(({camera:n})=>{const c=o.current;if(!c)return;let d=-1/0;for(let v=0;v<l;v+=1)i[v]-n.position.z>46&&(i[v]=d-Ne),d=Math.max(d,i[v]);const f=I(S.value(ge)),m=.9+Math.sin(f*Math.PI)*.14;for(let v=0;v<l;v+=1)Re(a,c,i,v,m);c.instanceMatrix.needsUpdate=!0,r.uniforms.uTime.value=w.elapsed,r.uniforms.uRimStrength.value=D.exposure*(.22+C.aperture*.4)}),e.jsx("instancedMesh",{ref:o,args:[void 0,r.material,l*4],frustumCulled:!1,children:e.jsx("boxGeometry",{args:[1,1,1]})})},Re=(t,o,r,a,l=1)=>{const i=r[a],n=je*l,c=Jt*l,d=1.5,f=(v,u,M,p,k,x,z)=>{t.position.set(u,M,i+p),t.rotation.set(0,0,0),t.scale.set(k,x,z),t.updateMatrix(),o.setMatrixAt(v,t.matrix)},m=a*4;f(m+0,-n,c*.5-1,0,d,c,d*1.6),f(m+1,n,c*.5-1,0,d,c,d*1.6),f(m+2,0,c-1,0,n*2+d,d,d*1.6),f(m+3,0,-1,0,n*2+d,d*.8,d*1.6)},ao=()=>{const t=s.useMemo(()=>Be(),[]);s.useEffect(()=>t.dispose,[t]);const o=s.useMemo(()=>new Pe(340,320,1,1),[]);return s.useEffect(()=>()=>o.dispose(),[o]),j(()=>{t.uniforms.uTime.value=w.elapsed,t.uniforms.uRimStrength.value=D.exposure*.16}),e.jsxs("group",{children:[e.jsx("mesh",{geometry:o,material:t.material,position:[-je-.9,12,-80],rotation:[0,Math.PI/2,0]}),e.jsx("mesh",{geometry:o,material:t.material,position:[je+.9,12,-80],rotation:[0,-Math.PI/2,0]}),e.jsx("mesh",{geometry:o,material:t.material,position:[0,24.4,-80],rotation:[Math.PI/2,0,0]})]})},so=({distance:t})=>{const o=s.useMemo(()=>{const i=lt("#eef4f9","#7f95a8");return i.uFogColor.value=new b(Qt),i.uFogDensity.value=_e,i},[]),r=s.useMemo(()=>new H({uniforms:o,vertexShader:ut,fragmentShader:ct,transparent:!0,depthWrite:!1,side:pe,blending:ee}),[o]);s.useEffect(()=>()=>r.dispose(),[r]);const a=Z(i=>i.size),l=a.width/Math.max(1,a.height);return j((i,n)=>{const c=I(S.value(ge)),d=Ae(N((c-.55)/.45))*.75,f=C.proximity,m=N(d+f*.6)*D.exposure;C.aperture=V(C.aperture,m,3,n),o.uOpen.value=C.aperture,o.uTime.value=w.elapsed,o.uSpeed.value=D.reducedMotion?0:K.speed*w.running,o.uDistortion.value=.35+K.distortion*.8,o.uPointer.value.set(_.x,_.y),o.uPointerInfluence.value=K.pointerInfluence,o.uAspect.value=l,o.uFogDensity.value=_e}),e.jsxs("group",{position:[0,7.4,t],children:[e.jsx("mesh",{material:r,renderOrder:3,children:e.jsx("planeGeometry",{args:[72,72]})}),e.jsx(no,{})]})},no=()=>{const t=s.useMemo(()=>new H({uniforms:{uColor:{value:new b("#8ea3b5")},uIntensity:{value:.4}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.0);
            gl_FragColor = vec4(uColor, a * uIntensity);
          }
        `,transparent:!0,depthWrite:!1,blending:ee,side:Fe}),[]);return s.useEffect(()=>()=>t.dispose(),[t]),j(()=>{const o=.72+Math.sin(w.elapsed*.3)*.06;t.uniforms.uIntensity.value=D.exposure*C.aperture*o}),e.jsx("mesh",{material:t,scale:[1.6,1.6,1],renderOrder:2,children:e.jsx("planeGeometry",{args:[72,72]})})},io=()=>{const t=Z(l=>l.camera),o=s.useMemo(()=>new E,[]),r=s.useMemo(()=>new E(0,7.4,-268),[]),a=s.useMemo(()=>new E,[]);return j((l,i)=>{const n=I(S.value(ge)),c=Ge(n,.1,.14);let d=0;_.present&&(o.set(_.x,_.y,-1).applyQuaternion(t.quaternion).normalize().multiplyScalar(60).add(t.position),d=N(1-o.distanceTo(r)/90)),C.proximity=V(C.proximity,Math.max(c,d),2.6,i),a.copy(r).sub(t.position),C.depth=-a.z}),null},lo=Object.freeze(Object.defineProperty({__proto__:null,default:to,thresholdRuntime:C},Symbol.toStringTag,{value:"Module"})),ze="fracture",co=[2.6,5.2,2.6],uo=26,h={progress:0,target:0,followingScroll:!0,pointerMode:1,dispersed:0,resetToken:0},qe=()=>{h.target=0,h.followingScroll=!0,h.pointerMode=1,h.resetToken+=1,ie("click")},fe=(t,o=!1)=>{h.target=N(t),h.followingScroll=o,ie(t>.5?"fracture":"click")},Ue=()=>{h.pointerMode=h.pointerMode===1?-1:1,ie("click")},mo=[{position:[1,2.2,23],lookAt:[0,1.2,0],fov:40},{position:[9,4.5,19],lookAt:[0,1.8,0],fov:42},{position:[-8,7.5,22],lookAt:[0,2.6,0],fov:44},{position:[2,12,30],lookAt:[0,3.6,0],fov:46},{position:[0,17,42],lookAt:[0,4.5,0],fov:48}],fo=()=>{const t=ne(),o=Math.round(2400*t.density);he({frames:mo,getProgress:()=>I(S.value(ze)),parallax:1.4,parallaxLook:.6,damping:2.8});const r=s.useMemo(()=>dt({count:o,seed:2042427,size:co,scatterRadius:uo}),[o]),a=s.useMemo(()=>Wt(),[]);s.useEffect(()=>a.dispose,[a]);const l=s.useRef(null),i=s.useMemo(()=>new De,[]),n=s.useMemo(()=>new E,[]),c=s.useMemo(()=>new E,[]),d=s.useRef(h.resetToken);return s.useEffect(()=>{const f=l.current;if(f){for(let m=0;m<o;m+=1)i.position.set(r.rest[m*3],r.rest[m*3+1],r.rest[m*3+2]),i.scale.set(r.scales[m*3],r.scales[m*3+1],r.scales[m*3+2]),i.updateMatrix(),f.setMatrixAt(m,i.matrix);f.instanceMatrix.needsUpdate=!0}},[o,r]),j(({camera:f,pointer:m},v)=>{const u=l.current;if(!u)return;h.resetToken!==d.current&&(d.current=h.resetToken);const M=I(S.value(ze)),p=h.followingScroll?M:h.target,k=N(D.exposure*1.4-.2);h.progress=V(h.progress,N(p)*k,3.4,v);const x=h.progress;n.set(m.x,m.y,-1).applyQuaternion(f.quaternion).normalize().multiplyScalar(11).add(f.position);const z=K.pointerInfluence*3.4*h.pointerMode,te=7.5,ce=_.present;let q=0;for(let O=0;O<o;O+=1){const g=O*3,y=r.delays[O],T=N((x-y)/Math.max(.001,1-y)),L=$e(T);T>.02&&(q+=1);let U=r.rest[g]+(r.scatter[g]-r.rest[g])*L,X=r.rest[g+1]+(r.scatter[g+1]-r.rest[g+1])*L,$=r.rest[g+2]+(r.scatter[g+2]-r.rest[g+2])*L;if(ce&&z!==0){c.set(U-n.x,X-n.y,$-n.z);const W=c.length();if(W<te){const re=1-W/te,de=re*re*z;W>1e-4?c.multiplyScalar(de/W):c.set(0,de,0),U+=c.x,X+=c.y,$+=c.z}}const oe=(1-L)*.004;i.position.set(U,X,$),i.rotation.set(r.spin[g]*L*3.4+Math.sin(w.elapsed*.4+r.phases[O]*6.28)*oe,r.spin[g+1]*L*3.4+Math.cos(w.elapsed*.33+r.phases[O]*6.28)*oe,r.spin[g+2]*L*3.4);const ue=1-L*.42;i.scale.set(r.scales[g]*ue,r.scales[g+1]*ue,r.scales[g+2]*ue),i.updateMatrix(),u.setMatrixAt(O,i.matrix)}u.instanceMatrix.needsUpdate=!0,h.dispersed=q,a.uniforms.uTime.value=w.elapsed,a.uniforms.uRimStrength.value=(.35+x*.9)*D.exposure,a.uniforms.uDetail.value=.7+x*.6}),e.jsxs("group",{children:[e.jsx(po,{}),e.jsx("instancedMesh",{ref:l,args:[void 0,a.material,o],frustumCulled:!1,children:e.jsx("boxGeometry",{args:[1,1,1]})}),e.jsx(vo,{}),e.jsx(ve,{count:Math.round(1400*t.dust),extent:[40,30,40],distribution:"shell",seed:993987,variant:"dust",color:"#8fa2b2",accent:"#dfe8f0",size:1.1,opacity:.3,bounds:34,pointerRadius:9,pointerDistance:16})]})},po=()=>e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.16,color:"#3a4a58"}),e.jsx("directionalLight",{intensity:1.5,color:"#b6c8d6",position:[14,22,18]}),e.jsx("directionalLight",{intensity:.6,color:"#4f6678",position:[-18,-6,-14]}),e.jsx("pointLight",{position:[0,2,6],intensity:70,distance:40,decay:2,color:"#cbd9e6"})]}),vo=()=>{const t=s.useMemo(()=>new H({uniforms:{uColor:{value:new b("#7d93a6")},uIntensity:{value:.5}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.6) * uIntensity;
            // A faint concentric ripple keeps the disc from looking like a decal.
            a += pow(clamp(1.0 - d, 0.0, 1.0), 8.0) * uIntensity * 0.35;
            gl_FragColor = vec4(uColor, a * 0.55);
          }
        `,transparent:!0,depthWrite:!1,blending:ee,side:pe}),[]);return s.useEffect(()=>()=>t.dispose(),[t]),j(()=>{t.uniforms.uIntensity.value=D.exposure*(.5+h.progress*.55)}),e.jsx("mesh",{material:t,rotation:[-Math.PI/2,0,0],position:[0,-6.4,0],renderOrder:1,children:e.jsx("planeGeometry",{args:[52,52]})})},ho=Object.freeze(Object.defineProperty({__proto__:null,default:fo,fractureRuntime:h,resetFracture:qe,setFractureTarget:fe,toggleFracturePointerMode:Ue},Symbol.toStringTag,{value:"Module"})),Xe="afterlight",go=[{position:[6,10,60],lookAt:[0,14,0],fov:40},{position:[14,22,104],lookAt:[0,16,0],fov:38},{position:[-10,40,168],lookAt:[0,18,0],fov:34},{position:[0,62,236],lookAt:[0,18,0],fov:30},{position:[0,96,320],lookAt:[0,18,0],fov:26}],B={dissolve:0,afterglow:0},Ye=()=>ie("fracture"),xo=()=>{const t=ne();return he({frames:go,getProgress:()=>I(S.value(Xe)),parallax:.7,parallaxLook:.25,damping:1.8}),e.jsxs("group",{children:[e.jsx(bo,{}),e.jsx(wo,{}),e.jsx(ve,{count:Math.round(2600*t.dust),extent:[90,70,90],distribution:"shell",seed:10583567,variant:"dust",color:"#a9b8c6",accent:"#ffffff",size:1.2,opacity:.4,bounds:70,pointerRadius:22,pointerDistance:44}),e.jsx(yo,{})]})},yo=()=>(j((t,o)=>{const r=I(S.value(Xe)),a=Ae(N((r-.62)/.38));B.dissolve=a,B.afterglow=Ge(r,.08,.14)*(1-a*.85)}),null),bo=()=>{const t=s.useRef(null),o=s.useMemo(()=>new H({uniforms:{uColor:{value:new b("#1b2128")},uEdge:{value:new b("#8fa3b4")},uDissolve:{value:0},uTime:{value:0}},vertexShader:`
          varying vec3 vLocal;
          varying vec3 vNormalW;
          varying vec3 vViewDir;
          void main() {
            vLocal = position;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vNormalW = normalize(mat3(modelMatrix) * normal);
            vViewDir = normalize(cameraPosition - world.xyz);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,fragmentShader:`
          ${Ie}
          ${Oe}

          uniform vec3 uColor;
          uniform vec3 uEdge;
          uniform float uDissolve;
          uniform float uTime;
          varying vec3 vLocal;
          varying vec3 vNormalW;
          varying vec3 vViewDir;

          void main() {
            // Rim term: the slabs read only by their silhouette.
            float rim = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.2);

            // Dissolve eats the structure from the top down with a noisy edge,
            // so it looks like the material is being unmade rather than faded.
            float noise = vnoise3(vLocal * 0.35 + uTime * 0.05);
            float threshold = vLocal.y * 0.06 + 8.0;
            float eaten = smoothstep(threshold - 1.6, threshold + 1.6, (1.0 - uDissolve) * 22.0 + noise * 2.4);

            float a = (0.18 + rim * 0.85) * eaten;
            if (a < 0.004) discard;
            gl_FragColor = vec4(mix(uColor, uEdge, rim), a);
          }
        `,transparent:!0,depthWrite:!1,blending:ee}),[]);return s.useEffect(()=>()=>o.dispose(),[o]),j(()=>{o.uniforms.uDissolve.value=B.dissolve,o.uniforms.uTime.value=w.elapsed,t.current&&(t.current.rotation.y=w.elapsed*.012)}),e.jsxs("group",{ref:t,children:[e.jsx("mesh",{material:o,position:[0,8,0],children:e.jsx("boxGeometry",{args:[14,16,14]})}),e.jsx("mesh",{material:o,position:[26,4,-18],rotation:[0,.6,.08],children:e.jsx("boxGeometry",{args:[7,9,7]})}),e.jsx("mesh",{material:o,position:[-23,5,-26],rotation:[.1,-.5,-.05],children:e.jsx("boxGeometry",{args:[9,11,9]})}),e.jsx("ambientLight",{intensity:.1,color:"#39454f"}),e.jsx("directionalLight",{intensity:1.1,color:"#9fb2c2",position:[10,18,14]})]})},wo=()=>{const t=s.useMemo(()=>new H({uniforms:{uColor:{value:new b("#cfdce8")},uIntensity:{value:0},uContract:{value:0},uTime:{value:0}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform vec3 uColor;
          uniform float uIntensity;
          uniform float uContract;
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float d = length(p);
            float angle = atan(p.y, p.x);

            // Inverse-square-ish core, contracting toward nothing as the film ends.
            float radius = mix(0.34, 0.05, uContract);
            float core = 1.0 / (1.0 + pow(d / max(radius, 0.02), 2.0));

            // A wide, very faint halo so the glow sits in the fog.
            float halo = exp(-d * 3.2) * 0.14;

            // Anamorphic ring: a single thin ellipse of light around the core.
            float ring = exp(-pow((d - radius * 1.4) * (22.0 + uContract * 50.0), 2.0)) * 0.3;
            ring *= 0.6 + 0.4 * sin(angle * 2.0 + uTime * 0.25);

            // Slow breathing, and a little noise so the edge is never a circle.
            float breathe = 0.9 + 0.1 * sin(uTime * 0.35);
            float wobble = 0.94 + 0.06 * sin(angle * 5.0 - uTime * 0.2);

            float a = (core * 0.42 * wobble + halo + ring) * uIntensity * breathe;

            // Force the quad's own edge to zero. Without this the billboard's
            // rectangular boundary is visible as a faint panel edge, which is
            // the one artefact that instantly reads as "a quad in a scene".
            a *= 1.0 - smoothstep(0.55, 1.0, d);
            if (a < 0.002) discard;
            gl_FragColor = vec4(uColor * (0.7 + core * 0.6), a);
          }
        `,transparent:!0,depthWrite:!1,blending:ee,side:pe}),[]);s.useEffect(()=>()=>t.dispose(),[t]);const o=s.useRef(null);return j(({camera:r,clock:a})=>{t.uniforms.uIntensity.value=B.afterglow*.85,t.uniforms.uContract.value=B.dissolve,t.uniforms.uTime.value=a.elapsedTime,o.current&&o.current.quaternion.copy(r.quaternion)}),e.jsx("group",{ref:o,position:[0,14,0],children:e.jsx("mesh",{material:t,renderOrder:2,children:e.jsx("planeGeometry",{args:[150,150]})})})},jo=Object.freeze(Object.defineProperty({__proto__:null,afterlightRuntime:B,cueReplay:Ye,default:xo},Symbol.toStringTag,{value:"Module"})),le=(t,o,r=12)=>{const[a,l]=s.useState(t),i=s.useRef(o(a));return s.useEffect(()=>{let n=0;const c=()=>{n=requestAnimationFrame(c);const d=t(),f=o(d);f!==i.current&&(i.current=f,l(d))};return n=requestAnimationFrame(c),()=>cancelAnimationFrame(n)},[r]),a},So=()=>{const o=le(()=>J.focus,r=>Math.round(r*6))>.5;return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(R,{tone:o?"live":"muted",dot:!0,live:!0,children:["Focal point · ",o?"locked":"seeking"]}),e.jsx("p",{className:"max-w-[42ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]",children:o?"The slab is holding your attention. Its edges answer it.":"Move the pointer across the monolith. The edges answer."})]})},Mo=({align:t})=>{const o=le(()=>({progress:h.progress,mode:h.pointerMode,following:h.followingScroll,dispersed:h.dispersed}),a=>Math.round(a.progress*24)+(a.mode===1?0:100)+(a.following?0:1e3)+Math.round(a.dispersed/40),12),r=Math.round((1-o.progress)*100);return e.jsxs("div",{className:`flex flex-col gap-3 ${t==="center"?"items-center":""}`,children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(P,{variant:"technical",size:"sm",onClick:()=>fe(1),children:"Disintegrate"}),e.jsx(P,{variant:"technical",size:"sm",onClick:()=>fe(0),children:"Reassemble"}),e.jsxs(P,{variant:"technical",size:"sm",onClick:Ue,children:["Pointer · ",o.mode===1?"repel":"attract"]}),e.jsx(P,{variant:"ghost",size:"sm",onClick:qe,children:"Reset"}),o.following?e.jsx(R,{tone:"live",dot:!0,children:"Following scroll"}):e.jsx(P,{variant:"ghost",size:"sm",onClick:()=>fe(h.progress,!0),children:"Follow scroll"})]}),e.jsxs(R,{tone:"muted",live:!0,children:["Cohesion ",r.toString().padStart(3,"0"),"% · ",wt(o.dispersed)," fragments in flight"]}),e.jsx("p",{className:"max-w-[46ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]",children:"Scroll drives the sequence by default. The controls take over when you use them — “Follow scroll” hands it back."})]})},Ao=()=>{const t=zt("threshold",16).value,o=le(()=>({open:C.aperture,depth:C.depth}),a=>Math.round(a.open*8)+Math.round(a.depth/25),12),r=o.open>.4;return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(R,{tone:r?"live":"muted",dot:!0,live:!0,children:["Aperture · ",r?"open":"closed"," · ",o.depth.toFixed(0)," m"]}),e.jsxs("p",{className:"max-w-[42ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]",children:["Passage ",Math.round(t*100).toString().padStart(3,"0"),"% traversed. Aim the pointer at the far end to open it early."]})]})},Te={particles:0,shaders:1,portal:2},ko=["Particle field","Domain warp","Refractive aperture"],Eo=[{id:"particles",to:"/lab/particles",label:"Study I"},{id:"shaders",to:"/lab/shaders",label:"Study II"},{id:"portal",to:"/lab/portal",label:"Study III"}],Co=()=>{const t=le(()=>Te[jt.focus],o=>o,3);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(R,{tone:"live",dot:!0,children:["Study ",t+1," of 3 · ",ko[t]]}),e.jsx("div",{className:"flex flex-wrap gap-3",children:Eo.map(o=>e.jsx(P,{variant:Te[o.id]===t?"outline":"ghost",size:"sm",to:o.to,children:o.label},o.to))}),e.jsx("p",{className:"max-w-[46ch] text-sm leading-relaxed text-[color:var(--al-text-quiet)]",children:"Every parameter these studies run on is exposed in the laboratory, and every one of them changes what you are looking at."})]})},_o=()=>{const t=le(()=>B.dissolve,o=>Math.round(o*20),20);return e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(R,{tone:"muted",live:!0,children:t>.98?"Frame retained":`Dissolving · ${Math.round(t*100)}%`}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-3",children:[e.jsx(P,{variant:"primary",size:"md",onClick:()=>{Ye(),We(),A.getState().replay()},children:"Replay"}),e.jsx(P,{variant:"outline",size:"md",to:"/archive",children:"Archive"}),e.jsx(P,{variant:"outline",size:"md",to:"/credits",children:"Credits"})]})]})},No=()=>{Ct();const t=A(a=>a.entered),o=Me.webgl,r=A(a=>a.hasScrolled);return s.useEffect(()=>{const a=window.location.hash.replace("#","");if(!t||!a)return;const l=se.find(n=>n.id===a);if(!l)return;const i=requestAnimationFrame(()=>{Ve(`[data-scene="${l.id}"]`,{offset:-2})});return()=>cancelAnimationFrame(i)},[t]),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"fixed inset-0 z-0",children:o?e.jsx(Et,{className:"h-full w-full"}):e.jsx(mt,{})}),o?null:e.jsx(ft,{}),t?null:e.jsx(_t,{}),e.jsx("div",{className:"relative z-10",children:se.filter(a=>!a.gated).map(a=>e.jsx(Ro,{scene:a},a.id))}),e.jsx(Po,{}),e.jsx(Nt,{}),t?r?null:e.jsx(Fo,{}):null]})},Ro=({scene:t})=>{const o=s.useRef(null);return Rt(o,t.id),e.jsx("section",{ref:o,"data-scene":t.id,id:t.id,"aria-labelledby":`${t.id}-heading`,className:"relative h-[300vh]",children:e.jsxs("div",{className:"sticky top-0 flex h-dvh items-end overflow-hidden",children:[e.jsx("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-x-0 bottom-0 h-[46vh] sm:h-[52vh]",style:{background:"linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.30) 44%, rgba(5,5,5,0.68) 78%, rgba(5,5,5,0.88) 100%)"}}),e.jsx(zo,{scene:t})]})})},zo=({scene:t})=>{const o=t.id==="fracture"?"items-end text-right":t.id==="afterlight"?"items-center text-center":"items-start",r=t.id==="threshold"?"max-w-[38rem]":"max-w-[34rem]";return e.jsx("div",{className:`relative flex w-full flex-col gap-6 px-[var(--al-gutter)] pb-[max(5rem,calc(var(--al-space-8)+env(safe-area-inset-bottom)))] ${o}`,children:e.jsxs("div",{className:`flex flex-col gap-4 ${r} ${t.id==="afterlight"?"mx-auto items-center":""}`,children:[e.jsxs("div",{className:`flex items-baseline gap-4 ${t.id==="afterlight"?"justify-center":""}`,children:[e.jsx(R,{tone:"muted",children:t.numeral}),e.jsx("span",{"aria-hidden":"true",className:"h-px w-10 bg-[color:var(--al-line-strong)]"}),e.jsx(R,{tone:"muted",children:t.subtitle})]}),e.jsx("h2",{id:`${t.id}-heading`,className:"display-title text-lg",children:t.title}),e.jsx("p",{className:"max-w-[var(--al-measure)] text-base leading-relaxed text-[color:var(--al-text-muted)]",children:t.log}),e.jsx(To,{sceneId:t.id,align:t.id==="afterlight"?"center":"start"})]})})},To=({sceneId:t,align:o})=>{switch(t){case"void":return e.jsx(So,{});case"fracture":return e.jsx(Mo,{align:o});case"threshold":return e.jsx(Ao,{});case"echoes":return e.jsx(Co,{});case"afterlight":return e.jsx(_o,{});default:return null}},Po=()=>{const t=A(r=>r.activeScene),o=se.find(r=>r.id===t);return e.jsx("p",{className:"sr-only","aria-live":"polite","aria-atomic":"true",children:o?`Scene ${o.numeral} of 6 — ${o.title}.`:""})},Fo=()=>{const t=A(o=>o.setHasScrolled);return s.useEffect(()=>{const o=()=>{window.scrollY>24&&t(!0)};return window.addEventListener("scroll",o,{passive:!0}),()=>window.removeEventListener("scroll",o)},[t]),e.jsx("div",{className:"pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[95] flex justify-center",children:e.jsxs("button",{type:"button",onClick:()=>{ie("click"),we("void")},className:"label-mono pointer-events-auto flex min-h-[var(--al-control-tap)] items-center gap-3 border border-[color:var(--al-line)] bg-[color:rgba(5,5,5,0.5)] px-4 py-3 text-[color:var(--al-text-muted)] backdrop-blur-sm transition-colors hover:border-[color:var(--al-line-strong)] hover:text-ivory",children:["Begin",e.jsx("span",{"aria-hidden":"true",className:"inline-block h-3 w-px bg-current"})]})})},Vo=Object.freeze(Object.defineProperty({__proto__:null,Home:No},Symbol.toStringTag,{value:"Module"}));export{Vo as H,he as u};
