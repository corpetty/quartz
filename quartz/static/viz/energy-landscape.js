import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

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

const LABELS = [...TROUGHS, ...RIDGES];

// Mappedness ellipse center and radii
const MAP_CENTER_X = 0.40;
const MAP_CENTER_Y = 0.55;
const MAP_RADIUS_X = 0.48;
const MAP_RADIUS_Y = 0.50;

function gaussianBasis(x, y, cx, cy, sx, sy, A) {
  const dx = (x - cx) / sx;
  const dy = (y - cy) / sy;
  return A * Math.exp(-(dx * dx + dy * dy) / 2);
}

function terrainHeight(x, y) {
  let h = 0;
  for (const feature of LABELS) {
    h += gaussianBasis(x, y, feature.cx, feature.cy, feature.sx, feature.sy, feature.A);
  }
  return h;
}

function getMappedness(x, y) {
  const dx = (x - MAP_CENTER_X) / MAP_RADIUS_X;
  const dy = (y - MAP_CENTER_Y) / MAP_RADIUS_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Smooth falloff from 1 to 0 between dist=0.95 and dist=1.15
  return Math.max(0, Math.min(1, (1.15 - dist) / 0.2));
}

function colorFromHeight(h, mappedness, isDark) {
  // Normalize height for color mapping
  const normalizedH = Math.max(-1, Math.min(1, h));

  let r, g, b;

  if (normalizedH < 0) {
    // Trough: cool teal-blue (#1A8A8A to #1D9E75)
    const t = -normalizedH; // 0 to 1
    const c1 = { r: 0x1A / 255, g: 0x8A / 255, b: 0x8A / 255 };
    const c2 = { r: 0x1D / 255, g: 0x9E / 255, b: 0x75 / 255 };
    r = c1.r + (c2.r - c1.r) * t;
    g = c1.g + (c2.g - c1.g) * t;
    b = c1.b + (c2.b - c1.b) * t;
  } else {
    // Ridge: warm amber-coral (#C86A30 to #D85A30)
    const t = normalizedH;
    const c1 = { r: 0xC8 / 255, g: 0x6A / 255, b: 0x30 / 255 };
    const c2 = { r: 0xD8 / 255, g: 0x5A / 255, b: 0x30 / 255 };
    r = c1.r + (c2.r - c1.r) * t;
    g = c1.g + (c2.g - c1.g) * t;
    b = c1.b + (c2.b - c1.b) * t;
  }

  // Desaturate and fade unmapped regions
  if (mappedness < 1) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * mappedness + gray * (1 - mappedness);
    g = g * mappedness + gray * (1 - mappedness);
    b = b * mappedness + gray * (1 - mappedness);
  }

  return new THREE.Color(r, g, b);
}

function createTextSprite(text, isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isDark ? '#1a1a1a' : '#fafaf8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = isDark ? '#e0ded6' : '#2c2c2a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.3, 0.075, 1);

  return sprite;
}

