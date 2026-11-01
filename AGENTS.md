<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Website Documentation Template

## Project description

This is a reusable website documentation template for the official documentation of production projects. Each project can use this foundation and adapt its branding, navigation, guides, API references, and other documentation to its own product.

The current site uses Forma as example branding and content. Treat those examples as editable starting points and replace them with accurate product information when adapting the template.

## Stack and commands

- Next.js 16 App Router, React 19, and strict TypeScript.
- Tailwind CSS v4, shadcn/ui with Base UI primitives, and Lucide icons.
- Shiki for server-side syntax highlighting and locally hosted fonts.
- Node.js 24 or newer; install dependencies with `npm ci`.
- `npm run dev`: start the development server.
- `npm run build` and `npm start`: build and serve the production site.
- `npm run lint`: run ESLint.
- `npm run typecheck`: check TypeScript.
- `npm run check`: run lint, typecheck, and the production build.

## Project structure

- `src/app/`: routes, layouts, metadata, and global styles.
- `src/components/sites/opus-help/`: existing documentation components, content, search, navigation, themes, and article styles. The folder name is historical.
- `src/components/ui/`: shared UI primitives.
- `src/lib/`, `src/hooks/`, and `src/types/`: utilities, hooks, and shared types.
- `public/sites/opus-help/`: documentation fonts and icons used by the app.
- `docs/TEMPLATE.md`: customization and component guide.
- `.codex/`: Codex configuration, including Chrome browser access. Preserve it.

## Development guidelines

- Keep the template reusable across production projects; avoid coupling shared UI to one product.
- Start branding, article, and sidebar changes in `src/components/sites/opus-help/content.ts`.
- Keep documentation accurate, clear, and task oriented. Distinguish sample API endpoints and example behavior from real product capabilities.
- Preserve responsive layouts, accessible keyboard interactions, search, light/dark/system themes, and readable code examples.
- Use strict TypeScript without `any`, named exports, PascalCase components, camelCase utilities, and 2-space indentation.
- Prefer Tailwind utilities or scoped CSS. Use inline styles only when dynamic behavior requires them.
- Run checks appropriate to the change; use `npm run check` before delivering application changes.
- Use the Chrome access configured in `.codex/` for browser verification when needed.
