"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { Search, Sun, Moon, Monitor, ChevronRight, Menu, X, ListFilter, Check, ChevronDown, ArrowUpRight } from "lucide-react";
import { navigation, siteConfig, articleHref, getArticle, type DocArticle } from "./content";
import { BrandMark } from "./icons";
import { useSidebarState } from "./sidebar-state";
import { SearchDialog } from "./search-dialog";
import { setSearchQuery, useSearchQuery } from "./search-query";

type Theme = "light" | "dark" | "system";
function subscribeTheme(callback: () => void) {
  window.addEventListener("forma-theme-change", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("forma-theme-change", callback); window.removeEventListener("storage", callback); };
}
function themeSnapshot(): Theme {
  try { const value = localStorage.getItem("forma-theme"); return value === "light" || value === "dark" ? value : "system"; } catch { return "system"; }
}
function serverTheme(): Theme { return "system"; }

function ThemeMenu() {
  const theme = useSyncExternalStore(subscribeTheme, themeSnapshot, serverTheme);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && query.matches));
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [theme]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!detailsRef.current?.contains(event.target as Node)) detailsRef.current?.removeAttribute("open"); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return <details className="theme-menu" ref={detailsRef} onKeyDown={event => { if (event.key === "Escape") { detailsRef.current?.removeAttribute("open"); detailsRef.current?.querySelector("summary")?.focus(); } }}><summary aria-label="Change theme preference" title="Change theme preference"><Icon size={17} strokeWidth={1.5} /></summary><div className="theme-options" aria-label="Appearance">{([ ["system", "System", Monitor], ["light", "Light", Sun], ["dark", "Dark", Moon] ] as const).map(([value, label, OptionIcon]) => <button type="button" key={value} aria-pressed={theme === value} onClick={() => { try { localStorage.setItem("forma-theme", value); } catch {} document.documentElement.classList.toggle("dark", value === "dark" || (value === "system" && matchMedia("(prefers-color-scheme: dark)").matches)); window.dispatchEvent(new Event("forma-theme-change")); detailsRef.current?.removeAttribute("open"); }}><OptionIcon size={15} />{label}{theme === value && <Check size={14} className="theme-check" />}</button>)}</div></details>;
}

function SidebarNavigation({ currentSlug, onNavigate }: { currentSlug: string; onNavigate?: () => void }) {
  const { expandedGroups, toggleGroup } = useSidebarState();
  const navigationId = useId();

  return <nav aria-label="Documentation pages" className="sidebar-navigation">
    {navigation.map((group, index) => {
      const expanded = expandedGroups[group.title] !== false;
      const panelId = `${navigationId}-section-${index}`;

      return <div className="nav-group" key={group.title}>
        <h3>
          <button type="button" className="nav-group-toggle" aria-expanded={expanded} aria-controls={panelId} onClick={() => toggleGroup(group.title)}>
            <span>{group.title}</span>
            <ChevronRight className="nav-group-arrow" size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </h3>
        <div id={panelId} hidden={!expanded}>
          {group.slugs.map(slug => {
            const article = getArticle(slug)!;
            return <Link key={slug} href={articleHref(slug)} onClick={onNavigate} className={`sidebar-link ${slug === currentSlug ? "is-active" : ""}`} aria-current={slug === currentSlug ? "page" : undefined}>{article.title}</Link>;
          })}
        </div>
      </div>;
    })}
  </nav>;
}

function TableOfContents({ article }: { article: DocArticle }) {
  const [activeId, setActiveId] = useState<string | undefined>(article.sections[0]?.id);
  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let active: string | undefined = article.sections[0]?.id;
        for (const section of article.sections) {
          if ((document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity) <= 190) active = section.id;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) active = article.sections.at(-1)?.id;
        setActiveId(active);
      });
    }
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, [article]);
  return <aside className="table-of-contents"><nav aria-label="On this page"><button className="toc-title" title="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ListFilter size={14} strokeWidth={1.6} />On this page</button>{article.sections.map(section => <a key={section.id} href={`#${section.id}`} className={activeId === section.id ? "is-active" : ""} aria-current={activeId === section.id ? "location" : undefined}>{section.title}</a>)}</nav></aside>;
}

