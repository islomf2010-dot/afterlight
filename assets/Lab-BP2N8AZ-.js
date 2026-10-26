import{j as d,b as ee,u as I,e as pi,d as hi,f as _i,C as xi}from"./r3f-CAIdFP5s.js";import{b as P,d as yi,e as Ci,f as bi,L as Ti}from"./react-DE8NN6kS.js";import{C as jt,$ as rt,a0 as Ei,t as wi,r as at,G as nt,O as ot,K as _e,h as Pi,i as et,a as mt,n as Ht,j as zi,o as Q,E as Ai,w as Di,k as Si,a1 as Vt,a2 as Bi,Q as Ee,F as je,a3 as Ae,a4 as Oi,R as Ri,a5 as Li,S as Ni,V as Le,a6 as vt,_ as Fi,a7 as st,a8 as Ui,f as Ii,A as Mi}from"./three-CuITrT85.js";import{l as Yt,C as ki,a as ji,E as Hi,F as Vi,b as Yi,c as $i,P as Gi}from"./portal-CzQPYAJz.js";import{u as Ue,t as lt,v as Ie,p as Ne,F as M,c as $t,E as gt,y as Wi,P as He,G as qi,H as Zi,A as le,B as re,T as we,I as pt,J as ht,K as Xi,L as Ki}from"./index-CApK0vR9.js";import{E as Qi,P as Ji,D as er,a as tr}from"./ExhibitBackdrop-3NsNeXHH.js";import"./motion-BqM_xKjl.js";var De=192;function ir({type:i}){return d.jsxs(d.Fragment,{children:[i==="plane"&&d.jsx("planeGeometry",{args:[10,10,1,De]}),i==="sphere"&&d.jsx("icosahedronGeometry",{args:[1,De/3]}),i==="waterPlane"&&d.jsx("planeGeometry",{args:[10,10,De,De]})]})}function rr(i){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function ar(i){let e=i.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);return e?{r:parseInt(e[1]),g:parseInt(e[2]),b:parseInt(e[3])}:null}function he(i){if(i.startsWith("#"))return rr(i);if(i.startsWith("rgb"))return ar(i);throw new Error("Invalid color format")}function J(i=0){return i/255}var nr=Object.create,Me=Object.defineProperty,or=Object.defineProperties,sr=Object.getOwnPropertyDescriptor,lr=Object.getOwnPropertyDescriptors,cr=Object.getOwnPropertyNames,Fe=Object.getOwnPropertySymbols,ur=Object.getPrototypeOf,ct=Object.prototype.hasOwnProperty,Gt=Object.prototype.propertyIsEnumerable,_t=(i,e,t)=>e in i?Me(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,N=(i,e)=>{for(var t in e||(e={}))ct.call(e,t)&&_t(i,t,e[t]);if(Fe)for(var t of Fe(e))Gt.call(e,t)&&_t(i,t,e[t]);return i},Pe=(i,e)=>or(i,lr(e)),se=(i,e)=>{var t={};for(var r in i)ct.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&Fe)for(var r of Fe(i))e.indexOf(r)<0&&Gt.call(i,r)&&(t[r]=i[r]);return t},ze=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),k=(i,e)=>{for(var t in e)Me(i,t,{get:e[t],enumerable:!0})},dr=(i,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of cr(e))!ct.call(i,s)&&s!==t&&Me(i,s,{get:()=>e[s],enumerable:!(r=sr(e,s))||r.enumerable});return i},fr=(i,e,t)=>(t=i!=null?nr(ur(i)):{},dr(!i||!i.__esModule?Me(t,"default",{value:i,enumerable:!0}):t,i)),mr=({animate:i,range:e,rangeStart:t,rangeEnd:r,loop:s,loopDuration:n,reflection:c,uniforms:_,vertexShader:o,fragmentShader:p,onInit:m,shader:b})=>{let w=P.useRef(new jt),h=P.useMemo(()=>{let z=Object.entries(_),C=_.colors,y=he(C[0]),g=he(C[1]),a=he(C[2]),l={uC1r:{value:J(y?.r)},uC1g:{value:J(y?.g)},uC1b:{value:J(y?.b)},uC2r:{value:J(g?.r)},uC2g:{value:J(g?.g)},uC2b:{value:J(g?.b)},uC3r:{value:J(a?.r)},uC3g:{value:J(a?.g)},uC3b:{value:J(a?.b)}},v=z.reduce((T,[E,S])=>{let $=rt.clone({[E]:{value:S}});return N(N({},T),$)},{}),f={userData:v,metalness:b==="glass"?0:.2,roughness:b==="glass"?.1:1-(typeof c=="number"?c:.1),side:wi,onBeforeCompile:T=>{T.uniforms=N(N(N({},T.uniforms),v),l),T.vertexShader=o,T.fragmentShader=p}};b==="glass"&&(f.transparent=!0,f.opacity=.3,f.transmission=.9,f.thickness=.5,f.clearcoat=1,f.clearcoatRoughness=0,f.ior=1.5,f.envMapIntensity=1);let u=new Ei(f);return z.forEach(([T])=>Object.defineProperty(u,T,{get:()=>u.uniforms[T].value,set:E=>u.uniforms[T].value=E})),m&&m(u),u},[_,o,p,m,c,b]);return P.useEffect(()=>()=>{h.dispose()},[h]),P.useEffect(()=>{i==="on"?w.current.start():w.current.stop()},[i]),ee(()=>{if(i==="on"&&h.userData.uTime){let z=w.current.getElapsedTime();s==="on"&&Number.isFinite(n)&&n>0?(z=z%n,h.userData.uLoop&&(h.userData.uLoop.value=1),h.userData.uLoopDuration&&(h.userData.uLoopDuration.value=n)):(h.userData.uLoop&&(h.userData.uLoop.value=0),e==="enabled"&&Number.isFinite(t)&&Number.isFinite(r)&&r>t&&(z=t+z,z>=r&&(z=t,w.current.start()))),h.userData.uTime.value=z}}),d.jsx("primitive",{attach:"material",object:h})},Wt={};k(Wt,{fragment:()=>vr,vertex:()=>gr});var vr=`
#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
// #include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
// include를 통해 가져온 값은 대부분 환경, 빛 등을 계산하기 위해서 기본 fragment
// shader의 값들을 받아왔습니다. 일단은 무시하셔도 됩니다.

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;

varying vec3 color1;
varying vec3 color2;
varying vec3 color3;

// for npm package, need to add this manually
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {

  //-------- basic gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.5;

  #include <clipping_planes_fragment>

  vec4 diffuseColor = vec4(
      mix(mix(color1, color2, smoothstep(-3.0, 3.0, vPos.x)), color3, vPos.z),
      1);
  // diffuseColor는 오브젝트의 베이스 색상 (환경이나 빛이 고려되지 않은 본연의
  // 색)

  // mix(x, y, a): a를 축으로 했을 때 가장 낮은 값에서 x값의 영향력을 100%, 가장
  // 높은 값에서 y값의 영향력을 100%로 만든다. smoothstep(x, y, a): a축을
  // 기준으로 x를 최소값, y를 최대값으로 그 사이의 값을 쪼갠다. x와 y 사이를
  // 0-100 사이의 그라디언트처럼 단계별로 표현하고, x 미만의 값은 0, y 이상의
  // 값은 100으로 처리

  // 1. smoothstep(-3.0, 3.0,vPos.x)로 x축의 그라디언트가 표현 될 범위를 -3,
  // 3으로 정한다.
  // 2. mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x))로 color1과 color3을
  // 위의 범위 안에서 그라디언트로 표현한다.
  // 예를 들어 color1이 노랑, color3이 파랑이라고 치면, x축 기준 -3부터 3까지
  // 노랑과 파랑 사이의 그라디언트가 나타나고, -3보다 작은 값에서는 계속 노랑,
  // 3보다 큰 값에서는 계속 파랑이 나타난다.
  // 3. mix()를 한 번 더 사용해서 위의 그라디언트와 color2를 z축 기준으로
  // 분배한다.

  //-------- materiality ------------
  ReflectedLight reflectedLight =
      ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;

  #ifdef TRANSMISSION
    float totalTransmission = transmission;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  // #include <transmissionmap_fragment>
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
    vec3 outgoingLight =
        reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
        reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    //위에서 정의한 diffuseColor에 환경이나 반사값들을 반영한 값.
  #ifdef TRANSMISSION
    diffuseColor.a *=
        mix(saturate(1. - totalTransmission +
                    linearToRelativeLuminance2(reflectedLight.directSpecular +
                                              reflectedLight.indirectSpecular)),
            1.0, metalness);
  #endif


  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>


  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  // gl_FragColor가 fragment shader를 통해 나타나는 최종값으로, diffuseColor에서
  // 정의한 그라디언트 색상 위에 반사나 빛을 계산한 값을 최종값으로 정의.
  // gl_FragColor = vec4(mix(mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x)),
  // color2, vNormal.z), 1.0); 위처럼 최종값을 그라디언트 값 자체를 넣으면 환경
  // 영향없는 그라디언트만 표현됨.
}
`,gr=`// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- start here ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;
uniform float uLoop;
uniform float uLoopDuration;

uniform float uLoadingTime;

uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  vUv = uv;

  float t = uTime * uSpeed;
  
  // For seamless loops, sample noise using 4D-like circular interpolation
  vec3 noisePos = 0.43 * position * uNoiseDensity;
  float distortion;
  
  if (uLoop > 0.5) {
    // Create truly dynamic seamless loop using 4D noise simulation
    // Loop progress only depends on time and duration, not speed
    float loopProgress = uTime / uLoopDuration;
    float angle = loopProgress * 6.28318530718; // 2*PI
    
    // Radius scales with speed to maintain consistent visual speed
    // Larger radius = more distance traveled = faster perceived motion
    float radius = 5.0 * uSpeed;
    
    // Sample 4 noise values at cardinal points around the circle
    vec3 offset0 = vec3(cos(angle) * radius, sin(angle) * radius, 0.0);
    vec3 offset1 = vec3(cos(angle + 1.57079632679) * radius, sin(angle + 1.57079632679) * radius, 0.0);
    vec3 offset2 = vec3(cos(angle + 3.14159265359) * radius, sin(angle + 3.14159265359) * radius, 0.0);
    vec3 offset3 = vec3(cos(angle + 4.71238898038) * radius, sin(angle + 4.71238898038) * radius, 0.0);
    
    // Get noise at all 4 points
    float n0 = cnoise(noisePos + offset0);
    float n1 = cnoise(noisePos + offset1);
    float n2 = cnoise(noisePos + offset2);
    float n3 = cnoise(noisePos + offset3);
    
    // Smooth interpolation weights using cosine
    float w0 = (cos(angle) + 1.0) * 0.5;
    float w1 = (cos(angle + 1.57079632679) + 1.0) * 0.5;
    float w2 = (cos(angle + 3.14159265359) + 1.0) * 0.5;
    float w3 = (cos(angle + 4.71238898038) + 1.0) * 0.5;
    
    // Normalize weights
    float totalWeight = w0 + w1 + w2 + w3;
    w0 /= totalWeight;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    
    // Blend all samples with amplitude boost to match single-sample strength
    // Blending reduces amplitude by ~30%, so we compensate
    float blendedNoise = n0 * w0 + n1 * w1 + n2 * w2 + n3 * w3;
    distortion = 0.75 * blendedNoise * 1.5;
  } else {
    // Normal linear time progression
    distortion = 0.75 * cnoise(noisePos + t);
  }

  vec3 pos = position + normal * distortion * uNoiseStrength * uLoadingTime;
  vPos = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,qt={};k(qt,{fragment:()=>pr,vertex:()=>hr});var pr=`
#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
// #include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
// include를 통해 가져온 값은 대부분 환경, 빛 등을 계산하기 위해서 기본 fragment
// shader의 값들을 받아왔습니다. 일단은 무시하셔도 됩니다.
varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;
varying vec3 color1;
varying vec3 color2;
varying vec3 color3;
varying float distanceToCenter;


// for npm package, need to add this manually
// 'linearToRelativeLuminance' : function already has a body
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {
  //-------- basic gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.5;
#include <clipping_planes_fragment>

  float distanceToCenter = distance(vPos, vec3(0, 0, 0));
  // distanceToCenter로 중심점과의 거리를 구함.

  vec4 diffuseColor =
      vec4(mix(color3, mix(color2, color1, smoothstep(-1.0, 1.0, vPos.y)),
               distanceToCenter),
           1);

  //-------- materiality ------------
  ReflectedLight reflectedLight =
      ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
#ifdef TRANSMISSION
  float totalTransmission = transmission;
#endif
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <roughnessmap_fragment>
#include <metalnessmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <clearcoat_normal_fragment_begin>
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>
// #include <transmissionmap_fragment>
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
  vec3 outgoingLight =
      reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
      reflectedLight.directSpecular + reflectedLight.indirectSpecular;
//위에서 정의한 diffuseColor에 환경이나 반사값들을 반영한 값.
#ifdef TRANSMISSION
  diffuseColor.a *=
      mix(saturate(1. - totalTransmission +
                   linearToRelativeLuminance2(reflectedLight.directSpecular +
                                             reflectedLight.indirectSpecular)),
          1.0, metalness);
#endif
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  // gl_FragColor가 fragment shader를 통해 나타나는 최종값으로, diffuseColor에서
  // 정의한 그라디언트 색상 위에 반사나 빛을 계산한 값을 최종값으로 정의.
  // gl_FragColor = vec4(mix(mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x)),
  // color2, vNormal.z), 1.0); 위처럼 최종값을 그라디언트 값 자체를 넣으면 환경
  // 영향없는 그라디언트만 표현됨.

#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,hr=`// #pragma glslify: pnoise = require(glsl-noise/periodic/3d)

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}


//-------- start here ------------

varying vec3 vNormal;
uniform float uTime;
uniform float uSpeed;
uniform float uLoop;
uniform float uLoopDuration;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
uniform float uFrequency;
uniform float uAmplitude;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying vec3 vViewPosition;

#define STANDARD
#ifndef FLAT_SHADED
  #ifdef USE_TANGENT
    varying vec3 vTangent;
    varying vec3 vBitangent;
  #endif
#endif

#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>


// rotation
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

void main() {
  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  float t = uTime * uSpeed;
  
  // For seamless loops, sample noise using 4D-like circular interpolation
  float distortion;
  float angle;
  
  if (uLoop > 0.5) {
    // Create truly dynamic seamless loop using 4D noise simulation
    float loopProgress = uTime / uLoopDuration;
    float loopAngle = loopProgress * 6.28318530718; // 2*PI
    
    // Radius scales with speed to maintain consistent visual speed
    float radius = 5.0 * uSpeed;
    
    // Sample 4 noise values at cardinal points
    vec3 offset0 = vec3(cos(loopAngle) * radius, sin(loopAngle) * radius, 0.0);
    vec3 offset1 = vec3(cos(loopAngle + 1.57079632679) * radius, sin(loopAngle + 1.57079632679) * radius, 0.0);
    vec3 offset2 = vec3(cos(loopAngle + 3.14159265359) * radius, sin(loopAngle + 3.14159265359) * radius, 0.0);
    vec3 offset3 = vec3(cos(loopAngle + 4.71238898038) * radius, sin(loopAngle + 4.71238898038) * radius, 0.0);
    
    // Get noise at all 4 points
    float n0 = pnoise((normal + offset0) * uNoiseDensity, vec3(10.0));
    float n1 = pnoise((normal + offset1) * uNoiseDensity, vec3(10.0));
    float n2 = pnoise((normal + offset2) * uNoiseDensity, vec3(10.0));
    float n3 = pnoise((normal + offset3) * uNoiseDensity, vec3(10.0));
    
    // Smooth interpolation weights
    float w0 = (cos(loopAngle) + 1.0) * 0.5;
    float w1 = (cos(loopAngle + 1.57079632679) + 1.0) * 0.5;
    float w2 = (cos(loopAngle + 3.14159265359) + 1.0) * 0.5;
    float w3 = (cos(loopAngle + 4.71238898038) + 1.0) * 0.5;
    
    float totalWeight = w0 + w1 + w2 + w3;
    w0 /= totalWeight;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    
    // Blend samples with amplitude boost to match single-sample strength
    float blendedNoise = n0 * w0 + n1 * w1 + n2 * w2 + n3 * w3;
    distortion = blendedNoise * 1.5 * uNoiseStrength;
    
    // Apply loop to spiral effect with blended offset
    float angleOffset = offset0.x * w0 + offset1.x * w1 + offset2.x * w2 + offset3.x * w3;
    angle = sin(uv.y * uFrequency + angleOffset) * uAmplitude;
  } else {
    // Normal linear time progression
    distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;
    angle = sin(uv.y * uFrequency + t) * uAmplitude;
  }
  
  vec3 pos = position + (normal * distortion);
  pos = rotateY(pos, angle);

  vPos = pos;
  vDistort = distortion;
  vNormal = normal;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,Zt={};k(Zt,{fragment:()=>_r,vertex:()=>xr});var _r=`
#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
// #include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
// include를 통해 가져온 값은 대부분 환경, 빛 등을 계산하기 위해서 기본 fragment
// shader의 값들을 받아왔습니다. 일단은 무시하셔도 됩니다.

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;

varying vec3 color1;
varying vec3 color2;
varying vec3 color3;

// for npm package, need to add this manually
// 'linearToRelativeLuminance' : function already has a body
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {

  //-------- basic gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.5;

  #include <clipping_planes_fragment>

  vec4 diffuseColor = vec4(
      mix(mix(color1, color2, smoothstep(-3.0, 3.0, vPos.x)), color3, vPos.z),
      1);
  // diffuseColor는 오브젝트의 베이스 색상 (환경이나 빛이 고려되지 않은 본연의
  // 색)

  // mix(x, y, a): a를 축으로 했을 때 가장 낮은 값에서 x값의 영향력을 100%, 가장
  // 높은 값에서 y값의 영향력을 100%로 만든다. smoothstep(x, y, a): a축을
  // 기준으로 x를 최소값, y를 최대값으로 그 사이의 값을 쪼갠다. x와 y 사이를
  // 0-100 사이의 그라디언트처럼 단계별로 표현하고, x 미만의 값은 0, y 이상의
  // 값은 100으로 처리

  // 1. smoothstep(-3.0, 3.0,vPos.x)로 x축의 그라디언트가 표현 될 범위를 -3,
  // 3으로 정한다.
  // 2. mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x))로 color1과 color3을
  // 위의 범위 안에서 그라디언트로 표현한다.
  // 예를 들어 color1이 노랑, color3이 파랑이라고 치면, x축 기준 -3부터 3까지
  // 노랑과 파랑 사이의 그라디언트가 나타나고, -3보다 작은 값에서는 계속 노랑,
  // 3보다 큰 값에서는 계속 파랑이 나타난다.
  // 3. mix()를 한 번 더 사용해서 위의 그라디언트와 color2를 z축 기준으로
  // 분배한다.

  //-------- materiality ------------
  ReflectedLight reflectedLight =
      ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;

  #ifdef TRANSMISSION
    float totalTransmission = transmission;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  // #include <transmissionmap_fragment>
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
    vec3 outgoingLight =
        reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
        reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    //위에서 정의한 diffuseColor에 환경이나 반사값들을 반영한 값.
  #ifdef TRANSMISSION
    diffuseColor.a *=
        mix(saturate(1. - totalTransmission +
                    linearToRelativeLuminance2(reflectedLight.directSpecular +
                                              reflectedLight.indirectSpecular)),
            1.0, metalness);
  #endif


  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>


  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  // gl_FragColor가 fragment shader를 통해 나타나는 최종값으로, diffuseColor에서
  // 정의한 그라디언트 색상 위에 반사나 빛을 계산한 값을 최종값으로 정의.
  // gl_FragColor = vec4(mix(mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x)),
  // color2, vNormal.z), 1.0); 위처럼 최종값을 그라디언트 값 자체를 넣으면 환경
  // 영향없는 그라디언트만 표현됨.
}
`,xr=`// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 
vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- start here ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

uniform float uTime;
uniform float uSpeed;
uniform float uLoop;
uniform float uLoopDuration;
uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  float t = uTime * uSpeed;
  
  // For seamless loops, sample noise using 4D-like circular interpolation
  vec3 noisePos = 0.43 * position * uNoiseDensity;
  float distortion;
  
  if (uLoop > 0.5) {
    // Create truly dynamic seamless loop using 4D noise simulation
    float loopProgress = uTime / uLoopDuration;
    float angle = loopProgress * 6.28318530718; // 2*PI
    
    // Radius scales with speed to maintain consistent visual speed
    float radius = 5.0 * uSpeed;
    
    // Sample 4 noise values at cardinal points
    vec3 offset0 = vec3(cos(angle) * radius, sin(angle) * radius, 0.0);
    vec3 offset1 = vec3(cos(angle + 1.57079632679) * radius, sin(angle + 1.57079632679) * radius, 0.0);
    vec3 offset2 = vec3(cos(angle + 3.14159265359) * radius, sin(angle + 3.14159265359) * radius, 0.0);
    vec3 offset3 = vec3(cos(angle + 4.71238898038) * radius, sin(angle + 4.71238898038) * radius, 0.0);
    
    // Get noise at all 4 points
    float n0 = cnoise(noisePos + offset0);
    float n1 = cnoise(noisePos + offset1);
    float n2 = cnoise(noisePos + offset2);
    float n3 = cnoise(noisePos + offset3);
    
    // Smooth interpolation weights
    float w0 = (cos(angle) + 1.0) * 0.5;
    float w1 = (cos(angle + 1.57079632679) + 1.0) * 0.5;
    float w2 = (cos(angle + 3.14159265359) + 1.0) * 0.5;
    float w3 = (cos(angle + 4.71238898038) + 1.0) * 0.5;
    
    float totalWeight = w0 + w1 + w2 + w3;
    w0 /= totalWeight;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    
    // Blend samples with amplitude boost to match single-sample strength
    float blendedNoise = n0 * w0 + n1 * w1 + n2 * w2 + n3 * w3;
    distortion = 0.75 * blendedNoise * 1.5;
  } else {
    // Normal linear time progression
    distortion = 0.75 * cnoise(noisePos + t);
  }

  vec3 pos = position + normal * distortion * uNoiseStrength;
  vPos = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,Xt={};k(Xt,{plane:()=>Wt,sphere:()=>qt,waterPlane:()=>Zt});var Kt={};k(Kt,{fragment:()=>yr,vertex:()=>Cr});var yr=`// Glass Plane Fragment Shader - Transparency & Refraction

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

// transmission is already defined by Three.js when TRANSMISSION is enabled
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif

#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
#include <transmission_pars_fragment>

// Custom uniforms for glass effect
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTransparency;
uniform float uRefraction;
uniform float uChromaticAberration;
uniform float uFresnelPower;
uniform float uReflectivity;
// envMap and envMapIntensity are provided by Three.js

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;

// Fresnel calculation
float fresnel(vec3 viewDirection, vec3 normal, float power) {
  return pow(1.0 - dot(viewDirection, normal), power);
}

// Chromatic aberration for refraction
vec3 chromaticRefraction(vec3 viewDirection, vec3 normal, float ior, float chromaticStrength) {
  vec3 refractedR = refract(viewDirection, normal, 1.0 / (ior - chromaticStrength));
  vec3 refractedG = refract(viewDirection, normal, 1.0 / ior);
  vec3 refractedB = refract(viewDirection, normal, 1.0 / (ior + chromaticStrength));
  
  #ifdef ENVMAP_TYPE_CUBE
  return vec3(
    textureCube(envMap, refractedR).r,
    textureCube(envMap, refractedG).g,
    textureCube(envMap, refractedB).b
  );
  #else
  return vec3(0.5);
  #endif
}

void main() {
  #include <clipping_planes_fragment>
  
  vec4 diffuseColor = vec4(diffuse, opacity);
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
  
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  
  // Glass-specific calculations
  vec3 viewDirection = normalize(vViewPosition);
  vec3 worldNormal = normalize(vNormal);
  
  // Calculate Fresnel effect
  float fresnelFactor = fresnel(viewDirection, worldNormal, uFresnelPower);
  
  // Base glass color gradient
  vec3 gradientColor = mix(uColor1, uColor2, vUv.y);
  gradientColor = mix(gradientColor, uColor3, fresnelFactor);
  
  // Reflection
  #ifdef ENVMAP_TYPE_CUBE
  vec3 reflectionColor = textureCube(envMap, vReflect).rgb * envMapIntensity;
  #else
  vec3 reflectionColor = vec3(0.5);
  #endif
  
  // Refraction with chromatic aberration
  vec3 refractionColor;
  #ifdef ENVMAP_TYPE_CUBE
  if (uChromaticAberration > 0.0) {
    refractionColor = chromaticRefraction(-viewDirection, worldNormal, uRefraction, uChromaticAberration);
  } else {
    refractionColor = textureCube(envMap, vRefract).rgb;
  }
  refractionColor *= envMapIntensity;
  #else
  refractionColor = vec3(0.3);
  #endif
  
  // Mix reflection and refraction based on Fresnel
  vec3 envColor = mix(refractionColor, reflectionColor, fresnelFactor * uReflectivity);
  
  // Combine with gradient color
  vec3 finalColor = mix(gradientColor, envColor, 0.7);
  
  // Apply transparency
  float finalAlpha = mix(uTransparency, 1.0, fresnelFactor * 0.5);
  
  // Set diffuse color for standard lighting
  diffuseColor.rgb = finalColor;
  diffuseColor.a = finalAlpha;
  
  // Skip transmission_fragment to avoid conflicts
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + 
                       reflectedLight.directSpecular + reflectedLight.indirectSpecular + 
                       totalEmissiveRadiance;
  
  // Add our glass color contribution
  outgoingLight += finalColor * 0.8;
  
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
`,Cr=`// Glass Plane Vertex Shader - Refraction & Transparency Effects

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;

uniform float uTime;
uniform float uSpeed;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uNoiseStrength;
uniform float uDistortion;

// Noise functions for glass distortion
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
    dot(p2, x2), dot(p3, x3)));
}

