import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Same relationship points as the 2D visualizations
const POINTS = [
  { label: 'Acquaintance', x: 0.15, y: 0.08 },
  { label: 'Work colleague', x: 0.20, y: 0.20 },
  { label: 'Mentor', x: 0.08, y: 0.55 },
  { label: 'New crush', x: 0.55, y: 0.30 },
  { label: 'Casual sex', x: 0.85, y: 0.25 },
  { label: 'One-night stand', x: 0.95, y: 0.08 },
  { label: 'Cuddly friend', x: 0.40, y: 0.50 },
  { label: 'FWB', x: 0.70, y: 0.40 },
  { label: 'Deep friendship', x: 0.15, y: 0.85 },
  { label: 'Childhood best friend', x: 0.10, y: 0.92 },
  { label: 'Long-term affair', x: 0.75, y: 0.70 },
  { label: 'Romantic partner', x: 0.65, y: 0.88 },
];

const TROUGHS = [
  { cx: 0.18, cy: 0.82, sx: 0.14, sy: 0.14, A: -1.0, label: 'Deep friendships' },
  { cx: 0.62, cy: 0.85, sx: 0.18, sy: 0.12, A: -0.85, label: 'Romantic love' },
  { cx: 0.50, cy: 0.50, sx: 0.12, sy: 0.12, A: -0.5, label: 'Tender middle' },
  { cx: 0.80, cy: 0.30, sx: 0.10, sy: 0.10, A: -0.4, label: 'Casual touch' },
  { cx: 0.15, cy: 0.40, sx: 0.10, sy: 0.12, A: -0.3, label: 'Mentorship' },
];

const RIDGES = [
  { cx: 0.50, cy: 0.15, sx: 0.25, sy: 0.08, A: 0.7, label: 'Empty physicality' },
  { cx: 0.90, cy: 0.60, sx: 0.08, sy: 0.15, A: 0.6, label: 'Ungrounded intensity' },
  { cx: 0.35, cy: 0.70, sx: 0.08, sy: 0.08, A: 0.4, label: 'Uncertainty ridge' },
];

const ALL_FEATURES = [...TROUGHS, ...RIDGES];

const MAP_CX = 0.40, MAP_CY = 0.55, MAP_RX = 0.48, MAP_RY = 0.50;

function gaussian(x, y, cx, cy, sx, sy, A) {
  const dx = (x - cx) / sx, dy = (y - cy) / sy;
  return A * Math.exp(-(dx * dx + dy * dy) / 2);
}

function terrainHeight(x, y) {
  let h = 0;
  for (const f of ALL_FEATURES) h += gaussian(x, y, f.cx, f.cy, f.sx, f.sy, f.A);
  return h;
}

function mappedness(x, y) {
  const dx = (x - MAP_CX) / MAP_RX, dy = (y - MAP_CY) / MAP_RY;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, Math.min(1, (1.15 - d) / 0.2));
}

function heightColor(h, m) {
  const nh = Math.max(-1, Math.min(1, h));
  let r, g, b;
  if (nh < 0) {
    const t = -nh;
    r = (0x1A + (0x1D - 0x1A) * t) / 255;
    g = (0x8A + (0x9E - 0x8A) * t) / 255;
    b = (0x8A + (0x75 - 0x8A) * t) / 255;
  } else {
    const t = nh;
    r = (0xC8 + (0xD8 - 0xC8) * t) / 255;
    g = (0x6A + (0x5A - 0x6A) * t) / 255;
    b = 0x30 / 255;
  }
  if (m < 1) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * m + gray * (1 - m);
    g = g * m + gray * (1 - m);
    b = b * m + gray * (1 - m);
  }
  return new THREE.Color(r, g, b);
}

