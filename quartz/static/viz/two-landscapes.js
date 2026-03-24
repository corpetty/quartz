import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Same relationship points as the 2D visualizations
const POINTS = [
  { label: 'Acquaintance', x: 0.15, y: 0.08 },
  { label: 'Colleague', x: 0.20, y: 0.20 },
  { label: 'Mentor', x: 0.08, y: 0.55 },
  { label: 'New crush', x: 0.55, y: 0.30 },
  { label: 'Casual sex', x: 0.85, y: 0.25 },
  { label: 'Cuddly friend', x: 0.40, y: 0.50 },
  { label: 'FWB', x: 0.70, y: 0.40 },
  { label: 'Deep friendship', x: 0.15, y: 0.85 },
  { label: 'Romantic partner', x: 0.65, y: 0.88 },
];

const BUMPS_A = [
  { cx: 0.18, cy: 0.82, sx: 0.14, sy: 0.14, A: -1.0, label: 'Deep friendships' },
  { cx: 0.62, cy: 0.85, sx: 0.18, sy: 0.12, A: -0.85, label: 'Romantic love' },
  { cx: 0.50, cy: 0.50, sx: 0.12, sy: 0.12, A: -0.5, label: 'Tender middle' },
  { cx: 0.80, cy: 0.30, sx: 0.10, sy: 0.10, A: -0.4, label: 'Casual touch' },
  { cx: 0.15, cy: 0.40, sx: 0.10, sy: 0.12, A: -0.3, label: 'Mentorship' },
  { cx: 0.50, cy: 0.15, sx: 0.25, sy: 0.08, A: 0.7 },
  { cx: 0.90, cy: 0.60, sx: 0.08, sy: 0.15, A: 0.6 },
  { cx: 0.35, cy: 0.70, sx: 0.08, sy: 0.08, A: 0.4 },
];

const BUMPS_B = [
  { cx: 0.20, cy: 0.75, sx: 0.12, sy: 0.12, A: -0.8, label: 'Deep friendships' },
  { cx: 0.55, cy: 0.90, sx: 0.15, sy: 0.10, A: -0.9, label: 'Romantic love' },
  { cx: 0.75, cy: 0.45, sx: 0.10, sy: 0.10, A: -0.3, label: 'Physical play' },
  { cx: 0.50, cy: 0.50, sx: 0.15, sy: 0.15, A: 0.5, label: 'Tender middle (barrier)' },
  { cx: 0.85, cy: 0.25, sx: 0.10, sy: 0.10, A: 0.4 },
  { cx: 0.40, cy: 0.15, sx: 0.20, sy: 0.08, A: 0.6 },
];

// Labels for the combined view
const COMBINED_LABELS = [
  { cx: 0.19, cy: 0.78, label: 'Shared openness' },
  { cx: 0.58, cy: 0.87, label: 'Shared openness' },
  { cx: 0.50, cy: 0.50, label: 'Negotiation needed' },
  { cx: 0.82, cy: 0.28, label: 'Tension point' },
];

const HEIGHT_SCALE = 0.35;
const SEGS = 80;

function gaussian(x, y, cx, cy, sx, sy, A) {
  const dx = (x - cx) / sx, dy = (y - cy) / sy;
  return A * Math.exp(-(dx * dx + dy * dy) / 2);
}

function evalHeight(x, y, bumps) {
  let h = 0;
  for (const b of bumps) h += gaussian(x, y, b.cx, b.cy, b.sx, b.sy, b.A);
  return h;
}

function heightColor(h) {
  const nh = Math.max(-1, Math.min(1, h));
  if (nh < 0) {
    const t = -nh;
    return new THREE.Color(
      (0x1A + (0x1D - 0x1A) * t) / 255,
      (0x8A + (0x9E - 0x8A) * t) / 255,
      (0x8A + (0x75 - 0x8A) * t) / 255,
    );
  } else {
    const t = nh;
    return new THREE.Color(
      (0xC8 + (0xD8 - 0xC8) * t) / 255,
      (0x6A + (0x5A - 0x6A) * t) / 255,
      0x30 / 255,
    );
  }
}

