const vizInstances = new Map<Element, { destroy?: () => void; resize?: () => void }>()

async function initAllViz() {
  // Destroy previous instances
  for (const [, instance] of vizInstances) {
    if (instance.destroy) instance.destroy()
  }
  vizInstances.clear()

  // Find all viz containers
  const containers = document.querySelectorAll("[data-viz]")
  for (const container of containers) {
    const name = container.getAttribute("data-viz")
    if (!name) continue

    // Collect data-viz-* options
    const options: Record<string, string | boolean> = {}
    for (const attr of container.attributes) {
      if (attr.name.startsWith("data-viz-") && attr.name !== "data-viz") {
        const key = attr.name
          .replace("data-viz-", "")
          .replace(/-./g, (s) => s[1].toUpperCase())
        options[key] = attr.value
      }
    }

    // Detect dark mode via Quartz's saved-theme attribute
    const savedTheme = document.documentElement.getAttribute("saved-theme")
    options.dark = savedTheme === "dark"

    try {
      const module = await import(`/static/viz/${name}.js`)
      const instance = module.init(container as HTMLElement, options)
      vizInstances.set(container, instance || {})
    } catch (err) {
      console.error(`[viz] Failed to load "${name}":`, err)
      ;(container as HTMLElement).innerHTML =
        '<p style="color:var(--secondary);font-size:13px;padding:1rem;">Visualization failed to load.</p>'
    }
  }
}

document.addEventListener("nav", () => {
  initAllViz()

  // Re-init on theme change
  const handleThemeChange = () => initAllViz()
  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => document.removeEventListener("themechange", handleThemeChange))
})

// Handle resize
let resizeTimer: ReturnType<typeof setTimeout>
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    for (const [, instance] of vizInstances) {
      if (instance.resize) instance.resize()
    }
  }, 200)
})