// Create a text sprite with transparent background
function makeLabel(text, isDark, fontSize) {
  const canvas = document.createElement('canvas');
  const sz = fontSize || 28;
  const ctx = canvas.getContext('2d');
  ctx.font = `${sz}px system-ui, sans-serif`;
  const tw = ctx.measureText(text).width;
  canvas.width = Math.ceil(tw) + 16;
  canvas.height = sz + 12;
  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${sz}px system-ui, sans-serif`;
  ctx.fillStyle = isDark ? '#e0ded6' : '#2c2c2a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(canvas.width / 400, canvas.height / 400, 1);
  return { sprite, texture: tex, material: mat };
}

// Build the base plane: grid lines, axes, axis labels, and relationship dots
function buildBasePlane(scene, isDark) {
  const resources = [];
  const gridColor = isDark ? 0x444444 : 0xcccccc;
  const axisColor = isDark ? 0x888888 : 0x666666;
  const pointColor = 0x7F77DD;

  // Grid lines (4x4)
  const gridMat = new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.4 });
  resources.push(gridMat);
  for (let i = 1; i < 4; i++) {
    const f = i / 4;
    // Vertical (along Y at fixed X)
    const vg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(f, 0, 0), new THREE.Vector3(f, 1, 0)]);
    scene.add(new THREE.Line(vg, gridMat));
    resources.push(vg);
    // Horizontal
    const hg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, f, 0), new THREE.Vector3(1, f, 0)]);
    scene.add(new THREE.Line(hg, gridMat));
    resources.push(hg);
  }

  // Axis lines (border of the unit square)
  const axisMat = new THREE.LineBasicMaterial({ color: axisColor, linewidth: 2 });
  resources.push(axisMat);
  const border = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 1, 0), new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0),
  ]);
  scene.add(new THREE.LineSegments(border, axisMat));
  resources.push(border);

  // Axis labels
  const xLeft = makeLabel('Emotional', isDark, 22);
  xLeft.sprite.position.set(0.15, -0.07, 0);
  scene.add(xLeft.sprite);
  resources.push(xLeft.texture, xLeft.material);

  const xRight = makeLabel('Physical', isDark, 22);
  xRight.sprite.position.set(0.85, -0.07, 0);
  scene.add(xRight.sprite);
  resources.push(xRight.texture, xRight.material);

  const xMid = makeLabel('Expression →', isDark, 20);
  xMid.sprite.position.set(0.5, -0.07, 0);
  scene.add(xMid.sprite);
  resources.push(xMid.texture, xMid.material);

  const yBot = makeLabel('Shallow', isDark, 22);
  yBot.sprite.position.set(-0.09, 0.08, 0);
  scene.add(yBot.sprite);
  resources.push(yBot.texture, yBot.material);

  const yTop = makeLabel('Deep', isDark, 22);
  yTop.sprite.position.set(-0.06, 0.92, 0);
  scene.add(yTop.sprite);
  resources.push(yTop.texture, yTop.material);

  const yMid = makeLabel('↑ Intimacy', isDark, 20);
  yMid.sprite.position.set(-0.09, 0.5, 0);
  scene.add(yMid.sprite);
  resources.push(yMid.texture, yMid.material);

  // Z-axis label
  const zLabel = makeLabel('↑ Energy barrier', isDark, 18);
  zLabel.sprite.position.set(-0.05, -0.03, 0.35);
  scene.add(zLabel.sprite);
  resources.push(zLabel.texture, zLabel.material);

  // Relationship dots projected onto the floor
  const dotGeo = new THREE.SphereGeometry(0.008, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: pointColor, transparent: true, opacity: 0.5 });
  resources.push(dotGeo, dotMat);

  for (const pt of POINTS) {
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(pt.x, pt.y, 0);
    scene.add(dot);

    // Small label
    const lab = makeLabel(pt.label, isDark, 16);
    lab.sprite.position.set(pt.x + 0.04, pt.y, 0.005);
    lab.sprite.scale.multiplyScalar(0.7);
    scene.add(lab.sprite);
    resources.push(lab.texture, lab.material);
  }

  // Semi-transparent floor fill
  const floorGeo = new THREE.PlaneGeometry(1, 1);
  const floorMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x222222 : 0xf5f5f0,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0.5, 0.5, -0.002);
  scene.add(floor);
  resources.push(floorGeo, floorMat);

  // Vertical drop-lines from terrain features to floor (visual anchoring)
  const dropMat = new THREE.LineDashedMaterial({
    color: isDark ? 0x555555 : 0xaaaaaa,
    dashSize: 0.02,
    gapSize: 0.01,
    transparent: true,
    opacity: 0.4,
  });
  resources.push(dropMat);

  for (const f of ALL_FEATURES) {
    const h = terrainHeight(f.cx, f.cy) * mappedness(f.cx, f.cy) * 0.35;
    if (Math.abs(h) > 0.02) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(f.cx, f.cy, 0),
        new THREE.Vector3(f.cx, f.cy, h),
      ]);
      const line = new THREE.Line(lineGeo, dropMat);
      line.computeLineDistances();
      scene.add(line);
      resources.push(lineGeo);
    }
  }

  return resources;
}

export function init(container, options = {}) {
  const isDark = options.dark ?? false;
  const canvasHeight = parseInt(options.height) || 480;
  const canvasWidth = container.clientWidth || 800;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(isDark ? '#1a1a1a' : '#fafaf8');

  // Camera — elevated angle that clearly shows the floor plane with terrain above it
  const camera = new THREE.PerspectiveCamera(50, canvasWidth / canvasHeight, 0.01, 100);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0.8, 0.3, 1.2);
  scene.add(dirLight);

  // Height scaling factor — keeps terrain readable without overwhelming the floor
  const heightScale = 0.35;

  // Build the terrain mesh (unit square from 0,0 to 1,1 in XY, height along Z)
  const segs = 100;
  const geo = new THREE.BufferGeometry();
  const verts = [];
  const cols = [];
  const indices = [];

  for (let iy = 0; iy <= segs; iy++) {
    for (let ix = 0; ix <= segs; ix++) {
      const x = ix / segs;
      const y = iy / segs;
      const h = terrainHeight(x, y);
      const m = mappedness(x, y);
      const z = h * m * heightScale;

      verts.push(x, y, z);
      const c = heightColor(h, m);
      cols.push(c.r, c.g, c.b);
    }
  }

  for (let iy = 0; iy < segs; iy++) {
    for (let ix = 0; ix < segs; ix++) {
      const a = iy * (segs + 1) + ix;
      const b = a + 1;
      const c = a + (segs + 1);
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.computeVertexNormals();

  const terrainMat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    shininess: 15,
    side: THREE.DoubleSide,
  });
  const terrainMesh = new THREE.Mesh(geo, terrainMat);
  scene.add(terrainMesh);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: isDark ? 0x444444 : 0xd0d0ce,
    transparent: true,
    opacity: 0.1,
  });
  const wireMesh = new THREE.Mesh(geo, wireMat);
  scene.add(wireMesh);

  // Feature labels floating above the terrain
  const labelResources = [];
  for (const f of ALL_FEATURES) {
    const h = terrainHeight(f.cx, f.cy);
    const m = mappedness(f.cx, f.cy);
    const z = h * m * heightScale;
    const lab = makeLabel(f.label, isDark, 20);
    lab.sprite.position.set(f.cx, f.cy, z + (h < 0 ? -0.06 : 0.06));
    scene.add(lab.sprite);
    labelResources.push(lab);
  }

  // Build the 2D base plane (grid, axes, dots) at Z=0
  const baseResources = buildBasePlane(scene, isDark);

  // Orbit controls — spherical coords around the center of the scene
  const center = new THREE.Vector3(0.5, 0.5, 0.0);
  let theta = -Math.PI * 0.3;   // azimuthal
  let phi = Math.PI * 0.3;      // polar (from top)
  let radius = 1.6;

  function updateCamera() {
    // phi: 0 = top-down, PI/2 = horizontal
    camera.position.set(
      center.x + radius * Math.sin(phi) * Math.cos(theta),
      center.y + radius * Math.sin(phi) * Math.sin(theta),
      center.z + radius * Math.cos(phi),
    );
    camera.up.set(0, 0, 1);
    camera.lookAt(center);
  }
  updateCamera();

  // Interaction
  let dragging = false;
  let prev = { x: 0, y: 0 };

  function onDown(e) {
    dragging = true;
    const p = e.touches ? e.touches[0] : e;
    prev = { x: p.clientX, y: p.clientY };
  }
  function onMove(e) {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - prev.x;
    const dy = p.clientY - prev.y;
    theta -= dx * 0.006;
    phi = Math.max(0.15, Math.min(Math.PI * 0.48, phi + dy * 0.006));
    prev = { x: p.clientX, y: p.clientY };
    updateCamera();
  }
  function onUp() { dragging = false; }

  function onWheel(e) {
    e.preventDefault();
    radius = Math.max(0.7, Math.min(3.0, radius + e.deltaY * 0.002));
    updateCamera();
  }

  // Pinch zoom
  let pinchDist = 0;
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      dragging = false;
      pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    } else {
      onDown(e);
    }
  }
  function onTouchMove(e) {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      radius = Math.max(0.7, Math.min(3.0, radius - (d - pinchDist) * 0.003));
      pinchDist = d;
      updateCamera();
    } else {
      onMove(e);
    }
  }

  const el = renderer.domElement;
  el.addEventListener('mousedown', onDown);
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseup', onUp);
  el.addEventListener('mouseleave', onUp);
  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: true });
  el.addEventListener('touchend', onUp);

  // Help text
  const hint = document.createElement('div');
  hint.textContent = 'Drag to orbit · Scroll to zoom';
  hint.style.cssText = `text-align:center;font:11px system-ui,sans-serif;color:${isDark ? '#73726c' : '#9c9a92'};margin-top:6px;`;
  container.appendChild(hint);

  // Render loop
  let frameId;
  function loop() {
    frameId = requestAnimationFrame(loop);
    renderer.render(scene, camera);
  }
  loop();

  return {
    destroy() {
      cancelAnimationFrame(frameId);
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mouseleave', onUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onUp);
      geo.dispose();
      terrainMat.dispose();
      wireMat.dispose();
      for (const r of baseResources) { if (r.dispose) r.dispose(); }
      for (const l of labelResources) { l.texture.dispose(); l.material.dispose(); }
      renderer.dispose();
      container.innerHTML = '';
    },
    resize() {
      const w = container.clientWidth;
      camera.aspect = w / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(w, canvasHeight);
    },
  };
}
