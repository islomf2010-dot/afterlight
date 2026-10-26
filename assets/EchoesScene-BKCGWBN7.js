import{j as e,b as u}from"./r3f-CAIdFP5s.js";import{b as a}from"./react-DE8NN6kS.js";import{i as m,Z as x,h as f}from"./three-CuITrT85.js";import{u as g}from"./Home-CHEEEMCX.js";import{u as h,w as v,o as j,D as d,v as E}from"./index-CApK0vR9.js";import{E as t,P as y,D as b,a as S}from"./ExhibitBackdrop-3NsNeXHH.js";import"./portal-CzQPYAJz.js";import"./motion-BqM_xKjl.js";const C="echoes",r=34,p=[{id:"particles",x:0},{id:"shaders",x:r},{id:"portal",x:r*2}],P=p.map(i=>({position:[i.x,3.4,28],lookAt:[i.x,.8,0],fov:40})),B=()=>{const i=h();return g({frames:P,getProgress:()=>v(j.value(C)),parallax:.9,parallaxLook:.35,damping:3.2}),e.jsxs("group",{children:[e.jsx(M,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsx(t,{radius:20,intensity:.32}),e.jsx(y,{density:i.density,pointerDistance:11})]}),e.jsxs("group",{position:[r,0,0],children:[e.jsx(t,{radius:20,intensity:.28}),e.jsx(b,{size:17,highDetail:i.highPost})]}),e.jsxs("group",{position:[r*2,0,0],children:[e.jsx(t,{radius:20,intensity:.3}),e.jsx(S,{size:17,mode:"proximity"})]}),e.jsx(R,{width:r*2+48})]})},M=()=>{const i=a.useRef(0);return u(({camera:o})=>{if(i.current+=1,i.current%6!==0)return;let s="particles",n=1/0;for(const c of p){const l=Math.abs(o.position.x-c.x);l<n&&(n=l,s=c.id)}d.focus!==s&&(d.focus=s)}),null},R=({width:i})=>{const o=a.useMemo(()=>new m({uniforms:{uExposure:{value:0},uColor:{value:new f("#525d68")}},vertexShader:`
          varying vec2 vXZ;
          void main() {
            vXZ = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform float uExposure;
          uniform vec3 uColor;
          varying vec2 vXZ;

          // Screen-space-derivative line mask: constant apparent thickness at
          // any distance, which a plain fract() grid cannot do.
          float gridLine(vec2 p, float scale) {
            vec2 coord = p * scale;
            vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), 1e-5);
            return 1.0 - min(min(grid.x, grid.y), 1.0);
          }

          void main() {
            float minor = gridLine(vXZ, 0.25);
            float major = gridLine(vXZ, 0.0625);
            float d = length(vXZ - vec2(34.0, -8.0));
            float fade = exp(-d * 0.022);
            float a = (minor * 0.18 + major * 0.5) * fade * uExposure;
            if (a < 0.002) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `,transparent:!0,depthWrite:!1,blending:x}),[]);return a.useEffect(()=>()=>o.dispose(),[o]),u(()=>{o.uniforms.uExposure.value=E.exposure}),e.jsx("mesh",{material:o,rotation:[-Math.PI/2,0,0],position:[r,-9.5,0],renderOrder:1,children:e.jsx("planeGeometry",{args:[i,90]})})};export{B as default};
