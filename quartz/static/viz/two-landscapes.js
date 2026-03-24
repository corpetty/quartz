import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

/**
 * Two Landscapes Visualization
 * Shows how two people's boundary terrains interact
 */

export function init(container, options = {}) {
  const {
    height = 480,
    dark = false,
  } = options

  const width = container.clientWidth
  const isDark = dark

  // Color palette
  const colors = {
    bg: isDark ? '#1a1a1a' : '#fafaf8',
    text: isDark ? '#e0ded6' : '#2c2c2a',
    trough: new THREE.Color('#1A8A8A'),
    ridge: new THREE.Color('#D85A30'),
    neutral: new THREE.Color('#999999'),
    active: new THREE.Color('#7F77DD'),
  }

  // Scene setup
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(colors.bg)

  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  )
  camera.position.set(0.5, 0.8, 1.2)
  camera.lookAt(0.5, 0.3, 0.5)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // Terrain geometry
  const segmentsX = 80
  const segmentsY = 80
  const geometry = new THREE.PlaneGeometry(1, 1, segmentsX, segmentsY)
  geometry.rotateX(-Math.PI / 2)

  // Initial colors
  const colorAttribute = geometry.getAttribute('color') ||
    new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3)
  geometry.setAttribute('color', colorAttribute)

  const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Wireframe overlay
  const wireframeGeometry = geometry.clone()
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: isDark ? '#444444' : '#cccccc',
    opacity: 0.2,
    transparent: true,
    linewidth: 1,
  })
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
  wireframe.position.copy(mesh.position)
  scene.add(wireframe)

  // Gaussian basis functions
  const gaussianBumps = {
    personA: [
      { cx: 0.18, cy: 0.82, sx: 0.14, sy: 0.14, A: -1.0, label: 'Deep friendships' },
      { cx: 0.62, cy: 0.85, sx: 0.18, sy: 0.12, A: -0.85, label: 'Romantic love' },
      { cx: 0.50, cy: 0.50, sx: 0.12, sy: 0.12, A: -0.5, label: 'Tender middle' },
      { cx: 0.80, cy: 0.30, sx: 0.10, sy: 0.10, A: -0.4, label: 'Casual touch' },
      { cx: 0.15, cy: 0.40, sx: 0.10, sy: 0.12, A: -0.3, label: 'Mentorship' },
      { cx: 0.50, cy: 0.15, sx: 0.25, sy: 0.08, A: 0.7 },
      { cx: 0.90, cy: 0.60, sx: 0.08, sy: 0.15, A: 0.6 },
      { cx: 0.35, cy: 0.70, sx: 0.08, sy: 0.08, A: 0.4 },
    ],
    personB: [
      { cx: 0.20, cy: 0.75, sx: 0.12, sy: 0.12, A: -0.8, label: 'Deep friendships' },
      { cx: 0.55, cy: 0.90, sx: 0.15, sy: 0.10, A: -0.9, label: 'Romantic love' },
      { cx: 0.75, cy: 0.45, sx: 0.10, sy: 0.10, A: -0.3, label: 'Physical play' },
      { cx: 0.50, cy: 0.50, sx: 0.15, sy: 0.15, A: 0.5, label: 'Tender middle (barrier)' },
      { cx: 0.85, cy: 0.25, sx: 0.10, sy: 0.10, A: 0.4 },
      { cx: 0.40, cy: 0.15, sx: 0.20, sy: 0.08, A: 0.6 },
    ],
  }

  function evaluateHeight(x, y, bumps) {
    let h = 0
    for (const bump of bumps) {
      const dx = (x - bump.cx) / bump.sx
      const dy = (y - bump.cy) / bump.sy
      h += bump.A * Math.exp(-(dx * dx / 2 + dy * dy / 2))
    }
    return h * 0.3
  }

  function heightToColor(h) {
    if (h < -0.08) return colors.trough
    if (h > 0.08) return colors.ridge
    // Interpolate between ridge and neutral and trough
    if (h < 0) {
      const t = -h / 0.08
      const c = new THREE.Color()
      c.lerpColors(colors.neutral, colors.trough, t)
      return c
    } else {
      const t = h / 0.08
      const c = new THREE.Color()
      c.lerpColors(colors.neutral, colors.ridge, t)
      return c
    }
  }

  function updateTerrain(bumps) {
    const positions = geometry.attributes.position
    const colors = geometry.attributes.color

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const h = evaluateHeight(x, y, bumps)

      positions.setZ(i, h)

      const col = heightToColor(h)
      colors.setXYZ(i, col.r, col.g, col.b)
    }

    positions.needsUpdate = true
    colors.needsUpdate = true
  }

  function getMixedTerrain() {
    const mixed = []
    const allLabels = new Set()

    for (let i = 0; i < Math.max(gaussianBumps.personA.length, gaussianBumps.personB.length); i++) {
      const bumpA = gaussianBumps.personA[i]
      const bumpB = gaussianBumps.personB[i]

      if (bumpA && bumpB) {
        mixed.push({
          cx: (bumpA.cx + bumpB.cx) / 2,
          cy: (bumpA.cy + bumpB.cy) / 2,
          sx: (bumpA.sx + bumpB.sx) / 2,
          sy: (bumpA.sy + bumpB.sy) / 2,
          A: (bumpA.A + bumpB.A) / 2,
        })
      } else if (bumpA) {
        mixed.push({
          cx: bumpA.cx,
          cy: bumpA.cy,
          sx: bumpA.sx,
          sy: bumpA.sy,
          A: bumpA.A * 0.5,
        })
      } else if (bumpB) {
        mixed.push({
          cx: bumpB.cx,
          cy: bumpB.cy,
          sx: bumpB.sx,
          sy: bumpB.sy,
          A: bumpB.A * 0.5,
        })
      }
    }

    return mixed
  }

  // Store original heights for smooth transitions
  const originalPositions = new Float32Array(geometry.attributes.position.array)
  const originalColors = new Float32Array(geometry.attributes.color.array)

  let currentState = 'personA'
  let isTransitioning = false
  let transitionProgress = 0
  const transitionDuration = 500 // ms

  function setTerrain(state) {
    if (state === currentState || isTransitioning) return

    currentState = state
    isTransitioning = true
    transitionProgress = 0

    const targetHeights = []
    const targetColors = []

    const positions = geometry.attributes.position
    let bumps

    if (state === 'personA') {
      bumps = gaussianBumps.personA
    } else if (state === 'personB') {
      bumps = gaussianBumps.personB
    } else {
      bumps = getMixedTerrain()
    }

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const h = evaluateHeight(x, y, bumps)
      targetHeights.push(h)

      const col = heightToColor(h)
      targetColors.push(col.r, col.g, col.b)
    }

    // Start transition
    const startTime = performance.now()

    function animateTransition(currentTime) {
      transitionProgress = Math.min(1, (currentTime - startTime) / transitionDuration)

      const positions = geometry.attributes.position
      const colors = geometry.attributes.color

      for (let i = 0; i < positions.count; i++) {
        const startZ = originalPositions[i * 3 + 2]
        const targetZ = targetHeights[i]
        const z = startZ + (targetZ - startZ) * transitionProgress

        positions.setZ(i, z)

        const startR = originalColors[i * 3]
        const startG = originalColors[i * 3 + 1]
        const startB = originalColors[i * 3 + 2]

        const targetR = targetColors[i * 3]
        const targetG = targetColors[i * 3 + 1]
        const targetB = targetColors[i * 3 + 2]

        colors.setXYZ(
          i,
          startR + (targetR - startR) * transitionProgress,
          startG + (targetG - startG) * transitionProgress,
          startB + (targetB - startB) * transitionProgress
        )
      }

      positions.needsUpdate = true
      colors.needsUpdate = true

      if (transitionProgress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        isTransitioning = false
        // Store new originals
        originalPositions.set(geometry.attributes.position.array)
        originalColors.set(geometry.attributes.color.array)
      }
    }

    requestAnimationFrame(animateTransition)
  }

  // Initialize terrain
  updateTerrain(gaussianBumps.personA)

  // UI Setup
  const uiContainer = document.createElement('div')
  uiContainer.style.cssText = `
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    z-index: 10;
  `

  const buttonStyle = (isActive) => `
    padding: 8px 16px;
    border: 1px solid ${colors.text};
    background: ${isActive ? colors.active : 'transparent'};
    color: ${isActive ? '#ffffff' : colors.text};
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: all 200ms ease;
    flex: 1;
    text-align: center;
  `

  const buttons = {}
  const states = ['personA', 'personB', 'combined']
  const labels = {
    personA: 'Person A',
    personB: 'Person B',
    combined: 'Combined',
  }

  for (const state of states) {
    const btn = document.createElement('button')
    btn.textContent = labels[state]
    btn.style.cssText = buttonStyle(state === currentState)
    btn.onclick = () => {
      setTerrain(state)
      updateButtonStyles()
    }
    uiContainer.appendChild(btn)
    buttons[state] = btn
  }

  function updateButtonStyles() {
    for (const state of states) {
      buttons[state].style.cssText = buttonStyle(state === currentState)
    }
  }

  container.appendChild(uiContainer)

  // Orbit controls (manual implementation)
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }
  let cameraRotation = {
    x: Math.asin(camera.position.y / Math.hypot(camera.position.x, camera.position.y, camera.position.z)),
    y: Math.atan2(camera.position.z, camera.position.x),
  }
  let cameraDistance = Math.hypot(camera.position.x, camera.position.y, camera.position.z)

  function updateCameraPosition() {
    const radius = cameraDistance
    const centerX = 0.5
    const centerY = 0.3
    const centerZ = 0.5

    camera.position.x = centerX + radius * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y)
    camera.position.y = centerY + radius * Math.sin(cameraRotation.x)
    camera.position.z = centerZ + radius * Math.cos(cameraRotation.x) * Math.sin(cameraRotation.y)

    camera.lookAt(centerX, centerY, centerZ)
  }

  function onMouseDown(e) {
    isDragging = true
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  function onMouseMove(e) {
    if (!isDragging) return

    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y

    cameraRotation.y -= deltaX * 0.005
    cameraRotation.x += deltaY * 0.005
    cameraRotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRotation.x))

    updateCameraPosition()
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  function onMouseUp() {
    isDragging = false
  }

  function onWheel(e) {
    e.preventDefault()
    cameraDistance += e.deltaY * 0.0005
    cameraDistance = Math.max(0.5, Math.min(3, cameraDistance))
    updateCameraPosition()
  }

  renderer.domElement.addEventListener('mousedown', onMouseDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('mouseup', onMouseUp)
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

  // Touch support
  let touchStartDistance = 0

  function getTouchDistance(touches) {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      isDragging = false
      touchStartDistance = getTouchDistance(e.touches)
    }
  }

  function onTouchMove(e) {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x
      const deltaY = e.touches[0].clientY - previousMousePosition.y

      cameraRotation.y -= deltaX * 0.005
      cameraRotation.x += deltaY * 0.005
      cameraRotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRotation.x))

      updateCameraPosition()
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches)
      const delta = touchStartDistance - currentDistance
      cameraDistance += delta * 0.0005
      cameraDistance = Math.max(0.5, Math.min(3, cameraDistance))
      updateCameraPosition()
      touchStartDistance = currentDistance
    }
  }

  function onTouchEnd() {
    isDragging = false
  }

  renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true })
  renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true })
  renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true })

  // Animation loop
  let animationFrameId

  function animate() {
    animationFrameId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()

  // Resize handler
  function onResize() {
    const newWidth = container.clientWidth
    camera.aspect = newWidth / height
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, height)
  }

  window.addEventListener('resize', onResize)

  // Return public API
  return {
    destroy() {
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      renderer.domElement.removeEventListener('touchstart', onTouchStart)
      renderer.domElement.removeEventListener('touchmove', onTouchMove)
      renderer.domElement.removeEventListener('touchend', onTouchEnd)

      cancelAnimationFrame(animationFrameId)

      geometry.dispose()
      wireframeGeometry.dispose()
      material.dispose()
      wireframeMaterial.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      if (uiContainer.parentNode === container) {
        container.removeChild(uiContainer)
      }
    },

    resize() {
      onResize()
    },
  }
}
