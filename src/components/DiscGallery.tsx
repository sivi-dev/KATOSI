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
  isClosingBranches?: boolean;
}
const clampIndex = (value: number, count: number) => Math.max(0, Math.min(count - 1, value));

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  [
    [0, '#e8ebf2'],
    [0.45, '#d4d8e2'],
    [0.55, '#c8cdd8'],
    [0.60, '#f2f4f8'],
    [0.72, '#ffffff'],
    [0.82, '#c4c8d4'],
    [0.90, '#dce0ea'],
    [0.96, '#f4f6fa'],
    [1.0, '#b8bcc8']
  ].forEach(([stop, color]) => gradient.addColorStop(stop as number, color as string));
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 512);
  const shine = ctx.createLinearGradient(0, 0, 512, 512);
  shine.addColorStop(0, '#ffffff00');
  shine.addColorStop(0.35, '#ffffff40');
  shine.addColorStop(0.5, '#ffffff00');
  shine.addColorStop(0.7, '#ffffff24');
  shine.addColorStop(1, '#ffffff00');
  ctx.fillStyle = shine; ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
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
      const tiltGroup = new THREE.Group(); group.add(tiltGroup);
      const platter = new THREE.Group(); tiltGroup.add(platter);
      const paper = new THREE.MeshStandardMaterial({map:sleeveTexture(track),roughness:.91,metalness:.03,side:THREE.DoubleSide});
      resources.push(paper.map!);
      const front = ring(.224,.991,.005,paper,platter);
      front.userData.index = index;
      const edgeMaterial = new THREE.MeshStandardMaterial({color:PALETTE.silver,metalness:.72,roughness:.4,side:THREE.DoubleSide});
      ring(.991,1,.003,edgeMaterial,platter);
      ring(.98,1,-.006,new THREE.MeshStandardMaterial({color:0x92949c,metalness:.65,roughness:.45,side:THREE.DoubleSide}),platter);
      const edgeGeo = new THREE.CylinderGeometry(1,1,.016,192,1,true);
      edgeGeo.rotateX(Math.PI/2);
      const edge = new THREE.Mesh(edgeGeo,edgeMaterial); platter.add(edge); resources.push(edgeGeo);
      ring(.122,.126,.007,new THREE.MeshStandardMaterial({color:0xd8dbe2,roughness:.32,metalness:.78,side:THREE.DoubleSide}),platter);
      ring(.224,.228,.007,new THREE.MeshStandardMaterial({color:0xc8ccd6,roughness:.35,metalness:.72,side:THREE.DoubleSide}),platter);
      const hitGeo = new THREE.CircleGeometry(1, 32);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.z = 0.001;
      hitMesh.userData.index = index;
      platter.add(hitMesh);
      resources.push(hitGeo, hitMat);
      const hubMesh = ring(.126,.224,.012,new THREE.MeshBasicMaterial({map:hub,side:THREE.DoubleSide}),platter);
      hubMesh.userData.index = index;
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
      return {
        group,
        tiltGroup,
        platter,
        hitMesh,
        front,
        hubMesh,
        index,
        spin: 0,
        selectionScale: 1,
        noteOrbit,
        notes,
        notePhase: 0,
        targetTiltX: 0,
        targetTiltY: 0,
        currentTiltX: 0,
        currentTiltY: 0,
        targetHoverScale: 1.0,
        currentHoverScale: 1.0,
      };
    });
    let disposed=false;
    let width=0,height=0,radius=0,spacing=0;
    const resize = () => {
      width=element.clientWidth;height=element.clientHeight;needsRender=true;
      if(!width||!height)return;
      renderer.setSize(width,height);
      camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();
      radius=width<768 ? Math.min(width*.34,height*.24) : Math.min(width*0.175,height*0.295);
      spacing=radius*(width<768 ? 1.55 : 1.50);
    };
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
    let hovered=-1;
    let hoverNormU = 0;
    let hoverNormV = 0;
    let drag: {x:number;y:number;target:number;distance:number;pointer:number}|null=null;
    let wheelTotal=0,lastWheelInput=0,lastWheelStep=0;
    let lastTap: {index:number;at:number;x:number;y:number}|null=null;
    let pendingClick:ReturnType<typeof setTimeout>|null=null;
    const pick=(x:number,y:number)=>{
      const rect=element.getBoundingClientRect();
      pointer.set((x-rect.left)/width*2-1,-(y-rect.top)/height*2+1);
      raycaster.setFromCamera(pointer,camera);
      const targets = discs.filter(d=>d.group.visible).flatMap(d=>[d.hitMesh, d.front, d.hubMesh]);
      return raycaster.intersectObjects(targets,false)[0]?.object.userData.index ?? -1;
    };
    const transition = {
      phase: live.current.isBranched ? ('opened' as 'idle' | 'opening' | 'opened' | 'closing') : ('idle' as 'idle' | 'opening' | 'opened' | 'closing'),
      startTime: 0,
      duration: 1350,
      startPos: new THREE.Vector3(),
      startRot: new THREE.Euler(),
      startScale: 1,
      lastBranched: !!live.current.isBranched,
      lastClosing: !!live.current.isClosingBranches,
    };

    const down=(e:PointerEvent)=>{
      if(e.button!==0 || live.current.isBranched || transition.phase !== 'idle')return;
      drag={x:e.clientX,y:e.clientY,target:movement.current.target,distance:0,pointer:e.pointerId};
      element.setPointerCapture(e.pointerId); setDragging(true);
      hovered = -1;
      hoverNormU = 0;
      hoverNormV = 0;
    };
    const move=(e:PointerEvent)=>{
      if(live.current.isBranched || transition.phase !== 'idle'){
        if(transition.phase === 'opened' || (live.current.isBranched && transition.phase !== 'closing')){
          const hit = pick(e.clientX, e.clientY);
          element.style.cursor = (hit === live.current.browsingIndex) ? 'pointer' : 'default';
        } else {
          element.style.cursor = 'default';
        }
        return;
      }
      if(drag){
        drag.distance=Math.max(drag.distance,Math.hypot(e.clientX-drag.x,e.clientY-drag.y));
        movement.current.target=Math.max(-.25,Math.min(discs.length-.75,drag.target-(e.clientX-drag.x)/spacing));
        hovered=-1;
        hoverNormU = 0;
        hoverNormV = 0;
      }else{
        const rect=element.getBoundingClientRect();
        pointer.set(((e.clientX-rect.left)/width)*2-1,-((e.clientY-rect.top)/height)*2+1);
        raycaster.setFromCamera(pointer,camera);
        const targets = discs.filter(d=>d.group.visible).flatMap(d=>[d.front, d.hubMesh]);
        const intersects = raycaster.intersectObjects(targets,false);
        if(intersects.length > 0){
          const hitIndex = intersects[0].object.userData.index;
          hovered = hitIndex;
          element.style.cursor='pointer';
          const d = discs[hitIndex];
          if(d){
            // Calculate screen-space center of disc
            const discCenterX = rect.left + (d.group.position.x / (width / 2) + 1) * 0.5 * width;
            const discCenterY = rect.top + (-d.group.position.y / (height / 2) + 1) * 0.5 * height;
            const discRadius = d.group.scale.x;
            const discWidth = discRadius * 2;
            const discHeight = discRadius * 2 * Math.cos(0.64);
            hoverNormU = Math.max(-1, Math.min(1, (e.clientX - discCenterX) / (discWidth / 2)));
            hoverNormV = Math.max(-1, Math.min(1, (e.clientY - discCenterY) / (discHeight / 2)));
          }
        }else{
          hovered=-1;
          hoverNormU = 0;
          hoverNormV = 0;
          element.style.cursor='grab';
        }
      }
    };
    const leave=()=>{
      hovered=-1;
      hoverNormU = 0;
      hoverNormV = 0;
    };
    const up=(e:PointerEvent)=>{
      if(transition.phase === 'opened' || (live.current.isBranched && transition.phase !== 'closing')){
        if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
        drag=null;setDragging(false);
        const index=pick(e.clientX,e.clientY);
        if(index === live.current.browsingIndex){
          live.current.onSelectTrack(live.current.tracks[index],index);
        }
        return;
      }
      if(transition.phase !== 'idle'){
        if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
        drag=null;setDragging(false);
        return;
      }
      if(!drag)return;
      const clicked=drag.distance<7;
      if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
      drag=null;setDragging(false);
      if(clicked){
        const index=pick(e.clientX,e.clientY);
        const now=performance.now();
        if(lastTap&&now-lastTap.at<450&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){
          if(pendingClick)clearTimeout(pendingClick);pendingClick=null;
          const openedIndex=lastTap.index;lastTap=null;
          live.current.onOpenTrack(openedIndex);
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
        hovered = pick(e.clientX, e.clientY);
        element.style.cursor = hovered >= 0 ? 'pointer' : 'grab';
      }
    };
    const cancel=()=>{drag=null;setDragging(false);movement.current.target=clampIndex(Math.round(movement.current.target),discs.length);live.current.onBrowse(clampIndex(movement.current.target,discs.length));};
    const wheel=(e:WheelEvent)=>{
      if(live.current.isBranched || transition.phase !== 'idle')return;
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
    element.addEventListener('pointerleave',leave);
    element.addEventListener('wheel',wheel,{passive:false});
    let frame=0,lastTime=performance.now();
    let lastIsPlaying=false,lastPlayingIndex=-1;
    const animate=(time:number)=>{
      const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;
      const m=movement.current;
      const mobile=width<768;

      // Coordinate opening and closing transitions
      const isEntering = !!live.current.isBranched && !live.current.isClosingBranches && !transition.lastBranched;
      const isExiting = (!!live.current.isClosingBranches && !transition.lastClosing) || (!live.current.isBranched && transition.lastBranched);

      if (isEntering && transition.phase !== 'opening' && transition.phase !== 'opened') {
        transition.phase = 'opening';
        transition.startTime = time;
        transition.duration = live.current.reducedMotion ? 250 : 1350;
        const curDisc = discs[live.current.browsingIndex];
        if (curDisc) {
          transition.startPos.copy(curDisc.group.position);
          transition.startRot.copy(curDisc.tiltGroup.rotation);
          transition.startScale = curDisc.group.scale.x;
        }
      } else if (isExiting && transition.phase !== 'closing' && transition.phase !== 'idle') {
        transition.phase = 'closing';
        transition.startTime = time;
        transition.duration = live.current.reducedMotion ? 250 : 1100;
        const curDisc = discs[live.current.browsingIndex];
        if (curDisc) {
          transition.startPos.copy(curDisc.group.position);
          transition.startRot.copy(curDisc.tiltGroup.rotation);
          transition.startScale = curDisc.group.scale.x;
        }
      }
      transition.lastBranched = !!live.current.isBranched;
      transition.lastClosing = !!live.current.isClosingBranches;

      const isTransitioning = transition.phase === 'opening' || transition.phase === 'closing';
      const moving=Math.abs(m.target-m.value)>.0001||Math.abs(m.speed)>.001;
      const scaling = discs.some(d => Math.abs(d.selectionScale - (live.current.minimizedIndex === d.index ? 0.64 : 1)) > 0.001);
      const tilting = discs.some(d => Math.abs(d.currentTiltX - d.targetTiltX) > 0.001 || Math.abs(d.currentTiltY - d.targetTiltY) > 0.001 || Math.abs(d.currentHoverScale - d.targetHoverScale) > 0.001);
      const playbackChanged=lastIsPlaying!==live.current.isPlaying||lastPlayingIndex!==live.current.playingIndex;

      if(!moving&&!isTransitioning&&!scaling&&!tilting&&!live.current.isPlaying&&!needsRender&&!playbackChanged&&transition.phase==='idle'&&hovered===-1){
        frame=requestAnimationFrame(animate);
        return;
      }

      if(live.current.reducedMotion){m.value=m.target;m.speed=0;}
      else {const stiffness=drag?65:48; m.speed+=(m.target-m.value)*stiffness*dt;m.speed*=Math.exp(-11*dt);m.value+=m.speed*dt;}
      lastIsPlaying=live.current.isPlaying;lastPlayingIndex=live.current.playingIndex;

      const targetLowerCenterY = mobile ? -height * 0.20 : -height * 0.24;
      const targetLowerCenterScale = radius * (mobile ? 1.05 : 1.15);

      const baseRotX = mobile ? 0.38 : 0.64;
      const baseRotY = mobile ? 0.14 : 0.20;
      const baseRotZ = mobile ? -0.10 : -0.32;
      const galleryCenterX = mobile ? 0 : width * 0.015;
      const galleryCenterY = mobile ? -height * 0.04 : height * 0.015;

      discs.forEach(d=>{
        const diff=d.index-m.value;
        const spacingX = radius * (mobile ? 1.55 : 1.50);
        const spacingY = radius * (mobile ? 0.25 : 0.46);

        let galX = 0;
        let galY = 0;
        let sizeProgression = 1.0;

        if (diff < 0) {
          galX = galleryCenterX + diff * spacingX * (mobile ? 1.0 : 1.05);
          galY = galleryCenterY + diff * spacingY * (mobile ? 1.0 : 1.02);
          sizeProgression = Math.max(0.48, 1.0 + diff * (mobile ? 0.14 : 0.22));
        } else if (diff > 0) {
          galX = galleryCenterX + diff * spacingX * (mobile ? 1.0 : 1.35);
          galY = galleryCenterY + diff * spacingY * (mobile ? 1.0 : 1.25);
          sizeProgression = Math.min(1.42, 1.0 + diff * (mobile ? 0.14 : 0.26));
        } else {
          galX = galleryCenterX;
          galY = galleryCenterY;
          sizeProgression = 1.0;
        }

        const heroFactor = Math.max(0, 1 - Math.abs(diff));
        const galZ = -120 - Math.abs(diff) * 50 + heroFactor * 220;
        const order = Math.round(5 + heroFactor * 20);
        d.platter.traverse(child => { child.renderOrder = order; });

        const baseScale = radius * (mobile ? 0.95 : 1.0) * sizeProgression;

        if (transition.phase === 'opening') {
          const elapsed = time - transition.startTime;
          const p = Math.min(1, elapsed / transition.duration);
          const easeT = easeInOutCubic(p);

          if (d.index === live.current.browsingIndex) {
            const arcY = Math.sin(easeT * Math.PI) * 36;
            d.group.position.set(
              THREE.MathUtils.lerp(transition.startPos.x, 0, easeT),
              THREE.MathUtils.lerp(transition.startPos.y, targetLowerCenterY, easeT) + arcY,
              THREE.MathUtils.lerp(transition.startPos.z, 45, easeT)
            );
            d.tiltGroup.rotation.set(
              THREE.MathUtils.lerp(transition.startRot.x, 0, easeT),
              THREE.MathUtils.lerp(transition.startRot.y, 0, easeT),
              THREE.MathUtils.lerp(transition.startRot.z, 0, easeT)
            );
            d.group.scale.setScalar(THREE.MathUtils.lerp(transition.startScale, targetLowerCenterScale, easeT));
            d.group.visible = true;
          } else {
            const driftT = Math.min(1, elapsed / 250);
            const dir = d.index < live.current.browsingIndex ? -1 : 1;
            d.group.position.set(
              galX + dir * driftT * (radius * 0.65),
              galY + dir * driftT * (radius * 0.15),
              galZ
            );
            d.tiltGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
            d.group.scale.setScalar(baseScale * (1 - driftT * 0.15));
            d.group.visible = driftT < 1;
          }

          if (p >= 1) {
            transition.phase = 'opened';
          }
        } else if (transition.phase === 'closing') {
          const elapsed = time - transition.startTime;
          const p = Math.min(1, elapsed / transition.duration);
          const easeT = easeInOutCubic(p);

          if (d.index === live.current.browsingIndex) {
            const arcY = Math.sin(easeT * Math.PI) * 36;
            d.group.position.set(
              THREE.MathUtils.lerp(transition.startPos.x, galX, easeT),
              THREE.MathUtils.lerp(transition.startPos.y, galY, easeT) + arcY,
              THREE.MathUtils.lerp(transition.startPos.z, galZ, easeT)
            );
            d.tiltGroup.rotation.set(
              THREE.MathUtils.lerp(transition.startRot.x, baseRotX, easeT),
              THREE.MathUtils.lerp(transition.startRot.y, baseRotY, easeT),
              THREE.MathUtils.lerp(transition.startRot.z, baseRotZ, easeT)
            );
            d.group.scale.setScalar(THREE.MathUtils.lerp(transition.startScale, baseScale, easeT));
            d.group.visible = true;
          } else {
            const driftT = Math.max(0, (1 - p) / 0.55);
            const dir = d.index < live.current.browsingIndex ? -1 : 1;
            d.group.position.set(
              galX + dir * driftT * (radius * 0.65),
              galY + dir * driftT * (radius * 0.15),
              galZ
            );
            d.tiltGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
            d.group.scale.setScalar(baseScale * (1 - driftT * 0.15));
            d.group.visible = Math.abs(diff) < 2.9;
          }

          if (p >= 1) {
            transition.phase = 'idle';
          }
        } else if (transition.phase === 'opened' || (live.current.isBranched && !live.current.isClosingBranches)) {
          if (d.index === live.current.browsingIndex) {
            d.group.position.set(0, targetLowerCenterY, 45);
            d.tiltGroup.rotation.set(0, 0, 0);
            d.group.scale.setScalar(targetLowerCenterScale);
            d.group.visible = true;
          } else {
            d.group.visible = false;
          }
        } else {
          // Regular Gallery browsing with hover tilt
          d.group.visible = Math.abs(diff) < 2.9;

          const isHovered = (hovered === d.index) && !drag && !live.current.reducedMotion;
          if (isHovered) {
            const maxTiltX = (6 * Math.PI) / 180;
            const maxTiltY = (8 * Math.PI) / 180;
            d.targetTiltX = -hoverNormV * maxTiltX;
            d.targetTiltY = hoverNormU * maxTiltY;
            d.targetHoverScale = 1.025;
          } else {
            d.targetTiltX = 0;
            d.targetTiltY = 0;
            d.targetHoverScale = 1.0;
          }

          const tiltSpeed = live.current.reducedMotion ? 1 : (1 - Math.exp(-14 * dt));
          d.currentTiltX += (d.targetTiltX - d.currentTiltX) * tiltSpeed;
          d.currentTiltY += (d.targetTiltY - d.currentTiltY) * tiltSpeed;
          d.currentHoverScale += (d.targetHoverScale - d.currentHoverScale) * tiltSpeed;

          d.group.position.set(galX, galY, galZ);
          d.tiltGroup.rotation.set(
            baseRotX + d.currentTiltX,
            baseRotY + d.currentTiltY,
            baseRotZ
          );

          const sizeTarget = live.current.minimizedIndex === d.index ? 0.64 : 1.0;
          d.selectionScale = live.current.reducedMotion ? sizeTarget : THREE.MathUtils.lerp(d.selectionScale, sizeTarget, 1 - Math.exp(-10 * dt));

          const effectiveScale = baseScale * d.selectionScale * d.currentHoverScale;
          d.group.scale.setScalar(effectiveScale);
        }

        // Platter spin rotates continuously around local Z axis during playback
        if (live.current.isPlaying && live.current.playingIndex === d.index && !live.current.reducedMotion) {
          d.spin -= dt * 0.15;
        }
        d.platter.rotation.z = d.spin;

        const isBranchedActive = live.current.isBranched || transition.phase !== 'idle';
        const playingHere = live.current.isPlaying && live.current.playingIndex === d.index && !isBranchedActive;
        d.noteOrbit.visible = playingHere;
        if (playingHere) {
          if (!live.current.reducedMotion) d.notePhase += dt * 0.20;
          d.notes.forEach((note, noteIndex) => {
            const angle = d.notePhase + (noteIndex * Math.PI * 2) / 16;
            const r = 1.18 + (noteIndex % 3) * 0.08 + Math.sin(d.notePhase * 2 + noteIndex) * 0.03;
            const z = 0.08 + Math.sin(d.notePhase * 2.5 + noteIndex * 1.5) * 0.04;
            note.position.set(Math.cos(angle) * r, Math.sin(angle) * r, z);
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
      element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancel);
      element.removeEventListener('pointerleave',leave);element.removeEventListener('wheel',wheel);
      renderer.domElement.removeEventListener('webglcontextlost',onContextLost);
      resources.forEach(r=>r.dispose());renderer.dispose();renderer.domElement.remove();
    };
  }, []);

  return <div className={`disc-gallery-stage ${dragging?'is-dragging':''}`} ref={host} aria-label="Interactive compact disc collection">
    {fallback&&<button className={`fallback-disc ${props.isBranched ? 'fallback-disc--branched' : (props.minimizedIndex===props.browsingIndex?'fallback-disc--minimized':'')}`} onClick={event=>{
      if(fallbackClick.current)clearTimeout(fallbackClick.current);
      props.onMinimizeTrack(props.browsingIndex);
      if(event.detail===2)props.onOpenTrack(props.browsingIndex);
      else if(event.detail===0)props.onSelectTrack(props.tracks[props.browsingIndex],props.browsingIndex);
      else fallbackClick.current=setTimeout(()=>props.onSelectTrack(props.tracks[props.browsingIndex],props.browsingIndex),450);
    }} style={{backgroundImage:`url(${props.tracks[props.browsingIndex].artworkUrl})`}} aria-label={`Play ${props.tracks[props.browsingIndex].title}`}><span/></button>}
    <div className="sr-only" aria-live="polite">{props.tracks[props.browsingIndex].title}, {props.browsingIndex+1} of {props.tracks.length}</div>
  </div>;
}
