# Forma documentation template

A reusable Next.js template for the official documentation websites of production projects. Forma provides example branding and articles to replace with your own product information.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run check` for ESLint, strict TypeScript, and the production build. Use `npm run build` followed by `npm start` for the production preview.

## Customize

Start with `src/components/sites/opus-help/content.ts`:

- `siteConfig`: brand name, header tabs, and Dashboard button label. The Dashboard button has no click handler or destination.
- `articles`: typed article content, sections, resource cards, and component blocks.
- `navigation`: sidebar groups and article order, which also controls previous/next links.
- Each article has a unique `slug`; each section has a unique `id` within its article.
- Search indexes the article title, introduction, category, section headings, cards, and block text automatically.

Add a guide to `guideDefinitions` for the standard steps layout, or add a complete `DocArticle` to `specialArticles` for a custom combination of sections and blocks. Add the slug to `navigation`. The dynamic route generates the page automatically.

```ts
{
  slug: "your-feature",
  title: "Your Feature",
  group: "Getting Started",
  description: "A helpful introduction to your feature.",
  sections: [{
    id: "overview",
    title: "Overview",
    description: "Explain how this feature helps your users.",
    blocks: [{ type: "callout", tone: "tip", text: "A useful detail." }],
  }],
}
```

Supported blocks: callouts (`info`, `tip`, `warning`), numbered steps, code with copy controls, keyboard-accessible tabs, accordions, and tables. Sections also support resource cards in two or three columns. Use React components directly when a page needs something more specialized.

Code blocks use dark panels in both themes, Paper Mono at 14px/24px, and Shiki's `dark-plus` syntax colors. Set `language` to `bash`, `json`, `javascript`, `typescript`, `python`, or `http`; aliases such as `cURL` and `js` work too. Unknown languages render as plain text. A code block's `title` is optional: omit it for a floating copy control, or include it for a compact labeled header.

Tabs whose items all contain `code` automatically render as one integrated code group. Each item accepts `label`, `text` (accessible instructions), `code`, and an optional `language` when its label isn't a language name. Other tab sets retain the standard article presentation. Highlighting runs on the server; copy controls always copy the original snippet, including whitespace. Long lines scroll horizontally within the panel, including with a keyboard when the code is focused.

## Files

| File | Purpose |
| --- | --- |
| `src/components/sites/opus-help/content.ts` | Branding, article data, sidebar groups, link helpers |
| `documentation-shell.tsx` | Header, sidebar, mobile drawer, search, themes, table of contents |
| `search-dialog.tsx` | Compact search panel, title/breadcrumb rows, and keyboard interaction |
| `search-query.ts` | Search query URL state and direct links to an open search |
| `documentation-search.ts` | Local index, title ranking, section destinations, and typo matching |
| `sidebar-state.tsx` | Shared section states and sidebar scroll position across article navigation |
| `documentation-page.tsx` | Article structure, pagination, footer |
| `article-components.tsx` | Cards, headings, steps, text tabs, accordions, feedback |
| `code-block.tsx` | Syntax token rendering, integrated code tabs, copy controls and tooltips |
| `code-highlighting.server.ts` | Server-side Shiki highlighting and language aliases |
| `workspace-tour.tsx` | Editable HTML illustration and four-step introductory tour |
| `icons.tsx` | Brand mark and reusable line icons |
| `documentation.css` | Layout, component styling, themes, responsive behavior |
| `src/app/layout.tsx` | Metadata, locally hosted Inter and Paper Mono fonts, initial theme |

The `opus-help` directory name is historical; the components use independent example branding. If renaming the folder, update the imports. Replace the brand mark in `icons.tsx` and `src/app/icon.svg`, the metadata in `src/app/layout.tsx`, and the tour copy in `workspace-tour.tsx`.

Colors are controlled through the `--docs-*` variables at the top of `documentation.css`. Light and dark values are separate. The outer width cap is 1472px; the sidebar is 288px; the table of contents is 240px. The article has a 24px left gutter and a 64px gap to the contents column. At 1280px the contents column appears; at 1024px the desktop header and sidebar appear; card grids become multi-column at 640px.

## Routes

| Purpose | Local route |
| --- | --- |
| Source `/docs` → `/docs/article/introduction-to-opusclip` | `/`, `/docs` |
| Legacy introduction alias | `/docs/article/introduction-to-opusclip` |
| Example introduction | `/docs/article/introduction` |
| Standard article layouts | `/docs/article/[slug]` |
| Learning center | `/docs/article/learning-center` |
| API example | `/docs/article/api-overview` |
| FAQs | `/docs/article/faq` |
| Changelog | `/docs/article/changelog` |

All visible navigation and resource links lead to included local routes. Unknown article slugs return the custom 404 page.

## Behavior and integration points

- Search provides an input-only panel when opened, compact title/breadcrumb rows once a query matches, and a keyboard-hint footer on desktop. It uses a local index, prioritizes title matches, accepts minor typos, and links directly to matching sections. Queries are reflected in `?search=…`; opening a URL with that parameter opens the search. Open with the header button or Ctrl/⌘ K, use arrow keys to select, Enter to open, and Escape or the backdrop to close. The panel has no category filters, excerpts, history sections, or empty-state suggestions.
- Theme preferences are saved in `localStorage`. System mode follows operating-system changes, and the initial theme is applied before the page renders.
- The mobile drawer, search, and tour use Base UI dialogs with focus management, Escape dismissal, and scroll locking.
- Sidebar sections expand and collapse with full-width heading buttons and rotating arrows. Article links have a small indent, with 12px between sections. Sections start expanded; their states persist across article navigation and are shared with the mobile drawer. Desktop sidebar scrolling is preserved when changing articles.
- The contents column follows article scroll and supports direct section anchors.
- Feedback buttons save a browser-local vote and show an acknowledgment. Connect these to your own analytics or backend when needed; there is no hosted feedback service.
- The walkthrough is an interactive component, not a video. Replace it with your own media if appropriate.
- API endpoints and billing/security examples are explicitly illustrative. Replace them with your own product information before publishing.

## Local assets

Fonts and SVG icons used by the app are stored in `public/sites/opus-help/`. Inter and Paper Mono are loaded through `next/font/local`, so the site does not require external font requests. Preserve the accompanying font license. The brand mark and workspace illustration are editable local SVG/HTML components.