void main() {
  #include <uv_pars_vertex>
  #include <uv_vertex>
  #include <uv2_pars_vertex>
  #include <uv2_vertex>
  #include <color_pars_vertex>
  #include <color_vertex>
  #include <morphcolor_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  
  #ifndef FLAT_SHADED
  vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
  vTangent = normalize(transformedTangent);
  vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  
  // Pass UV coordinates
  vUv = uv;

  // Calculate time-based animation
  float time = uTime * uSpeed;
  
  // Create subtle wave distortion for glass effect
  float waveX = sin(position.x * uWaveFrequency + time) * uWaveAmplitude;
  float waveY = cos(position.y * uWaveFrequency + time) * uWaveAmplitude;
  float waveZ = sin(position.z * uWaveFrequency + time * 0.5) * uWaveAmplitude * 0.5;
  
  // Add noise for organic glass distortion
  vec3 noisePos = position + vec3(time * 0.1);
  float noise = snoise(noisePos * 0.5) * uNoiseStrength;
  
  // Apply distortion to transformed position
  transformed += vec3(waveX, waveY, waveZ) * uDistortion + normal * noise;
  
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  
  vViewPosition = -mvPosition.xyz;
  vPosition = transformed;
  
  // Calculate world position for refraction
  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vGlassWorldPos = worldPosition.xyz;
  
  // Calculate reflection and refraction vectors
  vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
  vec3 viewVector = normalize(cameraPosition - worldPosition.xyz);
  
  // Reflection vector
  vReflect = reflect(-viewVector, worldNormal);
  
  // Refraction vector with index of refraction for glass (1.5)
  float ior = 1.5;
  vRefract = refract(-viewVector, worldNormal, 1.0 / ior);
  
  #include <fog_vertex>
  #include <shadowmap_vertex>
}
`,Qt={};k(Qt,{fragment:()=>br,vertex:()=>Tr});var br=`// Glass Sphere Fragment Shader - Transparency & Refraction

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

// transmission is already defined by Three.js when TRANSMISSION is enabled
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif

#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
#include <transmission_pars_fragment>

// Custom uniforms for glass effect
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTransparency;
uniform float uRefraction;
uniform float uChromaticAberration;
uniform float uFresnelPower;
uniform float uReflectivity;
// envMap and envMapIntensity are provided by Three.js

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;
varying float vDistortion;

// Fresnel calculation
float fresnel(vec3 viewDirection, vec3 normal, float power) {
  return pow(1.0 - abs(dot(viewDirection, normal)), power);
}

// Chromatic aberration for refraction
vec3 chromaticRefraction(vec3 viewDirection, vec3 normal, float ior, float chromaticStrength) {
  vec3 refractedR = refract(viewDirection, normal, 1.0 / (ior - chromaticStrength));
  vec3 refractedG = refract(viewDirection, normal, 1.0 / ior);
  vec3 refractedB = refract(viewDirection, normal, 1.0 / (ior + chromaticStrength));
  
  #ifdef ENVMAP_TYPE_CUBE
  return vec3(
    textureCube(envMap, refractedR).r,
    textureCube(envMap, refractedG).g,
    textureCube(envMap, refractedB).b
  );
  #else
  return vec3(0.5);
  #endif
}

// Caustics simulation for sphere
float caustics(vec3 position, float time) {
  float c1 = sin(position.x * 4.0 + time) * sin(position.y * 4.0 + time * 0.8);
  float c2 = sin(position.z * 3.0 - time * 1.2) * sin(position.x * 3.0 + time);
  return (c1 + c2) * 0.5 + 0.5;
}

void main() {
  #include <clipping_planes_fragment>
  
  vec4 diffuseColor = vec4(diffuse, opacity);
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
  
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  
  // Glass-specific calculations
  vec3 viewDirection = normalize(vViewPosition);
  vec3 worldNormal = normalize(vNormal);
  
  // Calculate Fresnel effect
  float fresnelFactor = fresnel(viewDirection, worldNormal, uFresnelPower);
  
  // For sphere, use spherical UV mapping for gradient
  float sphericalU = atan(vPosition.z, vPosition.x) / (2.0 * PI) + 0.5;
  float sphericalV = acos(vPosition.y / length(vPosition)) / PI;
  vec2 sphericalUV = vec2(sphericalU, sphericalV);
  
  // Create color gradient based on spherical coordinates
  vec3 gradientColor = mix(uColor1, uColor2, sphericalUV.y);
  gradientColor = mix(gradientColor, uColor3, pow(fresnelFactor, 1.5));
  
  // Add caustics effect for sphere
  float causticsValue = caustics(vGlassWorldPos, uTime);
  gradientColor += vec3(causticsValue * 0.1);
  
  // Reflection
  #ifdef ENVMAP_TYPE_CUBE
  vec3 reflectionColor = textureCube(envMap, vReflect).rgb * envMapIntensity;
  #else
  vec3 reflectionColor = vec3(0.5);
  #endif
  
  // Refraction with chromatic aberration (enhanced for sphere)
  vec3 refractionColor;
  #ifdef ENVMAP_TYPE_CUBE
  if (uChromaticAberration > 0.0) {
    float chromaticIntensity = uChromaticAberration * (1.0 + vDistortion * 0.5);
    refractionColor = chromaticRefraction(-viewDirection, worldNormal, uRefraction, chromaticIntensity);
  } else {
    refractionColor = textureCube(envMap, vRefract).rgb;
  }
  refractionColor *= envMapIntensity;
  #else
  refractionColor = vec3(0.3);
  #endif
  
  // Mix reflection and refraction based on Fresnel (stronger effect for sphere)
  vec3 envColor = mix(refractionColor, reflectionColor, fresnelFactor * uReflectivity);
  
  // Add inner glow effect for sphere
  float innerGlow = pow(1.0 - abs(dot(viewDirection, worldNormal)), 3.0);
  vec3 glowColor = mix(uColor2, uColor3, innerGlow) * innerGlow * 0.5;
  
  // Combine all effects
  vec3 finalColor = mix(gradientColor, envColor, 0.8) + glowColor;
  
  // Apply transparency with sphere thickness consideration
  float thickness = 1.0 - pow(abs(dot(viewDirection, worldNormal)), 0.5);
  float finalAlpha = mix(uTransparency * thickness, 1.0, fresnelFactor * 0.7);
  
  // Set diffuse color for standard lighting
  diffuseColor.rgb = finalColor;
  diffuseColor.a = finalAlpha;
  
  // Skip transmission_fragment to avoid conflicts
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + 
                       reflectedLight.directSpecular + reflectedLight.indirectSpecular + 
                       totalEmissiveRadiance;
  
  // Add our glass color contribution
  outgoingLight += finalColor * 0.9;
  
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
`,Tr=`// Glass Sphere Vertex Shader - Refraction & Transparency Effects

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;
varying float vDistortion;

uniform float uTime;
uniform float uSpeed;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uNoiseStrength;
uniform float uDistortion;

// Noise functions for glass distortion
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
    dot(p2, x2), dot(p3, x3)));
}

void main() {
  #include <uv_pars_vertex>
  #include <uv_vertex>
  #include <uv2_pars_vertex>
  #include <uv2_vertex>
  #include <color_pars_vertex>
  #include <color_vertex>
  #include <morphcolor_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  
  #ifndef FLAT_SHADED
  vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
  vTangent = normalize(transformedTangent);
  vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  
  // Pass UV coordinates
  vUv = uv;

  // Calculate time-based animation
  float time = uTime * uSpeed;
  
  // For sphere, use spherical coordinates for better distortion
  float theta = atan(position.z, position.x);
  float phi = acos(position.y / length(position));
  
  // Create waves based on spherical coordinates
  float waveTheta = sin(theta * uWaveFrequency * 2.0 + time) * uWaveAmplitude;
  float wavePhi = cos(phi * uWaveFrequency + time * 1.5) * uWaveAmplitude;
  
  // Add noise for organic glass distortion
  vec3 noisePos = position + vec3(time * 0.1);
  float noise = snoise(noisePos * 0.8) * uNoiseStrength;
  
  // Calculate distortion based on position on sphere
  float distortionAmount = (waveTheta + wavePhi) * uDistortion + noise;
  vDistortion = distortionAmount;
  
  // Apply distortion along normal for sphere
  transformed += normal * distortionAmount;
  
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  
  vViewPosition = -mvPosition.xyz;
  vPosition = transformed;
  
  // Calculate world position for refraction
  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vGlassWorldPos = worldPosition.xyz;
  
  // Calculate reflection and refraction vectors
  vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
  vec3 viewVector = normalize(cameraPosition - worldPosition.xyz);
  
  // Reflection vector
  vReflect = reflect(-viewVector, worldNormal);
  
  // Refraction vector with index of refraction for glass (1.5)
  // For sphere, adjust IOR based on curvature
  float ior = 1.5 + sin(theta * 2.0 + time) * 0.1;
  vRefract = refract(-viewVector, worldNormal, 1.0 / ior);
  
  #include <fog_vertex>
  #include <shadowmap_vertex>
}
`,Jt={};k(Jt,{fragment:()=>Er,vertex:()=>wr});var Er=`// Glass WaterPlane Fragment Shader - Liquid Glass Effect

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

// transmission is already defined by Three.js when TRANSMISSION is enabled
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif

#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
#include <transmission_pars_fragment>

// Custom uniforms for liquid glass effect
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTransparency;
uniform float uRefraction;
uniform float uChromaticAberration;
uniform float uFresnelPower;
uniform float uReflectivity;
// envMap and envMapIntensity are provided by Three.js
uniform float uLiquidEffect;
uniform float uFoamIntensity;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;
varying float vWaveHeight;
varying vec3 vWaveNormal;

// Fresnel calculation
float fresnel(vec3 viewDirection, vec3 normal, float power) {
  return pow(1.0 - abs(dot(viewDirection, normal)), power);
}

// Chromatic aberration for refraction
vec3 chromaticRefraction(vec3 viewDirection, vec3 normal, float ior, float chromaticStrength) {
  vec3 refractedR = refract(viewDirection, normal, 1.0 / (ior - chromaticStrength));
  vec3 refractedG = refract(viewDirection, normal, 1.0 / ior);
  vec3 refractedB = refract(viewDirection, normal, 1.0 / (ior + chromaticStrength));
  
  #ifdef ENVMAP_TYPE_CUBE
  vec3 result = vec3(
    textureCube(envMap, refractedR).r,
    textureCube(envMap, refractedG).g,
    textureCube(envMap, refractedB).b
  );
  
  // Add distortion based on wave height
  float distortion = vWaveHeight * 0.1;
  result = mix(result, textureCube(envMap, refractedG + vec3(distortion)).rgb, 0.3);
  #else
  vec3 result = vec3(0.5);
  #endif
  
  return result;
}

// Foam effect for water surface
float foam(vec2 uv, float waveHeight, float time) {
  float foamThreshold = 0.3;
  float foamAmount = smoothstep(foamThreshold - 0.1, foamThreshold + 0.1, abs(waveHeight));
  
  // Add foam texture pattern
  float foamPattern = sin(uv.x * 40.0 + time) * cos(uv.y * 30.0 - time * 0.5);
  foamPattern += sin(uv.x * 25.0 - time * 0.8) * sin(uv.y * 35.0 + time);
  foamPattern = clamp(foamPattern * 0.5 + 0.5, 0.0, 1.0);
  
  return foamAmount * foamPattern;
}

// Caustics for underwater effect
vec3 caustics(vec3 position, float time) {
  float c1 = sin(position.x * 6.0 + time * 1.5) * sin(position.z * 6.0 + time);
  float c2 = cos(position.x * 4.0 - time) * cos(position.z * 5.0 + time * 1.2);
  float c3 = sin((position.x + position.z) * 3.0 + time * 0.8);
  
  float causticPattern = (c1 + c2 + c3) / 3.0;
  causticPattern = pow(max(0.0, causticPattern), 2.0);
  
  return vec3(causticPattern) * vec3(0.3, 0.6, 1.0);
}

void main() {
  #include <clipping_planes_fragment>
  
  vec4 diffuseColor = vec4(diffuse, opacity);
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
  
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  
  // Use wave normal for more accurate water surface
  vec3 viewDirection = normalize(vViewPosition);
  vec3 worldNormal = normalize(vWaveNormal);
  
  // Calculate Fresnel effect
  float fresnelFactor = fresnel(viewDirection, worldNormal, uFresnelPower);
  
  // Water color gradient with depth effect
  float depth = 1.0 - abs(vWaveHeight) * 2.0;
  vec3 shallowColor = mix(uColor1, uColor2, vUv.y);
  vec3 deepColor = mix(uColor2, uColor3, depth);
  vec3 gradientColor = mix(shallowColor, deepColor, fresnelFactor);
  
  // Add foam effect
  float foamAmount = foam(vUv, vWaveHeight, uTime) * uFoamIntensity;
  vec3 foamColor = vec3(1.0, 1.0, 1.0);
  gradientColor = mix(gradientColor, foamColor, foamAmount);
  
  // Reflection
  #ifdef ENVMAP_TYPE_CUBE
  vec3 reflectionColor = textureCube(envMap, vReflect).rgb * envMapIntensity;
  
  // Add slight blur to reflection for water effect
  vec3 blurredReflection = reflectionColor;
  for (int i = 0; i < 4; i++) {
    vec3 offset = vec3(
      sin(float(i) * 2.0) * 0.01,
      0.0,
      cos(float(i) * 2.0) * 0.01
    );
    blurredReflection += textureCube(envMap, vReflect + offset).rgb * envMapIntensity;
  }
  blurredReflection /= 5.0;
  reflectionColor = mix(reflectionColor, blurredReflection, uLiquidEffect);
  #else
  vec3 reflectionColor = vec3(0.5);
  #endif
  
  // Refraction with chromatic aberration (stronger for water)
  vec3 refractionColor;
  #ifdef ENVMAP_TYPE_CUBE
  if (uChromaticAberration > 0.0) {
    float waterIOR = 1.33 + vWaveHeight * 0.1;
    refractionColor = chromaticRefraction(-viewDirection, worldNormal, waterIOR, uChromaticAberration * 1.5);
  } else {
    refractionColor = textureCube(envMap, vRefract).rgb;
  }
  refractionColor *= envMapIntensity;
  #else
  refractionColor = vec3(0.3);
  #endif
  
  // Add caustics to refraction
  vec3 causticsColor = caustics(vGlassWorldPos, uTime);
  refractionColor += causticsColor * 0.3 * uLiquidEffect;
  
  // Mix reflection and refraction based on Fresnel and wave
  float reflectionMix = fresnelFactor * uReflectivity * (1.0 + abs(vWaveHeight));
  vec3 envColor = mix(refractionColor, reflectionColor, clamp(reflectionMix, 0.0, 1.0));
  
  // Combine all effects
  vec3 finalColor = mix(gradientColor, envColor, 0.85);
  
  // Apply transparency with wave variation
  float waveAlpha = 1.0 - abs(vWaveHeight) * 0.3;
  float finalAlpha = mix(uTransparency * waveAlpha, 1.0, fresnelFactor * 0.6 + foamAmount * 0.4);
  
  // Set diffuse color for standard lighting
  diffuseColor.rgb = finalColor;
  diffuseColor.a = finalAlpha;
  
  // Skip transmission_fragment to avoid conflicts
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + 
                       reflectedLight.directSpecular + reflectedLight.indirectSpecular + 
                       totalEmissiveRadiance;
  
  // Add our liquid glass color contribution
  outgoingLight += finalColor * 0.95;
  
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
`,wr=`// Glass WaterPlane Vertex Shader - Liquid Glass Effect

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vGlassWorldPos;
varying vec3 vReflect;
varying vec3 vRefract;
varying float vWaveHeight;
varying vec3 vWaveNormal;

uniform float uTime;
uniform float uSpeed;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uNoiseStrength;
uniform float uDistortion;
uniform float uFlowSpeed;
uniform vec2 uFlowDirection;

// Noise functions for water-like glass distortion
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
    dot(p2, x2), dot(p3, x3)));
}

// Water wave function
vec3 waterWave(vec2 pos, float time) {
  // Flow effect
  vec2 flowPos = pos + uFlowDirection * time * uFlowSpeed;
  
  // Multiple wave layers for realistic water
  float wave1 = sin(flowPos.x * uWaveFrequency + time) * cos(flowPos.y * uWaveFrequency * 0.8 + time * 0.7);
  float wave2 = sin(flowPos.x * uWaveFrequency * 1.7 - time * 1.3) * sin(flowPos.y * uWaveFrequency * 1.3 + time);
  float wave3 = cos(flowPos.x * uWaveFrequency * 0.5 + time * 0.5) * sin(flowPos.y * uWaveFrequency * 0.6 - time * 0.8);
  
  // Combine waves
  float height = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * uWaveAmplitude;
  
  // Calculate wave normals
  float dx = cos(flowPos.x * uWaveFrequency + time) * uWaveFrequency * 0.5 * uWaveAmplitude;
  float dz = -sin(flowPos.y * uWaveFrequency * 0.8 + time * 0.7) * uWaveFrequency * 0.8 * 0.5 * uWaveAmplitude;
  
  return vec3(dx, height, dz);
}

void main() {
  #include <uv_pars_vertex>
  #include <uv_vertex>
  #include <uv2_pars_vertex>
  #include <uv2_vertex>
  #include <color_pars_vertex>
  #include <color_vertex>
  #include <morphcolor_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  
  // Pass UV coordinates
  vUv = uv;

  // Calculate time-based animation
  float time = uTime * uSpeed;
  
  // Calculate water waves
  vec3 waveData = waterWave(position.xz, time);
  float waveHeight = waveData.y;
  vec2 waveGradient = waveData.xz;
  
  // Add noise for organic water movement
  vec3 noisePos = vec3(position.x, position.y, position.z) + vec3(time * 0.05);
  float noise = snoise(noisePos * 1.2) * uNoiseStrength * 0.5;
  
  // Store wave height for fragment shader
  vWaveHeight = waveHeight + noise;
  
  // Calculate perturbed normal for water surface
  vec3 waveNormal = normalize(vec3(-waveGradient.x, 1.0, -waveGradient.y));
  vWaveNormal = waveNormal;
  
  // Blend original normal with wave normal
  vec3 blendedNormal = normalize(mix(normal, waveNormal, 0.7));
  
  #ifndef FLAT_SHADED
  vNormal = normalize(mat3(modelViewMatrix) * blendedNormal);
  #ifdef USE_TANGENT
  vTangent = normalize(transformedTangent);
  vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  
  // Apply wave displacement and additional distortion
  transformed.y += waveHeight + noise;
  transformed += blendedNormal * uDistortion * noise;
  
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  
  vViewPosition = -mvPosition.xyz;
  vPosition = transformed;
  
  // Calculate world position for refraction
  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vGlassWorldPos = worldPosition.xyz;
  
  // Calculate reflection and refraction vectors with wave normal
  vec3 worldNormal = normalize(mat3(modelMatrix) * blendedNormal);
  vec3 viewVector = normalize(cameraPosition - worldPosition.xyz);
  
  // Reflection vector
  vReflect = reflect(-viewVector, worldNormal);
  
  // Refraction vector with varying IOR for water effect
  float ior = 1.33 + sin(time + position.x * 2.0) * 0.1; // Water IOR ~1.33
  vRefract = refract(-viewVector, worldNormal, 1.0 / ior);
  
  #include <fog_vertex>
  #include <shadowmap_vertex>
}
`,ei={};k(ei,{plane:()=>Kt,sphere:()=>Qt,waterPlane:()=>Jt});var ti={};k(ti,{fragment:()=>Pr,vertex:()=>zr});var Pr=`uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;


varying vec3 vNormal;
varying vec3 vPos;

void main() {
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);

  gl_FragColor = vec4(color1 * vPos.x + color2 * vPos.y + color3 * vPos.z, 1.);

}
`,zr=`// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- start here ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

uniform float uLoadingTime;

uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  vUv = uv;

  // vNormal = normal;

  float t = uTime * uSpeed;
  // Create a sine wave from top to bottom of the sphere
  float distortion = 0.75 * cnoise(0.43 * position * uNoiseDensity + t);

  vec3 pos = position + normal * distortion * uNoiseStrength * uLoadingTime;
  vPos = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,ii={};k(ii,{fragment:()=>Ar,vertex:()=>Dr});var Ar=`
#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
// #include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>
// include를 통해 가져온 값은 대부분 환경, 빛 등을 계산하기 위해서 기본 fragment
// shader의 값들을 받아왔습니다. 일단은 무시하셔도 됩니다.
varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;
varying vec3 color1;
varying vec3 color2;
varying vec3 color3;
varying float distanceToCenter;
void main() {
  //-------- basic gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.5;
#include <clipping_planes_fragment>

  float distanceToCenter = distance(vPos, vec3(0, 0, 0));
  // distanceToCenter로 중심점과의 거리를 구함.

  vec4 diffuseColor =
      vec4(mix(color3, mix(color2, color1, smoothstep(-1.0, 1.0, vPos.y)),
               distanceToCenter),
           1);

  //-------- materiality ------------
  ReflectedLight reflectedLight =
      ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
#ifdef TRANSMISSION
  float totalTransmission = transmission;
#endif
#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <roughnessmap_fragment>
#include <metalnessmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <clearcoat_normal_fragment_begin>
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>
// #include <transmissionmap_fragment>
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>
#include <aomap_fragment>
  vec3 outgoingLight =
      reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
      reflectedLight.directSpecular + reflectedLight.indirectSpecular;
//위에서 정의한 diffuseColor에 환경이나 반사값들을 반영한 값.
#ifdef TRANSMISSION
  diffuseColor.a *=
      mix(saturate(1. - totalTransmission +
                   linearToRelativeLuminance(reflectedLight.directSpecular +
                                             reflectedLight.indirectSpecular)),
          1.0, metalness);
#endif
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  // gl_FragColor가 fragment shader를 통해 나타나는 최종값으로, diffuseColor에서
  // 정의한 그라디언트 색상 위에 반사나 빛을 계산한 값을 최종값으로 정의.
  // gl_FragColor = vec4(mix(mix(color1, color3, smoothstep(-3.0, 3.0,vPos.x)),
  // color2, vNormal.z), 1.0); 위처럼 최종값을 그라디언트 값 자체를 넣으면 환경
  // 영향없는 그라디언트만 표현됨.

#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}
`,Dr=`// #pragma glslify: pnoise = require(glsl-noise/periodic/3d)

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}


//-------- start here ------------

varying vec3 vNormal;
uniform float uTime;
uniform float uSpeed;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
uniform float uFrequency;
uniform float uAmplitude;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying vec3 vViewPosition;

#define STANDARD
#ifndef FLAT_SHADED
  #ifdef USE_TANGENT
    varying vec3 vTangent;
    varying vec3 vBitangent;
  #endif
#endif

#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>


// rotation
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

void main() {
  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  float t = uTime * uSpeed;
  float distortion =
      pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;
  vec3 pos = position + (normal * distortion);
  float angle = sin(uv.y * uFrequency + t) * uAmplitude;
  pos = rotateY(pos, angle);

  vPos = pos;
  vDistort = distortion;
  vNormal = normal;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,ri={};k(ri,{fragment:()=>Sr,vertex:()=>Br});var Sr=`uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;


varying vec3 vNormal;
varying vec3 vPos;

void main() {
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);

  gl_FragColor = vec4(color1 * vPos.x + color2 * vPos.y + color3 * vPos.z, 1.);

}
`,Br=`// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- start here ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

uniform float uLoadingTime;

uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- start vertex ------------
  vUv = uv;

  // vNormal = normal;

  float t = uTime * uSpeed;
  // Create a sine wave from top to bottom of the sphere
  float distortion = 0.75 * cnoise(0.43 * position * uNoiseDensity + t);

  vec3 pos = position + normal * distortion * uNoiseStrength * uLoadingTime;
  vPos = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`,ai={};k(ai,{plane:()=>ti,sphere:()=>ii,waterPlane:()=>ri});var ni={};k(ni,{fragment:()=>Or,vertex:()=>Rr});var Or=`// Cosmic Plane Fragment Shader - Holographic Gradient

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vHolographicIntensity;
varying float vCosmicWave;

uniform float uTime;
uniform float uSpeed;

uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;

