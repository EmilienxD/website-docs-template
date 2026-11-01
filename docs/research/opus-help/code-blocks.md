# Code blocks

Reference: https://help.opus.pro/api-reference/endpoints/create-project

Local demonstration: http://localhost:3000/docs/article/api-overview

The reusable API article keeps Forma's example content. The reference supplies the code components' appearance and interaction. The template's wider article layout remains as requested.

## Observed and reproduced rules

| Property | Reference and implementation |
| --- | --- |
| Panel | Dark `#0B0C0E` in both page themes; 16px radius |
| Font | Actual Paper Mono variable font, 14px, weight 400, 24px line height |
| Code padding | 14px vertically, 16px horizontally |
| Syntax | Shiki `dark-plus`, including yellow commands, blue flags, orange strings |
| Margins | 20px top, 32px bottom |
| Plain blocks | Headerless by default; optional title header |
| Copy | 26px button, actual 16px source SVG; check and live announcement after success |
| Floating controls | Top 12px, right 16px |
| Code groups | 2px padding, transparent 1px border in light, white 10% border in dark |
| Tabs | Integrated 34px bar; 12px/24px, weight 500; 4px gap; scrolling tab list |
| Selection | White tab label; black underline in light, white underline in dark |
| Overflow | Unwrapped lines scroll inside the code panel; page width stays within the viewport |

Arrow keys, Home, and End select and focus code tabs. Copy uses the active tab's original source string rather than its highlighted DOM. Clipboard failure is announced, and the copy button can be retried. Hover and keyboard focus reveal a copy tooltip. Text-only article tabs retain their existing presentation.

Highlighting runs in `code-highlighting.server.ts`; serializable tokens are passed to the client renderer. The browser does not load the syntax highlighter. Supported bundled grammars are Bash, JSON, JavaScript, TypeScript, Python, and HTTP. Unknown languages fall back to plain text. Titles are optional; no redundant language badge is added above a tabbed example.

## Asset map

| Source | Local asset |
| --- | --- |
| `https://help.opus.pro/_mintlify/assets/fonts/PaperMono-Variable.woff2` | `public/sites/opus-help/fonts/paper-mono-variable.woff2` (53,276 bytes) |
| Inline source symbols `mi-mint-1-Copy`, `mi-mint-1-Check` | `public/sites/opus-help/code-icons.svg` |

## Comparison and validation

`code-block-measurements.json` records source/local measurements at 1440×1000 and 390×844. Screenshots in `docs/design-references/opus-code-*` and `forma-code-*` cover plain blocks, integrated tabs, alternate tabs, mobile, and dark mode. Reproduce with `node scripts/capture-code-reference.mjs` while the local development server is running.

The source and template have different snippet lengths, labels, and article widths, so their total panel dimensions differ. Their font, line spacing, padding, rounded corners, syntax palette, and tab geometry follow the same rules. Source-specific API tooling and endpoint forms are outside this code-block update.

`npm run check` passes. `node scripts/verify-template.mjs` passes 14 checks across 33 routes, including every code tab's clipboard contents, plain-block copy, keyboard tab navigation, syntax colors, dark backgrounds, and mobile horizontal scrolling. No runtime errors or missing local assets were found.
