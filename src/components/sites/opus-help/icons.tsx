import { BookOpen, Search, Upload, FileText, Globe, Palette, Type, PanelsTopLeft, SlidersHorizontal, Folder, Clock3, Share2, Download, Code2, Mail, ShieldCheck, CreditCard, CircleHelp, Zap, Settings2, Check, Terminal, Bell, Layers, Sparkles } from "lucide-react";
import type { IconName } from "./content";

const icons = { book: BookOpen, search: Search, upload: Upload, file: FileText, globe: Globe, palette: Palette, type: Type, layout: PanelsTopLeft, sliders: SlidersHorizontal, folder: Folder, clock: Clock3, share: Share2, download: Download, code: Code2, mail: Mail, shield: ShieldCheck, "credit-card": CreditCard, help: CircleHelp, zap: Zap, settings: Settings2, check: Check, terminal: Terminal, bell: Bell, layers: Layers, sparkles: Sparkles };

export function DocIcon({ name, className }: { name: IconName; className?: string }) {
  if (name === "grid" || name === "link" || name === "users") {
    return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "grid" && <><path d="M14 17h6m-3-3v6" /><rect x="4" y="4" width="6" height="6" rx=".6" /><rect x="4" y="14" width="6" height="6" rx=".6" /><rect x="14" y="4" width="6" height="6" rx=".6" /></>}
      {name === "link" && <><path d="M14 12c0-2.49-2.317-5-5.143-5H7.143C4.303 7 2 9.238 2 12c0 2.378 1.71 4.369 4 4.874.368.081.75.124 1.143.124" /><path d="M10 12c0 2.49 2.317 5 5.143 5h1.714C19.697 17 22 14.762 22 12c0-2.378-1.71-4.369-4-4.874A5.3 5.3 0 0 0 16.857 7" /></>}
      {name === "users" && <><path d="M1 20v-1a7 7 0 0 1 14 0v1m-2-6a5 5 0 0 1 10 0v.5" /><circle cx="8" cy="8" r="4" /><circle cx="18" cy="6" r="3" /></>}
    </svg>;
  }
  const Icon = icons[name];
  return <Icon className={className} size={24} strokeWidth={1.5} aria-hidden="true" />;
}

export function BrandMark({ className }: { className?: string }) {
  return <svg className={className} width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 27V12a7 7 0 0 1 7-7h11v6H14a1 1 0 0 0-1 1v15H7Z" fill="currentColor" /><path d="M16 14h9v6h-9v-6Z" fill="currentColor" /><path d="M3 25V12A11 11 0 0 1 14 1h15v3H14a8 8 0 0 0-8 8v16a3 3 0 0 1-3-3Z" fill="currentColor" /></svg>;
}
