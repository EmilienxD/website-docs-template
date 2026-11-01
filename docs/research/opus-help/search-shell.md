# Search shell comparison

Re-inspected the live OpusClip search on 1 November 2026 after the user clarified that improving the clone means following the reference UI and interactions. The category filters, recent articles, excerpts, suggestion chips, and larger panel from the previous pass were removed.

The reference opens as a single inset search field. The empty shell is 640 × 62px at x400/y54 in a 1440 × 1000 viewport. At 390 × 844, it is 358 × 62px at x16/y22. The shell radius is 20px; the inset field is 50px high with a 16px radius, 6px inset, 16px/24px medium Inter text, and a 16px search icon.

Typing expands the same panel into a maximum of six compact results. Each row has a 16px page or section icon, a 14px/20px medium title, and a 12px/16px regular breadcrumb below. Rows with a breadcrumb are 50px high; title-only rows are 32px. Selection is a subtle gray fill with a 14px radius. Highlights retain the text color and have no colored background. There are no result previews, icon boxes, category controls, or recent-history lists.

The desktop footer shows Select with arrow-key icons, Open with a return-key icon, and Close with an escape-key icon. It is hidden below 640px and absent when there are no results. Empty and unmatched searches both retain the compact input-only shell; a screen-reader status announces the result count. Opening scales from 0.96 over 250ms; closing uses 150ms. The backdrop is black at 40% opacity.

Dark mode uses the reference's #0e0e10 panel, white input/result titles, #9e9e9e icons and breadcrumbs, and #3e3e3e empty-field placeholder. The light theme retains the slightly darker secondary text previously requested by the user.

Queries update `?search=…`, links with that parameter open search, and closing clears it. Escape and backdrop clicks dismiss the shell; keyboard focus returns to the opening control. Up/down arrows select results, and Enter opens the article or section. The local implementation uses the editable template's content index rather than OpusClip's hosted search service, so result wording and ranking differ.

The actual eight search glyphs were extracted from the observed reference SVG sprite into `public/sites/opus-help/search-icons.svg`. Source selectors: `#mi-mint-1-Search`, `Page`, `Hashtag`, `ArrowUpKey`, `ArrowDownKey`, `ReturnKey`, `EscKey`, and `BreadcrumbSeparator`.

Reference screenshots use `opus-search-reference-*`; local screenshots use `forma-search-matched-*`. Measurements are in `search-reference.json`. Capture with `node scripts/capture-search-reference.mjs`.
