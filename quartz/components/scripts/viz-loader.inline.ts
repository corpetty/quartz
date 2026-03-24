const vizInstances = new Map<Element, { destroy?: () => void; resize?: () => void }>()

// Session-level cache buster — forces re-fetch of viz modules once per page load
// so that deploys with updated JS are picked up without needing hard refresh
const vizCacheBust = Date.now()

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

    // Ensure container is a positioning context so absolutely-positioned
    // children (buttons, overlays) don't escape to the page body
    const el = container as HTMLElement
    if (getComputedStyle(el).position === "static") {
      el.style.position = "relative"
    }
    // Ensure overflow is visible for labels but contained for UI
    el.style.overflow = "hidden"

    try {
      const module = await import(`/static/viz/${name}.js?v=${vizCacheBust}`)
      const instance = module.init(el, options)
      vizInstances.set(container, instance || {})
    } catch (err) {
      console.error(`[viz] Failed to load "${name}":`, err)
      el.innerHTML =
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