function makeLabel(text, isDark, fontSize) {
  const canvas = document.createElement('canvas');
  const sz = fontSize || 28;
  const ctx = canvas.getContext('2d');
  ctx.font = `${sz}px system-ui, sans-serif`;
  const tw = ctx.measureText(text).width;
  canvas.width = Math.ceil(tw) + 16;
  canvas.height = sz + 12;
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

function buildBasePlane(scene, isDark) {
  const resources = [];
  const gridColor = isDark ? 0x444444 : 0xcccccc;
  const axisColor = isDark ? 0x888888 : 0x666666;

  // Grid 4x4
  const gridMat = new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.4 });
  resources.push(gridMat);
  for (let i = 1; i < 4; i++) {
    const f = i / 4;
    const vg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(f, 0, 0), new THREE.Vector3(f, 1, 0)]);
    scene.add(new THREE.Line(vg, gridMat));
    resources.push(vg);
    const hg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, f, 0), new THREE.Vector3(1, f, 0)]);
    scene.add(new THREE.Line(hg, gridMat));
    resources.push(hg);
  }

  // Border
  const axisMat = new THREE.LineBasicMaterial({ color: axisColor });
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
  const labels = [
    ['Emotional', 0.15, -0.06, 0], ['Expression →', 0.5, -0.06, 0], ['Physical', 0.85, -0.06, 0],
    ['Shallow', -0.08, 0.08, 0], ['↑ Intimacy', -0.08, 0.5, 0], ['Deep', -0.06, 0.92, 0],
  ];
  for (const [text, x, y, z] of labels) {
    const l = makeLabel(text, isDark, 20);
    l.sprite.position.set(x, y, z);
    scene.add(l.sprite);
    resources.push(l.texture, l.material);
  }

  // Relationship dots on floor
  const dotGeo = new THREE.SphereGeometry(0.007, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x7F77DD, transparent: true, opacity: 0.45 });
  resources.push(dotGeo, dotMat);
  for (const pt of POINTS) {
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(pt.x, pt.y, 0);
    scene.add(dot);
    const lab = makeLabel(pt.label, isDark, 14);
    lab.sprite.position.set(pt.x + 0.035, pt.y, 0.003);
    lab.sprite.scale.multiplyScalar(0.6);
    scene.add(lab.sprite);
    resources.push(lab.texture, lab.material);
  }

  // Semi-transparent floor
  const floorGeo = new THREE.PlaneGeometry(1, 1);
  const floorMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x222222 : 0xf5f5f0, transparent: true, opacity: 0.25, side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0.5, 0.5, -0.002);
  scene.add(floor);
  resources.push(floorGeo, floorMat);

  return resources;
}

