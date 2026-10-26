import{b as g,j as e,u as P}from"./r3f-CAIdFP5s.js";import{b as a}from"./react-DE8NN6kS.js";import{V as x,a as D,i as f,t as I,Z as M,s as T,h as E}from"./three-CuITrT85.js";import{g as O,D as C,m as F,h as V,i as _,j as G}from"./portal-CzQPYAJz.js";import{p as u,y as p,h as S,t as v,v as h,q as b}from"./index-CApK0vR9.js";const W=({target:r,distance:o=9,enabled:s=!0})=>{const n=a.useMemo(()=>new x,[]);return g(({camera:i})=>{if(s){if(!u.present){r.set(0,0,-9999);return}n.set(u.x,u.y,-1).applyQuaternion(i.quaternion).normalize().multiplyScalar(o).add(i.position),r.lerp(n,.22)}}),null},X=({density:r=1,pointerDistance:o=9,live:s=!0,showArmature:n=!0})=>{const i=a.useMemo(()=>new x(0,0,-9999),[]);return e.jsxs("group",{children:[e.jsx(W,{target:i,distance:o}),e.jsx(O,{count:Math.round(4200*r),extent:[7,4.4,7],distribution:"halo",seed:10098627,variant:"field",color:"#93a6b5",accent:"#eef4f9",size:2.1,opacity:.85,bounds:9,pointerRadius:4.2,liveControls:s,pointerTarget:i}),n?e.jsx(L,{}):null,e.jsx("ambientLight",{intensity:.12,color:"#4a5865"}),e.jsx("directionalLight",{intensity:.6,color:"#c4d3e0",position:[5,8,6]}),e.jsx("pointLight",{position:[0,0,4],intensity:12,distance:22,decay:2,color:"#dce7f0"})]})},L=()=>e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[7.4,.035,6,128]}),e.jsx("meshBasicMaterial",{color:"#5d6b78",transparent:!0,opacity:.4,depthWrite:!1})]}),e.jsxs("mesh",{rotation:[0,0,Math.PI/2],children:[e.jsx("torusGeometry",{args:[5.2,.03,6,128]}),e.jsx("meshBasicMaterial",{color:"#5d6b78",transparent:!0,opacity:.28,depthWrite:!1})]})]}),Q=({size:r=17,live:o=!0,highDetail:s=!0})=>{const n=P(d=>d.size),i=n.width/Math.max(1,n.height),l=a.useRef(.45),t=a.useMemo(()=>({uTime:{value:0},uDistortion:{value:.45},uSpeed:{value:1},uPointer:{value:new D(0,0)},uPointerInfluence:{value:1},uAspect:{value:i},uInk:{value:new x(.018,.022,.028)},uPaper:{value:new x(.86,.88,.9)},uAberration:{value:s?1:0}}),[i,s]),c=a.useMemo(()=>new f({uniforms:t,vertexShader:F,fragmentShader:C,side:I}),[t]);return a.useEffect(()=>()=>c.dispose(),[c]),g((d,m)=>{const y=o?p.distortion:.45;l.current=S(l.current,y,5,m),t.uTime.value=v.elapsed,t.uDistortion.value=l.current*h.exposure,t.uSpeed.value=h.reducedMotion?0:p.speed*v.running,t.uPointerInfluence.value=o?p.pointerInfluence:.8,t.uPointer.value.x=u.present?u.x:99,t.uPointer.value.y=u.present?u.y:99,t.uAspect.value=i}),e.jsxs("group",{children:[e.jsx("mesh",{material:c,renderOrder:1,children:e.jsx("planeGeometry",{args:[r,r]})}),e.jsx(N,{size:r+1.2}),e.jsx("ambientLight",{intensity:.08,color:"#39434d"})]})},N=({size:r})=>{const o=r/2,s=.06,n=.06;return e.jsx("group",{position:[0,0,-.2],children:[[0,o,r,s],[0,-o,r,s],[-o,0,s,r],[o,0,s,r]].map(([i,l,t,c],d)=>e.jsxs("mesh",{position:[i,l,0],children:[e.jsx("boxGeometry",{args:[t,c,n]}),e.jsx("meshBasicMaterial",{color:"#4c5a67",transparent:!0,opacity:.5})]},d))})},Z=({size:r=17,live:o=!0,mode:s="proximity"})=>{const n=P(m=>m.size),i=n.width/Math.max(1,n.height),l=a.useRef(.6),t=a.useMemo(()=>{const m=V("#eef4f9","#7f95a8");return m.uAspect.value=i,m},[i]),c=a.useMemo(()=>new f({uniforms:t,vertexShader:G,fragmentShader:_,transparent:!0,depthWrite:!1,side:I,blending:M}),[t]),d=a.useMemo(()=>new f({uniforms:{uColor:{value:new E("#7f95a8")},uIntensity:{value:.4}},vertexShader:`
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
            gl_FragColor = vec4(uColor, pow(clamp(1.0 - d, 0.0, 1.0), 2.8) * uIntensity);
          }
        `,transparent:!0,depthWrite:!1,blending:M,side:T}),[]);return a.useEffect(()=>()=>c.dispose(),[c]),a.useEffect(()=>()=>d.dispose(),[d]),g((m,y)=>{const j=u.present,w=o?p.pointerInfluence:1,R=j?b(1-Math.hypot(u.x,u.y)/1.5)*w:0,A=s==="pulse"?.5+Math.sin(v.elapsed*.42)*.42:R;l.current=S(l.current,A,2.4,y),t.uOpen.value=b(l.current)*h.exposure,t.uTime.value=v.elapsed,t.uSpeed.value=h.reducedMotion?0:p.speed*v.running,t.uDistortion.value=.3+(o?p.distortion:.5)*.9,t.uPointer.value.set(j?u.x:0,j?u.y:0),t.uPointerInfluence.value=w,t.uAspect.value=i,d.uniforms.uIntensity.value=.5*t.uOpen.value}),e.jsxs("group",{children:[e.jsx("mesh",{material:c,renderOrder:3,children:e.jsx("planeGeometry",{args:[r,r]})}),e.jsx("mesh",{material:d,scale:1.7,renderOrder:2,children:e.jsx("planeGeometry",{args:[r,r]})}),e.jsx("ambientLight",{intensity:.09,color:"#414e5a"}),e.jsx("pointLight",{position:[0,0,3],intensity:9,distance:18,decay:2,color:"#d9e4ed"})]})},H=({radius:r=17,color:o="#46525e",intensity:s=.4})=>{const n=a.useMemo(()=>new f({uniforms:{uColor:{value:new E(o)},uIntensity:{value:s},uTime:{value:0}},vertexShader:`
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - world.xyz);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          // Rim-weighted: brightest where the shell turns away from the eye.
          float rim = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.6);
          float breathe = 0.92 + sin(uTime * 0.25) * 0.08;
          gl_FragColor = vec4(uColor, rim * uIntensity * breathe);
        }
      `,transparent:!0,depthWrite:!1,blending:M,side:T}),[o,s]);return a.useEffect(()=>()=>n.dispose(),[n]),g(()=>{n.uniforms.uTime.value=v.elapsed,n.uniforms.uIntensity.value=s*h.exposure}),e.jsx("mesh",{material:n,scale:r,renderOrder:0,children:e.jsx("sphereGeometry",{args:[1,24,16]})})};export{Q as D,H as E,X as P,Z as a};