// Holographic helper functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(hash(i + vec2(0.0, 0.0)), 
                   hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), 
                   hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// for npm package, need to add this manually
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {

  //-------- Cosmic Holographic Gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.2; // More reflective for holographic effect

  #include <clipping_planes_fragment>

  float t = uTime * uSpeed;
  
  // Create holographic interference patterns
  float interference1 = sin(vPos.x * 20.0 + t * 3.0) * cos(vPos.y * 15.0 + t * 2.0);
  float interference2 = sin(vPos.x * 35.0 + t * 4.0) * sin(vPos.y * 30.0 + t * 3.5);
  float interference3 = cos(vPos.x * 50.0 + t * 5.0) * cos(vPos.y * 45.0 + t * 4.5);
  
  // Combine interference patterns
  float holographicPattern = (interference1 + interference2 * 0.5 + interference3 * 0.25) / 1.75;
  
  // Create cosmic shimmer effect
  float shimmer = noise2D(vPos.xy * 40.0 + t * 2.0) * 0.3;
  float cosmicGlow = noise2D(vPos.xy * 8.0 + t * 0.5) * 0.5;
  
  // Holographic color shifting
  vec3 holographicShift = vec3(
    sin(vPos.x * 10.0 + t * 2.0 + 0.0) * 0.1,
    sin(vPos.x * 10.0 + t * 2.0 + 2.094) * 0.1,  // 120 degrees
    sin(vPos.x * 10.0 + t * 2.0 + 4.188) * 0.1   // 240 degrees
  );
  
  // Enhanced gradient mixing with cosmic effects
  float gradientX = smoothstep(-4.0, 4.0, vPos.x + holographicPattern * 2.0);
  float gradientY = smoothstep(-4.0, 4.0, vPos.y + vCosmicWave * 1.5);
  float gradientZ = smoothstep(-2.0, 2.0, vPos.z + shimmer);
  
  // Multi-layer color mixing for depth
  vec3 baseGradient = mix(
    mix(color1, color2, gradientX), 
    color3, 
    gradientY * 0.7 + gradientZ * 0.3
  );
  
  // Apply holographic color shifts
  vec3 holographicColor = baseGradient + holographicShift;
  
  // Add cosmic glow and shimmer
  vec3 cosmicEnhancement = vec3(
    cosmicGlow * 0.2,
    shimmer * 0.15,
    (cosmicGlow + shimmer) * 0.1
  );
  
  // Holographic intensity modulation
  float intensityMod = 1.0 + vHolographicIntensity * 0.5 + abs(holographicPattern) * 0.3;
  
  // Final color with cosmic and holographic effects
  vec3 finalColor = (holographicColor + cosmicEnhancement) * intensityMod;
  
  // Add subtle iridescence
  float iridescence = sin(vPos.x * 25.0 + t * 3.0) * cos(vPos.y * 20.0 + t * 2.5) * 0.1;
  finalColor += vec3(iridescence * 0.2, iridescence * 0.3, iridescence * 0.4);

  vec4 diffuseColor = vec4(finalColor, 1.0);

  //-------- Enhanced Materiality for Holographic Effect ------------
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive + finalColor * 0.1; // Add some emission for glow

  #ifdef TRANSMISSION
    float totalTransmission = transmission;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
                      reflectedLight.directSpecular + reflectedLight.indirectSpecular +
                      totalEmissiveRadiance;

  #ifdef TRANSMISSION
    diffuseColor.a *= mix(saturate(1. - totalTransmission +
                        linearToRelativeLuminance2(reflectedLight.directSpecular +
                                                  reflectedLight.indirectSpecular)),
                1.0, metalness);
  #endif

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
}
`,Rr=`// Cosmic Plane Vertex Shader - Holographic Effect
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- Holographic Effect Functions ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotation3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }
vec3 rotateX(vec3 v, float angle) { return rotation3dX(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vHolographicIntensity;
varying float vCosmicWave;

uniform float uTime;
uniform float uSpeed;
uniform float uLoadingTime;
uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- Cosmic Holographic Effect ------------
  vUv = uv;
  
  float t = uTime * uSpeed;
  
  // Create holographic interference patterns
  float holographicPattern = sin(position.x * 15.0 + t * 2.0) * 
                            sin(position.y * 12.0 + t * 1.5) * 0.1;
  
  // Cosmic wave distortion
  float cosmicWave = cnoise(position * uNoiseDensity * 0.5 + vec3(t * 0.3, t * 0.2, t * 0.4));
  vCosmicWave = cosmicWave;
  
  // Multi-layer noise for depth
  float noise1 = cnoise(position * uNoiseDensity * 2.0 + t * 0.8);
  float noise2 = cnoise(position * uNoiseDensity * 0.3 + t * 0.2) * 0.5;
  float noise3 = cnoise(position * uNoiseDensity * 4.0 + t * 1.2) * 0.25;
  
  float combinedNoise = noise1 + noise2 + noise3;
  
  // Holographic shimmer effect
  float shimmer = sin(position.x * 30.0 + t * 4.0) * 
                  cos(position.y * 25.0 + t * 3.0) * 0.05;
  
  // Calculate holographic intensity for fragment shader
  vHolographicIntensity = abs(holographicPattern) + abs(shimmer) * 2.0;
  
  // Apply displacement with holographic and cosmic effects
  float totalDisplacement = (combinedNoise + holographicPattern + shimmer) * uNoiseStrength * uLoadingTime;
  
  vec3 pos = position + normal * totalDisplacement;
  vPos = pos;
  
  // Add subtle rotation effect for cosmic feel
  pos = rotateY(pos, sin(t * 0.1) * 0.05);
  pos = rotateX(pos, cos(t * 0.07) * 0.03);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,oi={};k(oi,{fragment:()=>Lr,vertex:()=>Nr});var Lr=`// Cosmic Sphere Fragment Shader - Nebula Particle Effect

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vNebulaIntensity;
varying float vParticleDensity;
varying vec3 vCosmicSwirl;

uniform float uTime;
uniform float uSpeed;

uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;

// Nebula helper functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(hash(i + vec2(0.0, 0.0)), 
                   hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), 
                   hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal Brownian Motion for complex nebula patterns
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
        value += amplitude * noise2D(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

// Star field generation
float stars(vec2 p, float density) {
    vec2 n = floor(p * density);
    vec2 f = fract(p * density);
    
    float d = 1.0;
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash(n + g) * vec2(1.0);
            vec2 r = g + o - f;
            d = min(d, dot(r, r));
        }
    }
    
    return 1.0 - smoothstep(0.0, 0.02, sqrt(d));
}

// for npm package, need to add this manually
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {

  //-------- Cosmic Nebula Gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.1; // Very reflective for cosmic shine

  #include <clipping_planes_fragment>

  float t = uTime * uSpeed;
  
  // Calculate distance from center for radial effects
  float distanceFromCenter = length(vPos);
  float angle = atan(vPos.y, vPos.x);
  
  // Create complex nebula patterns using FBM
  vec2 nebulaCoords = vPos.xy * 3.0 + vCosmicSwirl.xy;
  float nebulaPattern1 = fbm(nebulaCoords + t * 0.1);
  float nebulaPattern2 = fbm(nebulaCoords * 2.0 + t * 0.15);
  float nebulaPattern3 = fbm(nebulaCoords * 4.0 + t * 0.2);
  
  // Combine nebula patterns
  float combinedNebula = (nebulaPattern1 + nebulaPattern2 * 0.5 + nebulaPattern3 * 0.25) / 1.75;
  
  // Create particle-like bright spots
  float particleField = stars(vPos.xy * 20.0 + t * 0.5, 50.0);
  float microParticles = stars(vPos.xy * 80.0 + t * 1.0, 200.0) * 0.5;
  
  // Create cosmic dust clouds
  float dustClouds = fbm(vPos.xy * 8.0 + t * 0.05) * 0.3;
  
  // Energy streams
  float energyStream1 = sin(vPos.x * 15.0 + t * 3.0 + angle * 2.0) * 0.1;
  float energyStream2 = cos(vPos.y * 20.0 + t * 2.5 + distanceFromCenter * 5.0) * 0.1;
  
  // Cosmic gradient mixing with nebula influence
  float gradientX = smoothstep(-3.0, 3.0, vPos.x + combinedNebula * 2.0 + vCosmicSwirl.x * 3.0);
  float gradientY = smoothstep(-3.0, 3.0, vPos.y + vNebulaIntensity * 1.5 + vCosmicSwirl.y * 2.0);
  float gradientZ = smoothstep(-2.0, 2.0, vPos.z + dustClouds * 2.0);
  
  // Multi-layer color mixing
  vec3 baseGradient = mix(
    mix(color1, color2, gradientX), 
    color3, 
    gradientY * 0.6 + gradientZ * 0.4
  );
  
  // Add nebula color variations
  vec3 nebulaColor = baseGradient;
  nebulaColor.r += combinedNebula * 0.3 + energyStream1;
  nebulaColor.g += vNebulaIntensity * 0.2 + energyStream2;
  nebulaColor.b += dustClouds * 0.4 + abs(vCosmicSwirl.z) * 0.5;
  
  // Add particle brightness
  vec3 particleGlow = vec3(
    particleField * 0.8 + microParticles * 0.4,
    particleField * 0.6 + microParticles * 0.3,
    particleField * 0.9 + microParticles * 0.5
  );
  
  // Create pulsing cosmic energy
  float cosmicPulse = sin(t * 1.5 + distanceFromCenter * 3.0) * 0.1 + 1.0;
  
  // Combine all effects
  vec3 finalColor = (nebulaColor + particleGlow * 2.0) * cosmicPulse;
  
  // Add cosmic rim lighting effect
  float rimLight = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.0);
  finalColor += rimLight * 0.3 * (color1 + color2 + color3) / 3.0;
  
  // Enhance particle density areas
  finalColor = mix(finalColor, finalColor * 1.5, vParticleDensity * 0.5);
  
  // Add subtle color temperature variation
  float temperature = sin(angle * 3.0 + t * 0.8) * 0.1;
  finalColor.r += temperature * 0.1;
  finalColor.b -= temperature * 0.1;

  vec4 diffuseColor = vec4(finalColor, 1.0);

  //-------- Enhanced Materiality for Cosmic Effect ------------
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive + finalColor * 0.2; // Strong emission for nebula glow

  #ifdef TRANSMISSION
    float totalTransmission = transmission;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
                      reflectedLight.directSpecular + reflectedLight.indirectSpecular +
                      totalEmissiveRadiance;

  #ifdef TRANSMISSION
    diffuseColor.a *= mix(saturate(1. - totalTransmission +
                        linearToRelativeLuminance2(reflectedLight.directSpecular +
                                                  reflectedLight.indirectSpecular)),
                1.0, metalness);
  #endif

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
}
`,Nr=`// Cosmic Sphere Vertex Shader - Nebula Effect
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- Nebula Effect Functions ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotation3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

mat3 rotation3dZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }
vec3 rotateX(vec3 v, float angle) { return rotation3dX(angle) * v; }
vec3 rotateZ(vec3 v, float angle) { return rotation3dZ(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vNebulaIntensity;
varying float vParticleDensity;
varying vec3 vCosmicSwirl;

uniform float uTime;
uniform float uSpeed;
uniform float uLoadingTime;
uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- Cosmic Nebula Effect ------------
  vUv = uv;
  
  float t = uTime * uSpeed;
  
  // Create swirling nebula patterns
  vec3 swirlCenter = vec3(0.0, 0.0, 0.0);
  vec3 toCenter = position - swirlCenter;
  float distanceFromCenter = length(toCenter);
  
  // Create spiral motion
  float angle = atan(toCenter.y, toCenter.x);
  float spiralAngle = angle + distanceFromCenter * 2.0 + t * 0.5;
  
  // Multi-octave noise for nebula density
  float nebula1 = cnoise(position * uNoiseDensity * 0.8 + vec3(t * 0.2, t * 0.3, t * 0.1));
  float nebula2 = cnoise(position * uNoiseDensity * 1.5 + vec3(t * 0.4, t * 0.2, t * 0.5)) * 0.7;
  float nebula3 = cnoise(position * uNoiseDensity * 3.0 + vec3(t * 0.8, t * 0.6, t * 0.9)) * 0.4;
  float nebula4 = cnoise(position * uNoiseDensity * 6.0 + vec3(t * 1.2, t * 1.0, t * 1.4)) * 0.2;
  
  // Combine nebula layers for complexity
  float nebulaPattern = nebula1 + nebula2 + nebula3 + nebula4;
  vNebulaIntensity = abs(nebulaPattern);
  
  // Create particle-like density variations
  float particleDensity = cnoise(position * uNoiseDensity * 8.0 + vec3(t * 2.0, t * 1.5, t * 2.5));
  vParticleDensity = smoothstep(-0.3, 0.8, particleDensity);
  
  // Create cosmic swirl effect
  vec3 swirl = vec3(
    sin(spiralAngle + t * 0.3) * distanceFromCenter * 0.1,
    cos(spiralAngle + t * 0.2) * distanceFromCenter * 0.1,
    sin(distanceFromCenter * 3.0 + t * 0.4) * 0.05
  );
  vCosmicSwirl = swirl;
  
  // Create pulsing effect for cosmic energy
  float pulse = sin(t * 2.0 + distanceFromCenter * 5.0) * 0.1 + 1.0;
  
  // Apply complex displacement
  float totalDisplacement = nebulaPattern * uNoiseStrength * uLoadingTime * pulse;
  
  // Add swirl displacement
  vec3 pos = position + normal * totalDisplacement + swirl * 0.3;
  vPos = pos;
  
  // Add cosmic rotation for dynamic feel
  pos = rotateY(pos, sin(t * 0.1 + distanceFromCenter) * 0.1);
  pos = rotateX(pos, cos(t * 0.08 + angle) * 0.08);
  pos = rotateZ(pos, sin(t * 0.05 + spiralAngle) * 0.05);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,si={};k(si,{fragment:()=>Fr,vertex:()=>Ur});var Fr=`// Cosmic WaterPlane Fragment Shader - Aurora Wave Effect

#define STANDARD
#ifdef PHYSICAL
#define REFLECTIVITY
#define CLEARCOAT
#define TRANSMISSION
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef TRANSMISSION
uniform float transmission;
#endif
#ifdef REFLECTIVITY
uniform float reflectivity;
#endif
#ifdef CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <color_pars_fragment>
#include <common>
#include <dithering_pars_fragment>
#include <emissivemap_pars_fragment>
#include <lightmap_pars_fragment>
#include <map_pars_fragment>
#include <packing>
#include <uv2_pars_fragment>
#include <uv_pars_fragment>
#include <bsdfs>
#include <bumpmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <shadowmap_pars_fragment>

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vAuroraIntensity;
varying float vWaveHeight;
varying vec3 vFlowDirection;

uniform float uTime;
uniform float uSpeed;

uniform float uC1r;
uniform float uC1g;
uniform float uC1b;
uniform float uC2r;
uniform float uC2g;
uniform float uC2b;
uniform float uC3r;
uniform float uC3g;
uniform float uC3b;

// Aurora helper functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(hash(i + vec2(0.0, 0.0)), 
                   hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), 
                   hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal Brownian Motion for aurora patterns
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise2D(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

// Aurora curtain effect
float aurora(vec2 p, float time) {
    vec2 q = vec2(fbm(p + vec2(0.0, time * 0.1)),
                  fbm(p + vec2(5.2, time * 0.15)));
    
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, time * 0.2)),
                  fbm(p + 4.0 * q + vec2(8.3, time * 0.18)));
    
    return fbm(p + 4.0 * r);
}

// Water caustics effect
float caustics(vec2 p, float time) {
    vec2 uv = p * 4.0;
    vec2 p0 = uv + vec2(time * 0.3, time * 0.2);
    vec2 p1 = uv + vec2(time * -0.4, time * 0.3);
    
    float c1 = sin(length(p0) * 8.0 - time * 2.0) * 0.5 + 0.5;
    float c2 = sin(length(p1) * 6.0 - time * 1.5) * 0.5 + 0.5;
    
    return (c1 + c2) * 0.5;
}

// for npm package, need to add this manually
float linearToRelativeLuminance2( const in vec3 color ) {
    vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
    return dot( weights, color.rgb );
}

void main() {

  //-------- Cosmic Aurora Water Gradient ------------
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);
  
  float clearcoat = 1.0;
  float clearcoatRoughness = 0.05; // Very smooth for water-like reflection

  #include <clipping_planes_fragment>

  float t = uTime * uSpeed;
  
  // Create aurora patterns
  vec2 auroraCoords = vPos.xy * 2.0 + vFlowDirection.xy * t * 0.5;
  float auroraPattern1 = aurora(auroraCoords, t);
  float auroraPattern2 = aurora(auroraCoords * 1.5 + vec2(3.0, 1.0), t * 1.2);
  float auroraPattern3 = aurora(auroraCoords * 0.7 + vec2(-2.0, 4.0), t * 0.8);
  
  // Combine aurora layers
  float combinedAurora = (auroraPattern1 + auroraPattern2 * 0.7 + auroraPattern3 * 0.5) / 2.2;
  
  // Create water caustics
  float causticsPattern = caustics(vPos.xy, t);
  
  // Create flowing light streams
  float lightStream1 = sin(vPos.x * 8.0 + t * 2.0 + combinedAurora * 3.0) * 0.2;
  float lightStream2 = cos(vPos.y * 6.0 + t * 1.5 + vWaveHeight * 4.0) * 0.15;
  float lightStream3 = sin((vPos.x + vPos.y) * 10.0 + t * 2.5) * 0.1;
  
  // Create cosmic energy waves
  float distanceFromCenter = length(vPos.xy);
  float energyWave = sin(distanceFromCenter * 5.0 - t * 3.0) * 
                     exp(-distanceFromCenter * 0.05) * 0.3;
  
  // Aurora color shifting effect
  vec3 auroraShift = vec3(
    sin(combinedAurora * 6.28 + t * 1.0) * 0.2,
    sin(combinedAurora * 6.28 + t * 1.0 + 2.094) * 0.2,  // 120 degrees
    sin(combinedAurora * 6.28 + t * 1.0 + 4.188) * 0.2   // 240 degrees
  );
  
  // Enhanced gradient mixing with aurora and water effects
  float gradientX = smoothstep(-4.0, 4.0, vPos.x + combinedAurora * 3.0 + vFlowDirection.x * 2.0);
  float gradientY = smoothstep(-4.0, 4.0, vPos.y + vWaveHeight * 2.0 + lightStream1 * 3.0);
  float gradientZ = smoothstep(-3.0, 3.0, vPos.z + causticsPattern * 2.0);
  
  // Multi-layer color mixing
  vec3 baseGradient = mix(
    mix(color1, color2, gradientX), 
    color3, 
    gradientY * 0.7 + gradientZ * 0.3
  );
  
  // Apply aurora color shifts
  vec3 auroraColor = baseGradient + auroraShift;
  
  // Add water caustics coloring
  vec3 causticsColor = vec3(
    causticsPattern * 0.3,
    causticsPattern * 0.4,
    causticsPattern * 0.5
  );
  
  // Add light streams
  vec3 lightStreams = vec3(
    abs(lightStream1) * 0.4,
    abs(lightStream2) * 0.3,
    abs(lightStream3) * 0.5
  );
  
  // Aurora intensity modulation
  float auroraIntensityMod = 1.0 + vAuroraIntensity * 0.8 + abs(combinedAurora) * 0.6;
  
  // Combine all effects
  vec3 finalColor = (auroraColor + causticsColor + lightStreams + vec3(energyWave * 0.2)) * auroraIntensityMod;
  
  // Add water-like shimmer
  float shimmer = sin(vPos.x * 20.0 + t * 4.0) * 
                  cos(vPos.y * 18.0 + t * 3.5) * 
                  vWaveHeight * 0.1;
  finalColor += vec3(shimmer * 0.3, shimmer * 0.4, shimmer * 0.6);
  
  // Add aurora dancing effect
  float auroraMovement = sin(vPos.x * 3.0 + t * 1.2 + combinedAurora * 2.0) * 
                         cos(vPos.y * 2.5 + t * 0.9) * 0.15;
  finalColor.g += abs(auroraMovement) * 0.4;
  finalColor.b += abs(auroraMovement) * 0.2;
  
  // Add cosmic depth variation
  float depthVariation = noise2D(vPos.xy * 5.0 + t * 0.3) * 0.1;
  finalColor *= (1.0 + depthVariation);

  vec4 diffuseColor = vec4(finalColor, 1.0);

  //-------- Enhanced Materiality for Water Aurora Effect ------------
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive + finalColor * 0.15; // Moderate emission for aurora glow

  #ifdef TRANSMISSION
    float totalTransmission = transmission;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse +
                      reflectedLight.directSpecular + reflectedLight.indirectSpecular +
                      totalEmissiveRadiance;

  #ifdef TRANSMISSION
    diffuseColor.a *= mix(saturate(1. - totalTransmission +
                        linearToRelativeLuminance2(reflectedLight.directSpecular +
                                                  reflectedLight.indirectSpecular)),
                1.0, metalness);
  #endif

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
}
`,Ur=`// Cosmic WaterPlane Vertex Shader - Aurora Wave Effect
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

// noise source from https://github.com/hughsk/glsl-noise/blob/master/periodic/3d.glsl

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

//-------- Aurora Wave Effect Functions ------------

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

vec3 rotateY(vec3 v, float angle) { return rotation3dY(angle) * v; }

varying vec3 vNormal;
varying float displacement;
varying vec3 vPos;
varying float vDistort;
varying vec2 vUv;
varying float vAuroraIntensity;
varying float vWaveHeight;
varying vec3 vFlowDirection;

uniform float uTime;
uniform float uSpeed;
uniform float uLoadingTime;
uniform float uNoiseDensity;
uniform float uNoiseStrength;

#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
#ifdef USE_TANGENT
varying vec3 vTangent;
varying vec3 vBitangent;
#endif
#endif
#include <clipping_planes_pars_vertex>
#include <color_pars_vertex>
#include <common>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <morphtarget_pars_vertex>
#include <shadowmap_pars_vertex>
#include <skinning_pars_vertex>
#include <uv2_pars_vertex>
#include <uv_pars_vertex>

