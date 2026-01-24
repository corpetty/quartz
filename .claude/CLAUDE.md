# Quartz Project

This is a Quartz v4 digital garden / static site generator project.

## Project Overview

Quartz transforms Markdown content into a static website. It's built with TypeScript and uses modern web technologies.

## Key Commands

- `npx quartz build` - Build the static site
- `npx quartz serve` - Serve the site locally with hot reload
- `npm run check` - Run TypeScript checks and Prettier formatting check
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Project Structure

- `/quartz/` - Core Quartz framework code (TypeScript)
- `/content/` - Markdown content for the site
- `/quartz.config.ts` - Main configuration file
- `/quartz.layout.ts` - Layout configuration

## Development Notes

- Node.js 20+ or 22+ required
- Uses ESM modules (`"type": "module"`)
- TypeScript for type safety
- Prettier for code formatting

## Content

Content is written in Markdown and stored in the `/content/` directory. Quartz supports:
- Obsidian-style wikilinks
- Frontmatter metadata
- LaTeX math (KaTeX/MathJax)
- Code syntax highlighting (Shiki)
- Citations (rehype-citation)

## Writing Voice Profile

When writing content (blog posts, articles, analysis) that represents Corey's voice:

- **Profile:** `.claude/voice-profile.md`
- **When to use:** Any content that will be published or represents Corey's voice
- **Key principles:**
  - Show the thinking process, admit uncertainty
  - Data first, opinions clearly marked
  - Invite dialogue and critique
  - Strategic informality (cusses when warranted, not for shock)
  - Avoid AI-isms: over-hedging, generic transitions, sanitized language

Quick voice check - reject output that contains:
- "It's worth noting that..."
- "Furthermore" / "Moreover" / "Additionally"
- "Incredibly" / "Absolutely" / "Remarkably"
- Generic conclusions that could apply to anything

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

