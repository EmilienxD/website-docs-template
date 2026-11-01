import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarStateProvider } from "@/components/sites/opus-help/sidebar-state";
import "./globals.css";
import "@/components/sites/opus-help/documentation.css";

const inter = localFont({
  src: "../../public/sites/opus-help/fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const paperMono = localFont({
  src: "../../public/sites/opus-help/fonts/paper-mono-variable.woff2",
  variable: "--font-paper-mono",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: { default: "Forma — Help Center", template: "%s — Forma" },
  description: "Guides, resources, and answers to help you make the most of your workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${paperMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('forma-theme')||'system';document.documentElement.classList.toggle('dark',t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))}catch{}` }} />
        <SidebarStateProvider>{children}</SidebarStateProvider>
      </body>
    </html>
  );
}