export function DocumentationShell({ article, children }: { article: DocArticle; children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchQuery = useSearchQuery();
  // A shared search URL opens the panel; clearing its field keeps the panel open.
  if (searchQuery && !searchOpen) setSearchOpen(true);
  const isSearchOpen = searchOpen || Boolean(searchQuery);
  const changeSearchOpen = useCallback((next: boolean) => {
    if (!next) setSearchQuery("");
    setSearchOpen(next);
  }, []);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const searchReturnFocusRef = useRef<HTMLElement>(null);
  const { desktopScrollTopRef } = useSidebarState();
  const specialTab = siteConfig.tabs.find(tab => tab.slug === article.slug && tab.slug !== "introduction");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!isSearchOpen) searchReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        changeSearchOpen(!isSearchOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSearchOpen, changeSearchOpen]);
  useLayoutEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) sidebar.scrollTop = desktopScrollTopRef.current;
    const activeLink = sidebar?.querySelector('[aria-current="page"]');
    if (sidebar && activeLink && activeLink.getClientRects().length > 0) {
      const bounds = sidebar.getBoundingClientRect();
      const activeBounds = activeLink.getBoundingClientRect();
      if (activeBounds.bottom > bounds.bottom) sidebar.scrollTop += activeBounds.bottom - bounds.bottom + 32;
      else if (activeBounds.top < bounds.top) sidebar.scrollTop -= bounds.top - activeBounds.top + 32;
    }
    if (sidebar) desktopScrollTopRef.current = sidebar.scrollTop;
  }, [article.slug, desktopScrollTopRef]);
  return <div className="documentation"><a className="skip-link" href="#content-area">Skip to content</a><header className="site-header"><div className="header-inner"><div className="topbar"><Link className="brand" href={siteConfig.home} aria-label={`${siteConfig.name} Help Center`}><BrandMark /><span>{siteConfig.name.toLowerCase()}<span className="brand-dot">.</span></span></Link><button type="button" className="search-trigger" onClick={event => { searchReturnFocusRef.current = event.currentTarget; setSearchOpen(true); }} aria-label="Open search"><span><Search size={16} strokeWidth={1.5} /><span>Search...</span></span><kbd>Ctrl K</kbd></button><div className="header-actions"><button type="button" className="header-cta">{siteConfig.dashboardLabel}<ChevronRight size={14} /></button><ThemeMenu /><button type="button" className="mobile-search icon-button" aria-label="Open search" onClick={event => { searchReturnFocusRef.current = event.currentTarget; setSearchOpen(true); }}><Search size={20} strokeWidth={1.6} /></button></div></div><nav className="top-tabs" aria-label="Main navigation">{siteConfig.tabs.map(tab => <Link href={tab.href} className={(specialTab?.slug ?? "introduction") === tab.slug ? "is-active" : ""} aria-current={(specialTab?.slug ?? "introduction") === tab.slug ? "page" : undefined} key={tab.slug}>{tab.label}</Link>)}</nav><button className="mobile-breadcrumb" type="button" onClick={() => setNavigationOpen(true)} aria-label="Open documentation navigation"><Menu size={18} strokeWidth={1.5} /><span>{article.group}</span><ChevronRight size={13} /><strong>{article.title}</strong></button></div></header>
    <div className="docs-layout"><aside className="desktop-sidebar" ref={sidebarRef} onScroll={event => { desktopScrollTopRef.current = event.currentTarget.scrollTop; }}><SidebarNavigation currentSlug={article.slug} /></aside><main className="article-layout"><article className="article-content" id="content-area" tabIndex={-1}>{children}</article><TableOfContents article={article} key={article.slug} /></main></div>
    <SearchDialog open={isSearchOpen} onOpenChange={changeSearchOpen} returnFocusRef={searchReturnFocusRef} />
    <Dialog.Root open={navigationOpen} onOpenChange={setNavigationOpen}><Dialog.Portal><Dialog.Backdrop className="dialog-backdrop" /><Dialog.Popup className="mobile-drawer"><Dialog.Title className="sr-only">Documentation navigation</Dialog.Title><div className="drawer-header"><Link className="brand" href="/docs" onClick={() => setNavigationOpen(false)}><BrandMark /><span>forma.</span></Link><div><ThemeMenu /><Dialog.Close className="icon-button" aria-label="Close navigation"><X size={20} /></Dialog.Close></div></div><div className="drawer-tabs"><label className="sr-only" htmlFor="documentation-section">Documentation section</label><select id="documentation-section" value={specialTab?.href ?? "/docs"} onChange={event => { window.location.href = event.target.value; }} >{siteConfig.tabs.map(tab => <option key={tab.slug} value={tab.href}>{tab.label}</option>)}</select><ChevronDown size={16} /></div><SidebarNavigation currentSlug={article.slug} onNavigate={() => setNavigationOpen(false)} /><Link className="drawer-bottom" href="/docs/article/quickstart" onClick={() => setNavigationOpen(false)}>Get started with Forma<ArrowUpRight size={15} /></Link></Dialog.Popup></Dialog.Portal></Dialog.Root>
  </div>;
}
