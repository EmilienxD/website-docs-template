import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>A little off the beaten path.</h1><p>This article may have moved. Find your way back to the documentation.</p><Link className="primary-button" href="/docs">Back to Help Center <span aria-hidden="true">→</span></Link></main>;
}