export function init(container, options = {}) {
  const height = parseInt(options.height) || 480;
  const width = container.clientWidth || 800;
  const isDark = options.dark ?? false;

  // Scene setup
  const scene = new THREE.Scene();
  const bgColor = isDark ? '#1a1a1a' : '#fafaf8';
  const textColor = isDark ? '#e0ded6' : '#2c2c2a';
  scene.background = new THREE.Color(bgColor);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0.5, 0.5, 1.2);
  camera.lookAt(0.5, 0.5, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0.6, 0.8, 0.8);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -1;
  directionalLight.shadow.camera.right = 1;
  directionalLight.shadow.camera.top = 1;
  directionalLight.shadow.camera.bottom = -1;
  scene.add(directionalLight);

  // Terrain geometry
  const segmentsX = 100;
  const segmentsY = 100;
  const geometry = new THREE.PlaneGeometry(1, 1, segmentsX, segmentsY);

  // Displace vertices and set colors
  const positionAttribute = geometry.getAttribute('position');
  const positions = positionAttribute.array;
  const colors = [];

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];

    const h = terrainHeight(x, y);
    const mappedness = getMappedness(x, y);
    positions[i + 2] = h * mappedness; // Apply mappedness to height

    const color = colorFromHeight(h, mappedness, isDark);
    colors.push(color.r, color.g, color.b);
  }

  positionAttribute.needsUpdate = true;
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.computeVertexNormals();

  // Material
  const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    emissive: 0x000000,
    shininess: 20,
    wireframe: false,
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  scene.add(terrain);

  // Wireframe overlay
  const wireframeGeometry = geometry.clone();
  const wireframeMaterial = new THREE.MeshPhongMaterial({
    wireframe: true,
    color: isDark ? '#333333' : '#d0d0ce',
    transparent: true,
    opacity: 0.15,
    emissive: 0x000000,
  });
  const wireframeOverlay = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  wireframeOverlay.position.z = 0.001;
  scene.add(wireframeOverlay);

  // Axis labels
  const axisLabelSize = 0.08;
  const xLabelSprite = createTextSprite('Emotional ← → Physical', isDark);
  xLabelSprite.position.set(0.5, -0.08, 0.3);
  xLabelSprite.scale.set(0.35, 0.09, 1);
  scene.add(xLabelSprite);

  const yLabelSprite = createTextSprite('Depth of Intimacy', isDark);
  yLabelSprite.position.set(-0.12, 0.5, 0.3);
  yLabelSprite.scale.set(0.25, 0.08, 1);
  scene.add(yLabelSprite);

  // Feature labels
  const labelSprites = [];
  for (const feature of LABELS) {
    const h = terrainHeight(feature.cx, feature.cy);
    const sprite = createTextSprite(feature.label, isDark);
    sprite.position.set(feature.cx, feature.cy, h + 0.15);
    sprite.scale.set(0.25, 0.06, 1);
    scene.add(sprite);
    labelSprites.push(sprite);
  }

  // Orbit controls state
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let sphericalCoords = { theta: Math.PI * 0.25, phi: Math.PI * 0.35, radius: 1.3 };

  function updateCameraPosition() {
    const centerX = 0.5;
    const centerY = 0.5;
    const centerZ = 0.25;

    camera.position.x = centerX + sphericalCoords.radius * Math.sin(sphericalCoords.phi) * Math.cos(sphericalCoords.theta);
    camera.position.y = centerY + sphericalCoords.radius * Math.sin(sphericalCoords.phi) * Math.sin(sphericalCoords.theta);
    camera.position.z = centerZ + sphericalCoords.radius * Math.cos(sphericalCoords.phi);

    camera.lookAt(centerX, centerY, centerZ);
  }

  // Mouse events
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    sphericalCoords.theta += deltaX * 0.005;
    sphericalCoords.phi += deltaY * 0.005;
    sphericalCoords.phi = Math.max(0.2, Math.min(Math.PI - 0.2, sphericalCoords.phi));

    updateCameraPosition();
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
  });

  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    sphericalCoords.radius += e.deltaY * 0.001;
    sphericalCoords.radius = Math.max(0.8, Math.min(2.5, sphericalCoords.radius));
    updateCameraPosition();
  }, { passive: false });

  // Touch events
  let touchStartDistance = 0;

  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDragging = false;
      touchStartDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  });

  renderer.domElement.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      sphericalCoords.theta += deltaX * 0.005;
      sphericalCoords.phi += deltaY * 0.005;
      sphericalCoords.phi = Math.max(0.2, Math.min(Math.PI - 0.2, sphericalCoords.phi));

      updateCameraPosition();
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = currentDistance - touchStartDistance;
      sphericalCoords.radius += delta * 0.002;
      sphericalCoords.radius = Math.max(0.8, Math.min(2.5, sphericalCoords.radius));
      updateCameraPosition();
      touchStartDistance = currentDistance;
    }
  });

  renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Animation loop
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  // Interface
  return {
    destroy() {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      container.removeChild(renderer.domElement);
    },
    resize() {
      const newWidth = container.clientWidth || width;
      const newHeight = parseInt(options.height) || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    },
  };
}
