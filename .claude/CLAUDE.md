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
