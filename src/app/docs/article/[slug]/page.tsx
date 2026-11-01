import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentationPage } from "@/components/sites/opus-help/documentation-page";
import { articles, getArticle } from "@/components/sites/opus-help/content";

export function generateStaticParams() {
  return [...articles.map(({ slug }) => ({ slug })), { slug: "introduction-to-opusclip" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return { title: article?.title ?? "Page not found" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <DocumentationPage slug={article.slug} />;
}
