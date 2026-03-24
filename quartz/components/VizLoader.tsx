import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

// @ts-ignore
import vizLoaderScript from "./scripts/viz-loader.inline"

const VizLoader: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = () => null
  Component.afterDOMLoaded = vizLoaderScript
  return Component
}

export default VizLoader
