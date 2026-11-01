import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getArticle, navigation, articleHref } from "./content";
import { DocumentationShell } from "./documentation-shell";
import { ArticleFeedback, ArticleSection } from "./article-components";
import { WorkspaceTour } from "./workspace-tour";
import { BrandMark } from "./icons";
import { highlightArticleCode } from "./code-highlighting.server";

export async function DocumentationPage({ slug }: { slug: string }) {
  const sourceArticle = getArticle(slug)!;
  const article = await highlightArticleCode(sourceArticle);
  const ordered = navigation.flatMap(group => group.slugs);
  const index = ordered.indexOf(article.slug);
  const previous = getArticle(ordered[index - 1]);
  const next = getArticle(ordered[index + 1]);

  return <DocumentationShell article={sourceArticle}>
    <header className="article-header"><p className="article-eyebrow">{article.group}</p><h1>{article.title}</h1><p className="article-description">{article.description}</p></header>
    {article.tour && <WorkspaceTour />}
    <div className="article-body">{article.sections.map(section => <ArticleSection section={section} key={section.id} />)}</div>
    <ArticleFeedback slug={article.slug} key={article.slug} />
    <nav className="article-pagination" aria-label="Article pagination">{previous ? <Link href={articleHref(previous.slug)}><ChevronLeft size={15} /><span>{previous.title}</span></Link> : <span />}{next && <Link href={articleHref(next.slug)}><span>{next.title}</span><ChevronRight size={15} /></Link>}</nav>
    <footer className="article-footer"><Link href="/docs" aria-label="Forma documentation home"><BrandMark /> <span>Forma <span className="footer-divider">/</span> Documentation</span></Link><span>Made for a little more clarity.</span></footer>
  </DocumentationShell>;
}
