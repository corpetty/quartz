# viz-loader

Local Quartz v5 component plugin. Lazy-loads interactive visualization ES
modules from `/static/viz/<name>.js` for any element with a `[data-viz]`
attribute in your content, e.g.:

```html
<div data-viz="intimacy-surface" data-viz-height="520" style="margin: 2rem 0;"></div>
```

The corresponding module (`quartz/static/viz/intimacy-surface.js`) must export
an `init(el, options)` function. `data-viz-*` attributes are forwarded as
camelCased option keys, plus a `dark` boolean derived from the current theme.
Instances are re-initialized on SPA navigation and theme change, and their
optional `resize()` is called (debounced) on window resize.

## Install

Referenced as a local plugin in `quartz.config.yaml`:

```yaml
plugins:
  - source: ./plugins/viz-loader
    enabled: true
    layout:
      position: afterBody
      priority: 30
```

Then `npx quartz plugin install --from-config`.

## Maintenance

This plugin ships a hand-authored, pre-built `dist/` so no build step is
required. The component renders nothing; it only injects an `afterDOMLoaded`
script. To change behavior, edit `dist/components/index.js` directly.
