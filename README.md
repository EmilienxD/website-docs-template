# Website Documentation Template

A reusable foundation for the official documentation websites of production projects. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

The included Forma content demonstrates guides, API references, FAQs, and release notes. Adapt the branding and content for each product.

## Getting started

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a production preview, run `npm run build` followed by `npm start`.

## Customization

See [docs/TEMPLATE.md](docs/TEMPLATE.md) for content authoring, components, routes, and integration points.

- Update branding, articles, and sidebar navigation in `src/components/sites/opus-help/content.ts`.
- Adjust themes and layout in `src/components/sites/opus-help/documentation.css`.
- Replace metadata and fonts in `src/app/layout.tsx`, and the logo in `icons.tsx` and `src/app/icon.svg`.
- Replace sample product information, API endpoints, and integration links before publishing.

The site includes local search, responsive navigation, light/dark/system themes, syntax highlighting, copyable code tabs, a table of contents, and article pagination.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript |
| `npm run check` | Run lint, typecheck, and build |

## Development

[AGENTS.md](AGENTS.md) contains shared project instructions; [CLAUDE.md](CLAUDE.md) imports them for Claude Code. `.codex/` provides Codex configuration and Chrome browser access.

## License

[MIT](LICENSE). Bundled fonts retain their accompanying license.
