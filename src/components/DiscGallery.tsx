import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Track } from '../data/tracks';
import './DiscGallery.css';
import { NOTE_PATHS } from './musicalNotation';
import { NOTE_COLORS, PALETTE } from '../theme';

interface Props {
  tracks: Track[]; browsingIndex: number; playingIndex: number;
  isPlaying: boolean; isPaused: boolean; reducedMotion?: boolean;
  onBrowse: (index: number) => void;
  onSelectTrack: (track: Track, index: number) => void;
  onOpenTrack: (index: number) => void;
  onMinimizeTrack: (index: number) => void;
  minimizedIndex: number | null;
  isBranched?: boolean;
}
const clampIndex = (value: number, count: number) => Math.max(0, Math.min(count - 1, value));

// The sleeve is printed on a real annulus: the spindle hole is geometry, not paint.
function sleeveTexture(track: Track, image?: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = image ? 1024 : 256;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(canvas.width/1536,canvas.height/1536);
  ctx.fillStyle = track.accentColor || PALETTE.aubergine;
  ctx.fillRect(0, 0, 1536, 1536);
  if (image) {
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    ctx.drawImage(image, (image.naturalWidth-side)/2, (image.naturalHeight-side)/2, side, side, 0, 0, 1536, 1536);
  } else {
    ctx.fillStyle = PALETTE.pearl;
    ctx.textAlign = 'center';
    ctx.font = '76px Georgia';
    ctx.fillText(track.title, 768, 450, 1200);
  }
  // Fine catalogue lettering follows the outer edge, like a physical release.
  const imprint = `KATOSI  •  ${track.title.toUpperCase()}  •  ${track.year}  •  ${track.label.toUpperCase()}  •  COMPACT DISC DIGITAL AUDIO  •  `;
  ctx.save(); ctx.translate(768,768);
  ctx.font = '13px Arial'; ctx.textAlign = 'center';
  for (let i=0;i<imprint.length;i++) {
    const a = (i / imprint.length) * Math.PI * 2;
    ctx.save(); ctx.rotate(a); ctx.translate(0,-727);
    ctx.fillStyle='rgba(255,255,245,.78)';
    ctx.shadowColor='rgba(0,0,0,.8)'; ctx.shadowBlur=3;
    ctx.fillText(imprint[i],0,0); ctx.restore();
  }
  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function hubTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d')!;
  const gradient=ctx.createRadialGradient(256,256,0,256,256,256);
  [[0,'#d8dae0'],[.555,'#b7bbc6'],[.568,'#797e8d'],[.6,'#d6d9df'],[.64,'#e4e5e9'],[.68,'#b7bdc9'],[.78,'#a4aab6'],[.8,'#d0d4dc'],[.85,PALETTE.silver],[.91,'#949ba9'],[.965,'#b7bdc7'],[1,'#858d9c']].forEach(([stop,color])=>gradient.addColorStop(stop as number,color as string));
  ctx.fillStyle=gradient;ctx.fillRect(0,0,512,512);
  const shine=ctx.createLinearGradient(0,0,512,512);shine.addColorStop(0,'#ffffff00');shine.addColorStop(.4,'#ffffff24');shine.addColorStop(.6,'#ffffff00');shine.addColorStop(1,'#ffffff12');
  ctx.fillStyle=shine;ctx.fillRect(0,0,512,512);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export function DiscGallery(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  const movement = useRef({value: props.browsingIndex, target: props.browsingIndex, speed: 0});
  const [fallback, setFallback] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fallbackClick = useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(fallbackClick.current)clearTimeout(fallbackClick.current);},[]);
  useEffect(() => { live.current = props; });

  useEffect(() => {
    const m = movement.current;
    m.target = props.browsingIndex;
  }, [props.browsingIndex, props.tracks.length]);

  useEffect(() => {
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'}); }
    catch { queueMicrotask(() => setFallback(true)); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0,0);
    renderer.domElement.setAttribute('aria-hidden','true');
    element.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-640,640,360,-360,1,4000);
    camera.position.z = 1600;
    const ambient = new THREE.HemisphereLight(0xffffff,0xb5b2b7,2.3);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff,2.8);
    key.position.set(-600,700,1500); scene.add(key);
    const fill = new THREE.DirectionalLight(0xd4d8ef,1.1);
    fill.position.set(900,-300,600); scene.add(fill);

    const resources: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];
    const ring = (inner:number,outer:number,z:number,material:THREE.Material,parent:THREE.Group) => {
      const geo = new THREE.RingGeometry(inner,outer,192);
      const mesh = new THREE.Mesh(geo,material); mesh.position.z=z;
      parent.add(mesh); resources.push(geo,material); return mesh;
    };
    let needsRender = true;
    const hub=hubTexture();resources.push(hub);
    const noteMaterials = NOTE_PATHS.map((path, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 180;
      const ctx = canvas.getContext('2d')!;
      const color = NOTE_COLORS[index % NOTE_COLORS.length];
      
      // Classy gold leaf metallic gradient for orchestral elegance
      const grad = ctx.createLinearGradient(0, 0, 160, 180);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.28, color);
      grad.addColorStop(0.72, '#C5A059');
      grad.addColorStop(1, color);

      ctx.save();
      ctx.scale(4.5, 4.5);
      // Subtle, refined champagne specular glow (classy, aristocratic, never cartoonish)
      ctx.shadowColor = 'rgba(230, 202, 133, 0.45)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = grad;
      ctx.fill(new Path2D(path));
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        depthTest: false
      });
      resources.push(texture, material);
      return material;
    });
    const discs = live.current.tracks.map((track,index) => {
      const group = new THREE.Group();
      const platter = new THREE.Group(); group.add(platter);
      const paper = new THREE.MeshStandardMaterial({map:sleeveTexture(track),roughness:.91,metalness:.03,side:THREE.DoubleSide});
      resources.push(paper.map!);
      const front = ring(.224,.991,.005,paper,platter);
      front.userData.index = index;
      const edgeMaterial = new THREE.MeshStandardMaterial({color:PALETTE.silver,metalness:.72,roughness:.4,side:THREE.DoubleSide});
      ring(.991,1,.003,edgeMaterial,platter);
      ring(.98,1,-.006,new THREE.MeshStandardMaterial({color:0x92949c,metalness:.65,roughness:.45,side:THREE.DoubleSide}),platter);
      const edgeGeo = new THREE.CylinderGeometry(1,1,.009,192,1,true);
      edgeGeo.rotateX(Math.PI/2);
      const edge = new THREE.Mesh(edgeGeo,edgeMaterial); platter.add(edge); resources.push(edgeGeo);
      ring(.126,.224,.006,new THREE.MeshStandardMaterial({color:0xa7acb9,roughness:.42,metalness:.52,side:THREE.DoubleSide}),platter);
      ring(.14,.194,.009,new THREE.MeshStandardMaterial({color:0xd9dbe0,roughness:.5,metalness:.32,side:THREE.DoubleSide}),platter);
      ring(.126,.14,.01,new THREE.MeshStandardMaterial({color:0x8c919d,roughness:.44,metalness:.5,side:THREE.DoubleSide}),platter);
      ring(.195,.199,.011,new THREE.MeshBasicMaterial({color:0xe1e2e5,side:THREE.DoubleSide}),platter);
      ring(.216,.219,.011,new THREE.MeshBasicMaterial({color:0xbfc3cb,side:THREE.DoubleSide}),platter);
      ring(.126,.224,.017,new THREE.MeshBasicMaterial({map:hub,side:THREE.DoubleSide}),platter);
      // A restrained surface reflection; no opaque overlay across the artwork.
      const sheen = new THREE.ShaderMaterial({
        transparent:true, depthWrite:false, side:THREE.DoubleSide,
        uniforms:{uTime:{value:0}},
        vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader:'varying vec2 vUv; uniform float uTime; void main(){vec2 p=vUv-.5;float a=atan(p.y,p.x);float beam=pow(max(0.,cos(a*2.+.6)),22.);float grooves=sin(length(p)*2600.)*.012;vec3 col=mix(vec3(.86,.9,1.),vec3(1.,.93,.8),sin(a)*.5+.5);gl_FragColor=vec4(col,beam*.065+grooves+.012);}'
      });
      ring(.224,.99,.014,sheen,platter);
      const noteOrbit = new THREE.Group();
      group.add(noteOrbit);
      noteOrbit.visible = false;
      const notes = Array.from({ length: 16 }, (_, noteIndex) => {
        const note = new THREE.Sprite(noteMaterials[noteIndex % noteMaterials.length]);
        note.scale.set(0.15, 0.17, 1);
        note.renderOrder = 30;
        noteOrbit.add(note);
        return note;
      });
      scene.add(group);
      const img = new Image(); img.crossOrigin='anonymous';
      img.onload=()=>{
        if (disposed) return;
        const texture=sleeveTexture(track,img); resources.push(texture);
        const previous=paper.map;previous?.dispose();if(previous)resources.splice(resources.indexOf(previous),1);
        paper.map=texture;paper.needsUpdate=true;needsRender=true;
      };
      img.src=track.artworkUrl;
      return {group,platter,front,index,spin:0,selectionScale:1,noteOrbit,notes,notePhase:0};
    });
    let disposed=false;
    let width=0,height=0,radius=0,spacing=0;
    const resize = () => {
      width=element.clientWidth;height=element.clientHeight;needsRender=true;
      if(!width||!height)return;
      renderer.setSize(width,height);
      camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();
      radius=width<700 ? Math.min(width*.40,height*.30) : Math.min(width*.205,height*.365);
      spacing=radius*(width<700 ? 1.7 : 1.82);
    };
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
    let hovered=-1;
    let drag: {x:number;y:number;target:number;distance:number;pointer:number}|null=null;
    let wheelTotal=0,lastWheelInput=0,lastWheelStep=0;
    let lastTap: {index:number;at:number;x:number;y:number}|null=null;
    let pendingClick:ReturnType<typeof setTimeout>|null=null;
    const pick=(x:number,y:number)=>{
      const rect=element.getBoundingClientRect();
      pointer.set((x-rect.left)/width*2-1,-(y-rect.top)/height*2+1);
      raycaster.setFromCamera(pointer,camera);
      return raycaster.intersectObjects(discs.map(d=>d.front),false)[0]?.object.userData.index ?? -1;
    };
    const down=(e:PointerEvent)=>{
      if(e.button!==0)return;
      drag={x:e.clientX,y:e.clientY,target:movement.current.target,distance:0,pointer:e.pointerId};
      element.setPointerCapture(e.pointerId); setDragging(true);
    };
    const move=(e:PointerEvent)=>{
      if(drag){
        drag.distance=Math.max(drag.distance,Math.hypot(e.clientX-drag.x,e.clientY-drag.y));
        movement.current.target=Math.max(-.25,Math.min(discs.length-.75,drag.target-(e.clientX-drag.x)/spacing));
      }else{
        hovered=pick(e.clientX,e.clientY);
        element.style.cursor=hovered>=0?'pointer':'grab';
      }
    };
    const up=(e:PointerEvent)=>{
      if(!drag)return;
      const clicked=drag.distance<7;
      if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
      drag=null;setDragging(false);
      if(clicked){
        const index=pick(e.clientX,e.clientY);
        const now=performance.now();
        if(lastTap&&now-lastTap.at<450&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){
          if(pendingClick)clearTimeout(pendingClick);pendingClick=null;
          const openedIndex=lastTap.index;lastTap=null;live.current.onOpenTrack(openedIndex);
        }else if(index>=0){
          lastTap={index,at:now,x:e.clientX,y:e.clientY};
          live.current.onBrowse(index);live.current.onMinimizeTrack(index);
          if(pendingClick)clearTimeout(pendingClick);
          pendingClick=setTimeout(()=>{pendingClick=null;lastTap=null;live.current.onSelectTrack(live.current.tracks[index],index);},450);
        }else lastTap=null;
      }else{
        lastTap=null;if(pendingClick)clearTimeout(pendingClick);pendingClick=null;
        movement.current.target=clampIndex(Math.round(movement.current.target),discs.length);
        live.current.onBrowse(clampIndex(movement.current.target,discs.length));
      }
    };
    const cancel=()=>{drag=null;setDragging(false);movement.current.target=clampIndex(Math.round(movement.current.target),discs.length);live.current.onBrowse(clampIndex(movement.current.target,discs.length));};
    const wheel=(e:WheelEvent)=>{
      e.preventDefault();
      const now=performance.now(); if(now-lastWheelInput>180)wheelTotal=0;lastWheelInput=now;
      wheelTotal+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?18:1);
      if(Math.abs(wheelTotal)>55 && now-lastWheelStep>420){
        movement.current.target=clampIndex(Math.round(movement.current.target)+Math.sign(wheelTotal),discs.length);
        live.current.onBrowse(clampIndex(movement.current.target,discs.length));
        wheelTotal=0;lastWheelStep=now;
      }
    };
    element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);
    element.addEventListener('pointerup',up);element.addEventListener('pointercancel',cancel);
    element.addEventListener('wheel',wheel,{passive:false});
    let frame=0,lastTime=performance.now();
    let lastIsPlaying=false,lastPlayingIndex=-1;
    const animate=(time:number)=>{
      const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;
      const m=movement.current;
      const moving=Math.abs(m.target-m.value)>.0001||Math.abs(m.speed)>.001;
      const scaling = discs.some(d => {
        const target = (live.current.isBranched && d.index === live.current.browsingIndex)
          ? 0.58
          : (live.current.minimizedIndex === d.index ? 0.64 : 1);
        return Math.abs(d.selectionScale - target) > 0.001;
      });
      const playbackChanged=lastIsPlaying!==live.current.isPlaying||lastPlayingIndex!==live.current.playingIndex;
      if(!moving&&!scaling&&!live.current.isPlaying&&!needsRender&&!playbackChanged&&!live.current.isBranched){frame=requestAnimationFrame(animate);return;}
      if(live.current.reducedMotion){m.value=m.target;m.speed=0;}
      else {const stiffness=drag?65:48; m.speed+=(m.target-m.value)*stiffness*dt;m.speed*=Math.exp(-11*dt);m.value+=m.speed*dt;}
      lastIsPlaying=live.current.isPlaying;lastPlayingIndex=live.current.playingIndex;
      const mobile=width<700;
      discs.forEach(d=>{
        const diff=d.index-m.value;
        const isBranchedActive = !!live.current.isBranched && d.index === live.current.browsingIndex;
        // When branching canopy is open, focus solely on the active minimized CD in the lower-center
        d.group.visible = isBranchedActive || (!live.current.isBranched && Math.abs(diff) < 2.9);
        const step=diff<0?.78:1;
        
        const targetX = isBranchedActive
          ? 0
          : (mobile ? width*.06 : width*.155)+diff*spacing*step*(diff>0?1.16:1);
        // Center Footer positioning: exactly at the bottom of the stage
        const targetY = isBranchedActive
          ? -(height / 2) + (mobile ? 115 : 135)
          : (mobile ? -height*.015 : height*.10)+diff*radius*(diff<0?.37:.62);
        const targetZ = isBranchedActive ? 20 : -Math.abs(diff)*3;

        d.group.position.set(targetX, targetY, targetZ);

        if (isBranchedActive) {
          d.group.rotation.set(0.48, 0.20, -0.01);
        } else {
          // Euler XYZ produces the diagonal, foreshortened face of a physical CD.
          d.group.rotation.set(.72,.65,-.03+Math.max(-.07,Math.min(.07,m.speed*.008)));
        }

        const sizeTarget = isBranchedActive
          ? 0.50
          : (live.current.minimizedIndex===d.index?.64:1);

        d.selectionScale=live.current.reducedMotion?sizeTarget:THREE.MathUtils.lerp(d.selectionScale,sizeTarget,1-Math.exp(-10*dt));
        d.group.scale.setScalar(radius*(mobile?.94:1.04)*Math.max(.5,Math.min(1.3,1+diff*.18))*d.selectionScale);

        if(live.current.isPlaying&&live.current.playingIndex===d.index&&!live.current.reducedMotion)d.spin-=dt*.2;
        d.platter.rotation.z=d.spin;
        const playingHere=live.current.isPlaying&&live.current.playingIndex===d.index;
        d.noteOrbit.visible=playingHere;
        if(playingHere){
          // Restrained, stately orbital drift for classical violin notes
          if(!live.current.reducedMotion)d.notePhase+=dt*.20;
          d.notes.forEach((note,noteIndex)=>{
            const angle=d.notePhase+(noteIndex*Math.PI*2)/16;
            const r=1.18+(noteIndex%3)*0.08+Math.sin(d.notePhase*2+noteIndex)*0.03;
            const z=0.08+Math.sin(d.notePhase*2.5+noteIndex*1.5)*0.04;
            note.position.set(Math.cos(angle)*r,Math.sin(angle)*r,z);
          });
        }
      });
      renderer.render(scene,camera);needsRender=false;frame=requestAnimationFrame(animate);
    };
    frame=requestAnimationFrame(animate);
    const onContextLost=(e:Event)=>{e.preventDefault();setFallback(true);};
    renderer.domElement.addEventListener('webglcontextlost',onContextLost);
    return ()=>{
      disposed=true;if(pendingClick)clearTimeout(pendingClick);cancelAnimationFrame(frame);observer.disconnect();
      element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);
      element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancel);element.removeEventListener('wheel',wheel);
      renderer.domElement.removeEventListener('webglcontextlost',onContextLost);
      resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove();
    };
  }, []);

  return <div className={`disc-gallery-stage ${dragging?'is-dragging':''}`} ref={host} aria-label="Interactive compact disc collection">
    {fallback&&<button className={`fallback-disc ${props.minimizedIndex===props.browsingIndex?'fallback-disc--minimized':''}`} onClick={event=>{
      if(fallbackClick.current)clearTimeout(fallbackClick.current);
      props.onMinimizeTrack(props.browsingIndex);
      if(event.detail===2)props.onOpenTrack(props.browsingIndex);
      else if(event.detail===0)props.onSelectTrack(props.tracks[props.browsingIndex],props.browsingIndex);
      else fallbackClick.current=setTimeout(()=>props.onSelectTrack(props.tracks[props.browsingIndex],props.browsingIndex),450);
    }} style={{backgroundImage:`url(${props.tracks[props.browsingIndex].artworkUrl})`}} aria-label={`Play ${props.tracks[props.browsingIndex].title}`}><span/></button>}
    <div className="sr-only" aria-live="polite">{props.tracks[props.browsingIndex].title}, {props.browsingIndex+1} of {props.tracks.length}</div>
  </div>;
}
