import { promises as fs } from "fs"
import { FontWeight, SatoriOptions } from "satori/wasm"
import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { JSXInternal } from "preact/src/jsx"
import { FontSpecification, getFontSpecificationName, ThemeKey } from "./theme"
import path from "path"
import { QUARTZ } from "./path"
import { formatDate, getDate } from "../components/Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"
import { styleText } from "util"

const defaultHeaderWeight = [700]
const defaultBodyWeight = [400]

export async function getSatoriFonts(headerFont: FontSpecification, bodyFont: FontSpecification) {
  // Get all weights for header and body fonts
  const headerWeights: FontWeight[] = (
    typeof headerFont === "string"
      ? defaultHeaderWeight
      : (headerFont.weights ?? defaultHeaderWeight)
  ) as FontWeight[]
  const bodyWeights: FontWeight[] = (
    typeof bodyFont === "string" ? defaultBodyWeight : (bodyFont.weights ?? defaultBodyWeight)
  ) as FontWeight[]

  const headerFontName = typeof headerFont === "string" ? headerFont : headerFont.name
  const bodyFontName = typeof bodyFont === "string" ? bodyFont : bodyFont.name

  // Fetch fonts for all weights and convert to satori format in one go
  const headerFontPromises = headerWeights.map(async (weight) => {
    const data = await fetchTtf(headerFontName, weight)
    if (!data) return null
    return {
      name: headerFontName,
      data,
      weight,
      style: "normal" as const,
    }
  })

  const bodyFontPromises = bodyWeights.map(async (weight) => {
    const data = await fetchTtf(bodyFontName, weight)
    if (!data) return null
    return {
      name: bodyFontName,
      data,
      weight,
      style: "normal" as const,
    }
  })

  const [headerFonts, bodyFonts] = await Promise.all([
    Promise.all(headerFontPromises),
    Promise.all(bodyFontPromises),
  ])

  // Filter out any failed fetches and combine header and body fonts
  const fonts: SatoriOptions["fonts"] = [
    ...headerFonts.filter((font): font is NonNullable<typeof font> => font !== null),
    ...bodyFonts.filter((font): font is NonNullable<typeof font> => font !== null),
  ]

  return fonts
}

/**
 * Get the `.ttf` file of a google font
 * @param fontName name of google font
 * @param weight what font weight to fetch font
 * @returns `.ttf` file of google font
 */
export async function fetchTtf(
  rawFontName: string,
  weight: FontWeight,
): Promise<Buffer<ArrayBufferLike> | undefined> {
  const fontName = rawFontName.replaceAll(" ", "+")
  const cacheKey = `${fontName}-${weight}`
  const cacheDir = path.join(QUARTZ, ".quartz-cache", "fonts")
  const cachePath = path.join(cacheDir, cacheKey)

  // Check if font exists in cache
  try {
    // Get css file from google fonts
    // Use a simple user agent to get ttf format (modern browsers get woff2 which satori doesn't support)
    const cssResponse = await fetch(
      `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        },
      },
    )
    const css = await cssResponse.text()

    // Extract .ttf url from css file
    const urlRegex = /url\((https:\/\/fonts.gstatic.com\/s\/.*?\.ttf)\)/g
    const match = urlRegex.exec(css)

    if (!match) {
      throw new Error("Could not fetch font")
    }

    // Retrieve font data as ArrayBuffer
    const fontResponse = await fetch(match[1])

    // fontData is an ArrayBuffer containing the .ttf file data (get match[1] due to google fonts response format, always contains link twice, but second entry is the "raw" link)
    const fontData = await fontResponse.arrayBuffer()

    return fontData
  } catch (error) {
    // ignore errors and fetch font
  }

  // Get css file from google fonts
  const cssResponse = await fetch(
    `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}`,
  )
  const css = await cssResponse.text()

  // Extract .ttf url from css file
  const urlRegex = /url\((https:\/\/fonts.gstatic.com\/s\/.*?.ttf)\)/g
  const match = urlRegex.exec(css)

  if (!match) {
    console.log(
      styleText(
        "yellow",
        `\nWarning: Failed to fetch font ${rawFontName} with weight ${weight}, got ${cssResponse.statusText}`,
      ),
    )
    return
  }

  // fontData is an ArrayBuffer containing the .ttf file data
  const fontResponse = await fetch(match[1])
  const fontData = Buffer.from(await fontResponse.arrayBuffer())
  await fs.mkdir(cacheDir, { recursive: true })
  await fs.writeFile(cachePath, fontData)

  return fontData
}

export type SocialImageOptions = {
  /**
   * What color scheme to use for image generation (uses colors from config theme)
   */
  colorScheme: ThemeKey
  /**
   * Height to generate image with in pixels (should be around 630px)
   */
  height: number
  /**
   * Width to generate image with in pixels (should be around 1200px)
   */
  width: number
  /**
   * Whether to use the auto generated image for the root path ("/", when set to false) or the default og image (when set to true).
   */
  excludeRoot: boolean
  /**
   * JSX to use for generating image. See satori docs for more info (https://github.com/vercel/satori)
   */
  imageStructure: (
    options: ImageOptions & {
      userOpts: UserOpts
      iconBase64?: string
    },
  ) => JSXInternal.Element
}

export type UserOpts = Omit<SocialImageOptions, "imageStructure">

export type ImageOptions = {
  /**
   * what title to use as header in image
   */
  title: string
  /**
   * what description to use as body in image
   */
  description: string
  /**
   * header + body font to be used when generating satori image (as promise to work around sync in component)
   */
  fonts: SatoriOptions["fonts"]
  /**
   * `GlobalConfiguration` of quartz (used for theme/typography)
   */
  cfg: GlobalConfiguration
  /**
   * full file data of current page
   */
  fileData: QuartzPluginData
}

// This is the default template for generated social image.
export const defaultImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts: { colorScheme },
  title,
  description,
  fonts,
  fileData: _fileData,
}: ImageOptions & {
  userOpts: UserOpts
  iconBase64?: string
}) => {
  // How many characters are allowed before switching to smaller font
  const fontBreakPoint = 50
  const useSmallerFont = title.length > fontBreakPoint

  // Setup to access image
  const iconPath = `https://${cfg.baseUrl}/static/icon.png`

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: cfg.theme.colors[colorScheme].light,
      }}
    >
      {/* Main content area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          flexGrow: 1,
          padding: "48px 56px",
          gap: "20px",
        }}
      >
        {/* Title */}
        <p
          style={{
            color: cfg.theme.colors[colorScheme].secondary,
            fontSize: useSmallerFont ? 48 : 56,
            fontFamily: fonts[0].name,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </p>
        {/* Description */}
        <p
          style={{
            color: cfg.theme.colors[colorScheme].darkgray,
            fontSize: 28,
            lineHeight: 1.4,
            fontFamily: fonts[1].name,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      {/* Footer with branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 56px",
          borderTop: `1px solid ${cfg.theme.colors[colorScheme].lightgray}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img src={iconPath} width={48} height={48} />
          <p
            style={{
              color: cfg.theme.colors[colorScheme].dark,
              fontSize: 24,
              fontFamily: fonts[0].name,
              margin: 0,
            }}
          >
            {cfg.pageTitle}
          </p>
        </div>
        <p
          style={{
            color: cfg.theme.colors[colorScheme].gray,
            fontSize: 20,
            fontFamily: fonts[1].name,
            margin: 0,
          }}
        >
          {cfg.baseUrl}
        </p>
      </div>
    </div>
  )
}
