"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { articles } from "./content";
import { buildSearchIndex, searchDocumentation, searchTerms, type SearchResult } from "./documentation-search";
import { setSearchQuery, useSearchQuery } from "./search-query";

const searchIndex = buildSearchIndex(articles);
const genericSectionTitles = new Set(["Before You Begin", "Step by Step", "Good to Know", "What?s Next?", "Next Steps", "Introduction"]);

type SearchGlyphName = "search" | "page" | "section" | "arrow-up" | "arrow-down" | "return" | "escape" | "separator";

function SearchGlyph({ name, className }: { name: SearchGlyphName; className?: string }) {
  return <svg className={className} width="18" height="18" viewBox="0 0 18 18" strokeWidth="1.5" aria-hidden="true"><use href={`/sites/opus-help/search-icons.svg#${name}`} /></svg>;
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const expression = terms.filter(term => term.length > 1).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  if (!expression) return <>{text}</>;
  return <>{text.split(new RegExp(`(${expression})`, "gi")).map((part, index) => new RegExp(`^(${expression})$`, "i").test(part) ? <mark key={index}>{part}</mark> : part)}</>;
}

export function SearchDialog({ open, onOpenChange, returnFocusRef }: { open: boolean; onOpenChange: (open: boolean) => void; returnFocusRef: RefObject<HTMLElement | null> }) {
  const query = useSearchQuery();
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const id = useId();
  const hasQuery = query.trim().length > 0;
  const terms = searchTerms(query);
  const results = useMemo(() => hasQuery ? searchDocumentation(searchIndex, query).results.slice(0, 6) : [], [query, hasQuery]);
  const activeIndex = Math.min(selected, Math.max(0, results.length - 1));
  const activeResult = results[activeIndex];

  function updateQuery(value: string) {
    setSelected(0);
    setSearchQuery(value);
    if (resultsRef.current) resultsRef.current.scrollTop = 0;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
      event.preventDefault();
      if (!results.length) return;
      const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : event.key === "PageDown" ? 5 : -5;
      const next = (activeIndex + delta + results.length * 5) % results.length;
      setSelected(next);
      const option = document.getElementById(`${id}-result-${next}`);
      const list = resultsRef.current;
      if (option && list) {
        const bounds = list.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom + 8;
        else if (row.top < bounds.top) list.scrollTop -= bounds.top - row.top + 8;
      }
    }
    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      onOpenChange(false);
      router.push(activeResult.href);
    }
  }

  function renderResult(result: SearchResult, index: number) {
    const showArticleTitle = result.kind === "section" && genericSectionTitles.has(result.title);
    const title = showArticleTitle ? result.articleTitle : result.title;
    const area = result.scope === "api" ? "API Reference" : result.scope === "faq" ? "FAQs" : "Help Center";
    const breadcrumbs = result.kind === "section" ? [result.articleTitle, result.title] : [area, result.group];
    return <Link
      role="option" tabIndex={-1} aria-selected={index === activeIndex}
      id={`${id}-result-${index}`} aria-labelledby={`${id}-title-${index} ${id}-breadcrumb-${index}`}
      href={result.href} key={result.id}
      className={`search-result ${index === activeIndex ? "is-selected" : ""}`}
      onPointerMove={event => { if (event.movementX || event.movementY) setSelected(index); }}
      onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) onOpenChange(false); }}
    >
      <span className="search-result-icon"><SearchGlyph name={result.kind === "section" ? "section" : "page"} /></span>
      <span className="search-result-copy">
        <strong id={`${id}-title-${index}`}><Highlight text={title} terms={terms} /></strong>
        <span className="search-breadcrumb" id={`${id}-breadcrumb-${index}`}>{breadcrumbs.map((crumb, crumbIndex) => <span key={crumbIndex}>{crumbIndex > 0 && <SearchGlyph name="separator" />}<span>{crumb}</span></span>)}</span>
      </span>
    </Link>;
  }

  return <Dialog.Root open={open} onOpenChange={onOpenChange} onOpenChangeComplete={next => { if (!next) setSelected(0); }}>
    <Dialog.Portal>
      <Dialog.Backdrop className="dialog-backdrop search-backdrop" />
      <Dialog.Popup className="search-dialog" initialFocus={inputRef} finalFocus={returnFocusRef}>
        <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
        <Dialog.Description id={`${id}-hints`} className="sr-only">Use the up and down arrow keys to select a result, Enter to open it, and Escape to close search.</Dialog.Description>
        <div className="search-header"><div className="search-input-row">
          <SearchGlyph name="search" className="search-input-icon" />
          <input ref={inputRef} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search" placeholder="Search..." aria-label="Search documentation" aria-describedby={`${id}-hints`} value={query} role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-results`} aria-activedescendant={activeResult ? `${id}-result-${activeIndex}` : undefined} onChange={event => updateQuery(event.target.value)} onKeyDown={handleKeyDown} />
        </div></div>
        <div className="search-results" ref={resultsRef} id={`${id}-results`} role="listbox" aria-label="Articles">{results.map(renderResult)}</div>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{hasQuery ? `Results: ${results.length}` : ""}</span>
        {results.length > 0 && <div className="search-footer"><div><span><span className="search-arrow-keys"><SearchGlyph name="arrow-up" /><SearchGlyph name="arrow-down" /></span>Select</span><span><SearchGlyph name="return" />Open</span></div><Dialog.Close className="search-close-hint"><SearchGlyph name="escape" />Close</Dialog.Close></div>}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
