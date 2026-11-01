"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import type { ContentBlock, HighlightedCode } from "./content";

interface CodeContentProps {
  code: string;
  language?: string;
  highlightedCode?: HighlightedCode;
}

function CodeContent({ code, language, highlightedCode }: CodeContentProps) {
  return <pre className="code-content" tabIndex={0} aria-label={`${language ?? "Example"} code`}><code data-language={language}>{highlightedCode ? highlightedCode.map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && "\n"}{line.map((token, tokenIndex) => <span key={tokenIndex} style={{
    color: token.color,
    fontStyle: token.fontStyle && token.fontStyle & 1 ? "italic" : undefined,
    fontWeight: token.fontStyle && token.fontStyle & 2 ? 700 : undefined,
    textDecoration: token.fontStyle && token.fontStyle & 4 ? "underline" : undefined,
  }}>{token.content}</span>)}</Fragment>) : code.replace(/\n$/, "")}</code></pre>;
}

function CopyCodeButton({ code }: { code: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copy() {
    clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2200);
  }

  const label = copyState === "copied" ? "Copied" : copyState === "error" ? "Try copying again" : "Copy code";
  return <Tooltip.Provider><Tooltip.Root><Tooltip.Trigger type="button" className="code-copy" onClick={copy} aria-label={label} data-copied={copyState === "copied" || undefined} closeOnClick={false} delay={300}>
    <svg width="16" height="16" strokeWidth={copyState === "copied" ? 2 : 1.5} aria-hidden="true"><use href={`/sites/opus-help/code-icons.svg#${copyState === "copied" ? "check" : "copy"}`} /></svg>
  </Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner side="top" sideOffset={6} className="code-tooltip-positioner"><Tooltip.Popup className="code-tooltip">{label}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root><span className="sr-only" role="status">{copyState === "copied" ? "Code copied to clipboard" : copyState === "error" ? "Could not copy. Select the code to copy it manually." : ""}</span></Tooltip.Provider>;
}

export function CodeBlock({ title, ...content }: CodeContentProps & { title?: string }) {
  return <div className={`code-block${title ? " has-title" : ""}`}>
    {title ? <div className="code-header"><span>{title}</span><CopyCodeButton code={content.code} /></div> : <div className="code-floating-actions"><CopyCodeButton code={content.code} /></div>}
    <CodeContent {...content} />
  </div>;
}

export function CodeGroup({ items }: { items: Extract<ContentBlock, { type: "tabs" }>["items"] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const item = items[selected];
  return <div className="code-group">
    <div className="code-group-header"><div className="code-tab-list" role="tablist" aria-label="Code examples">
      {items.map((item, index) => <button type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={selected === index} aria-controls={`${id}-panel-${index}`} tabIndex={selected === index ? 0 : -1} key={item.label} onClick={() => setSelected(index)} onKeyDown={event => {
        let next: number | undefined;
        if (event.key === "ArrowRight") next = (index + 1) % items.length;
        if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = items.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          setSelected(next);
          document.getElementById(`${id}-tab-${next}`)?.focus();
        }
      }}><span>{item.label}</span></button>)}
    </div><CopyCodeButton code={item.code ?? ""} key={selected} /></div>
    {items.map((item, index) => <div className="code-tab-panel" role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} key={item.label}>
      <p className="sr-only">{item.text}</p>
      <CodeContent code={item.code ?? ""} language={item.language ?? item.label} highlightedCode={item.highlightedCode} />
    </div>)}
  </div>;
}
