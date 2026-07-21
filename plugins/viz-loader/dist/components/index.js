// Quartz v5 component plugin: VizLoader
//
// Hand-authored, pre-built module (no build step required — Quartz uses the
// committed dist/ directly for local plugins). Source of truth lives alongside
// this file in ../../src for reference.
//
// Renders nothing. It attaches an `afterDOMLoaded` script that lazy-loads
// visualization ES modules from /static/viz/<name>.js for any element with a
// [data-viz] attribute, forwarding data-viz-* attributes as options and
// re-initializing on SPA navigation, theme change, and resize.

var vizScript = `
const vizInstances = new Map()

// Session-level cache buster — forces re-fetch of viz modules once per page
// load so deploys with updated JS are picked up without a hard refresh.
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
    const options = {}
    for (const attr of container.attributes) {
      if (attr.name.startsWith("data-viz-") && attr.name !== "data-viz") {
        const key = attr.name.replace("data-viz-", "").replace(/-./g, (s) => s[1].toUpperCase())
        options[key] = attr.value
      }
    }

    // Detect dark mode via Quartz's saved-theme attribute
    const savedTheme = document.documentElement.getAttribute("saved-theme")
    options.dark = savedTheme === "dark"

    // Ensure container is a positioning context so absolutely-positioned
    // children (buttons, overlays) don't escape to the page body
    const el = container
    if (getComputedStyle(el).position === "static") {
      el.style.position = "relative"
    }
    el.style.overflow = "hidden"

    try {
      const mod = await import("/static/viz/" + name + ".js?v=" + vizCacheBust)
      const instance = mod.init(el, options)
      vizInstances.set(container, instance || {})
    } catch (err) {
      console.error('[viz] Failed to load "' + name + '":', err)
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
let resizeTimer
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    for (const [, instance] of vizInstances) {
      if (instance.resize) instance.resize()
    }
  }, 200)
})
`

const VizLoader = () => {
  const Component = () => null
  Component.afterDOMLoaded = vizScript
  return Component
}

export { VizLoader }
