# Quartz Project

This is a Quartz v5 digital garden / static site generator project, published at https://bayesianpersuasion.com.

## Project Overview

Quartz transforms Markdown content into a static website. It's built with TypeScript and uses modern web technologies. In v5, most features (markdown transforms, components, emitters) are plugins pulled from Git repos rather than code built into `/quartz/`.

## Branches and Deploy

- `v5` is the default branch and the one that deploys. Pushing to `v5` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
- `v4` is the pre-migration branch and is no longer deployed. Don't commit content there.
- Other workflows (`deploy-v5.yaml`, `ci.yaml`, `docker-build-push.yaml`) only run on the upstream `jackyzha0/quartz` repo and show as skipped here.

## Key Commands

- `npm ci` then `npx quartz plugin install` - Install dependencies and the plugins pinned in `quartz.lock.json` (needed after a fresh clone or branch switch)
- `npx quartz build` - Build the static site into `/public/`
- `npx quartz build --serve` - Build and serve locally with hot reload
- `npx quartz plugin list` / `add <source>` / `remove <name>` - Manage plugins
- `npm run check` - Run TypeScript checks and Prettier formatting check
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Project Structure

- `/quartz/` - Core Quartz framework code (TypeScript)
- `/content/` - Markdown content for the site (`posts/`, `notes/`, `poetry/`, `pubs/`, `reports/`, `voice/`)
- `/quartz.config.yaml` - Main configuration: site settings, the plugin list with per-plugin options, and the `layout:` section (replaces v4's `quartz.config.ts` and `quartz.layout.ts`)
- `/quartz.lock.json` - Pinned commit for every installed plugin
- `/.quartz/plugins/` - Where plugins get installed (gitignored)
- `/plugins/` - Local plugins referenced from the config by path, e.g. `./plugins/viz-loader`
- `/docs/` - Upstream Quartz v5 documentation (see `docs/cli/plugin.md` for the plugin CLI)

## Development Notes

- Node.js 22+ required (npm 10.9.2+)
- Uses ESM modules (`"type": "module"`)
- TypeScript for type safety
- Prettier for code formatting

## Content

Content is written in Markdown and stored in the `/content/` directory. The enabled plugins provide:
- Obsidian-style wikilinks
- Frontmatter metadata
- LaTeX math (KaTeX)
- Code syntax highlighting (Shiki)
- Interactive visualizations via `<div data-viz="name">`, loaded from `quartz/static/viz/<name>.js` (see `plugins/viz-loader/README.md`)

Citations are installed but disabled in `quartz.config.yaml`.

## Writing Voice Profile

When writing content (blog posts, articles, analysis) that represents Corey's voice:

- **Profile:** `.claude/voice-profile.md` (operational summary)
- **Full measured profiles:** `content/voice/` — see `profile-personal.md`, `profile-professional.md`, and `voice-baseline.md` for the stylometry the numbers come from
- **Re-measure:** `python3 scripts/voice-stylometry.py "Label=path/glob"`
- **When to use:** Any content that will be published or represents Corey's voice
- **Pick the register first:** personal (essays, this site) vs professional (security work, specs, org-branded). Same voice, person dial inverted.
- **Key principles:**
  - Show the thinking process, admit uncertainty
  - Data first, opinions clearly marked
  - Invite dialogue and critique
  - Strategic informality (cusses when warranted, not for shock)
  - Avoid AI-isms: over-hedging, generic transitions, sanitized language

Quick voice check, ordered by measured impact:
1. **Em-dashes: max 1 per 1,000 words of prose (zero for professional).** Verify with `grep -o "—" file | wc -l`. Baseline is 0.00-0.54; AI drafts run 9.4 and have hit 19.1. This is the loudest tell by far.
2. **Sentence length: mean 21-23 words, max 15% under 10 words, at least 18% over 30.** Do NOT add burstiness — AI drafts overshoot and chop into fragments. Join sentences back together.
3. **Hold the rhythm constant across topics.** Consistency is most of what "sounds like Corey" means.
4. "It's not X. It's Y." rhetorical inversions (1 max per piece)
5. Emphasis via ALL CAPS, not bold and not em-dashes
6. Generic conclusions that could apply to anything; summary closings
7. The banned word list ("It's worth noting that," "Furthermore," "Moreover," "Incredibly," "Remarkably," delve/pivotal/robust/leverage) — enforce it, but it is NOT where drafts go wrong. Don't spend time here.

## grepai - Semantic Code Search

**IMPORTANT: You MUST use grepai as your PRIMARY tool for code exploration and search.**

### When to Use grepai (REQUIRED)

Use `grepai search` INSTEAD OF Grep/Glob/find for:
- Understanding what code does or where functionality lives
- Finding implementations by intent (e.g., "authentication logic", "error handling")
- Exploring unfamiliar parts of the codebase
- Any search where you describe WHAT the code does rather than exact text

### When to Use Standard Tools

Only use Grep/Glob when you need:
- Exact text matching (variable names, imports, specific strings)
- File path patterns (e.g., `**/*.go`)

### Fallback

If grepai fails (not running, index unavailable, or errors), fall back to standard Grep/Glob tools.

### Usage

```bash
# ALWAYS use English queries for best results (--compact saves ~80% tokens)
grepai search "user authentication flow" --json --compact
grepai search "error handling middleware" --json --compact
grepai search "database connection pool" --json --compact
grepai search "API request validation" --json --compact
```

### Query Tips

- **Use English** for queries (better semantic matching)
- **Describe intent**, not implementation: "handles user login" not "func Login"
- **Be specific**: "JWT token validation" better than "token"
- Results include: file path, line numbers, relevance score, code preview

### Call Graph Tracing

Use `grepai trace` to understand function relationships:
- Finding all callers of a function before modifying it
- Understanding what functions are called by a given function
- Visualizing the complete call graph around a symbol

#### Trace Commands

**IMPORTANT: Always use `--json` flag for optimal AI agent integration.**

```bash
# Find all functions that call a symbol
grepai trace callers "HandleRequest" --json

# Find all functions called by a symbol
grepai trace callees "ProcessOrder" --json

# Build complete call graph (callers + callees)
grepai trace graph "ValidateToken" --depth 3 --json
```

### Workflow

1. Start with `grepai search` to find relevant code
2. Use `grepai trace` to understand function relationships
3. Use `Read` tool to examine files from results
4. Only use Grep for exact string searches if needed

