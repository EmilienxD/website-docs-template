# Opus Help Center reference

Inspected 1 November 2026 in system Chrome with Playwright, using actual computed styles and wheel/keyboard/pointer input. The requested URL `https://help.opus.pro/docs` redirects to `https://help.opus.pro/docs/article/introduction-to-opusclip`.

The user wants the complete page structure and a reusable documentation template, with generic editable content replacing Opus branding, product-specific copy, and video. Application code and local route ownership belong to the primary agent; this directory contains source evidence only.

## Source structure and local mapping

| Source | Intended local equivalent | Ownership |
| --- | --- | --- |
| `/docs` → `/docs/article/introduction-to-opusclip` | `/` and `/docs`, reusable introduction | Root application routes |
| Article anchor sections | Introduction section anchors | Shared article renderer |
| Sidebar article links | Generic example articles under `/docs/…` | Content configuration and article route |
| Topbar documentation areas | Generic help, guides, API, FAQ, changelog | Content configuration and local routes |

Source article order: category label; H1; two-line introduction; centered tutorial embed; Getting Started (3 cards); ClipAnything (3); Submit Your Video (3); Customize Your Clips (5); Get Your Clips (2); Edit Your Clips (10); Manage Your Clips (1); Publish Your Projects (3); Export to XML (2); Others (5); helpfulness controls; next article; muted platform footer. Cards use two or three columns according to the section. All stack into one column on phones.

The sidebar has grouped plain text links, an active rounded gray row, and its own scrolling area. The article and right table of contents scroll independently of that sidebar. The entire two-row desktop header remains sticky.

## Geometry

Measurements below use headless Chrome without a permanent scrollbar gutter. The interactive browser with a visible scrollbar has about 15px less available width.

| Rule | 1440 × 1000 | 1920 × 1080 | 390 × 844 |
| --- | --- | --- | --- |
| Outer content max width | 1472px cap, currently 1440px | 1472px, x224 | Full width |
| Header | 64px top + 48px tabs | Same, centered inner max width | 64px top + 56px breadcrumbs |
| Header logo left | x48 | x272 | x16 |
| Sidebar | x32, width288 | x256, width288 | Hidden; opens 320px drawer |
| Article content | x363.2, width688.8 | x587.2, width720.8 | x20, width350 |
| Article category top | y152 | y152 | y160 |
| H1 top | y184 | y184 | y192 |
| Right contents | x1144, width264 | x1400, width264 | Hidden |
| Resource card | 218.9 × 134px (wrapped title) | 229.6 × 134px | 350 × 110px (single-line title) |

The outer wrapper has 32px desktop horizontal padding; header uses 48px. Source sidebar actual links are width256, leaving a 32px gutter within its 288px column. Article introduces an additional 43.2px gap after sidebar column. Right contents has generous whitespace separating it from article. Main article max visible content width is approximately721px. Source uses `lg` desktop sidebar/header conventions at 1024px; card grids switch from stacked to columns at640px. The right contents disappears before the sidebar does.

Section headings have 36px top and18px bottom margin. Card grid column gap16px, row effective gap16px; cards themselves have8px top/bottom margin. Card inner padding24px horizontal/20px vertical, 24px icon,16px gap before title. Border1px near black at10% opacity; border radius16px. Source cards gain a black border on hover, without a shadow or transform.

## Typography and color

All documentation text uses the loaded Inter variable font (weight100–900). H1 is36px/40px, weight600, letter spacing−0.9px; phone H1 is30px/36px, letter spacing−0.75px. H2 is24px/32px, weight600, letter spacing−0.6px. Body content is16px/28px. Sidebar and top tabs are14px/24px, sidebar group heading600 weight. Card title is16px/24px, weight600. Right contents is14px/24px with32px row pitch.

Light background `#fff`; H1 and sidebar headings `#161616`; card title `#252525`; prose `#3e3e3e`; secondary navigation `#4f4f4f`; muted text `#6f6f6f`; active sidebar background black10%. Heading2 uses a very dark blue-gray (`oklch(0.21 0.034 264.665)`). Header separators are extremely subtle black/gray borders.

Dark background `rgb(14,14,16)`; H1 `#dedede`; card title white; prose/muted approximately `#9e9e9e`; card border white10%; active sidebar white10%. Theme menu offers System, Light, Dark and remembers selection.

## Interaction states

- Desktop search opens by button or Ctrl+K. It is a640px dialog centered horizontally at y54, rounded20px, with gray darkened backdrop. The initial state is a single input. Typing produces article title and breadcrumb rows, a highlighted selected result, and a footer explaining Up/Down, Enter, Escape. Actual source search results captured for `brand`.
- Desktop theme icon opens a small menu with System/Light/Dark, each with an icon and secondary description. Dark mode screenshot captured after selecting Dark.
- Mobile uses search and more-action icons at the right of the logo. More actions reveals a compact Dashboard link and close icon over a backdrop.
- Mobile breadcrumb row opens a320px white drawer with logo, theme segmented control, documentation-area select, and the full grouped sidebar; the remaining page is dimmed.
- Right contents links jump to article anchors and bold the current section as article scrolls. Header remains sticky. Its title also offers a return-to-top action.
- Resource cards navigate to their linked articles or article anchors. Their hover changes border, not position.
- The article footer offers Yes/No helpfulness controls and next-article navigation.

## Assets

| Actual source URL | Template treatment |
| --- | --- |
| `https://help.opus.pro/_mintlify/assets/fonts/inter/Inter-latin.woff2` | Use actual font locally; application agent owns `public/sites/…/fonts/` |
| `https://mintcdn.com/opusclip-c3e48c12/H3hvh_QZTOfvCejz/logo/opus_logo.svg?...` | Replace branding as requested; original reference logo is28px square |
| `https://www.youtube.com/embed/dvO5NsYovM4` | Replace Opus tutorial with reusable local walkthrough component |
| `https://i.ytimg.com/vi/dvO5NsYovM4/sddefault.jpg` | Source-only tutorial thumbnail, intentionally excluded from reusable template |
| Inline SVG card icons | Reusable line icons,24px, stroke1.5px |

Source tutorial is560 × 315px with8px radius. It is fixed width even on phones and creates actual horizontal overflow: scrollWidth475 at viewport390 (embed x−85 through475). Preserve the desktop media footprint but fix the overflow in the reusable template. This is an intentional improvement and a documented source difference.

## Saved visual evidence

See `../../design-references/opus-source-*` for desktop top/middle/bottom/full-page, wide top, phone top/cards/full-page/sidebar/more-action states, desktop empty search/results, theme menu, and dark mode. Exact styles, rectangles, resource requests, and measured ancestors are in `measurements.json`. Reproduce screenshots with `node scripts/capture-reference.mjs` after installing Playwright locally. The capture script is a development tool; it is not a production dependency.

These are reference screenshots, not the rendered implementation. Compare local output at equal viewport sizes. Brand, copy, tutorial artwork, and section names are intentionally editable examples; spacing, hierarchy, navigation, cards, and responsive rules should retain source appearance.