export function init(container, options = {}) {
  const isDark = options.dark ?? false;
  const canvasHeight = parseInt(options.height) || 480;
  const canvasWidth = container.clientWidth || 800;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(isDark ? '#1a1a1a' : '#fafaf8');

  const camera = new THREE.PerspectiveCamera(50, canvasWidth / canvasHeight, 0.01, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0.8, 0.3, 1.2);
  scene.add(dirLight);

  // Build terrain geometry — vertices in XY plane, height along Z
  const geo = new THREE.BufferGeometry();
  const vertCount = (SEGS + 1) * (SEGS + 1);
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices = [];

  // Initialize positions (X, Y fixed; Z will be set per state)
  let idx = 0;
  for (let iy = 0; iy <= SEGS; iy++) {
    for (let ix = 0; ix <= SEGS; ix++) {
      positions[idx] = ix / SEGS;
      positions[idx + 1] = iy / SEGS;
      positions[idx + 2] = 0;
      idx += 3;
    }
  }
  for (let iy = 0; iy < SEGS; iy++) {
    for (let ix = 0; ix < SEGS; ix++) {
      const a = iy * (SEGS + 1) + ix;
      const b = a + 1;
      const c = a + (SEGS + 1);
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const terrainMat = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 15, side: THREE.DoubleSide });
  const terrainMesh = new THREE.Mesh(geo, terrainMat);
  scene.add(terrainMesh);

  const wireMat = new THREE.MeshBasicMaterial({ wireframe: true, color: isDark ? 0x444444 : 0xd0d0ce, transparent: true, opacity: 0.1 });
  const wireMesh = new THREE.Mesh(geo, wireMat);
  scene.add(wireMesh);

  // Precompute height fields for each state
  function computeField(bumps) {
    const heights = new Float32Array(vertCount);
    const fieldColors = new Float32Array(vertCount * 3);
    for (let iy = 0; iy <= SEGS; iy++) {
      for (let ix = 0; ix <= SEGS; ix++) {
        const i = iy * (SEGS + 1) + ix;
        const x = ix / SEGS, y = iy / SEGS;
        const h = evalHeight(x, y, bumps);
        heights[i] = h * HEIGHT_SCALE;
        const c = heightColor(h);
        fieldColors[i * 3] = c.r;
        fieldColors[i * 3 + 1] = c.g;
        fieldColors[i * 3 + 2] = c.b;
      }
    }
    return { heights, colors: fieldColors };
  }

  // Combined: average height at each point (NOT averaged bumps)
  function computeCombinedField() {
    const heights = new Float32Array(vertCount);
    const fieldColors = new Float32Array(vertCount * 3);
    for (let iy = 0; iy <= SEGS; iy++) {
      for (let ix = 0; ix <= SEGS; ix++) {
        const i = iy * (SEGS + 1) + ix;
        const x = ix / SEGS, y = iy / SEGS;
        const hA = evalHeight(x, y, BUMPS_A);
        const hB = evalHeight(x, y, BUMPS_B);
        const h = (hA + hB) / 2;
        heights[i] = h * HEIGHT_SCALE;
        const c = heightColor(h);
        fieldColors[i * 3] = c.r;
        fieldColors[i * 3 + 1] = c.g;
        fieldColors[i * 3 + 2] = c.b;
      }
    }
    return { heights, colors: fieldColors };
  }

  const fields = {
    personA: computeField(BUMPS_A),
    personB: computeField(BUMPS_B),
    combined: computeCombinedField(),
  };

  // Apply a field to the geometry
  function applyField(field) {
    const pos = geo.attributes.position.array;
    const col = geo.attributes.color.array;
    for (let i = 0; i < vertCount; i++) {
      pos[i * 3 + 2] = field.heights[i];
      col[i * 3] = field.colors[i * 3];
      col[i * 3 + 1] = field.colors[i * 3 + 1];
      col[i * 3 + 2] = field.colors[i * 3 + 2];
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.computeVertexNormals();
  }

  // Initialize with Person A
  applyField(fields.personA);
  geo.computeVertexNormals();

  // Feature label sprites (managed per-state)
  let featureLabelSprites = [];
  function setFeatureLabels(labels) {
    for (const s of featureLabelSprites) { scene.remove(s.sprite); s.texture.dispose(); s.material.dispose(); }
    featureLabelSprites = [];
    for (const f of labels) {
      const l = makeLabel(f.label, isDark, 18);
      // Position above terrain at that point
      const x = f.cx, y = f.cy;
      const h = f._z !== undefined ? f._z : 0.06;
      l.sprite.position.set(x, y, h);
      scene.add(l.sprite);
      featureLabelSprites.push(l);
    }
  }

  function labelsForState(state) {
    const bumps = state === 'personA' ? BUMPS_A : state === 'personB' ? BUMPS_B : null;
    if (bumps) {
      return bumps.filter(b => b.label).map(b => {
        const h = evalHeight(b.cx, b.cy, bumps) * HEIGHT_SCALE;
        return { cx: b.cx, cy: b.cy, label: b.label, _z: h + (b.A < 0 ? -0.05 : 0.05) };
      });
    }
    // Combined labels
    return COMBINED_LABELS.map(l => {
      const hA = evalHeight(l.cx, l.cy, BUMPS_A);
      const hB = evalHeight(l.cx, l.cy, BUMPS_B);
      const h = ((hA + hB) / 2) * HEIGHT_SCALE;
      return { cx: l.cx, cy: l.cy, label: l.label, _z: h + 0.06 };
    });
  }

  setFeatureLabels(labelsForState('personA'));

  // Build the 2D base plane at Z=0
  const baseResources = buildBasePlane(scene, isDark);

  // Transition state
  let currentState = 'personA';
  let transitioning = false;

  function transitionTo(state) {
    if (state === currentState || transitioning) return;
    transitioning = true;

    const target = fields[state];
    const startPos = new Float32Array(geo.attributes.position.array);
    const startCol = new Float32Array(geo.attributes.color.array);
    const t0 = performance.now();
    const duration = 500;

    function step(now) {
      let t = Math.min(1, (now - t0) / duration);
      // Ease in-out
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const pos = geo.attributes.position.array;
      const col = geo.attributes.color.array;
      for (let i = 0; i < vertCount; i++) {
        pos[i * 3 + 2] = startPos[i * 3 + 2] + (target.heights[i] - startPos[i * 3 + 2]) * t;
        col[i * 3] = startCol[i * 3] + (target.colors[i * 3] - startCol[i * 3]) * t;
        col[i * 3 + 1] = startCol[i * 3 + 1] + (target.colors[i * 3 + 1] - startCol[i * 3 + 1]) * t;
        col[i * 3 + 2] = startCol[i * 3 + 2] + (target.colors[i * 3 + 2] - startCol[i * 3 + 2]) * t;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      geo.computeVertexNormals();

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        transitioning = false;
        currentState = state;
        setFeatureLabels(labelsForState(state));
      }
    }

    // Clear labels during transition
    setFeatureLabels([]);
    currentState = state;
    requestAnimationFrame(step);
  }

  // UI — buttons above the canvas
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;margin-bottom:10px;';

  const stateLabels = { personA: 'Person A', personB: 'Person B', combined: 'Combined' };
  const buttons = {};

  function updateBtnStyles() {
    for (const [s, btn] of Object.entries(buttons)) {
      const active = s === currentState;
      btn.style.borderColor = active ? '#7F77DD' : (isDark ? '#555' : '#ccc');
      btn.style.background = active ? 'rgba(127,119,221,0.15)' : 'transparent';
      btn.style.color = active ? '#7F77DD' : (isDark ? '#e0ded6' : '#2c2c2a');
    }
  }

  for (const state of ['personA', 'personB', 'combined']) {
    const btn = document.createElement('button');
    btn.textContent = stateLabels[state];
    btn.style.cssText = `padding:6px 16px;border-radius:6px;border:1.5px solid;font:13px system-ui,sans-serif;cursor:pointer;transition:all 0.2s;flex:1;`;
    btn.addEventListener('click', () => { transitionTo(state); updateBtnStyles(); });
    btnRow.appendChild(btn);
    buttons[state] = btn;
  }

  container.appendChild(btnRow);
  container.appendChild(renderer.domElement);
  updateBtnStyles();

  // Hint
  const hint = document.createElement('div');
  hint.textContent = 'Drag to orbit · Scroll to zoom';
  hint.style.cssText = `text-align:center;font:11px system-ui,sans-serif;color:${isDark ? '#73726c' : '#9c9a92'};margin-top:6px;`;
  container.appendChild(hint);

  // Orbit controls
  const center = new THREE.Vector3(0.5, 0.5, 0.0);
  let theta = -Math.PI * 0.3;
  let phi = Math.PI * 0.3;
  let radius = 1.6;

  function updateCamera() {
    camera.position.set(
      center.x + radius * Math.sin(phi) * Math.cos(theta),
      center.y + radius * Math.sin(phi) * Math.sin(theta),
      center.z + radius * Math.cos(phi),
    );
    camera.up.set(0, 0, 1);
    camera.lookAt(center);
  }
  updateCamera();

  let dragging = false, prev = { x: 0, y: 0 };
  function onDown(e) { dragging = true; const p = e.touches ? e.touches[0] : e; prev = { x: p.clientX, y: p.clientY }; }
  function onMove(e) {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    theta -= (p.clientX - prev.x) * 0.006;
    phi = Math.max(0.15, Math.min(Math.PI * 0.48, phi + (p.clientY - prev.y) * 0.006));
    prev = { x: p.clientX, y: p.clientY };
    updateCamera();
  }
  function onUp() { dragging = false; }
  function onWheel(e) { e.preventDefault(); radius = Math.max(0.7, Math.min(3.0, radius + e.deltaY * 0.002)); updateCamera(); }

  let pinchDist = 0;
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      dragging = false;
      pinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    } else { onDown(e); }
  }
  function onTouchMove(e) {
    if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      radius = Math.max(0.7, Math.min(3.0, radius - (d - pinchDist) * 0.003));
      pinchDist = d;
      updateCamera();
    } else { onMove(e); }
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

  let frameId;
  function loop() { frameId = requestAnimationFrame(loop); renderer.render(scene, camera); }
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
      geo.dispose(); terrainMat.dispose(); wireMat.dispose();
      for (const r of baseResources) { if (r.dispose) r.dispose(); }
      for (const l of featureLabelSprites) { l.texture.dispose(); l.material.dispose(); }
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
