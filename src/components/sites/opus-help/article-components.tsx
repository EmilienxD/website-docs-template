"use client";

import { useState, useId, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Info, Lightbulb, TriangleAlert, ThumbsUp, ThumbsDown, Link as LinkIcon, ArrowUpRight } from "lucide-react";
import { articleHref, type ContentBlock, type DocSection, type ResourceCard } from "./content";
import { DocIcon } from "./icons";
import { CodeBlock, CodeGroup } from "./code-block";

export function ResourceCards({ cards, columns = 3 }: { cards: ResourceCard[]; columns?: 2 | 3 }) {
  return <div className={`resource-grid columns-${columns}`}>
    {cards.map((card, index) => <Link className="resource-card" href={articleHref(card.slug)} key={`${card.slug}-${index}`}>
      <DocIcon name={card.icon} />
      <ArrowUpRight className="card-arrow" size={16} aria-hidden="true" />
      <span className="card-title">{card.title}</span>
      {card.description && <span className="card-description">{card.description}</span>}
    </Link>)}
  </div>;
}

export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="section-heading"><a className="heading-anchor" href={`#${id}`} aria-label={`Link to ${typeof children === "string" ? children : "section"}`}><LinkIcon size={16} /></a>{children}</h2>;
}

function ArticleTabs({ items }: { items: Extract<ContentBlock, { type: "tabs" }>["items"] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  return <div className="article-tabs"><div className="tab-list" role="tablist" aria-label="Options">
    {items.map((item, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === index} aria-controls={`${id}-panel-${index}`} tabIndex={selected === index ? 0 : -1} key={item.label} onClick={() => setSelected(index)} onKeyDown={event => {
      let next: number | undefined;
      if (event.key === "ArrowRight") next = (selected + 1) % items.length;
      if (event.key === "ArrowLeft") next = (selected - 1 + items.length) % items.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = items.length - 1;
      if (next !== undefined) { event.preventDefault(); setSelected(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }
    }}>{item.label}</button>)}
  </div><div role="tabpanel" id={`${id}-panel-${selected}`} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}><p>{items[selected].text}</p>{items[selected].code !== undefined && <CodeBlock code={items[selected].code} language={items[selected].language ?? items[selected].label} highlightedCode={items[selected].highlightedCode} />}</div></div>;
}

export function ArticleBlock({ block }: { block: ContentBlock }) {
  if (block.type === "callout") {
    const Icon = block.tone === "tip" ? Lightbulb : block.tone === "warning" ? TriangleAlert : Info;
    return <aside className={`callout callout-${block.tone}`}><Icon size={20} aria-hidden="true" /><div>{block.title && <strong>{block.title}</strong>}<p>{block.text}</p></div></aside>;
  }
  if (block.type === "steps") return <ol className="steps">{block.items.map((step, index) => <li key={step.title}><span className="step-number">{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>;
  if (block.type === "code") return <CodeBlock {...block} />;
  if (block.type === "tabs") return block.items.every(item => item.code !== undefined) ? <CodeGroup items={block.items} /> : <ArticleTabs items={block.items} />;
  if (block.type === "accordion") return <div className="accordion-group">{block.items.map(item => <details className="accordion" key={item.title}><summary><ChevronRight size={16} aria-hidden="true" /><span>{item.title}</span><ChevronDown className="accordion-down" size={16} aria-hidden="true" /></summary><p>{item.text}</p></details>)}</div>;
  if (block.type === "table") return <div className="table-wrap" tabIndex={0} role="region" aria-label="Reference table"><table><thead><tr>{block.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
  return null;
}

export function ArticleSection({ section }: { section: DocSection }) {
  return <section className="article-section"><SectionHeading id={section.id}>{section.title}</SectionHeading>{section.description && <p>{section.description}</p>}{section.blocks?.map((block, index) => <ArticleBlock block={block} key={index} />)}{section.cards && <ResourceCards cards={section.cards} columns={section.columns} />}</section>;
}

function subscribeFeedback(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ArticleFeedback({ slug }: { slug: string }) {
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const savedVote = useSyncExternalStore(subscribeFeedback, () => { try { return localStorage.getItem(`forma-feedback-${slug}`); } catch { return null; } }, () => null);
  const vote = currentVote ?? savedVote;
  function saveVote(value: string) {
    setCurrentVote(value);
    try { localStorage.setItem(`forma-feedback-${slug}`, value); } catch {}
  }
  return <div className="article-feedback"><span role="status">{vote ? "Thanks for helping us improve these docs." : "Was this page helpful?"}</span><div><button className={vote === "yes" ? "selected" : ""} aria-pressed={vote === "yes"} onClick={() => saveVote("yes")}><ThumbsUp size={15} />Yes</button><button className={vote === "no" ? "selected" : ""} aria-pressed={vote === "no"} onClick={() => saveVote("no")}><ThumbsDown size={15} />No</button></div></div>;
}