void main() {

  #include <beginnormal_vertex>
  #include <color_vertex>
  #include <defaultnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <uv2_vertex>
  #include <uv_vertex>
  #ifndef FLAT_SHADED
    vNormal = normalize(transformedNormal);
  #ifdef USE_TANGENT
    vTangent = normalize(transformedTangent);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
  #endif
  #endif
  #include <begin_vertex>

  #include <clipping_planes_vertex>
  #include <displacementmap_vertex>
  #include <logdepthbuf_vertex>
  #include <morphtarget_vertex>
  #include <project_vertex>
  #include <skinning_vertex>
    vViewPosition = -mvPosition.xyz;
  #include <fog_vertex>
  #include <shadowmap_vertex>
  #include <worldpos_vertex>

  //-------- Cosmic Aurora Wave Effect ------------
  vUv = uv;
  
  float t = uTime * uSpeed;
  
  // Create flowing aurora patterns
  float auroraFlow1 = sin(position.x * 5.0 + t * 1.5) * cos(position.y * 3.0 + t * 1.0);
  float auroraFlow2 = sin(position.x * 8.0 + t * 2.0) * sin(position.y * 6.0 + t * 1.8);
  float auroraFlow3 = cos(position.x * 12.0 + t * 2.5) * cos(position.y * 9.0 + t * 2.2);
  
  // Combine aurora flows
  float auroraPattern = (auroraFlow1 + auroraFlow2 * 0.7 + auroraFlow3 * 0.4) / 2.1;
  vAuroraIntensity = abs(auroraPattern);
  
  // Create multi-layered waves
  float wave1 = cnoise(vec3(position.xy * uNoiseDensity * 0.5, t * 0.3));
  float wave2 = cnoise(vec3(position.xy * uNoiseDensity * 1.2, t * 0.5)) * 0.6;
  float wave3 = cnoise(vec3(position.xy * uNoiseDensity * 2.5, t * 0.8)) * 0.3;
  float wave4 = cnoise(vec3(position.xy * uNoiseDensity * 5.0, t * 1.2)) * 0.15;
  
  // Combine waves for complex water surface
  float combinedWaves = wave1 + wave2 + wave3 + wave4;
  vWaveHeight = combinedWaves;
  
  // Create flowing current patterns
  vec2 flowDirection = vec2(
    sin(position.x * 2.0 + t * 0.8) + cos(position.y * 1.5 + t * 0.6),
    cos(position.x * 1.8 + t * 0.7) + sin(position.y * 2.2 + t * 0.9)
  );
  vFlowDirection = vec3(normalize(flowDirection), 0.0);
  
  // Aurora-influenced wave distortion
  float auroraWave = sin(position.x * 15.0 + t * 3.0 + auroraPattern * 5.0) * 
                     cos(position.y * 12.0 + t * 2.5 + auroraPattern * 4.0) * 0.2;
  
  // Create cosmic energy ripples
  float distanceFromCenter = length(position.xy);
  float cosmicRipple = sin(distanceFromCenter * 8.0 - t * 4.0) * 
                       exp(-distanceFromCenter * 0.1) * 0.3;
  
  // Pulsing effect for cosmic energy
  float cosmicPulse = sin(t * 1.5 + distanceFromCenter * 2.0) * 0.1 + 1.0;
  
  // Apply complex displacement
  float totalDisplacement = (combinedWaves + auroraWave + cosmicRipple) * 
                           uNoiseStrength * uLoadingTime * cosmicPulse;
  
  vec3 pos = position + normal * totalDisplacement;
  vPos = pos;
  
  // Add subtle rotation for cosmic flow
  pos = rotateY(pos, sin(t * 0.05 + distanceFromCenter * 0.1) * 0.02);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,li={};k(li,{plane:()=>ni,sphere:()=>oi,waterPlane:()=>si});var ci={};k(ci,{cosmic:()=>li,defaults:()=>Xt,glass:()=>ei,positionMix:()=>ai});var te={performance:!1,render:!0},ui={enable:i=>{te[i]=!0},disable:i=>{te[i]=!1},enableAll:()=>{Object.keys(te).forEach(i=>{te[i]=!0})},disableAll:()=>{Object.keys(te).forEach(i=>{te[i]=!1})},performance:(...i)=>{te.performance&&console.log("[Performance]",...i)},render:(...i)=>{te.render&&console.log("[Render]",...i)}};typeof window<"u"&&(window.debug=ui);function tt(i){return i/180*Math.PI}function Ir(i){return i.map(e=>tt(e))}function Mr(i){return i.replace("http://localhost:3001/customize","").replace("https://shadergradient.co/customize","").replace("https://www.shadergradient.co/customize","")}function kr({animate:i,range:e,rangeStart:t,rangeEnd:r,loop:s,loopDuration:n,positionX:c,positionY:_,positionZ:o,rotationX:p,rotationY:m,rotationZ:b,type:w,color1:h,color2:z,color3:C,reflection:y,uTime:g,uSpeed:a,uDensity:l,uStrength:v,uFrequency:f,uAmplitude:u,shader:T}){let{vertex:E,fragment:S}=ci[T][w],$={colors:[h,z,C],uTime:g,uSpeed:a,uLoadingTime:1,uNoiseDensity:l,uNoiseStrength:v,uFrequency:f,uAmplitude:u,uIntensity:.5,uLoop:s==="on"?1:0,uLoopDuration:n||5},W=T==="glass"?{uColor1:he(h),uColor2:he(z),uColor3:he(C),uTransparency:.1,uRefraction:1.5,uChromaticAberration:.1,uFresnelPower:2,uReflectivity:.9,uWaveAmplitude:.02,uWaveFrequency:5,uDistortion:.1,uFlowSpeed:.1,uFlowDirection:{x:1,y:.5},uLiquidEffect:.5,uFoamIntensity:.3,envMapIntensity:1}:{},R=N(N({},$),W);return d.jsxs("mesh",{name:"shadergradient-mesh",position:[c,_,o],rotation:Ir([p,m,b]),children:[d.jsx(ir,{type:w}),d.jsx(mr,{animate:i,range:e,rangeStart:t,rangeEnd:r,loop:s,loopDuration:n,reflection:y,shader:T,uniforms:R,vertexShader:E,fragmentShader:S,onInit:ae=>{ui.performance("material (onInit)",ae)}})]})}var ke=class{constructor(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}},jr=new ot(-1,1,1,-1,0,1),ut=new nt;ut.setAttribute("position",new _e([-1,3,0,-1,-1,0,3,-1,0],3));ut.setAttribute("uv",new _e([0,2,0,0,2,0],2));var Hr=class{constructor(e){this._mesh=new at(ut,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jr)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Vr=class extends ke{constructor(e,t,r,s,n){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=s,this.clearAlpha=n!==void 0?n:0,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pi}render(e,t,r){let s=e.autoClear;e.autoClear=!1;let n,c;this.overrideMaterial!==void 0&&(c=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor&&(e.getClearColor(this._oldClearColor),n=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor&&e.setClearColor(this._oldClearColor,n),this.overrideMaterial!==void 0&&(this.scene.overrideMaterial=c),e.autoClear=s}},xt=class extends ke{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof et?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=rt.clone(e.uniforms),this.material=new et({defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Hr(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}},yt={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;

		}`},Ct=class extends ke{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let s=e.getContext(),n=e.state;n.buffers.color.setMask(!1),n.buffers.depth.setMask(!1),n.buffers.color.setLocked(!0),n.buffers.depth.setLocked(!0);let c,_;this.inverse?(c=0,_=1):(c=1,_=0),n.buffers.stencil.setTest(!0),n.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),n.buffers.stencil.setFunc(s.ALWAYS,c,4294967295),n.buffers.stencil.setClear(_),n.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),n.buffers.color.setLocked(!1),n.buffers.depth.setLocked(!1),n.buffers.stencil.setLocked(!1),n.buffers.stencil.setFunc(s.EQUAL,1,4294967295),n.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),n.buffers.stencil.setLocked(!0)}},Yr=class extends ke{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},$r=class{constructor(e,t){if(this.renderer=e,t===void 0){let r={minFilter:Q,magFilter:Q,format:zi},s=e.getSize(new mt);this._pixelRatio=e.getPixelRatio(),this._width=s.width,this._height=s.height,t=new Ht(this._width*this._pixelRatio,this._height*this._pixelRatio,r),t.texture.name="EffectComposer.rt1"}else this._pixelRatio=1,this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],yt===void 0&&console.error("THREE.EffectComposer relies on CopyShader"),xt===void 0&&console.error("THREE.EffectComposer relies on ShaderPass"),this.copyPass=new xt(yt),this.clock=new jt}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let s=0,n=this.passes.length;s<n;s++){let c=this.passes[s];if(c.enabled!==!1){if(c.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),c.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),c.needsSwap){if(r){let _=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(_.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(_.EQUAL,1,4294967295)}this.swapBuffers()}Ct!==void 0&&(c instanceof Ct?r=!0:c instanceof Yr&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new mt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(r,s),this.renderTarget2.setSize(r,s);for(let n=0;n<this.passes.length;n++)this.passes[n].setSize(r,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}};new ot(-1,1,1,-1,0,1);var di=new nt;di.setAttribute("position",new _e([-1,3,0,-1,-1,0,3,-1,0],3));di.setAttribute("uv",new _e([0,2,0,0,2,0],2));var ce={uniforms:{tDiffuse:{value:null},shape:{value:1},radius:{value:2},rotateR:{value:Math.PI/12*1},rotateG:{value:Math.PI/12*2},rotateB:{value:Math.PI/12*3},scatter:{value:1},width:{value:20},height:{value:20},blending:{value:1},blendingMode:{value:1},greyscale:{value:!1},disable:{value:!1}},vertexShader:`

		varying vec2 vUV;
		varying vec3 vPosition;

		void main() {

			vUV = uv;
			vPosition = position;

			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

		}`,fragmentShader:`

		#define SQRT2_MINUS_ONE 0.41421356
		#define SQRT2_HALF_MINUS_ONE 0.20710678
		#define PI2 6.28318531
		#define SHAPE_DOT 1
		#define SHAPE_ELLIPSE 2
		#define SHAPE_LINE 3
		#define SHAPE_SQUARE 4
		#define BLENDING_LINEAR 1
		#define BLENDING_MULTIPLY 2
		#define BLENDING_ADD 3
		#define BLENDING_LIGHTER 4
		#define BLENDING_DARKER 5
		uniform sampler2D tDiffuse;
		uniform float radius;
		uniform float rotateR;
		uniform float rotateG;
		uniform float rotateB;
		uniform float scatter;
		uniform float width;
		uniform float height;
		uniform int shape;
		uniform bool disable;
		uniform float blending;
		uniform int blendingMode;
		varying vec2 vUV;
		varying vec3 vPosition;
		uniform bool greyscale;
		const int samples = 8;

		float blend( float a, float b, float t ) {

		// linear blend
			return a * ( 1.0 - t ) + b * t;

		}

		float hypot( float x, float y ) {

		// vector magnitude
			return sqrt( x * x + y * y );

		}

		float rand( vec2 seed ){

		// get pseudo-random number
			return fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

		}

		float distanceToDotRadius( float channel, vec2 coord, vec2 normal, vec2 p, float angle, float rad_max ) {

		// apply shape-specific transforms
			float dist = hypot( coord.x - p.x, coord.y - p.y );
			float rad = channel;

			if ( shape == SHAPE_DOT ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

			} else if ( shape == SHAPE_ELLIPSE ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

				if ( dist != 0.0 ) {
					float dot_p = abs( ( p.x - coord.x ) / dist * normal.x + ( p.y - coord.y ) / dist * normal.y );
					dist = ( dist * ( 1.0 - SQRT2_HALF_MINUS_ONE ) ) + dot_p * dist * SQRT2_MINUS_ONE;
				}

			} else if ( shape == SHAPE_LINE ) {

				rad = pow( abs( rad ), 1.5) * rad_max;
				float dot_p = ( p.x - coord.x ) * normal.x + ( p.y - coord.y ) * normal.y;
				dist = hypot( normal.x * dot_p, normal.y * dot_p );

			} else if ( shape == SHAPE_SQUARE ) {

				float theta = atan( p.y - coord.y, p.x - coord.x ) - angle;
				float sin_t = abs( sin( theta ) );
				float cos_t = abs( cos( theta ) );
				rad = pow( abs( rad ), 1.4 );
				rad = rad_max * ( rad + ( ( sin_t > cos_t ) ? rad - sin_t * rad : rad - cos_t * rad ) );

			}

			return rad - dist;

		}

		struct Cell {

		// grid sample positions
			vec2 normal;
			vec2 p1;
			vec2 p2;
			vec2 p3;
			vec2 p4;
			float samp2;
			float samp1;
			float samp3;
			float samp4;

		};

		vec4 getSample( vec2 point ) {

		// multi-sampled point
			vec4 tex = texture2D( tDiffuse, vec2( point.x / width, point.y / height ) );
			float base = rand( vec2( floor( point.x ), floor( point.y ) ) ) * PI2;
			float step = PI2 / float( samples );
			// float dist = radius * 0.66;
			float dist = radius * 0.0;

			for ( int i = 0; i < samples; ++i ) {

				float r = base + step * float( i );
				vec2 coord = point + vec2( cos( r ) * dist, sin( r ) * dist );
				tex += texture2D( tDiffuse, vec2( coord.x / width, coord.y / height ) );

			}

			tex /= float( samples ) + 1.0;
			return tex;

		}

		float getDotColour( Cell c, vec2 p, int channel, float angle, float aa ) {

		// get colour for given point
			float dist_c_1, dist_c_2, dist_c_3, dist_c_4, res;

			if ( channel == 0 ) {

				c.samp1 = getSample( c.p1 ).r;
				c.samp2 = getSample( c.p2 ).r;
				c.samp3 = getSample( c.p3 ).r;
				c.samp4 = getSample( c.p4 ).r;

			} else if (channel == 1) {

				c.samp1 = getSample( c.p1 ).g;
				c.samp2 = getSample( c.p2 ).g;
				c.samp3 = getSample( c.p3 ).g;
				c.samp4 = getSample( c.p4 ).g;

			} else {

				c.samp1 = getSample( c.p1 ).b;
				c.samp3 = getSample( c.p3 ).b;
				c.samp2 = getSample( c.p2 ).b;
				c.samp4 = getSample( c.p4 ).b;

			}

			dist_c_1 = distanceToDotRadius( c.samp1, c.p1, c.normal, p, angle, radius );
			dist_c_2 = distanceToDotRadius( c.samp2, c.p2, c.normal, p, angle, radius );
			dist_c_3 = distanceToDotRadius( c.samp3, c.p3, c.normal, p, angle, radius );
			dist_c_4 = distanceToDotRadius( c.samp4, c.p4, c.normal, p, angle, radius );
			res = ( dist_c_1 > 0.0 ) ? clamp( dist_c_1 / aa, 0.0, 1.0 ) : 0.0;
			// res = 0.0;
			res += ( dist_c_2 > 0.0 ) ? clamp( dist_c_2 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_3 > 0.0 ) ? clamp( dist_c_3 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_4 > 0.0 ) ? clamp( dist_c_4 / aa, 0.0, 1.0 ) : 0.0;
			res = clamp( res, 0.0, 1.0 );

			return res;
			// return 2

		}

		Cell getReferenceCell( vec2 p, vec2 origin, float grid_angle, float step ) {

		// get containing cell
			Cell c;

		// calc grid
			vec2 n = vec2( cos( grid_angle ), sin( grid_angle ) );
			float threshold = step * 0.5;
			float dot_normal = n.x * ( p.x - origin.x ) + n.y * ( p.y - origin.y );
			float dot_line = -n.y * ( p.x - origin.x ) + n.x * ( p.y - origin.y );
			vec2 offset = vec2( n.x * dot_normal, n.y * dot_normal );
			float offset_normal = mod( hypot( offset.x, offset.y ), step );
			float normal_dir = ( dot_normal < 0.0 ) ? 1.0 : -1.0;
			float normal_scale = ( ( offset_normal < threshold ) ? -offset_normal : step - offset_normal ) * normal_dir;
			float offset_line = mod( hypot( ( p.x - offset.x ) - origin.x, ( p.y - offset.y ) - origin.y ), step );
			float line_dir = ( dot_line < 0.0 ) ? 1.0 : -1.0;
			float line_scale = ( ( offset_line < threshold ) ? -offset_line : step - offset_line ) * line_dir;

		// get closest corner
			c.normal = n;
			c.p1.x = p.x - n.x * normal_scale + n.y * line_scale;
			c.p1.y = p.y - n.y * normal_scale - n.x * line_scale;

		// scatter
			if ( scatter != 0.0 ) {

				float off_mag = scatter * threshold * 0.5;
				float off_angle = rand( vec2( floor( c.p1.x ), floor( c.p1.y ) ) ) * PI2;
				c.p1.x += cos( off_angle ) * off_mag;
				c.p1.y += sin( off_angle ) * off_mag;

			}

		// find corners
			float normal_step = normal_dir * ( ( offset_normal < threshold ) ? step : -step );
			float line_step = line_dir * ( ( offset_line < threshold ) ? step : -step );
			c.p2.x = c.p1.x - n.x * normal_step;
			c.p2.y = c.p1.y - n.y * normal_step;
			c.p3.x = c.p1.x + n.y * line_step;
			c.p3.y = c.p1.y - n.x * line_step;
			c.p4.x = c.p1.x - n.x * normal_step + n.y * line_step;
			c.p4.y = c.p1.y - n.y * normal_step - n.x * line_step;

			return c;

		}

		float blendColour( float a, float b, float t ) {

		// blend colours
			if ( blendingMode == BLENDING_LINEAR ) {
				return blend( a, b, 1.0 - t );
			} else if ( blendingMode == BLENDING_ADD ) {
				return blend( a, min( 1.0, a + b ), t );
			} else if ( blendingMode == BLENDING_MULTIPLY ) {
				return blend( a, max( 0.0, a * b ), t );
			} else if ( blendingMode == BLENDING_LIGHTER ) {
				return blend( a, max( a, b ), t );
			} else if ( blendingMode == BLENDING_DARKER ) {
				return blend( a, min( a, b ), t );
			} else {
				return blend( a, b, 1.0 - t );
			}

		}

		void main() {

			if ( ! disable ) {

		// setup
				vec2 p = vec2( vUV.x * width, vUV.y * height ) - vec2(vPosition.x, vPosition.y) * 3.0; // - position values to remove black borders.
				vec2 origin = vec2( 0, 0 );
				float aa = ( radius < 2.5 ) ? radius * 0.5 : 1.25;
				// float aa = 0.0;

		// get channel samples
				Cell cell_r = getReferenceCell( p, origin, rotateR, radius );
				Cell cell_g = getReferenceCell( p, origin, rotateG, radius );
				Cell cell_b = getReferenceCell( p, origin, rotateB, radius );
				float r = getDotColour( cell_r, p, 0, rotateR, aa );
				float g = getDotColour( cell_g, p, 1, rotateG, aa );
				float b = getDotColour( cell_b, p, 2, rotateB, aa );

		// blend with original
				vec4 colour = texture2D( tDiffuse, vUV );
				
				// add masking before blendColour
				if (colour.r == 0.0) {
					r = 0.0;
				} else {
					r = blendColour( r, colour.r, blending );
				}

				if (colour.g == 0.0) {
					g = 0.0;
				} else {
					g = blendColour( g, colour.g, blending );
				}

				if (colour.b == 0.0) {
					b = 0.0;
				} else {
					b = blendColour( b, colour.b, blending );
				}
				
				
				

				if ( greyscale ) {
					r = g = b = (r + b + g) / 3.0;
				}

				// add alpha channel to each r, g, b colors
				vec4 vR;
				vec4 vG;
				vec4 vB;
	
				// apply transparent to outside of mesh
				if (r == 0.0 && colour.r == 0.0) {
					vR = vec4( 0, 0, 0, 0 );
				} else {
					vR = vec4( r, 0, 0, 1 );
				}
	
				if (g == 0.0 && colour.g == 0.0) {
					vG = vec4( 0, 0, 0, 0 );
				} else {
					vG = vec4( 0, g, 0, 1 );
				}
	
				if (b == 0.0 && colour.b == 0.0) {
					vB = vec4( 0, 0, 0, 0 );
				} else {
					vB = vec4( 0, 0, b, 1 );
				}

				// gl_FragColor = vec4( r, g, b, 1.0 );
				gl_FragColor = vR + vG + vB;

			} else {

				gl_FragColor = texture2D( tDiffuse, vUV );

			}

		}`},Gr=class{constructor(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}},Wr=new ot(-1,1,1,-1,0,1),dt=new nt;dt.setAttribute("position",new _e([-1,3,0,-1,-1,0,3,-1,0],3));dt.setAttribute("uv",new _e([0,2,0,0,2,0],2));var qr=class{constructor(e){this._mesh=new at(dt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Wr)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},U={SKIP:0,ADD:1,ALPHA:2,AVERAGE:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,EXCLUSION:8,LIGHTEN:9,MULTIPLY:10,DIVIDE:11,NEGATION:12,NORMAL:13,OVERLAY:14,REFLECT:15,SCREEN:16,SOFT_LIGHT:17,SUBTRACT:18},Zr=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return min(x + y, 1.0) * opacity + x * (1.0 - opacity);

}
`,Xr=`vec3 blend(const in vec3 x, const in vec3 y, const in float opacity) {

	return y * opacity + x * (1.0 - opacity);

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	float a = min(y.a, opacity);

	return vec4(blend(x.rgb, y.rgb, a), max(x.a, a));

}
`,Kr=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return (x + y) * 0.5 * opacity + x * (1.0 - opacity);

}
`,Qr=`float blend(const in float x, const in float y) {

	return (y == 0.0) ? y : max(1.0 - (1.0 - x) / y, 0.0);

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,Jr=`float blend(const in float x, const in float y) {

	return (y == 1.0) ? y : min(x / (1.0 - y), 1.0);

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,ea=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return min(x, y) * opacity + x * (1.0 - opacity);

}
`,ta=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return abs(x - y) * opacity + x * (1.0 - opacity);

}
`,ia=`float blend(const in float x, const in float y) {

	return (y > 0.0) ? min(x / y, 1.0) : 1.0;

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,ra=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return (x + y - 2.0 * x * y) * opacity + x * (1.0 - opacity);

}
`,aa=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return max(x, y) * opacity + x * (1.0 - opacity);

}
`,na=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return x * y * opacity + x * (1.0 - opacity);

}
`,oa=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return (1.0 - abs(1.0 - x - y)) * opacity + x * (1.0 - opacity);

}
`,sa=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return y * opacity + x * (1.0 - opacity);

}
`,la=`float blend(const in float x, const in float y) {

	return (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,ca=`float blend(const in float x, const in float y) {

	return (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,ua=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return (1.0 - (1.0 - x) * (1.0 - y)) * opacity + x * (1.0 - opacity);

}
`,da=`float blend(const in float x, const in float y) {

	return (y < 0.5) ?
		(2.0 * x * y + x * x * (1.0 - 2.0 * y)) :
		(sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));

}

vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	vec4 z = vec4(
		blend(x.r, y.r),
		blend(x.g, y.g),
		blend(x.b, y.b),
		blend(x.a, y.a)
	);

	return z * opacity + x * (1.0 - opacity);

}
`,fa=`vec4 blend(const in vec4 x, const in vec4 y, const in float opacity) {

	return max(x + y - 1.0, 0.0) * opacity + x * (1.0 - opacity);

}
`,ma=new Map([[U.SKIP,null],[U.ADD,Zr],[U.ALPHA,Xr],[U.AVERAGE,Kr],[U.COLOR_BURN,Qr],[U.COLOR_DODGE,Jr],[U.DARKEN,ea],[U.DIFFERENCE,ta],[U.EXCLUSION,ra],[U.LIGHTEN,aa],[U.MULTIPLY,na],[U.DIVIDE,ia],[U.NEGATION,oa],[U.NORMAL,sa],[U.OVERLAY,la],[U.REFLECT,ca],[U.SCREEN,ua],[U.SOFT_LIGHT,da],[U.SUBTRACT,fa]]),va=class extends Ai{constructor(i,e=1){super(),this.blendFunction=i,this.opacity=new Di(e)}getBlendFunction(){return this.blendFunction}setBlendFunction(i){this.blendFunction=i,this.dispatchEvent({type:"change"})}getShaderCode(){return ma.get(this.blendFunction)}},ga=class extends Gr{constructor(e,t,r){super(),ce===void 0&&console.error("THREE.HalftonePass requires HalftoneShader"),this.uniforms=rt.clone(ce.uniforms),this.material=new et({uniforms:this.uniforms,fragmentShader:ce.fragmentShader,vertexShader:ce.vertexShader}),this.uniforms.width.value=e,this.uniforms.height.value=t,this.uniforms.disable.value=r.disable,this.fsQuad=new qr(this.material),this.blendMode=new va(U.SCREEN),this.extensions=null}render(e,t,r){this.material.uniforms.tDiffuse.value=r.texture,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e))}setSize(e,t){this.uniforms.width.value=e,this.uniforms.height.value=t}initialize(e,t,r){}addEventListener(){}getAttributes(){return this.attributes}getFragmentShader(){return ce.fragmentShader}getVertexShader(){return ce.vertexShader}update(e,t,r){}};function pa({disable:i=!1}){let{gl:e,scene:t,camera:r,size:s}=I(),n=P.useRef(null),c=P.useRef(null),_=P.useMemo(()=>({shape:1,radius:2,rotateR:Math.PI/12,rotateB:Math.PI/12*2,rotateG:Math.PI/12*3,scatter:1,blending:1,blendingMode:1,greyscale:!1}),[]);return P.useEffect(()=>{let o=new $r(e),p=new Vr(t,r),m=new ga(s.width,s.height,Pe(N({},_),{disable:i}));return o.addPass(p),o.addPass(m),n.current=o,c.current=m,()=>{var b,w,h,z,C,y,g,a;(b=p.dispose)==null||b.call(p),(w=m.fsQuad)!=null&&w.dispose&&m.fsQuad.dispose(),(z=(h=m.material)==null?void 0:h.dispose)==null||z.call(h),(y=(C=o.renderTarget1)==null?void 0:C.dispose)==null||y.call(C),(a=(g=o.renderTarget2)==null?void 0:g.dispose)==null||a.call(g),n.current=null,c.current=null}},[r,e,_,t]),P.useEffect(()=>{var o;let p=n.current;p&&(p.setSize(s.width,s.height),(o=c.current)==null||o.setSize(s.width,s.height))},[s.height,s.width]),P.useEffect(()=>{var o,p;(p=(o=c.current)==null?void 0:o.uniforms)!=null&&p.disable&&(c.current.uniforms.disable.value=i)},[i]),ee((o,p)=>{let m=n.current;m&&(e.autoClear=!0,m.render(p))},1),d.jsx(d.Fragment,{})}var ha=1,_a=14,bt={zoom:1,distance:14},Tt={zoom:5,distance:14},xa="https://ruucm.github.io/shadergradient/ui@0.0.0/assets/hdr/";function ya({type:i,cAzimuthAngle:e,cPolarAngle:t,cDistance:r,cameraZoom:s,zoomOut:n,enableTransition:c=!0}){let _=P.useRef();return ee((o,p)=>_.current.update(p)),P.useEffect(()=>{let o=_.current;o?.rotateTo(tt(e),tt(t),c)},[_,e,t,c]),P.useEffect(()=>{let o=_.current;n?i==="sphere"?(o?.dollyTo(Tt.distance,c),o?.zoomTo(Tt.zoom,c)):(o?.dollyTo(bt.distance,c),o?.zoomTo(bt.zoom,c)):i==="sphere"?(o?.zoomTo(s,c),o?.dollyTo(_a,c)):(o?.dollyTo(r,c),o?.zoomTo(ha,c))},[_,n,i,s,r,c]),_}var F={LEFT:1,RIGHT:2,MIDDLE:4},x=Object.freeze({NONE:0,ROTATE:1,TRUCK:2,OFFSET:4,DOLLY:8,ZOOM:16,TOUCH_ROTATE:32,TOUCH_TRUCK:64,TOUCH_OFFSET:128,TOUCH_DOLLY:256,TOUCH_ZOOM:512,TOUCH_DOLLY_TRUCK:1024,TOUCH_DOLLY_OFFSET:2048,TOUCH_DOLLY_ROTATE:4096,TOUCH_ZOOM_TRUCK:8192,TOUCH_ZOOM_OFFSET:16384,TOUCH_ZOOM_ROTATE:32768}),ue={NONE:0,IN:1,OUT:-1};function ne(i){return i.isPerspectiveCamera}function ie(i){return i.isOrthographicCamera}var de=Math.PI*2,Et=Math.PI/2,fi=1e-5,xe=Math.PI/180;function Z(i,e,t){return Math.max(e,Math.min(t,i))}function L(i,e=fi){return Math.abs(i)<e}function O(i,e,t=fi){return L(i-e,t)}function wt(i,e){return Math.round(i/e)*e}function ye(i){return isFinite(i)?i:i<0?-Number.MAX_VALUE:Number.MAX_VALUE}function Ce(i){return Math.abs(i)<Number.MAX_VALUE?i:i*(1/0)}function Se(i,e,t,r,s=1/0,n){r=Math.max(1e-4,r);let c=2/r,_=c*n,o=1/(1+_+.48*_*_+.235*_*_*_),p=i-e,m=e,b=s*r;p=Z(p,-b,b),e=i-p;let w=(t.value+c*p)*n;t.value=(t.value-c*w)*o;let h=e+(p+w)*o;return m-i>0==h>m&&(h=m,t.value=(h-m)/n),h}function Pt(i,e,t,r,s=1/0,n,c){r=Math.max(1e-4,r);let _=2/r,o=_*n,p=1/(1+o+.48*o*o+.235*o*o*o),m=e.x,b=e.y,w=e.z,h=i.x-m,z=i.y-b,C=i.z-w,y=m,g=b,a=w,l=s*r,v=l*l,f=h*h+z*z+C*C;if(f>v){let j=Math.sqrt(f);h=h/j*l,z=z/j*l,C=C/j*l}m=i.x-h,b=i.y-z,w=i.z-C;let u=(t.x+_*h)*n,T=(t.y+_*z)*n,E=(t.z+_*C)*n;t.x=(t.x-_*u)*p,t.y=(t.y-_*T)*p,t.z=(t.z-_*E)*p,c.x=m+(h+u)*p,c.y=b+(z+T)*p,c.z=w+(C+E)*p;let S=y-i.x,$=g-i.y,W=a-i.z,R=c.x-y,ae=c.y-g,H=c.z-a;return S*R+$*ae+W*H>0&&(c.x=y,c.y=g,c.z=a,t.x=(c.x-y)/n,t.y=(c.y-g)/n,t.z=(c.z-a)/n),c}function Ve(i,e){e.set(0,0),i.forEach(t=>{e.x+=t.clientX,e.y+=t.clientY}),e.x/=i.length,e.y/=i.length}function Ye(i,e){return ie(i)?(console.warn(`${e} is not supported in OrthographicCamera`),!0):!1}var Ca=class{constructor(){this._listeners={}}addEventListener(i,e){let t=this._listeners;t[i]===void 0&&(t[i]=[]),t[i].indexOf(e)===-1&&t[i].push(e)}hasEventListener(i,e){let t=this._listeners;return t[i]!==void 0&&t[i].indexOf(e)!==-1}removeEventListener(i,e){let t=this._listeners[i];if(t!==void 0){let r=t.indexOf(e);r!==-1&&t.splice(r,1)}}removeAllEventListeners(i){if(!i){this._listeners={};return}Array.isArray(this._listeners[i])&&(this._listeners[i].length=0)}dispatchEvent(i){let e=this._listeners[i.type];if(e!==void 0){i.target=this;let t=e.slice(0);for(let r=0,s=t.length;r<s;r++)t[r].call(this,i)}}},$e,ba="2.9.0",Be=1/8,Ta=/Mac/.test(($e=globalThis?.navigator)===null||$e===void 0?void 0:$e.platform),A,zt,Oe,Ge,V,D,B,fe,be,X,K,oe,At,Dt,G,Te,me,St,We,Bt,qe,Ze,Re,q=class it extends Ca{static install(e){A=e.THREE,zt=Object.freeze(new A.Vector3(0,0,0)),Oe=Object.freeze(new A.Vector3(0,1,0)),Ge=Object.freeze(new A.Vector3(0,0,1)),V=new A.Vector2,D=new A.Vector3,B=new A.Vector3,fe=new A.Vector3,be=new A.Vector3,X=new A.Vector3,K=new A.Vector3,oe=new A.Vector3,At=new A.Vector3,Dt=new A.Vector3,G=new A.Spherical,Te=new A.Spherical,me=new A.Box3,St=new A.Box3,We=new A.Sphere,Bt=new A.Quaternion,qe=new A.Quaternion,Ze=new A.Matrix4,Re=new A.Raycaster}static get ACTION(){return x}constructor(e,t){super(),this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.minDistance=Number.EPSILON,this.maxDistance=1/0,this.infinityDolly=!1,this.minZoom=.01,this.maxZoom=1/0,this.smoothTime=.25,this.draggingSmoothTime=.125,this.maxSpeed=1/0,this.azimuthRotateSpeed=1,this.polarRotateSpeed=1,this.dollySpeed=1,this.dollyDragInverted=!1,this.truckSpeed=2,this.dollyToCursor=!1,this.dragToOffset=!1,this.verticalDragToForward=!1,this.boundaryFriction=0,this.restThreshold=.01,this.colliderMeshes=[],this.cancel=()=>{},this._enabled=!0,this._state=x.NONE,this._viewport=null,this._changedDolly=0,this._changedZoom=0,this._hasRested=!0,this._boundaryEnclosesCamera=!1,this._needsUpdate=!0,this._updatedLastTime=!1,this._elementRect=new DOMRect,this._isDragging=!1,this._dragNeedsUpdate=!0,this._activePointers=[],this._lockedPointer=null,this._interactiveArea=new DOMRect(0,0,1,1),this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._isUserControllingOffset=!1,this._isUserControllingZoom=!1,this._lastDollyDirection=ue.NONE,this._thetaVelocity={value:0},this._phiVelocity={value:0},this._radiusVelocity={value:0},this._targetVelocity=new A.Vector3,this._focalOffsetVelocity=new A.Vector3,this._zoomVelocity={value:0},this._truckInternal=(g,a,l)=>{let v,f;if(ne(this._camera)){let u=D.copy(this._camera.position).sub(this._target),T=this._camera.getEffectiveFOV()*xe,E=u.length()*Math.tan(T*.5);v=this.truckSpeed*g*E/this._elementRect.height,f=this.truckSpeed*a*E/this._elementRect.height}else if(ie(this._camera)){let u=this._camera;v=g*(u.right-u.left)/u.zoom/this._elementRect.width,f=a*(u.top-u.bottom)/u.zoom/this._elementRect.height}else return;this.verticalDragToForward?(l?this.setFocalOffset(this._focalOffsetEnd.x+v,this._focalOffsetEnd.y,this._focalOffsetEnd.z,!0):this.truck(v,0,!0),this.forward(-f,!0)):l?this.setFocalOffset(this._focalOffsetEnd.x+v,this._focalOffsetEnd.y+f,this._focalOffsetEnd.z,!0):this.truck(v,f,!0)},this._rotateInternal=(g,a)=>{let l=de*this.azimuthRotateSpeed*g/this._elementRect.height,v=de*this.polarRotateSpeed*a/this._elementRect.height;this.rotate(l,v,!0)},this._dollyInternal=(g,a,l)=>{let v=Math.pow(.95,-g*this.dollySpeed),f=this._sphericalEnd.radius,u=this._sphericalEnd.radius*v,T=Z(u,this.minDistance,this.maxDistance),E=T-u;this.infinityDolly&&this.dollyToCursor?this._dollyToNoClamp(u,!0):this.infinityDolly&&!this.dollyToCursor?(this.dollyInFixed(E,!0),this._dollyToNoClamp(T,!0)):this._dollyToNoClamp(T,!0),this.dollyToCursor&&(this._changedDolly+=(this.infinityDolly?u:T)-f,this._dollyControlCoord.set(a,l)),this._lastDollyDirection=Math.sign(-g)},this._zoomInternal=(g,a,l)=>{let v=Math.pow(.95,g*this.dollySpeed),f=this._zoom,u=this._zoom*v;this.zoomTo(u,!0),this.dollyToCursor&&(this._changedZoom+=u-f,this._dollyControlCoord.set(a,l))},typeof A>"u"&&console.error("camera-controls: `THREE` is undefined. You must first run `CameraControls.install( { THREE: THREE } )`. Check the docs for further information."),this._camera=e,this._yAxisUpSpace=new A.Quaternion().setFromUnitVectors(this._camera.up,Oe),this._yAxisUpSpaceInverse=this._yAxisUpSpace.clone().invert(),this._state=x.NONE,this._target=new A.Vector3,this._targetEnd=this._target.clone(),this._focalOffset=new A.Vector3,this._focalOffsetEnd=this._focalOffset.clone(),this._spherical=new A.Spherical().setFromVector3(D.copy(this._camera.position).applyQuaternion(this._yAxisUpSpace)),this._sphericalEnd=this._spherical.clone(),this._lastDistance=this._spherical.radius,this._zoom=this._camera.zoom,this._zoomEnd=this._zoom,this._lastZoom=this._zoom,this._nearPlaneCorners=[new A.Vector3,new A.Vector3,new A.Vector3,new A.Vector3],this._updateNearPlaneCorners(),this._boundary=new A.Box3(new A.Vector3(-1/0,-1/0,-1/0),new A.Vector3(1/0,1/0,1/0)),this._cameraUp0=this._camera.up.clone(),this._target0=this._target.clone(),this._position0=this._camera.position.clone(),this._zoom0=this._zoom,this._focalOffset0=this._focalOffset.clone(),this._dollyControlCoord=new A.Vector2,this.mouseButtons={left:x.ROTATE,middle:x.DOLLY,right:x.TRUCK,wheel:ne(this._camera)?x.DOLLY:ie(this._camera)?x.ZOOM:x.NONE},this.touches={one:x.TOUCH_ROTATE,two:ne(this._camera)?x.TOUCH_DOLLY_TRUCK:ie(this._camera)?x.TOUCH_ZOOM_TRUCK:x.NONE,three:x.TOUCH_TRUCK};let r=new A.Vector2,s=new A.Vector2,n=new A.Vector2,c=g=>{if(!this._enabled||!this._domElement)return;if(this._interactiveArea.left!==0||this._interactiveArea.top!==0||this._interactiveArea.width!==1||this._interactiveArea.height!==1){let v=this._domElement.getBoundingClientRect(),f=g.clientX/v.width,u=g.clientY/v.height;if(f<this._interactiveArea.left||f>this._interactiveArea.right||u<this._interactiveArea.top||u>this._interactiveArea.bottom)return}let a=g.pointerType!=="mouse"?null:(g.buttons&F.LEFT)===F.LEFT?F.LEFT:(g.buttons&F.MIDDLE)===F.MIDDLE?F.MIDDLE:(g.buttons&F.RIGHT)===F.RIGHT?F.RIGHT:null;if(a!==null){let v=this._findPointerByMouseButton(a);v&&this._disposePointer(v)}if((g.buttons&F.LEFT)===F.LEFT&&this._lockedPointer)return;let l={pointerId:g.pointerId,clientX:g.clientX,clientY:g.clientY,deltaX:0,deltaY:0,mouseButton:a};this._activePointers.push(l),this._domElement.ownerDocument.removeEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",o),this._domElement.ownerDocument.addEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.addEventListener("pointerup",o),this._isDragging=!0,w(g)},_=g=>{g.cancelable&&g.preventDefault();let a=g.pointerId,l=this._lockedPointer||this._findPointerById(a);if(l){if(l.clientX=g.clientX,l.clientY=g.clientY,l.deltaX=g.movementX,l.deltaY=g.movementY,this._state=0,g.pointerType==="touch")switch(this._activePointers.length){case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else(!this._isDragging&&this._lockedPointer||this._isDragging&&(g.buttons&F.LEFT)===F.LEFT)&&(this._state=this._state|this.mouseButtons.left),this._isDragging&&(g.buttons&F.MIDDLE)===F.MIDDLE&&(this._state=this._state|this.mouseButtons.middle),this._isDragging&&(g.buttons&F.RIGHT)===F.RIGHT&&(this._state=this._state|this.mouseButtons.right);h()}},o=g=>{let a=this._findPointerById(g.pointerId);if(!(a&&a===this._lockedPointer)){if(a&&this._disposePointer(a),g.pointerType==="touch")switch(this._activePointers.length){case 0:this._state=x.NONE;break;case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else this._state=x.NONE;z()}},p=-1,m=g=>{if(!this._domElement||!this._enabled||this.mouseButtons.wheel===x.NONE)return;if(this._interactiveArea.left!==0||this._interactiveArea.top!==0||this._interactiveArea.width!==1||this._interactiveArea.height!==1){let u=this._domElement.getBoundingClientRect(),T=g.clientX/u.width,E=g.clientY/u.height;if(T<this._interactiveArea.left||T>this._interactiveArea.right||E<this._interactiveArea.top||E>this._interactiveArea.bottom)return}if(g.preventDefault(),this.dollyToCursor||this.mouseButtons.wheel===x.ROTATE||this.mouseButtons.wheel===x.TRUCK){let u=performance.now();p-u<1e3&&this._getClientRect(this._elementRect),p=u}let a=Ta?-1:-3,l=g.deltaMode===1?g.deltaY/a:g.deltaY/(a*10),v=this.dollyToCursor?(g.clientX-this._elementRect.x)/this._elementRect.width*2-1:0,f=this.dollyToCursor?(g.clientY-this._elementRect.y)/this._elementRect.height*-2+1:0;switch(this.mouseButtons.wheel){case x.ROTATE:{this._rotateInternal(g.deltaX,g.deltaY),this._isUserControllingRotate=!0;break}case x.TRUCK:{this._truckInternal(g.deltaX,g.deltaY,!1),this._isUserControllingTruck=!0;break}case x.OFFSET:{this._truckInternal(g.deltaX,g.deltaY,!0),this._isUserControllingOffset=!0;break}case x.DOLLY:{this._dollyInternal(-l,v,f),this._isUserControllingDolly=!0;break}case x.ZOOM:{this._zoomInternal(-l,v,f),this._isUserControllingZoom=!0;break}}this.dispatchEvent({type:"control"})},b=g=>{if(!(!this._domElement||!this._enabled)){if(this.mouseButtons.right===it.ACTION.NONE){let a=g instanceof PointerEvent?g.pointerId:0,l=this._findPointerById(a);l&&this._disposePointer(l),this._domElement.ownerDocument.removeEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",o);return}g.preventDefault()}},w=g=>{if(this._enabled){if(Ve(this._activePointers,V),this._getClientRect(this._elementRect),r.copy(V),s.copy(V),this._activePointers.length>=2){let a=V.x-this._activePointers[1].clientX,l=V.y-this._activePointers[1].clientY,v=Math.sqrt(a*a+l*l);n.set(0,v);let f=(this._activePointers[0].clientX+this._activePointers[1].clientX)*.5,u=(this._activePointers[0].clientY+this._activePointers[1].clientY)*.5;s.set(f,u)}if(this._state=0,!g)this._lockedPointer&&(this._state=this._state|this.mouseButtons.left);else if("pointerType"in g&&g.pointerType==="touch")switch(this._activePointers.length){case 1:this._state=this.touches.one;break;case 2:this._state=this.touches.two;break;case 3:this._state=this.touches.three;break}else!this._lockedPointer&&(g.buttons&F.LEFT)===F.LEFT&&(this._state=this._state|this.mouseButtons.left),(g.buttons&F.MIDDLE)===F.MIDDLE&&(this._state=this._state|this.mouseButtons.middle),(g.buttons&F.RIGHT)===F.RIGHT&&(this._state=this._state|this.mouseButtons.right);((this._state&x.ROTATE)===x.ROTATE||(this._state&x.TOUCH_ROTATE)===x.TOUCH_ROTATE||(this._state&x.TOUCH_DOLLY_ROTATE)===x.TOUCH_DOLLY_ROTATE||(this._state&x.TOUCH_ZOOM_ROTATE)===x.TOUCH_ZOOM_ROTATE)&&(this._sphericalEnd.theta=this._spherical.theta,this._sphericalEnd.phi=this._spherical.phi,this._thetaVelocity.value=0,this._phiVelocity.value=0),((this._state&x.TRUCK)===x.TRUCK||(this._state&x.TOUCH_TRUCK)===x.TOUCH_TRUCK||(this._state&x.TOUCH_DOLLY_TRUCK)===x.TOUCH_DOLLY_TRUCK||(this._state&x.TOUCH_ZOOM_TRUCK)===x.TOUCH_ZOOM_TRUCK)&&(this._targetEnd.copy(this._target),this._targetVelocity.set(0,0,0)),((this._state&x.DOLLY)===x.DOLLY||(this._state&x.TOUCH_DOLLY)===x.TOUCH_DOLLY||(this._state&x.TOUCH_DOLLY_TRUCK)===x.TOUCH_DOLLY_TRUCK||(this._state&x.TOUCH_DOLLY_OFFSET)===x.TOUCH_DOLLY_OFFSET||(this._state&x.TOUCH_DOLLY_ROTATE)===x.TOUCH_DOLLY_ROTATE)&&(this._sphericalEnd.radius=this._spherical.radius,this._radiusVelocity.value=0),((this._state&x.ZOOM)===x.ZOOM||(this._state&x.TOUCH_ZOOM)===x.TOUCH_ZOOM||(this._state&x.TOUCH_ZOOM_TRUCK)===x.TOUCH_ZOOM_TRUCK||(this._state&x.TOUCH_ZOOM_OFFSET)===x.TOUCH_ZOOM_OFFSET||(this._state&x.TOUCH_ZOOM_ROTATE)===x.TOUCH_ZOOM_ROTATE)&&(this._zoomEnd=this._zoom,this._zoomVelocity.value=0),((this._state&x.OFFSET)===x.OFFSET||(this._state&x.TOUCH_OFFSET)===x.TOUCH_OFFSET||(this._state&x.TOUCH_DOLLY_OFFSET)===x.TOUCH_DOLLY_OFFSET||(this._state&x.TOUCH_ZOOM_OFFSET)===x.TOUCH_ZOOM_OFFSET)&&(this._focalOffsetEnd.copy(this._focalOffset),this._focalOffsetVelocity.set(0,0,0)),this.dispatchEvent({type:"controlstart"})}},h=()=>{if(!this._enabled||!this._dragNeedsUpdate)return;this._dragNeedsUpdate=!1,Ve(this._activePointers,V);let g=this._domElement&&this._domElement.ownerDocument.pointerLockElement===this._domElement?this._lockedPointer||this._activePointers[0]:null,a=g?-g.deltaX:s.x-V.x,l=g?-g.deltaY:s.y-V.y;if(s.copy(V),((this._state&x.ROTATE)===x.ROTATE||(this._state&x.TOUCH_ROTATE)===x.TOUCH_ROTATE||(this._state&x.TOUCH_DOLLY_ROTATE)===x.TOUCH_DOLLY_ROTATE||(this._state&x.TOUCH_ZOOM_ROTATE)===x.TOUCH_ZOOM_ROTATE)&&(this._rotateInternal(a,l),this._isUserControllingRotate=!0),(this._state&x.DOLLY)===x.DOLLY||(this._state&x.ZOOM)===x.ZOOM){let v=this.dollyToCursor?(r.x-this._elementRect.x)/this._elementRect.width*2-1:0,f=this.dollyToCursor?(r.y-this._elementRect.y)/this._elementRect.height*-2+1:0,u=this.dollyDragInverted?-1:1;(this._state&x.DOLLY)===x.DOLLY?(this._dollyInternal(u*l*Be,v,f),this._isUserControllingDolly=!0):(this._zoomInternal(u*l*Be,v,f),this._isUserControllingZoom=!0)}if((this._state&x.TOUCH_DOLLY)===x.TOUCH_DOLLY||(this._state&x.TOUCH_ZOOM)===x.TOUCH_ZOOM||(this._state&x.TOUCH_DOLLY_TRUCK)===x.TOUCH_DOLLY_TRUCK||(this._state&x.TOUCH_ZOOM_TRUCK)===x.TOUCH_ZOOM_TRUCK||(this._state&x.TOUCH_DOLLY_OFFSET)===x.TOUCH_DOLLY_OFFSET||(this._state&x.TOUCH_ZOOM_OFFSET)===x.TOUCH_ZOOM_OFFSET||(this._state&x.TOUCH_DOLLY_ROTATE)===x.TOUCH_DOLLY_ROTATE||(this._state&x.TOUCH_ZOOM_ROTATE)===x.TOUCH_ZOOM_ROTATE){let v=V.x-this._activePointers[1].clientX,f=V.y-this._activePointers[1].clientY,u=Math.sqrt(v*v+f*f),T=n.y-u;n.set(0,u);let E=this.dollyToCursor?(s.x-this._elementRect.x)/this._elementRect.width*2-1:0,S=this.dollyToCursor?(s.y-this._elementRect.y)/this._elementRect.height*-2+1:0;(this._state&x.TOUCH_DOLLY)===x.TOUCH_DOLLY||(this._state&x.TOUCH_DOLLY_ROTATE)===x.TOUCH_DOLLY_ROTATE||(this._state&x.TOUCH_DOLLY_TRUCK)===x.TOUCH_DOLLY_TRUCK||(this._state&x.TOUCH_DOLLY_OFFSET)===x.TOUCH_DOLLY_OFFSET?(this._dollyInternal(T*Be,E,S),this._isUserControllingDolly=!0):(this._zoomInternal(T*Be,E,S),this._isUserControllingZoom=!0)}((this._state&x.TRUCK)===x.TRUCK||(this._state&x.TOUCH_TRUCK)===x.TOUCH_TRUCK||(this._state&x.TOUCH_DOLLY_TRUCK)===x.TOUCH_DOLLY_TRUCK||(this._state&x.TOUCH_ZOOM_TRUCK)===x.TOUCH_ZOOM_TRUCK)&&(this._truckInternal(a,l,!1),this._isUserControllingTruck=!0),((this._state&x.OFFSET)===x.OFFSET||(this._state&x.TOUCH_OFFSET)===x.TOUCH_OFFSET||(this._state&x.TOUCH_DOLLY_OFFSET)===x.TOUCH_DOLLY_OFFSET||(this._state&x.TOUCH_ZOOM_OFFSET)===x.TOUCH_ZOOM_OFFSET)&&(this._truckInternal(a,l,!0),this._isUserControllingOffset=!0),this.dispatchEvent({type:"control"})},z=()=>{Ve(this._activePointers,V),s.copy(V),this._dragNeedsUpdate=!1,(this._activePointers.length===0||this._activePointers.length===1&&this._activePointers[0]===this._lockedPointer)&&(this._isDragging=!1),this._activePointers.length===0&&this._domElement&&(this._domElement.ownerDocument.removeEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",o),this.dispatchEvent({type:"controlend"}))};this.lockPointer=()=>{!this._enabled||!this._domElement||(this.cancel(),this._lockedPointer={pointerId:-1,clientX:0,clientY:0,deltaX:0,deltaY:0,mouseButton:null},this._activePointers.push(this._lockedPointer),this._domElement.ownerDocument.removeEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",o),this._domElement.requestPointerLock(),this._domElement.ownerDocument.addEventListener("pointerlockchange",C),this._domElement.ownerDocument.addEventListener("pointerlockerror",y),this._domElement.ownerDocument.addEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.addEventListener("pointerup",o),w())},this.unlockPointer=()=>{var g,a,l;this._lockedPointer!==null&&(this._disposePointer(this._lockedPointer),this._lockedPointer=null),(g=this._domElement)===null||g===void 0||g.ownerDocument.exitPointerLock(),(a=this._domElement)===null||a===void 0||a.ownerDocument.removeEventListener("pointerlockchange",C),(l=this._domElement)===null||l===void 0||l.ownerDocument.removeEventListener("pointerlockerror",y),this.cancel()};let C=()=>{this._domElement&&this._domElement.ownerDocument.pointerLockElement===this._domElement||this.unlockPointer()},y=()=>{this.unlockPointer()};this._addAllEventListeners=g=>{this._domElement=g,this._domElement.style.touchAction="none",this._domElement.style.userSelect="none",this._domElement.style.webkitUserSelect="none",this._domElement.addEventListener("pointerdown",c),this._domElement.addEventListener("pointercancel",o),this._domElement.addEventListener("wheel",m,{passive:!1}),this._domElement.addEventListener("contextmenu",b)},this._removeAllEventListeners=()=>{this._domElement&&(this._domElement.style.touchAction="",this._domElement.style.userSelect="",this._domElement.style.webkitUserSelect="",this._domElement.removeEventListener("pointerdown",c),this._domElement.removeEventListener("pointercancel",o),this._domElement.removeEventListener("wheel",m,{passive:!1}),this._domElement.removeEventListener("contextmenu",b),this._domElement.ownerDocument.removeEventListener("pointermove",_,{passive:!1}),this._domElement.ownerDocument.removeEventListener("pointerup",o),this._domElement.ownerDocument.removeEventListener("pointerlockchange",C),this._domElement.ownerDocument.removeEventListener("pointerlockerror",y))},this.cancel=()=>{this._state!==x.NONE&&(this._state=x.NONE,this._activePointers.length=0,z())},t&&this.connect(t),this.update(0)}get camera(){return this._camera}set camera(e){this._camera=e,this.updateCameraUp(),this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0}get enabled(){return this._enabled}set enabled(e){this._enabled=e,this._domElement&&(e?(this._domElement.style.touchAction="none",this._domElement.style.userSelect="none",this._domElement.style.webkitUserSelect="none"):(this.cancel(),this._domElement.style.touchAction="",this._domElement.style.userSelect="",this._domElement.style.webkitUserSelect=""))}get active(){return!this._hasRested}get currentAction(){return this._state}get distance(){return this._spherical.radius}set distance(e){this._spherical.radius===e&&this._sphericalEnd.radius===e||(this._spherical.radius=e,this._sphericalEnd.radius=e,this._needsUpdate=!0)}get azimuthAngle(){return this._spherical.theta}set azimuthAngle(e){this._spherical.theta===e&&this._sphericalEnd.theta===e||(this._spherical.theta=e,this._sphericalEnd.theta=e,this._needsUpdate=!0)}get polarAngle(){return this._spherical.phi}set polarAngle(e){this._spherical.phi===e&&this._sphericalEnd.phi===e||(this._spherical.phi=e,this._sphericalEnd.phi=e,this._needsUpdate=!0)}get boundaryEnclosesCamera(){return this._boundaryEnclosesCamera}set boundaryEnclosesCamera(e){this._boundaryEnclosesCamera=e,this._needsUpdate=!0}set interactiveArea(e){this._interactiveArea.width=Z(e.width,0,1),this._interactiveArea.height=Z(e.height,0,1),this._interactiveArea.x=Z(e.x,0,1-this._interactiveArea.width),this._interactiveArea.y=Z(e.y,0,1-this._interactiveArea.height)}addEventListener(e,t){super.addEventListener(e,t)}removeEventListener(e,t){super.removeEventListener(e,t)}rotate(e,t,r=!1){return this.rotateTo(this._sphericalEnd.theta+e,this._sphericalEnd.phi+t,r)}rotateAzimuthTo(e,t=!1){return this.rotateTo(e,this._sphericalEnd.phi,t)}rotatePolarTo(e,t=!1){return this.rotateTo(this._sphericalEnd.theta,e,t)}rotateTo(e,t,r=!1){this._isUserControllingRotate=!1;let s=Z(e,this.minAzimuthAngle,this.maxAzimuthAngle),n=Z(t,this.minPolarAngle,this.maxPolarAngle);this._sphericalEnd.theta=s,this._sphericalEnd.phi=n,this._sphericalEnd.makeSafe(),this._needsUpdate=!0,r||(this._spherical.theta=this._sphericalEnd.theta,this._spherical.phi=this._sphericalEnd.phi);let c=!r||O(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&O(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold);return this._createOnRestPromise(c)}dolly(e,t=!1){return this.dollyTo(this._sphericalEnd.radius-e,t)}dollyTo(e,t=!1){return this._isUserControllingDolly=!1,this._lastDollyDirection=ue.NONE,this._changedDolly=0,this._dollyToNoClamp(Z(e,this.minDistance,this.maxDistance),t)}_dollyToNoClamp(e,t=!1){let r=this._sphericalEnd.radius;if(this.colliderMeshes.length>=1){let n=this._collisionTest(),c=O(n,this._spherical.radius);if(!(r>e)&&c)return Promise.resolve();this._sphericalEnd.radius=Math.min(e,n)}else this._sphericalEnd.radius=e;this._needsUpdate=!0,t||(this._spherical.radius=this._sphericalEnd.radius);let s=!t||O(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(s)}dollyInFixed(e,t=!1){this._targetEnd.add(this._getCameraDirection(be).multiplyScalar(e)),t||this._target.copy(this._targetEnd);let r=!t||O(this._target.x,this._targetEnd.x,this.restThreshold)&&O(this._target.y,this._targetEnd.y,this.restThreshold)&&O(this._target.z,this._targetEnd.z,this.restThreshold);return this._createOnRestPromise(r)}zoom(e,t=!1){return this.zoomTo(this._zoomEnd+e,t)}zoomTo(e,t=!1){this._isUserControllingZoom=!1,this._zoomEnd=Z(e,this.minZoom,this.maxZoom),this._needsUpdate=!0,t||(this._zoom=this._zoomEnd);let r=!t||O(this._zoom,this._zoomEnd,this.restThreshold);return this._changedZoom=0,this._createOnRestPromise(r)}pan(e,t,r=!1){return console.warn("`pan` has been renamed to `truck`"),this.truck(e,t,r)}truck(e,t,r=!1){this._camera.updateMatrix(),X.setFromMatrixColumn(this._camera.matrix,0),K.setFromMatrixColumn(this._camera.matrix,1),X.multiplyScalar(e),K.multiplyScalar(-t);let s=D.copy(X).add(K),n=B.copy(this._targetEnd).add(s);return this.moveTo(n.x,n.y,n.z,r)}forward(e,t=!1){D.setFromMatrixColumn(this._camera.matrix,0),D.crossVectors(this._camera.up,D),D.multiplyScalar(e);let r=B.copy(this._targetEnd).add(D);return this.moveTo(r.x,r.y,r.z,t)}elevate(e,t=!1){return D.copy(this._camera.up).multiplyScalar(e),this.moveTo(this._targetEnd.x+D.x,this._targetEnd.y+D.y,this._targetEnd.z+D.z,t)}moveTo(e,t,r,s=!1){this._isUserControllingTruck=!1;let n=D.set(e,t,r).sub(this._targetEnd);this._encloseToBoundary(this._targetEnd,n,this.boundaryFriction),this._needsUpdate=!0,s||this._target.copy(this._targetEnd);let c=!s||O(this._target.x,this._targetEnd.x,this.restThreshold)&&O(this._target.y,this._targetEnd.y,this.restThreshold)&&O(this._target.z,this._targetEnd.z,this.restThreshold);return this._createOnRestPromise(c)}lookInDirectionOf(e,t,r,s=!1){let n=D.set(e,t,r).sub(this._targetEnd).normalize().multiplyScalar(-this._sphericalEnd.radius).add(this._targetEnd);return this.setPosition(n.x,n.y,n.z,s)}fitToBox(e,t,{cover:r=!1,paddingLeft:s=0,paddingRight:n=0,paddingBottom:c=0,paddingTop:_=0}={}){let o=[],p=e.isBox3?me.copy(e):me.setFromObject(e);p.isEmpty()&&(console.warn("camera-controls: fitTo() cannot be used with an empty box. Aborting"),Promise.resolve());let m=wt(this._sphericalEnd.theta,Et),b=wt(this._sphericalEnd.phi,Et);o.push(this.rotateTo(m,b,t));let w=D.setFromSpherical(this._sphericalEnd).normalize(),h=Bt.setFromUnitVectors(w,Ge),z=O(Math.abs(w.y),1);z&&h.multiply(qe.setFromAxisAngle(Oe,m)),h.multiply(this._yAxisUpSpaceInverse);let C=St.makeEmpty();B.copy(p.min).applyQuaternion(h),C.expandByPoint(B),B.copy(p.min).setX(p.max.x).applyQuaternion(h),C.expandByPoint(B),B.copy(p.min).setY(p.max.y).applyQuaternion(h),C.expandByPoint(B),B.copy(p.max).setZ(p.min.z).applyQuaternion(h),C.expandByPoint(B),B.copy(p.min).setZ(p.max.z).applyQuaternion(h),C.expandByPoint(B),B.copy(p.max).setY(p.min.y).applyQuaternion(h),C.expandByPoint(B),B.copy(p.max).setX(p.min.x).applyQuaternion(h),C.expandByPoint(B),B.copy(p.max).applyQuaternion(h),C.expandByPoint(B),C.min.x-=s,C.min.y-=c,C.max.x+=n,C.max.y+=_,h.setFromUnitVectors(Ge,w),z&&h.premultiply(qe.invert()),h.premultiply(this._yAxisUpSpace);let y=C.getSize(D),g=C.getCenter(B).applyQuaternion(h);if(ne(this._camera)){let a=this.getDistanceToFitBox(y.x,y.y,y.z,r);o.push(this.moveTo(g.x,g.y,g.z,t)),o.push(this.dollyTo(a,t)),o.push(this.setFocalOffset(0,0,0,t))}else if(ie(this._camera)){let a=this._camera,l=a.right-a.left,v=a.top-a.bottom,f=r?Math.max(l/y.x,v/y.y):Math.min(l/y.x,v/y.y);o.push(this.moveTo(g.x,g.y,g.z,t)),o.push(this.zoomTo(f,t)),o.push(this.setFocalOffset(0,0,0,t))}return Promise.all(o)}fitToSphere(e,t){let r=[],s="isObject3D"in e?it.createBoundingSphere(e,We):We.copy(e);if(r.push(this.moveTo(s.center.x,s.center.y,s.center.z,t)),ne(this._camera)){let n=this.getDistanceToFitSphere(s.radius);r.push(this.dollyTo(n,t))}else if(ie(this._camera)){let n=this._camera.right-this._camera.left,c=this._camera.top-this._camera.bottom,_=2*s.radius,o=Math.min(n/_,c/_);r.push(this.zoomTo(o,t))}return r.push(this.setFocalOffset(0,0,0,t)),Promise.all(r)}setLookAt(e,t,r,s,n,c,_=!1){this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._lastDollyDirection=ue.NONE,this._changedDolly=0;let o=B.set(s,n,c),p=D.set(e,t,r);this._targetEnd.copy(o),this._sphericalEnd.setFromVector3(p.sub(o).applyQuaternion(this._yAxisUpSpace)),this.normalizeRotations(),this._needsUpdate=!0,_||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));let m=!_||O(this._target.x,this._targetEnd.x,this.restThreshold)&&O(this._target.y,this._targetEnd.y,this.restThreshold)&&O(this._target.z,this._targetEnd.z,this.restThreshold)&&O(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&O(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&O(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(m)}lerpLookAt(e,t,r,s,n,c,_,o,p,m,b,w,h,z=!1){this._isUserControllingRotate=!1,this._isUserControllingDolly=!1,this._isUserControllingTruck=!1,this._lastDollyDirection=ue.NONE,this._changedDolly=0;let C=D.set(s,n,c),y=B.set(e,t,r);G.setFromVector3(y.sub(C).applyQuaternion(this._yAxisUpSpace));let g=fe.set(m,b,w),a=B.set(_,o,p);Te.setFromVector3(a.sub(g).applyQuaternion(this._yAxisUpSpace)),this._targetEnd.copy(C.lerp(g,h));let l=Te.theta-G.theta,v=Te.phi-G.phi,f=Te.radius-G.radius;this._sphericalEnd.set(G.radius+f*h,G.phi+v*h,G.theta+l*h),this.normalizeRotations(),this._needsUpdate=!0,z||(this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd));let u=!z||O(this._target.x,this._targetEnd.x,this.restThreshold)&&O(this._target.y,this._targetEnd.y,this.restThreshold)&&O(this._target.z,this._targetEnd.z,this.restThreshold)&&O(this._spherical.theta,this._sphericalEnd.theta,this.restThreshold)&&O(this._spherical.phi,this._sphericalEnd.phi,this.restThreshold)&&O(this._spherical.radius,this._sphericalEnd.radius,this.restThreshold);return this._createOnRestPromise(u)}setPosition(e,t,r,s=!1){return this.setLookAt(e,t,r,this._targetEnd.x,this._targetEnd.y,this._targetEnd.z,s)}setTarget(e,t,r,s=!1){let n=this.getPosition(D),c=this.setLookAt(n.x,n.y,n.z,e,t,r,s);return this._sphericalEnd.phi=Z(this._sphericalEnd.phi,this.minPolarAngle,this.maxPolarAngle),c}setFocalOffset(e,t,r,s=!1){this._isUserControllingOffset=!1,this._focalOffsetEnd.set(e,t,r),this._needsUpdate=!0,s||this._focalOffset.copy(this._focalOffsetEnd);let n=!s||O(this._focalOffset.x,this._focalOffsetEnd.x,this.restThreshold)&&O(this._focalOffset.y,this._focalOffsetEnd.y,this.restThreshold)&&O(this._focalOffset.z,this._focalOffsetEnd.z,this.restThreshold);return this._createOnRestPromise(n)}setOrbitPoint(e,t,r){this._camera.updateMatrixWorld(),X.setFromMatrixColumn(this._camera.matrixWorldInverse,0),K.setFromMatrixColumn(this._camera.matrixWorldInverse,1),oe.setFromMatrixColumn(this._camera.matrixWorldInverse,2);let s=D.set(e,t,r),n=s.distanceTo(this._camera.position),c=s.sub(this._camera.position);X.multiplyScalar(c.x),K.multiplyScalar(c.y),oe.multiplyScalar(c.z),D.copy(X).add(K).add(oe),D.z=D.z+n,this.dollyTo(n,!1),this.setFocalOffset(-D.x,D.y,-D.z,!1),this.moveTo(e,t,r,!1)}setBoundary(e){if(!e){this._boundary.min.set(-1/0,-1/0,-1/0),this._boundary.max.set(1/0,1/0,1/0),this._needsUpdate=!0;return}this._boundary.copy(e),this._boundary.clampPoint(this._targetEnd,this._targetEnd),this._needsUpdate=!0}setViewport(e,t,r,s){if(e===null){this._viewport=null;return}this._viewport=this._viewport||new A.Vector4,typeof e=="number"?this._viewport.set(e,t,r,s):this._viewport.copy(e)}getDistanceToFitBox(e,t,r,s=!1){if(Ye(this._camera,"getDistanceToFitBox"))return this._spherical.radius;let n=e/t,c=this._camera.getEffectiveFOV()*xe,_=this._camera.aspect;return((s?n>_:n<_)?t:e/_)*.5/Math.tan(c*.5)+r*.5}getDistanceToFitSphere(e){if(Ye(this._camera,"getDistanceToFitSphere"))return this._spherical.radius;let t=this._camera.getEffectiveFOV()*xe,r=Math.atan(Math.tan(t*.5)*this._camera.aspect)*2,s=1<this._camera.aspect?t:r;return e/Math.sin(s*.5)}getTarget(e,t=!0){return(e&&e.isVector3?e:new A.Vector3).copy(t?this._targetEnd:this._target)}getPosition(e,t=!0){return(e&&e.isVector3?e:new A.Vector3).setFromSpherical(t?this._sphericalEnd:this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(t?this._targetEnd:this._target)}getSpherical(e,t=!0){return(e||new A.Spherical).copy(t?this._sphericalEnd:this._spherical)}getFocalOffset(e,t=!0){return(e&&e.isVector3?e:new A.Vector3).copy(t?this._focalOffsetEnd:this._focalOffset)}normalizeRotations(){this._sphericalEnd.theta=this._sphericalEnd.theta%de,this._sphericalEnd.theta<0&&(this._sphericalEnd.theta+=de),this._spherical.theta+=de*Math.round((this._sphericalEnd.theta-this._spherical.theta)/de)}stop(){this._focalOffset.copy(this._focalOffsetEnd),this._target.copy(this._targetEnd),this._spherical.copy(this._sphericalEnd),this._zoom=this._zoomEnd}reset(e=!1){if(!O(this._camera.up.x,this._cameraUp0.x)||!O(this._camera.up.y,this._cameraUp0.y)||!O(this._camera.up.z,this._cameraUp0.z)){this._camera.up.copy(this._cameraUp0);let r=this.getPosition(D);this.updateCameraUp(),this.setPosition(r.x,r.y,r.z)}let t=[this.setLookAt(this._position0.x,this._position0.y,this._position0.z,this._target0.x,this._target0.y,this._target0.z,e),this.setFocalOffset(this._focalOffset0.x,this._focalOffset0.y,this._focalOffset0.z,e),this.zoomTo(this._zoom0,e)];return Promise.all(t)}saveState(){this._cameraUp0.copy(this._camera.up),this.getTarget(this._target0),this.getPosition(this._position0),this._zoom0=this._zoom,this._focalOffset0.copy(this._focalOffset)}updateCameraUp(){this._yAxisUpSpace.setFromUnitVectors(this._camera.up,Oe),this._yAxisUpSpaceInverse.copy(this._yAxisUpSpace).invert()}applyCameraUp(){let e=D.subVectors(this._target,this._camera.position).normalize(),t=B.crossVectors(e,this._camera.up);this._camera.up.crossVectors(t,e).normalize(),this._camera.updateMatrixWorld();let r=this.getPosition(D);this.updateCameraUp(),this.setPosition(r.x,r.y,r.z)}update(e){let t=this._sphericalEnd.theta-this._spherical.theta,r=this._sphericalEnd.phi-this._spherical.phi,s=this._sphericalEnd.radius-this._spherical.radius,n=At.subVectors(this._targetEnd,this._target),c=Dt.subVectors(this._focalOffsetEnd,this._focalOffset),_=this._zoomEnd-this._zoom;if(L(t))this._thetaVelocity.value=0,this._spherical.theta=this._sphericalEnd.theta;else{let m=this._isUserControllingRotate?this.draggingSmoothTime:this.smoothTime;this._spherical.theta=Se(this._spherical.theta,this._sphericalEnd.theta,this._thetaVelocity,m,1/0,e),this._needsUpdate=!0}if(L(r))this._phiVelocity.value=0,this._spherical.phi=this._sphericalEnd.phi;else{let m=this._isUserControllingRotate?this.draggingSmoothTime:this.smoothTime;this._spherical.phi=Se(this._spherical.phi,this._sphericalEnd.phi,this._phiVelocity,m,1/0,e),this._needsUpdate=!0}if(L(s))this._radiusVelocity.value=0,this._spherical.radius=this._sphericalEnd.radius;else{let m=this._isUserControllingDolly?this.draggingSmoothTime:this.smoothTime;this._spherical.radius=Se(this._spherical.radius,this._sphericalEnd.radius,this._radiusVelocity,m,this.maxSpeed,e),this._needsUpdate=!0}if(L(n.x)&&L(n.y)&&L(n.z))this._targetVelocity.set(0,0,0),this._target.copy(this._targetEnd);else{let m=this._isUserControllingTruck?this.draggingSmoothTime:this.smoothTime;Pt(this._target,this._targetEnd,this._targetVelocity,m,this.maxSpeed,e,this._target),this._needsUpdate=!0}if(L(c.x)&&L(c.y)&&L(c.z))this._focalOffsetVelocity.set(0,0,0),this._focalOffset.copy(this._focalOffsetEnd);else{let m=this._isUserControllingOffset?this.draggingSmoothTime:this.smoothTime;Pt(this._focalOffset,this._focalOffsetEnd,this._focalOffsetVelocity,m,this.maxSpeed,e,this._focalOffset),this._needsUpdate=!0}if(L(_))this._zoomVelocity.value=0,this._zoom=this._zoomEnd;else{let m=this._isUserControllingZoom?this.draggingSmoothTime:this.smoothTime;this._zoom=Se(this._zoom,this._zoomEnd,this._zoomVelocity,m,1/0,e)}if(this.dollyToCursor){if(ne(this._camera)&&this._changedDolly!==0){let m=this._spherical.radius-this._lastDistance,b=this._camera,w=this._getCameraDirection(be),h=D.copy(w).cross(b.up).normalize();h.lengthSq()===0&&(h.x=1);let z=B.crossVectors(h,w),C=this._sphericalEnd.radius*Math.tan(b.getEffectiveFOV()*xe*.5),y=(this._sphericalEnd.radius-m-this._sphericalEnd.radius)/this._sphericalEnd.radius,g=fe.copy(this._targetEnd).add(h.multiplyScalar(this._dollyControlCoord.x*C*b.aspect)).add(z.multiplyScalar(this._dollyControlCoord.y*C)),a=D.copy(this._targetEnd).lerp(g,y),l=this._lastDollyDirection===ue.IN&&this._spherical.radius<=this.minDistance,v=this._lastDollyDirection===ue.OUT&&this.maxDistance<=this._spherical.radius;if(this.infinityDolly&&(l||v)){this._sphericalEnd.radius-=m,this._spherical.radius-=m;let u=B.copy(w).multiplyScalar(-m);a.add(u)}this._boundary.clampPoint(a,a);let f=B.subVectors(a,this._targetEnd);this._targetEnd.copy(a),this._target.add(f),this._changedDolly-=m,L(this._changedDolly)&&(this._changedDolly=0)}else if(ie(this._camera)&&this._changedZoom!==0){let m=this._zoom-this._lastZoom,b=this._camera,w=D.set(this._dollyControlCoord.x,this._dollyControlCoord.y,(b.near+b.far)/(b.near-b.far)).unproject(b),h=B.set(0,0,-1).applyQuaternion(b.quaternion),z=fe.copy(w).add(h.multiplyScalar(-w.dot(b.up))),C=-(this._zoom-m-this._zoom)/this._zoom,y=this._getCameraDirection(be),g=this._targetEnd.dot(y),a=D.copy(this._targetEnd).lerp(z,C),l=a.dot(y),v=y.multiplyScalar(l-g);a.sub(v),this._boundary.clampPoint(a,a);let f=B.subVectors(a,this._targetEnd);this._targetEnd.copy(a),this._target.add(f),this._changedZoom-=m,L(this._changedZoom)&&(this._changedZoom=0)}}this._camera.zoom!==this._zoom&&(this._camera.zoom=this._zoom,this._camera.updateProjectionMatrix(),this._updateNearPlaneCorners(),this._needsUpdate=!0),this._dragNeedsUpdate=!0;let o=this._collisionTest();this._spherical.radius=Math.min(this._spherical.radius,o),this._spherical.makeSafe(),this._camera.position.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(this._target),this._camera.lookAt(this._target),(!L(this._focalOffset.x)||!L(this._focalOffset.y)||!L(this._focalOffset.z))&&(this._camera.updateMatrixWorld(),X.setFromMatrixColumn(this._camera.matrix,0),K.setFromMatrixColumn(this._camera.matrix,1),oe.setFromMatrixColumn(this._camera.matrix,2),X.multiplyScalar(this._focalOffset.x),K.multiplyScalar(-this._focalOffset.y),oe.multiplyScalar(this._focalOffset.z),D.copy(X).add(K).add(oe),this._camera.position.add(D)),this._boundaryEnclosesCamera&&this._encloseToBoundary(this._camera.position.copy(this._target),D.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse),1);let p=this._needsUpdate;return p&&!this._updatedLastTime?(this._hasRested=!1,this.dispatchEvent({type:"wake"}),this.dispatchEvent({type:"update"})):p?(this.dispatchEvent({type:"update"}),L(t,this.restThreshold)&&L(r,this.restThreshold)&&L(s,this.restThreshold)&&L(n.x,this.restThreshold)&&L(n.y,this.restThreshold)&&L(n.z,this.restThreshold)&&L(c.x,this.restThreshold)&&L(c.y,this.restThreshold)&&L(c.z,this.restThreshold)&&L(_,this.restThreshold)&&!this._hasRested&&(this._hasRested=!0,this.dispatchEvent({type:"rest"}))):!p&&this._updatedLastTime&&this.dispatchEvent({type:"sleep"}),this._lastDistance=this._spherical.radius,this._lastZoom=this._zoom,this._updatedLastTime=p,this._needsUpdate=!1,p}toJSON(){return JSON.stringify({enabled:this._enabled,minDistance:this.minDistance,maxDistance:ye(this.maxDistance),minZoom:this.minZoom,maxZoom:ye(this.maxZoom),minPolarAngle:this.minPolarAngle,maxPolarAngle:ye(this.maxPolarAngle),minAzimuthAngle:ye(this.minAzimuthAngle),maxAzimuthAngle:ye(this.maxAzimuthAngle),smoothTime:this.smoothTime,draggingSmoothTime:this.draggingSmoothTime,dollySpeed:this.dollySpeed,truckSpeed:this.truckSpeed,dollyToCursor:this.dollyToCursor,verticalDragToForward:this.verticalDragToForward,target:this._targetEnd.toArray(),position:D.setFromSpherical(this._sphericalEnd).add(this._targetEnd).toArray(),zoom:this._zoomEnd,focalOffset:this._focalOffsetEnd.toArray(),target0:this._target0.toArray(),position0:this._position0.toArray(),zoom0:this._zoom0,focalOffset0:this._focalOffset0.toArray()})}fromJSON(e,t=!1){let r=JSON.parse(e);this.enabled=r.enabled,this.minDistance=r.minDistance,this.maxDistance=Ce(r.maxDistance),this.minZoom=r.minZoom,this.maxZoom=Ce(r.maxZoom),this.minPolarAngle=r.minPolarAngle,this.maxPolarAngle=Ce(r.maxPolarAngle),this.minAzimuthAngle=Ce(r.minAzimuthAngle),this.maxAzimuthAngle=Ce(r.maxAzimuthAngle),this.smoothTime=r.smoothTime,this.draggingSmoothTime=r.draggingSmoothTime,this.dollySpeed=r.dollySpeed,this.truckSpeed=r.truckSpeed,this.dollyToCursor=r.dollyToCursor,this.verticalDragToForward=r.verticalDragToForward,this._target0.fromArray(r.target0),this._position0.fromArray(r.position0),this._zoom0=r.zoom0,this._focalOffset0.fromArray(r.focalOffset0),this.moveTo(r.target[0],r.target[1],r.target[2],t),G.setFromVector3(D.fromArray(r.position).sub(this._targetEnd).applyQuaternion(this._yAxisUpSpace)),this.rotateTo(G.theta,G.phi,t),this.dollyTo(G.radius,t),this.zoomTo(r.zoom,t),this.setFocalOffset(r.focalOffset[0],r.focalOffset[1],r.focalOffset[2],t),this._needsUpdate=!0}connect(e){if(this._domElement){console.warn("camera-controls is already connected.");return}e.setAttribute("data-camera-controls-version",ba),this._addAllEventListeners(e),this._getClientRect(this._elementRect)}disconnect(){this.cancel(),this._removeAllEventListeners(),this._domElement&&(this._domElement.removeAttribute("data-camera-controls-version"),this._domElement=void 0)}dispose(){this.removeAllEventListeners(),this.disconnect()}_getTargetDirection(e){return e.setFromSpherical(this._spherical).divideScalar(this._spherical.radius).applyQuaternion(this._yAxisUpSpaceInverse)}_getCameraDirection(e){return this._getTargetDirection(e).negate()}_findPointerById(e){return this._activePointers.find(t=>t.pointerId===e)}_findPointerByMouseButton(e){return this._activePointers.find(t=>t.mouseButton===e)}_disposePointer(e){this._activePointers.splice(this._activePointers.indexOf(e),1)}_encloseToBoundary(e,t,r){let s=t.lengthSq();if(s===0)return e;let n=B.copy(t).add(e),c=this._boundary.clampPoint(n,fe).sub(n),_=c.lengthSq();if(_===0)return e.add(t);if(_===s)return e;if(r===0)return e.add(t).add(c);{let o=1+r*_/t.dot(c);return e.add(B.copy(t).multiplyScalar(o)).add(c.multiplyScalar(1-r))}}_updateNearPlaneCorners(){if(ne(this._camera)){let e=this._camera,t=e.near,r=e.getEffectiveFOV()*xe,s=Math.tan(r*.5)*t,n=s*e.aspect;this._nearPlaneCorners[0].set(-n,-s,0),this._nearPlaneCorners[1].set(n,-s,0),this._nearPlaneCorners[2].set(n,s,0),this._nearPlaneCorners[3].set(-n,s,0)}else if(ie(this._camera)){let e=this._camera,t=1/e.zoom,r=e.left*t,s=e.right*t,n=e.top*t,c=e.bottom*t;this._nearPlaneCorners[0].set(r,n,0),this._nearPlaneCorners[1].set(s,n,0),this._nearPlaneCorners[2].set(s,c,0),this._nearPlaneCorners[3].set(r,c,0)}}_collisionTest(){let e=1/0;if(!(this.colliderMeshes.length>=1)||Ye(this._camera,"_collisionTest"))return e;let t=this._getTargetDirection(be);Ze.lookAt(zt,t,this._camera.up);for(let r=0;r<4;r++){let s=B.copy(this._nearPlaneCorners[r]);s.applyMatrix4(Ze);let n=fe.addVectors(this._target,s);Re.set(n,t),Re.far=this._spherical.radius+1;let c=Re.intersectObjects(this.colliderMeshes);c.length!==0&&c[0].distance<e&&(e=c[0].distance)}return e}_getClientRect(e){if(!this._domElement)return;let t=this._domElement.getBoundingClientRect();return e.x=t.left,e.y=t.top,this._viewport?(e.x+=this._viewport.x,e.y+=t.height-this._viewport.w-this._viewport.y,e.width=this._viewport.z,e.height=this._viewport.w):(e.width=t.width,e.height=t.height),e}_createOnRestPromise(e){return e?Promise.resolve():(this._hasRested=!1,this.dispatchEvent({type:"transitionstart"}),new Promise(t=>{let r=()=>{this.removeEventListener("rest",r),t()};this.addEventListener("rest",r)}))}_addAllEventListeners(e){}_removeAllEventListeners(){}get dampingFactor(){return console.warn(".dampingFactor has been deprecated. use smoothTime (in seconds) instead."),0}set dampingFactor(e){console.warn(".dampingFactor has been deprecated. use smoothTime (in seconds) instead.")}get draggingDampingFactor(){return console.warn(".draggingDampingFactor has been deprecated. use draggingSmoothTime (in seconds) instead."),0}set draggingDampingFactor(e){console.warn(".draggingDampingFactor has been deprecated. use draggingSmoothTime (in seconds) instead.")}static createBoundingSphere(e,t=new A.Sphere){let r=t,s=r.center;me.makeEmpty(),e.traverseVisible(c=>{c.isMesh&&me.expandByObject(c)}),me.getCenter(s);let n=0;return e.traverseVisible(c=>{if(!c.isMesh)return;let _=c,o=_.geometry.clone();o.applyMatrix4(_.matrixWorld);let p=o.attributes.position;for(let m=0,b=p.count;m<b;m++)D.fromBufferAttribute(p,m),n=Math.max(n,s.distanceToSquared(D))}),r.radius=Math.sqrt(n),r}};function Ea(i){var e=i,{smoothTime:t=.05}=e,r=se(e,["smoothTime"]);q.install({THREE:Si}),pi({CameraControls:q});let s=I(p=>p.camera),n=I(p=>p.gl),c=ya(r),[_,o]=P.useState(!1);return P.useEffect(()=>{let p=c.current;if(!p)return;let{type:m,onCameraUpdate:b}=r||{};if(!b)return;let w=g=>Math.round(g*180/Math.PI),h=()=>({cAzimuthAngle:w(p.azimuthAngle),cPolarAngle:w(p.polarAngle)}),z=()=>{var g;let a={};if(m==="sphere"){let l=p?.zoom;if(Number.isFinite(l))a.cameraZoom=Number(l.toFixed(2));else{let v=(g=p?.camera)==null?void 0:g.zoom;Number.isFinite(v)&&(a.cameraZoom=Number(v.toFixed(2)))}}else Number.isFinite(p.distance)&&(a.cDistance=Number(p.distance.toFixed(2)));return a},C=()=>{o(!0)},y=()=>{o(!1),b(N(N({},h()),z()))};return p.addEventListener("controlstart",C),p.addEventListener("rest",y),()=>{p.removeEventListener("controlstart",C),p.removeEventListener("rest",y)}},[c,r]),d.jsx("cameraControls",{ref:c,args:[s,n.domElement],smoothTime:_?0:t,zoomSpeed:10,dollySpeed:5,maxDistance:1e3,restThreshold:.01,mouseButtons:{left:q.ACTION.ROTATE,middle:r.type==="sphere"?q.ACTION.ZOOM:q.ACTION.DOLLY,right:q.ACTION.NONE,wheel:r.type==="sphere"?q.ACTION.ZOOM:q.ACTION.DOLLY},touches:{one:q.ACTION.ROTATE,two:q.ACTION.NONE,three:q.ACTION.NONE}})}function wa(i){return d.jsx(d.Fragment,{children:d.jsx(Ea,N({},i))})}var Pa=class extends Bi{constructor(i){super(i),this.type=Ee}parse(i){let e=function(y,g){switch(y){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(g||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(g||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(g||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(g||""))}},t=`
`,r=function(y,g,a){g=g||1024;let l=y.pos,v=-1,f=0,u="",T=String.fromCharCode.apply(null,new Uint16Array(y.subarray(l,l+128)));for(;0>(v=T.indexOf(t))&&f<g&&l<y.byteLength;)u+=T,f+=T.length,l+=128,T+=String.fromCharCode.apply(null,new Uint16Array(y.subarray(l,l+128)));return-1<v?(y.pos+=f+v+1,u+T.slice(0,v)):!1},s=function(y){let g=/^#\?(\S+)/,a=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,l=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,v=/^\s*FORMAT=(\S+)\s*$/,f=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,u={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},T,E;for((y.pos>=y.byteLength||!(T=r(y)))&&e(1,"no header found"),(E=T.match(g))||e(3,"bad initial token"),u.valid|=1,u.programtype=E[1],u.string+=T+`
`;T=r(y),T!==!1;){if(u.string+=T+`
`,T.charAt(0)==="#"){u.comments+=T+`
`;continue}if((E=T.match(a))&&(u.gamma=parseFloat(E[1])),(E=T.match(l))&&(u.exposure=parseFloat(E[1])),(E=T.match(v))&&(u.valid|=2,u.format=E[1]),(E=T.match(f))&&(u.valid|=4,u.height=parseInt(E[1],10),u.width=parseInt(E[2],10)),u.valid&2&&u.valid&4)break}return u.valid&2||e(3,"missing format specifier"),u.valid&4||e(3,"missing image size specifier"),u},n=function(y,g,a){let l=g;if(l<8||l>32767||y[0]!==2||y[1]!==2||y[2]&128)return new Uint8Array(y);l!==(y[2]<<8|y[3])&&e(3,"wrong scanline width");let v=new Uint8Array(4*g*a);v.length||e(4,"unable to allocate buffer space");let f=0,u=0,T=4*l,E=new Uint8Array(4),S=new Uint8Array(T),$=a;for(;$>0&&u<y.byteLength;){u+4>y.byteLength&&e(1),E[0]=y[u++],E[1]=y[u++],E[2]=y[u++],E[3]=y[u++],(E[0]!=2||E[1]!=2||(E[2]<<8|E[3])!=l)&&e(3,"bad rgbe scanline format");let W=0,R;for(;W<T&&u<y.byteLength;){R=y[u++];let H=R>128;if(H&&(R-=128),(R===0||W+R>T)&&e(3,"bad scanline data"),H){let j=y[u++];for(let ft=0;ft<R;ft++)S[W++]=j}else S.set(y.subarray(u,u+R),W),W+=R,u+=R}let ae=l;for(let H=0;H<ae;H++){let j=0;v[f]=S[H+j],j+=l,v[f+1]=S[H+j],j+=l,v[f+2]=S[H+j],j+=l,v[f+3]=S[H+j],f+=4}$--}return v},c=function(y,g,a,l){let v=y[g+3],f=Math.pow(2,v-128)/255;a[l+0]=y[g+0]*f,a[l+1]=y[g+1]*f,a[l+2]=y[g+2]*f,a[l+3]=1},_=function(y,g,a,l){let v=y[g+3],f=Math.pow(2,v-128)/255;a[l+0]=Ae.toHalfFloat(Math.min(y[g+0]*f,65504)),a[l+1]=Ae.toHalfFloat(Math.min(y[g+1]*f,65504)),a[l+2]=Ae.toHalfFloat(Math.min(y[g+2]*f,65504)),a[l+3]=Ae.toHalfFloat(1)},o=new Uint8Array(i);o.pos=0;let p=s(o),m=p.width,b=p.height,w=n(o.subarray(o.pos),m,b),h,z,C;switch(this.type){case je:C=w.length/4;let y=new Float32Array(C*4);for(let a=0;a<C;a++)c(w,a*4,y,a*4);h=y,z=je;break;case Ee:C=w.length/4;let g=new Uint16Array(C*4);for(let a=0;a<C;a++)_(w,a*4,g,a*4);h=g,z=Ee;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:m,height:b,data:h,header:p.string,gamma:p.gamma,exposure:p.exposure,type:z}}setDataType(i){return this.type=i,this}load(i,e,t,r){function s(n,c){switch(n.type){case je:case Ee:"colorSpace"in n?n.colorSpace="srgb-linear":n.encoding=3e3,n.minFilter=Q,n.magFilter=Q,n.generateMipmaps=!1,n.flipY=!0;break}e&&e(n,c)}return super.load(i,s,t,r)}};new Vt;function Xe(i,{path:e}){return hi(Pa,i,t=>t.setPath(e))}var za=P.createContext({}),Aa=()=>P.useContext(za),Da=i=>i.current&&i.current.isScene,Sa=i=>Da(i)?i.current:i;function Ba({background:i=!1,envPreset:e}){let{envBasePath:t}=Aa(),r=t||xa,s=Xe("city.hdr",{path:r}),n=Xe("dawn.hdr",{path:r}),c=Xe("lobby.hdr",{path:r}),_={city:s,dawn:n,lobby:c}[e],o=I(m=>m.scene);yi.useLayoutEffect(()=>{if(_){let m=Sa(o);m.background;let b=m.environment;return i!=="only"&&(m.environment=_),i&&(m.background=_),()=>{i!=="only"&&(m.environment=b),i&&(m.background="black")}}},[o,_,i]);let p=_;return p.mapping=Oi,null}function Oa({lightType:i,brightness:e,envPreset:t}){return d.jsxs(d.Fragment,{children:[i==="3d"&&d.jsx("ambientLight",{intensity:(e||1)*Math.PI}),i==="env"&&d.jsx(P.Suspense,{fallback:d.jsx(Ra,{}),children:d.jsx(Ba,{envPreset:t,background:!1,loadingCallback:()=>{}})})]})}function Ra(){return d.jsx("ambientLight",{intensity:.4})}function La(i,e){let t=I(s=>s.pointer),[r]=P.useState(()=>{let s=new Ri;return function(n,c){s.setFromCamera(t,i instanceof Li?i:i.current);let _=this.constructor.prototype.raycast.bind(this);_&&_(s,c)}});return r}function Na(i,e,t){let{gl:r,size:s,viewport:n}=I(),c=typeof i=="number"?i:s.width*n.dpr,_=s.height*n.dpr,o=(typeof i=="number"?t:i)||{},{samples:p}=o,m=se(o,["samples"]),b=P.useMemo(()=>{let w;return w=new Ht(c,_,N({minFilter:Q,magFilter:Q,encoding:r.outputEncoding,type:Ee},m)),w.samples=p,w},[]);return P.useLayoutEffect(()=>{b.setSize(c,_),p&&(b.samples=p)},[p,b,c,_]),P.useEffect(()=>()=>b.dispose(),[]),b}function Fa(i,e){if(typeof i=="function")return i(e);i&&(i.current=e)}function Ua(i){return e=>{for(let t of i)Fa(t,e)}}var Ia=i=>typeof i=="function",Ma=P.forwardRef((i,e)=>{var t=i,{envMap:r,resolution:s=256,frames:n=1/0,children:c,makeDefault:_}=t,o=se(t,["envMap","resolution","frames","children","makeDefault"]);let p=I(({set:a})=>a),m=I(({camera:a})=>a),b=I(({size:a})=>a),w=P.useRef(null),h=P.useRef(null),z=Na(s);P.useLayoutEffect(()=>{o.manual||w.current.updateProjectionMatrix()},[b,o]),P.useLayoutEffect(()=>{w.current.updateProjectionMatrix()}),P.useLayoutEffect(()=>{if(_){let a=m;return p(()=>({camera:w.current})),()=>p(()=>({camera:a}))}},[w,_,p]);let C=0,y=null,g=Ia(c);return ee(a=>{g&&(n===1/0||C<n)&&(h.current.visible=!1,a.gl.setRenderTarget(z),y=a.scene.background,r&&(a.scene.background=r),a.gl.render(a.scene,w.current),a.scene.background=y,a.gl.setRenderTarget(null),h.current.visible=!0,C++)}),d.jsxs(d.Fragment,{children:[d.jsx("orthographicCamera",Pe(N({left:b.width/-2,right:b.width/2,top:b.height/2,bottom:b.height/-2,ref:Ua([w,e])},o),{children:!g&&c})),d.jsx("group",{ref:h,children:g&&c(z.texture)})]})}),mi=P.createContext({}),ka=()=>P.useContext(mi),ja=2*Math.PI,Ot=new Fi,Rt=new Vt,[ve,Ke]=[new vt,new vt],Lt=new Le,Nt=new Le,Ha=i=>"minPolarAngle"in i,Va=({alignment:i="bottom-right",margin:e=[80,80],renderPriority:t=0,autoClear:r=!0,onUpdate:s,onTarget:n,children:c})=>{let _=I(({size:R})=>R),o=I(({camera:R})=>R),p=I(({controls:R})=>R),m=I(({gl:R})=>R),b=I(({scene:R})=>R),w=I(({invalidate:R})=>R),h=P.useRef(),z=P.useRef(),C=P.useRef(null),[y]=P.useState(()=>new Ni),g=P.useRef(!1),a=P.useRef(0),l=P.useRef(new Le(0,0,0)),v=P.useRef(new Le(0,0,0));P.useEffect(()=>{v.current.copy(o.up)},[o]);let f=P.useCallback(R=>{g.current=!0,(p||n)&&(l.current=p?.target||n?.()),a.current=o.position.distanceTo(Lt),ve.copy(o.quaternion),Nt.copy(R).multiplyScalar(a.current).add(Lt),Ot.lookAt(Nt),Ke.copy(Ot.quaternion),w()},[p,o,n,w]);P.useEffect(()=>(b.background&&(h.current=b.background,b.background=null,y.background=h.current),()=>{h.current&&(b.background=h.current)}),[]),ee((R,ae)=>{var H;if(C.current&&z.current){if(g.current)if(ve.angleTo(Ke)<.01)g.current=!1,Ha(p)&&o.up.copy(v.current);else{let j=ae*ja;ve.rotateTowards(Ke,j),o.position.set(0,0,1).applyQuaternion(ve).multiplyScalar(a.current).add(l.current),o.up.set(0,1,0).applyQuaternion(ve).normalize(),o.quaternion.copy(ve),s?s():p&&p.update(),w()}Rt.copy(o.matrix).invert(),(H=z.current)==null||H.quaternion.setFromRotationMatrix(Rt),r&&(m.autoClear=!1),m.clearDepth(),m.render(y,C.current)}},t);let u=La(C),T=P.useMemo(()=>({tweenCamera:f,raycast:u}),[f]),[E,S]=e,$=i.endsWith("-center")?0:i.endsWith("-left")?-_.width/2+E:_.width/2-E,W=i.startsWith("center-")?0:i.startsWith("top-")?_.height/2-S:-_.height/2+S;return _i(d.jsxs(mi.Provider,{value:T,children:[d.jsx(Ma,{ref:C,position:[0,0,200]}),d.jsx("group",{ref:z,position:[$,W,0],children:c})]}),y)};function Qe({scale:i=[.8,.05,.05],color:e,rotation:t}){return d.jsx("group",{rotation:t,children:d.jsxs("mesh",{position:[.4,0,0],children:[d.jsx("boxGeometry",{args:i}),d.jsx("meshBasicMaterial",{color:e,toneMapped:!1})]})})}function ge(i){var e=i,{onClick:t,font:r,disabled:s,arcStyle:n,label:c,labelColor:_,axisHeadScale:o=1}=e,p=se(e,["onClick","font","disabled","arcStyle","label","labelColor","axisHeadScale"]);let m=I(C=>C.gl),b=P.useMemo(()=>{let C=document.createElement("canvas");C.width=64,C.height=64;let y=C.getContext("2d");return y.beginPath(),y.arc(32,32,16,0,2*Math.PI),y.closePath(),y.fillStyle=n,y.fill(),c&&(y.font=r,y.textAlign="center",y.fillStyle=_,y.fillText(c,32,41)),new st(C)},[n,c,_,r]),[w,h]=P.useState(!1),z=(c?1:.75)*(w?1.2:1)*o;return d.jsx("sprite",Pe(N({scale:z,onPointerOver:s?void 0:C=>{C.stopPropagation(),h(!0)},onPointerOut:s?void 0:t||(C=>{C.stopPropagation(),h(!1)})},p),{children:d.jsx("spriteMaterial",{map:b,"map-encoding":m.outputEncoding,"map-anisotropy":m.capabilities.getMaxAnisotropy()||1,alphaTest:.3,opacity:c?1:.75,toneMapped:!1})}))}var Ya=i=>{var e=i,{hideNegativeAxes:t,hideAxisHeads:r,disabled:s,font:n="18px Inter var, Arial, sans-serif",axisColors:c=["#ff2060","#20df80","#2080ff"],axisHeadScale:_=1,axisScale:o,labels:p=["X","Y","Z"],labelColor:m="#000",onClick:b}=e,w=se(e,["hideNegativeAxes","hideAxisHeads","disabled","font","axisColors","axisHeadScale","axisScale","labels","labelColor","onClick"]);let[h,z,C]=c,{tweenCamera:y,raycast:g}=ka(),a={font:n,disabled:s,labelColor:m,raycast:g,onClick:b,axisHeadScale:_,onPointerDown:s?void 0:l=>{y(l.object.position),l.stopPropagation()}};return d.jsxs("group",Pe(N({scale:40},w),{children:[d.jsx(Qe,{color:h,rotation:[0,0,0],scale:o}),d.jsx(Qe,{color:z,rotation:[0,0,Math.PI/2],scale:o}),d.jsx(Qe,{color:C,rotation:[0,-Math.PI/2,0],scale:o}),!r&&d.jsxs(d.Fragment,{children:[d.jsx(ge,N({arcStyle:h,position:[1,0,0],label:p[0]},a)),d.jsx(ge,N({arcStyle:z,position:[0,1,0],label:p[1]},a)),d.jsx(ge,N({arcStyle:C,position:[0,0,1],label:p[2]},a)),!t&&d.jsxs(d.Fragment,{children:[d.jsx(ge,N({arcStyle:h,position:[-1,0,0]},a)),d.jsx(ge,N({arcStyle:z,position:[0,-1,0]},a)),d.jsx(ge,N({arcStyle:C,position:[0,0,-1]},a))]})]}),d.jsx("ambientLight",{intensity:.5}),d.jsx("pointLight",{position:[10,10,10],intensity:.5})]}))};function $a({margin:i=[65,110]}){return d.jsx(d.Fragment,{children:d.jsx(Va,{alignment:"bottom-right",margin:i,renderPriority:2,children:d.jsx(Ya,{axisColors:["#FF430A","#FF430A","#FF430A"],labelColor:"white",hideNegativeAxes:!0,axisHeadScale:.8})})})}var Ga={halo:{props:{type:"plane",uAmplitude:1,uDensity:1.3,uSpeed:.4,uStrength:4,uTime:0,uFrequency:5.5,range:"disabled",rangeStart:0,rangeEnd:40,frameRate:10,destination:"onCanvas",format:"gif",axesHelper:"off",brightness:1.2,cAzimuthAngle:180,cDistance:3.6,cPolarAngle:90,cameraZoom:1,color1:"#ff5005",color2:"#dbba95",color3:"#d0bce1",embedMode:"off",envPreset:"city",gizmoHelper:"hide",grain:"on",lightType:"3d",pixelDensity:1,fov:45,positionX:-1.4,positionY:0,positionZ:0,reflection:.1,rotationX:0,rotationY:10,rotationZ:50,shader:"defaults",animate:"on",wireframe:!1}}},Wa=ze((i,e)=>{e.exports=t=>encodeURIComponent(t).replace(/[!'()*]/g,r=>`%${r.charCodeAt(0).toString(16).toUpperCase()}`)}),qa=ze((i,e)=>{var t="%[a-f0-9]{2}",r=new RegExp("("+t+")|([^%]+?)","gi"),s=new RegExp("("+t+")+","gi");function n(o,p){try{return[decodeURIComponent(o.join(""))]}catch{}if(o.length===1)return o;p=p||1;var m=o.slice(0,p),b=o.slice(p);return Array.prototype.concat.call([],n(m),n(b))}function c(o){try{return decodeURIComponent(o)}catch{for(var p=o.match(r)||[],m=1;m<p.length;m++)o=n(p,m).join(""),p=o.match(r)||[];return o}}function _(o){for(var p={"%FE%FF":"��","%FF%FE":"��"},m=s.exec(o);m;){try{p[m[0]]=decodeURIComponent(m[0])}catch{var b=c(m[0]);b!==m[0]&&(p[m[0]]=b)}m=s.exec(o)}p["%C2"]="�";for(var w=Object.keys(p),h=0;h<w.length;h++){var z=w[h];o=o.replace(new RegExp(z,"g"),p[z])}return o}e.exports=function(o){if(typeof o!="string")throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof o+"`");try{return o=o.replace(/\+/g," "),decodeURIComponent(o)}catch{return _(o)}}}),Za=ze((i,e)=>{e.exports=(t,r)=>{if(!(typeof t=="string"&&typeof r=="string"))throw new TypeError("Expected the arguments to be of type `string`");if(r==="")return[t];let s=t.indexOf(r);return s===-1?[t]:[t.slice(0,s),t.slice(s+r.length)]}}),Xa=ze((i,e)=>{e.exports=function(t,r){for(var s={},n=Object.keys(t),c=Array.isArray(r),_=0;_<n.length;_++){var o=n[_],p=t[o];(c?r.indexOf(o)!==-1:r(o,p,t))&&(s[o]=p)}return s}}),Ka=ze(i=>{var e=Wa(),t=qa(),r=Za(),s=Xa(),n=a=>a==null,c=Symbol("encodeFragmentIdentifier");function _(a){switch(a.arrayFormat){case"index":return l=>(v,f)=>{let u=v.length;return f===void 0||a.skipNull&&f===null||a.skipEmptyString&&f===""?v:f===null?[...v,[m(l,a),"[",u,"]"].join("")]:[...v,[m(l,a),"[",m(u,a),"]=",m(f,a)].join("")]};case"bracket":return l=>(v,f)=>f===void 0||a.skipNull&&f===null||a.skipEmptyString&&f===""?v:f===null?[...v,[m(l,a),"[]"].join("")]:[...v,[m(l,a),"[]=",m(f,a)].join("")];case"colon-list-separator":return l=>(v,f)=>f===void 0||a.skipNull&&f===null||a.skipEmptyString&&f===""?v:f===null?[...v,[m(l,a),":list="].join("")]:[...v,[m(l,a),":list=",m(f,a)].join("")];case"comma":case"separator":case"bracket-separator":{let l=a.arrayFormat==="bracket-separator"?"[]=":"=";return v=>(f,u)=>u===void 0||a.skipNull&&u===null||a.skipEmptyString&&u===""?f:(u=u===null?"":u,f.length===0?[[m(v,a),l,m(u,a)].join("")]:[[f,m(u,a)].join(a.arrayFormatSeparator)])}default:return l=>(v,f)=>f===void 0||a.skipNull&&f===null||a.skipEmptyString&&f===""?v:f===null?[...v,m(l,a)]:[...v,[m(l,a),"=",m(f,a)].join("")]}}function o(a){let l;switch(a.arrayFormat){case"index":return(v,f,u)=>{if(l=/\[(\d*)\]$/.exec(v),v=v.replace(/\[\d*\]$/,""),!l){u[v]=f;return}u[v]===void 0&&(u[v]={}),u[v][l[1]]=f};case"bracket":return(v,f,u)=>{if(l=/(\[\])$/.exec(v),v=v.replace(/\[\]$/,""),!l){u[v]=f;return}if(u[v]===void 0){u[v]=[f];return}u[v]=[].concat(u[v],f)};case"colon-list-separator":return(v,f,u)=>{if(l=/(:list)$/.exec(v),v=v.replace(/:list$/,""),!l){u[v]=f;return}if(u[v]===void 0){u[v]=[f];return}u[v]=[].concat(u[v],f)};case"comma":case"separator":return(v,f,u)=>{let T=typeof f=="string"&&f.includes(a.arrayFormatSeparator),E=typeof f=="string"&&!T&&b(f,a).includes(a.arrayFormatSeparator);f=E?b(f,a):f;let S=T||E?f.split(a.arrayFormatSeparator).map($=>b($,a)):f===null?f:b(f,a);u[v]=S};case"bracket-separator":return(v,f,u)=>{let T=/(\[\])$/.test(v);if(v=v.replace(/\[\]$/,""),!T){u[v]=f&&b(f,a);return}let E=f===null?[]:f.split(a.arrayFormatSeparator).map(S=>b(S,a));if(u[v]===void 0){u[v]=E;return}u[v]=[].concat(u[v],E)};default:return(v,f,u)=>{if(u[v]===void 0){u[v]=f;return}u[v]=[].concat(u[v],f)}}}function p(a){if(typeof a!="string"||a.length!==1)throw new TypeError("arrayFormatSeparator must be single character string")}function m(a,l){return l.encode?l.strict?e(a):encodeURIComponent(a):a}function b(a,l){return l.decode?t(a):a}function w(a){return Array.isArray(a)?a.sort():typeof a=="object"?w(Object.keys(a)).sort((l,v)=>Number(l)-Number(v)).map(l=>a[l]):a}function h(a){let l=a.indexOf("#");return l!==-1&&(a=a.slice(0,l)),a}function z(a){let l="",v=a.indexOf("#");return v!==-1&&(l=a.slice(v)),l}function C(a){a=h(a);let l=a.indexOf("?");return l===-1?"":a.slice(l+1)}function y(a,l){return l.parseNumbers&&!Number.isNaN(Number(a))&&typeof a=="string"&&a.trim()!==""?a=Number(a):l.parseBooleans&&a!==null&&(a.toLowerCase()==="true"||a.toLowerCase()==="false")&&(a=a.toLowerCase()==="true"),a}function g(a,l){l=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},l),p(l.arrayFormatSeparator);let v=o(l),f=Object.create(null);if(typeof a!="string"||(a=a.trim().replace(/^[?#&]/,""),!a))return f;for(let u of a.split("&")){if(u==="")continue;let[T,E]=r(l.decode?u.replace(/\+/g," "):u,"=");E=E===void 0?null:["comma","separator","bracket-separator"].includes(l.arrayFormat)?E:b(E,l),v(b(T,l),E,f)}for(let u of Object.keys(f)){let T=f[u];if(typeof T=="object"&&T!==null)for(let E of Object.keys(T))T[E]=y(T[E],l);else f[u]=y(T,l)}return l.sort===!1?f:(l.sort===!0?Object.keys(f).sort():Object.keys(f).sort(l.sort)).reduce((u,T)=>{let E=f[T];return E&&typeof E=="object"&&!Array.isArray(E)?u[T]=w(E):u[T]=E,u},Object.create(null))}i.extract=C,i.parse=g,i.stringify=(a,l)=>{if(!a)return"";l=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},l),p(l.arrayFormatSeparator);let v=E=>l.skipNull&&n(a[E])||l.skipEmptyString&&a[E]==="",f=_(l),u={};for(let E of Object.keys(a))v(E)||(u[E]=a[E]);let T=Object.keys(u);return l.sort!==!1&&T.sort(l.sort),T.map(E=>{let S=a[E];return S===void 0?"":S===null?m(E,l):Array.isArray(S)?S.length===0&&l.arrayFormat==="bracket-separator"?m(E,l)+"[]":S.reduce(f(E),[]).join("&"):m(E,l)+"="+m(S,l)}).filter(E=>E.length>0).join("&")},i.parseUrl=(a,l)=>{l=Object.assign({decode:!0},l);let[v,f]=r(a,"#");return Object.assign({url:v.split("?")[0]||"",query:g(C(a),l)},l&&l.parseFragmentIdentifier&&f?{fragmentIdentifier:b(f,l)}:{})},i.stringifyUrl=(a,l)=>{l=Object.assign({encode:!0,strict:!0,[c]:!0},l);let v=h(a.url).split("?")[0]||"",f=i.extract(a.url),u=i.parse(f,{sort:!1}),T=Object.assign(u,a.query),E=i.stringify(T,l);E&&(E=`?${E}`);let S=z(a.url);return a.fragmentIdentifier&&(S=`#${l[c]?m(a.fragmentIdentifier,l):a.fragmentIdentifier}`),`${v}${E}${S}`},i.pick=(a,l,v)=>{v=Object.assign({parseFragmentIdentifier:!0,[c]:!1},v);let{url:f,query:u,fragmentIdentifier:T}=i.parseUrl(a,v);return i.stringifyUrl({url:f,query:s(u,l),fragmentIdentifier:T},v)},i.exclude=(a,l,v)=>{let f=Array.isArray(l)?u=>!l.includes(u):(u,T)=>!l(u,T);return i.pick(a,f,v)}}),Qa=fr(Ka());function Ja(i){let e=N(N({},Ga.halo.props),i),{control:t,urlString:r,onCameraUpdate:s}=e,n=se(e,["control","urlString","onCameraUpdate"]);t==="query"&&(n=Qa.parse(Mr(r),{parseNumbers:!0,parseBooleans:!0,arrayFormat:"index"}));let c=n,{lightType:_,envPreset:o,brightness:p,grain:m,toggleAxis:b}=c;return se(c,["lightType","envPreset","brightness","grain","toggleAxis"]),d.jsxs(d.Fragment,{children:[d.jsx(kr,N({},n)),d.jsx(Oa,{lightType:_,brightness:p,envPreset:o}),m!=="off"&&d.jsx(pa,{}),b&&d.jsx($a,{}),d.jsx(wa,Pe(N({},n),{onCameraUpdate:s}))]})}let Ft=!1;const en=()=>{if(Ft)return;Ft=!0;const i=Ui,e=(t,r)=>{typeof i[t]!="string"&&(i[t]=r)};e("uv2_pars_vertex",`
#ifdef USE_UV2
	varying vec2 vUv2;
#endif
`),e("uv2_vertex",`
#if defined( USE_UV2 )
	vUv2 = uv2;
#endif
`),e("uv2_pars_fragment",`
#ifdef USE_UV2
	varying vec2 vUv2;
#endif
`),e("encodings_fragment",`
#include <colorspace_fragment>
`),e("transmissionmap_pars_fragment",`
#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
#endif
`),e("transmissionmap_fragment",`
#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
#endif
`)},tn={color1:"#050505",color2:"#151719",color3:"#BFC5CA",speed:.6,density:1.1,strength:.32,frequency:1.4,type:"plane"},rn=({overrides:i})=>{const e=Ue(),t=I(n=>n.scene),r=P.useRef(null),s=P.useMemo(()=>({...tn,...i}),[i]);return P.useEffect(()=>{en()},[]),ee(()=>{const n=r.current??t.getObjectByName("shadergradient-mesh");if(!(n instanceof at))return;r.current=n;const c=n.material.userData?.uTime;c&&(c.value=Ie.reducedMotion?0:lt.elapsed)}),d.jsx(Ja,{color1:s.color1,color2:s.color2,color3:s.color3,type:s.type,shader:"cosmic",uSpeed:s.speed,uDensity:e.density<.5?s.density*.7:s.density,uStrength:s.strength,uFrequency:s.frequency,animate:"off",grain:"off",toggleAxis:!1,lightType:"3d",brightness:.4,positionX:0,positionY:0,positionZ:0,enableTransition:!1,enableCameraUpdate:!1})},an=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,nn=`
  precision highp float;

  uniform sampler2D uBackdrop;
  uniform vec2  uResolution;
  uniform vec2  uPointer;
  uniform float uTime;

  uniform float uWarp;
  uniform float uEdge;
  uniform float uRim;
  uniform float uBase;
  uniform float uCorner;
  uniform float uRadius;
  uniform float uTint;
  uniform float uReveal;

  varying vec2 vUv;

  /** Ported from upstream: signed distance to a rounded rectangle. */
  float roundedRectDistance(vec2 coord, vec2 size, float radius) {
    vec2 centre = size * 0.5;
    vec2 pixel = coord * size;
    vec2 toCorner = abs(pixel - centre) - (centre - radius);
    float outsideCorner = length(max(toCorner, 0.0));
    float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
    return outsideCorner + insideCorner - radius;
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centred = (vUv - 0.5) * aspect;

    float d = roundedRectDistance(vUv, vec2(1.0), uRadius);
    float inside = 1.0 - clamp(abs(d) * 2.0, 0.0, 1.0);

    // A slow surface drift, so the pane is never dead. Two octaves at very
    // different rates: one reads as the sheet moving, the other as light
    // travelling across it. Kept slow enough to stay restrained, fast enough
    // that the glass is visibly glass rather than a still image.
    float drift =
      (noise2(vUv * 2.6 + vec2(uTime * 0.22, uTime * -0.16)) - 0.5) * 1.0 +
      (noise2(vUv * 6.1 - vec2(uTime * 0.34, uTime * 0.27)) - 0.5) * 0.45;
    float pointer = 1.0 - clamp(length(centred - uPointer * aspect) * 1.6, 0.0, 1.0);

    float disp = (uWarp * (1.0 - inside) + uEdge * pow(1.0 - inside, 3.0)) * (1.0 + drift * 0.5);
    disp *= 1.0 + pointer * 0.8;

    // Chromatic split scaled by displacement — the refraction cue. The offset
    // is larger than upstream's because the backdrop here is a smooth field:
    // refracting it by a hair produces no visible change at all, which is
    // exactly what the first build measured (max frame delta of 1 level).
    vec2 offset = disp * 0.055 * aspect;
    vec3 colour;
    colour.r = texture2D(uBackdrop, vUv + offset * 1.10).r;
    colour.g = texture2D(uBackdrop, vUv + offset).g;
    colour.b = texture2D(uBackdrop, vUv + offset * 0.90).b;

    // Silver edge light, strongest along the outline and at the corners.
    float outline = pow(clamp(1.0 - inside, 0.0, 1.0), 2.0);
    float corner = pow(clamp(abs(centred.x) + abs(centred.y), 0.0, 1.0), 2.0);
    colour += vec3(0.60, 0.64, 0.69) * outline * (uEdge * 0.45 + uRim * 0.65);
    colour += vec3(0.48, 0.51, 0.56) * corner * uCorner * 0.35;
    colour *= mix(1.0, 0.86, uBase);

    // A cold, very light tint — AFTERLIGHT's palette, not a rainbow.
    colour = mix(colour, vec3(0.74, 0.78, 0.82), uTint * 0.32);

    // Sheen. Refraction alone is invisible against a smooth field, so the
    // travelling highlight that makes glass read as glass is added explicitly.
    // It tracks the drift, which is what makes the surface look alive.
    float sheen = noise2(vUv * 1.7 - vec2(uTime * 0.19, uTime * 0.13));
    sheen = pow(clamp(sheen, 0.0, 1.0), 3.0);
    colour += vec3(0.30, 0.33, 0.36) * sheen * (0.35 + uRim * 0.5);

    float alpha = uReveal * smoothstep(0.0, 0.08, inside);
    gl_FragColor = vec4(colour, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,on={warp:.35,edge:.5,rim:.6,base:.3,corner:.4,radius:.18,tint:.3},Y=512,sn=()=>{const i=document.createElement("canvas");i.width=Y,i.height=Y;const e=i.getContext("2d");if(e){e.fillStyle="#0a0c0f",e.fillRect(0,0,Y,Y);for(let s=0;s<26;s+=1){const n=s/26*Y,c=.02+.05*Math.abs(Math.sin(s*.7));e.fillStyle=`rgba(191, 197, 202, ${c.toFixed(3)})`,e.fillRect(0,n,Y,2+s%3)}const r=e.createRadialGradient(Y*.5,Y*.42,10,Y*.5,Y*.42,Y*.5);r.addColorStop(0,"rgba(243, 242, 238, 0.20)"),r.addColorStop(1,"rgba(243, 242, 238, 0)"),e.fillStyle=r,e.fillRect(0,0,Y,Y)}const t=new st(i);return t.minFilter=Q,t.magFilter=Q,t.generateMipmaps=!1,t.needsUpdate=!0,t},ln=({overrides:i})=>{const e=I(_=>_.size),t=P.useRef(null),[r,s]=P.useState(null);P.useEffect(()=>{const _=sn();return s(_),()=>_.dispose()},[]);const n=P.useMemo(()=>({...on,...i}),[i]),c=P.useMemo(()=>({uBackdrop:{value:r},uResolution:{value:new Float32Array([e.width,e.height])},uPointer:{value:new Float32Array([0,0])},uTime:{value:0},uWarp:{value:n.warp},uEdge:{value:n.edge},uRim:{value:n.rim},uBase:{value:n.base},uCorner:{value:n.corner},uRadius:{value:n.radius},uTint:{value:n.tint},uReveal:{value:0}}),[r,n,e.width,e.height]);return ee((_,o)=>{const p=t.current;if(!p)return;const m=p.uniforms,b=Math.min(o,.05);m.uResolution.value.set([e.width,e.height]),m.uPointer.value.set([Ne.targetX,-Ne.targetY]),m.uTime.value=Ie.reducedMotion?0:lt.elapsed,m.uWarp.value=n.warp,m.uEdge.value=n.edge,m.uRim.value=n.rim,m.uBase.value=n.base,m.uCorner.value=n.corner,m.uRadius.value=n.radius,m.uTint.value=n.tint,m.uReveal.value=Math.min(1,m.uReveal.value+b*1.5)}),d.jsxs("mesh",{position:[0,.4,3],dispose:null,children:[d.jsx("planeGeometry",{args:[e.width*.56,e.height*.56]}),d.jsx("shaderMaterial",{ref:t,vertexShader:an,fragmentShader:nn,uniforms:c,transparent:!0,depthWrite:!1,toneMapped:!1})]})},cn=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,un=`
  precision highp float;

  uniform vec2  uResolution;
  uniform float uTime;

  uniform sampler2D uMask;

  uniform float uSpeed;
  uniform float uIterations;
  uniform float uScale;
  uniform float uDotFactor;
  uniform float uVOffset;
  uniform float uIntensity;
  uniform float uExpFactor;
  uniform vec3  uColorFactors;
  uniform float uColorShift;

  uniform float uMaskScale;
  uniform float uMaskOpacity;
  uniform float uEdgeStrength;
  uniform float uNoiseAmount;

  uniform vec3  uInk;
  uniform vec3  uHighlight;

  varying vec2 vUv;

  // Cheap value noise. The original used 3D simplex here purely to wobble the
  // flow field; at this amplitude a 2D value noise is indistinguishable and
  // costs a quarter of the arithmetic in a full-screen fragment loop.
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /** Sobel-ish edge magnitude over the mask, used to deflect the flow. */
  float maskEdge(vec2 uv) {
    vec2 px = 1.0 / uResolution;
    float c = texture2D(uMask, uv).a;
    float l = texture2D(uMask, uv - vec2(px.x, 0.0)).a;
    float r = texture2D(uMask, uv + vec2(px.x, 0.0)).a;
    float t = texture2D(uMask, uv - vec2(0.0, px.y)).a;
    float b = texture2D(uMask, uv + vec2(0.0, px.y)).a;
    return smoothstep(0.0, 0.25, abs(c - l) + abs(c - r) + abs(c - t) + abs(c - b));
  }

  void main() {
    vec2 frag = vUv * uResolution;
    float time = uTime * uSpeed;

    // Centre the mask and keep its edges crisp.
    vec2 maskUv = (vUv - 0.5) / max(uMaskScale, 0.0001) + 0.5;
    maskUv.y = 1.0 - maskUv.y;

    bool insideBounds = maskUv.x >= 0.0 && maskUv.x <= 1.0 && maskUv.y >= 0.0 && maskUv.y <= 1.0;
    if (!insideBounds) discard;

    float mask = texture2D(uMask, maskUv).a;
    if (mask < 0.08) discard;

    float edge = maskEdge(maskUv) * uEdgeStrength;

    // --- flow field ------------------------------------------------------
    vec2 p = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
    float dotP = dot(p, p);
    float lens = abs(uDotFactor - dotP) * 1.6;

    vec2 v = p * (1.0 - lens) / max(uScale, 0.0001);
    // Bend the flow around the outline rather than letting it shear the mask.
    v += vec2(sin(edge * 10.0), cos(edge * 8.0)) * edge * 1.2;
    v += vec2(vnoise(p * 2.4 + time * 0.15), vnoise(p * 2.4 + time * 0.11) * 0.7) * uNoiseAmount;

    vec4 acc = vec4(0.0);
    int steps = int(clamp(uIterations, 1.0, 24.0));
    for (int i = 0; i < 24; i++) {
      if (i >= steps) break;
      float idx = float(i) + 1.0;
      vec2 offset = cos(v.yx * idx + vec2(0.0, idx) + time) / idx + uVOffset;
      // Deflect harder where the outline is.
      offset *= 1.0 + edge * 1.4;
      v += offset;
      acc += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * uIntensity;
    }

    if (uColorShift > 0.0) {
      acc = acc.wxyz * uColorShift + acc * (1.0 - uColorShift);
    }

    // tanh, expressed the way the original does — as an exp2 ratio.
    vec4 expPy = exp(p.y * vec4(uColorFactors.x, uColorFactors.y, uColorFactors.z, 0.0));
    // vec4() is explicit: a bare scalar is not implicitly widened on every GLSL
    // target three compiles for, and this failed to build on WebGL2.
    vec4 expLx = vec4(exp(-uExpFactor * lens));
    vec4 ratio = expPy * expLx / max(acc, vec4(1e-4));
    vec4 exp2x = exp(2.0 * ratio);
    acc = (exp2x - 1.0) / (exp2x + 1.0);

    // --- tone -----------------------------------------------------------
    // AFTERLIGHT's palette: cold metal in near-darkness. The band is biased
    // low so the wordmark sits *in* the frame rather than punching a white
    // hole through it — at full range the first build washed out the entire
    // page behind it.
    float band = clamp(acc.x, 0.0, 1.0);
    band = pow(band, 1.7);
    vec3 colour = mix(uInk, uHighlight, band);

    // The outline catches the most light, as a bevel would — but bounded, so
    // the rim cannot outrun the body.
    float rim = pow(clamp(edge, 0.0, 1.0), 2.4);
    colour += rim * 0.22;

    float alpha = mask * uMaskOpacity;
    gl_FragColor = vec4(colour, alpha);

    // Let three encode the output for its configured colour space.
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,dn={speed:.42,iterations:12,scale:2.1,dotFactor:.34,vOffset:.012,intensity:.028,expFactor:.36,maskScale:.86,maskOpacity:1,edgeStrength:.85,noiseAmount:.05},Ut=i=>{const e=parseInt(i.replace("#",""),16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]},It={ink:Ut("#050505"),highlight:Ut("#BFC5CA")},Mt=2048,fn=async()=>{const i=globalThis.document?.fonts;i&&await i.ready},mn=async i=>{const{text:e,aspect:t=6,weight:r=700,fontFamily:s}=i;await fn();const n=document.createElement("canvas"),c=Math.min(Mt,512),_=Math.min(Mt,Math.round(c*t));n.width=_,n.height=c;const o=n.getContext("2d");if(!o)throw new Error("createTextMask: no 2d context");o.clearRect(0,0,_,c),o.fillStyle="#ffffff",o.textAlign="center",o.textBaseline="middle",o.font=`${r} ${Math.round(c*.72)}px ${s??"'Space Grotesk Variable', 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"}`;let p=o.measureText(e);const m=_*.92;if(p.width>m){const w=Math.round(parseInt(o.font.match(/(\d+)px/)?.[1]??"360",10)*m/p.width);o.font=o.font.replace(/(\d+)px/,`${w}px`),p=o.measureText(e)}o.fillText(e,_/2,c/2,m);const b=new st(n);return b.minFilter=Q,b.magFilter=Q,b.colorSpace=Ii,b.generateMipmaps=!1,b.needsUpdate=!0,b},vn=({text:i="AFTERLIGHT",params:e,overrides:t,speedScale:r=1,aspect:s=4,fill:n=.52,distance:c=13})=>{const _=Ue(),o=I(f=>f.size),p=I(f=>{const u=f.camera;return u.isPerspectiveCamera?u.fov:42}),m=P.useRef(null),[b,w]=P.useState(null),[h,z]=P.useState(null),C=P.useMemo(()=>({...dn,...e,...t}),[e,t]);P.useEffect(()=>{let f=!1,u=null;return mn({text:i,aspect:s}).then(T=>{if(f){T.dispose();return}u=T,w(T)}).catch(T=>{f||z(T instanceof Error?T.message:"mask generation failed")}),()=>{f=!0,u?.dispose()}},[i,s]);const y=P.useMemo(()=>({uResolution:{value:new Float32Array([o.width,o.height])},uTime:{value:0},uMask:{value:b},uSpeed:{value:C.speed},uIterations:{value:C.iterations},uScale:{value:C.scale},uDotFactor:{value:C.dotFactor},uVOffset:{value:C.vOffset},uIntensity:{value:C.intensity},uExpFactor:{value:C.expFactor},uColorFactors:{value:new Float32Array([.16,.12,.2,0])},uColorShift:{value:.06},uMaskScale:{value:C.maskScale},uMaskOpacity:{value:C.maskOpacity},uEdgeStrength:{value:C.edgeStrength},uNoiseAmount:{value:C.noiseAmount},uInk:{value:new Float32Array(It.ink)},uHighlight:{value:new Float32Array(It.highlight)}}),[b,C,o.width,o.height]);if(ee(()=>{const f=m.current;if(!f)return;const u=f.uniforms;u.uResolution.value.set([o.width,o.height]),u.uTime.value=lt.elapsed*r,u.uSpeed.value=Ie.reducedMotion?0:C.speed,u.uIterations.value=_.density<.5?Math.min(C.iterations,8):C.iterations,u.uScale.value=C.scale,u.uIntensity.value=C.intensity,u.uEdgeStrength.value=C.edgeStrength,u.uNoiseAmount.value=C.noiseAmount,u.uMaskScale.value=C.maskScale}),h)return null;const l=2*c*Math.tan(p*Math.PI/360)*(o.width/Math.max(o.height,1))*n,v=l/s;return d.jsxs("mesh",{frustumCulled:!1,dispose:null,children:[d.jsx("planeGeometry",{args:[l,v]}),d.jsx("shaderMaterial",{ref:m,vertexShader:cn,fragmentShader:un,uniforms:y,transparent:!0,depthWrite:!1,toneMapped:!1})]})},gn=()=>{const i=Ue(),e=P.useRef(null);return ee(()=>{const t=e.current;t&&(t.rotation.y=Ne.targetX*.12,t.rotation.x=-Ne.targetY*.08)}),d.jsx("group",{ref:e,position:[0,-.9,2],children:d.jsx(vn,{text:"AFTERLIGHT",fill:.44,params:{iterations:i.density<.5?8:12}})})},pn={particles:{fog:"#070a0d",density:.016},shaders:{fog:"#08090b",density:.012},portal:{fog:"#06080a",density:.018}},hn={liquid:{fog:"#050607",density:.006},gradient:{fog:"#050505",density:.004},glass:{fog:"#08090b",density:.01}},_n=({exhibit:i,playground:e})=>{const t=Ue(),r=M(m=>m.paused),s=M(m=>m.params),[n,c]=P.useState(!1),_=P.useCallback(()=>c(!0),[]),o=P.useCallback(()=>c(!1),[]),p=e?hn[e]:pn[i];return!$t.webgl||n?d.jsx(Yt,{active:!0}):d.jsx(gt,{children:d.jsx("div",{className:"h-full w-full",children:d.jsxs(xi,{dpr:[1,t.dpr],frameloop:"always",gl:{antialias:t.highPost,alpha:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1},camera:{fov:42,near:.1,far:200,position:[0,1.6,15]},onCreated:({gl:m})=>{m.toneMapping=Mi},children:[d.jsx(ki,{onContextLost:_,onContextRestored:o}),d.jsx("color",{attach:"background",args:[p.fog]}),d.jsx("fogExp2",{attach:"fog",args:[p.fog,s.fogDensity*.04]}),d.jsx(ji,{running:!r}),d.jsx(Hi,{target:1}),d.jsx(Vi,{}),d.jsx(Yi,{}),d.jsx($i,{}),d.jsx(P.Suspense,{fallback:null,children:d.jsx(xn,{exhibit:i,playground:e,density:t.density,highDetail:t.highPost})}),d.jsx(gt,{children:d.jsx(Gi,{})})]})})})},xn=({exhibit:i,playground:e,density:t,highDetail:r})=>{const s=M(n=>n.params);return P.useEffect(()=>{Object.assign(Wi,s)},[s]),e?d.jsxs("group",{children:[e==="gradient"?d.jsx(rn,{}):null,e==="glass"?d.jsx(ln,{}):null,e==="liquid"?d.jsx(gn,{}):null]}):d.jsxs("group",{children:[d.jsx(Qi,{radius:16,intensity:.34}),i==="particles"?d.jsx(Ji,{density:t,pointerDistance:10,live:!0}):null,i==="shaders"?d.jsx(er,{size:17,live:!0,highDetail:r}):null,i==="portal"?d.jsx(tr,{size:17,live:!0,mode:"proximity"}):null]})},yn=({notice:i,onDismiss:e,timeout:t=6e3})=>{const r=P.useRef(null);if(P.useEffect(()=>{if(!(!i||t<=0))return r.current=window.setTimeout(e,t),()=>{r.current!==null&&window.clearTimeout(r.current)}},[i,e,t]),!i)return null;const s=i.kind==="error";return d.jsxs("div",{role:s?"alert":"status","aria-live":s?"assertive":"polite",className:["hairline flex items-start gap-3 bg-[color:var(--al-surface-raised)] p-3 text-2xs leading-relaxed",s?"text-[color:var(--al-danger)]":"text-[color:var(--al-text-muted)]"].join(" "),children:[d.jsx("span",{"aria-hidden":"true",className:"label-mono mt-px shrink-0 opacity-70",children:s?"ERR":i.kind==="success"?"OK":"···"}),d.jsxs("div",{className:"flex flex-1 flex-col gap-1",children:[d.jsx("span",{className:"font-mono normal-case tracking-normal text-[color:var(--al-text)]",children:i.message}),i.details?.length?d.jsx("ul",{className:"flex list-disc flex-col gap-0.5 pl-4 text-[color:var(--al-text-faint)]",children:i.details.slice(0,5).map(n=>d.jsx("li",{children:n},n))}):null]}),d.jsx("button",{type:"button",onClick:e,"aria-label":"Dismiss message",className:"label-mono shrink-0 px-1 text-[color:var(--al-text-faint)] transition-colors hover:text-ivory",children:"✕"})]})},Cn=()=>{const i=M(h=>h.params),e=M(h=>h.paused),t=M(h=>h.status),r=M(h=>h.lastCapture),s=M(h=>h.notice),n=M(h=>h.setParam),c=M(h=>h.togglePause),_=M(h=>h.reset),o=M(h=>h.randomize),p=M(h=>h.requestCapture),m=M(h=>h.exportConfig),b=M(h=>h.importConfig),w=M(h=>h.dismissNotice);return d.jsxs("div",{className:"flex flex-col gap-5",children:[d.jsx(He,{title:"Parameters",eyebrow:"Live",children:qi.map(h=>d.jsx(Zi,{label:h.label,value:i[h.key],min:h.min,max:h.max,step:h.step,decimals:h.decimals,unit:h.unit,hint:h.hint,disabled:e&&h.key==="speed",onChange:z=>{n(h.key,z),le("hover",.35)}},h.key))}),d.jsxs(He,{title:"Actions",eyebrow:"Transport",children:[d.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[d.jsx(re,{variant:"technical",size:"md",onClick:()=>{c(),le("click")},"aria-pressed":e,children:e?"Resume":"Pause"}),d.jsx(re,{variant:"technical",size:"md",onClick:()=>{o(),le("scene")},children:"Randomise"}),d.jsx(re,{variant:"technical",size:"md",onClick:()=>{_(),le("click")},children:"Reset"}),d.jsx(re,{variant:"technical",size:"md",onClick:()=>{p(),le("click")},disabled:t==="capturing",children:t==="capturing"?"Capturing…":"Capture"})]}),d.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[d.jsx(re,{variant:"outline",size:"md",onClick:()=>{m(),le("click")},children:"Export JSON"}),d.jsx(re,{variant:"outline",size:"md",onClick:()=>{b()},children:"Import JSON"})]}),d.jsx(we,{tone:"muted",children:"Capture writes a PNG of the current frame via canvas.toBlob. Export writes the six parameters above as JSON; import validates and clamps whatever it is given."})]}),d.jsxs(He,{title:"Readout",eyebrow:"Telemetry",children:[d.jsxs("dl",{className:"grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-2xs",children:[d.jsx(pe,{label:"Transport",value:e?"paused":"running"}),d.jsx(pe,{label:"Frame rate",value:`${Math.round(Ie.fps)} fps`}),d.jsx(pe,{label:"Particles",value:Math.round(i.particleCount).toLocaleString("en-US")}),d.jsx(pe,{label:"Fog",value:pt(i.fogDensity)}),d.jsx(pe,{label:"Particle range",value:`${ht("particleCount").min}–${ht("particleCount").max}`}),d.jsx(pe,{label:"Speed",value:`${pt(i.speed,2)}×`})]}),d.jsxs("p",{className:["font-mono text-2xs leading-relaxed",r===null?"text-[color:var(--al-text-quiet)]":r.ok?"text-[color:var(--al-text-muted)]":"text-[color:var(--al-danger)]"].join(" "),children:[d.jsx("span",{className:"label-mono mr-2 opacity-60",children:"Last capture"}),r===null?"none yet":`${r.label} · ${new Date(r.at).toLocaleTimeString("en-GB")}`]})]}),d.jsx(yn,{notice:s,onDismiss:w})]})},pe=({label:i,value:e})=>d.jsxs(d.Fragment,{children:[d.jsx("dt",{className:"label-mono text-[color:var(--al-text-faint)]",children:i}),d.jsx("dd",{className:"text-right tabular-nums text-[color:var(--al-text-muted)]",children:e})]}),kt=[{id:"liquid",numeral:"IV",title:"Liquid metal wordmark",source:"liquid-logo (MIT) — shader adapted",summary:"A flow-field integration wrapped around the outline of a generated text mask. The mask is rendered from live text at runtime, so no third-party logo asset ships with this project and the wordmark stays editable.",affects:"Every uniform below is wired to the material. Speed and edge strength respond to the pointer; the loop length and noise amount are the expensive ones."},{id:"gradient",numeral:"V",title:"Shader gradient",source:"@shadergradient/react (MIT) — mounted in this canvas",summary:"The ShaderGradient mesh, rendered inside the laboratory’s existing WebGL context rather than the package’s own <Canvas>, so this experiment adds a mesh and not a second renderer.",affects:"Colours, noise speed, density, strength and frequency are the package’s documented uniforms. Presets come from the package itself."},{id:"glass",numeral:"VI",title:"Liquid glass",source:"liquid-glass-js (MIT) — shader model adapted",summary:"The library’s rounded-rect SDF, displacement and edge-lighting model, running as a real WebGL surface over the laboratory backdrop. The original’s html2canvas page-snapshot pipeline is deliberately not used: it rasterises the whole document, cannot capture a WebGL canvas, and would mean a second context.",affects:"Warp, edge, rim and corner gain, all ported from the library’s uniforms."}],vi=i=>i==="liquid"||i==="gradient"||i==="glass",Je=[{id:"particles",numeral:"I",title:"Particle field",summary:"A seeded point cloud with a pointer displacement field. Positions are generated once on the CPU and animated entirely in the vertex shader, so the field costs one draw call at any count.",affects:"Count, distortion, pointer influence and speed all act directly on the field."},{id:"shaders",numeral:"II",title:"Domain warp",summary:"A two-stage simplex domain warp over a generated source image — horizon, monolith, star field. Chromatic separation scales with the warp, and the pointer applies a local lens rather than a translation.",affects:"Distortion drives the warp amplitude and the aberration; pointer influence sets the lens."},{id:"portal",numeral:"III",title:"Refractive aperture",summary:"A lens that refracts a procedurally generated field: polar interference rings, a domain-warped core, and a rim whose edge bends light most. It reads as glass without a render target.",affects:"Pointer influence opens the aperture and drags the lens; distortion and speed drive the interior."}],gi=i=>i==="particles"||i==="shaders"||i==="portal",bn=i=>gi(i)||vi(i),kn=()=>{const i=Ci(),e=M(o=>o.setFocus),t=i.study,r=vi(t)?t:void 0,s=gi(t)?t:"particles";if(P.useEffect(()=>{r||e(s)},[s,r,e]),t!==void 0&&!bn(t))return d.jsx(bi,{to:"/404",replace:!0});const n=Je.find(o=>o.id===s)??Je[0],c=r?kt.find(o=>o.id===r):void 0,_=$t.webgl;return d.jsxs("div",{className:"relative min-h-dvh",children:[d.jsx("div",{className:"fixed inset-0 z-0",children:d.jsx("div",{className:"absolute inset-x-0 bottom-0 top-[var(--al-nav-h)]",children:_?d.jsx(_n,{exhibit:s,playground:r}):d.jsx(Yt,{})})}),d.jsx("div",{className:"relative z-10 mx-auto w-full max-w-[92rem] px-[var(--al-gutter)] pb-16 pt-[calc(var(--al-nav-h)+3rem)]",children:d.jsxs("div",{className:"grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]",children:[d.jsxs("div",{className:"flex flex-col gap-8",children:[d.jsx(Xi,{numeral:"02 / Laboratory",title:"Studies",lede:"Three effects taken from the film and left running, plus a playground for the libraries this project integrates. Every film parameter is exposed, validated and saved; nothing here is decorative."}),d.jsx("nav",{"aria-label":"Studies",className:"flex flex-wrap gap-2",children:Je.map(o=>d.jsxs(re,{variant:o.id===s&&!r?"outline":"ghost",size:"md",to:`/lab/${o.id}`,"aria-current":o.id===s&&!r?"page":void 0,children:[o.numeral," · ",o.title]},o.id))}),d.jsxs("div",{className:"flex flex-col gap-3",children:[d.jsx(we,{tone:"muted",children:"Library playground"}),d.jsx("nav",{"aria-label":"Library playground",className:"flex flex-wrap gap-2",children:kt.map(o=>d.jsxs(re,{variant:o.id===r?"outline":"ghost",size:"md",to:`/lab/${o.id}`,"aria-current":o.id===r?"page":void 0,children:[o.numeral," · ",o.title]},o.id))})]}),d.jsxs("article",{className:"panel-surface flex max-w-[42rem] flex-col gap-4 p-6",children:[d.jsxs("div",{className:"flex items-baseline gap-4",children:[d.jsx(we,{tone:"muted",children:c?`Experiment ${c.numeral}`:`Study ${n.numeral}`}),d.jsx("span",{"aria-hidden":"true",className:"h-px flex-1 bg-[color:var(--al-line)]"}),c?d.jsx(we,{tone:"muted",children:c.source}):null]}),d.jsx("h2",{className:"display-title text-lg",children:c?c.title:n.title}),d.jsx("p",{className:"text-base leading-relaxed text-[color:var(--al-text-muted)]",children:c?c.summary:n.summary}),d.jsx("p",{className:"text-sm leading-relaxed text-[color:var(--al-text-faint)]",children:c?c.affects:n.affects})]}),d.jsxs("section",{className:"flex max-w-[42rem] flex-col gap-3",children:[d.jsx(we,{tone:"muted",children:"Also in the film"}),d.jsx("ul",{className:"flex flex-wrap gap-2",children:Ki.filter(o=>o!=="awakening").map(o=>d.jsx("li",{children:d.jsx(Ti,{to:`/#${o}`,className:"label-mono inline-flex h-[var(--al-control-sm)] items-center border border-[color:var(--al-line)] px-3 text-[color:var(--al-text-faint)] transition-colors hover:border-[color:var(--al-line-strong)] hover:text-ivory",children:o})},o))}),d.jsx("p",{className:"text-2xs leading-relaxed text-[color:var(--al-text-quiet)]",children:"Particle count, distortion, pointer influence, fog and bloom are shared between the film and the laboratory — change one here and the film changes too."})]})]}),d.jsx("aside",{className:"lg:sticky lg:top-[calc(var(--al-nav-h)+1.5rem)] lg:self-start",children:d.jsx(Cn,{})})]})})]})};export{kn as Lab,Je as STUDIES};
