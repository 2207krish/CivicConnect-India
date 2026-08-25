import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/ads/AdSlot";
import ArticleCard from "@/components/learn/ArticleCard";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import {
  formatArticleDate,
  getLearnArticle,
  learnArticles,
  relatedLearnArticles,
} from "@/data/learn-articles";
import { siteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return { title: `Guide not found · ${siteConfig.name}` };
  return {
    title: `${article.title} · ${siteConfig.name}`,
    description: article.excerpt,
    alternates: { canonical: `/learn/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) notFound();

  const related = relatedLearnArticles(article.slug);
  const url = `${siteUrl()}/learn/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.image,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url,
  };

  return (
    <article className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
          <Link href="/learn" className="hover:underline">
            Civic awareness
          </Link>
          {" · "}
          {article.category}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-[var(--navy)] md:text-[2.6rem]">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>
        <p className="mt-3 text-sm text-slate-500">
          {formatArticleDate(article.publishedAt)} · {article.readingMinutes} min read
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[28px] border border-[#e5dccb]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>

        <AdSlot slotKey="learnArticle" />

        <div className="mt-2 space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-[var(--navy)]">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[16px] leading-8 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-[28px] border border-[#e5dccb] bg-[#fffaf2] p-6 text-sm leading-7 text-slate-600">
          <p className="font-semibold text-[var(--navy)]">A note on this guide</p>
          <p className="mt-2">
            This article is general civic information for Indian residents. It is not
            legal advice, not a government publication, and not a substitute for the
            rules of your municipal corporation, utility or forum. Procedures differ
            by State. Pair what you read here with a dated complaint on{" "}
            <Link href="/complaints/new" className="font-semibold text-[var(--saffron)] hover:underline">
              CivicConnect
            </Link>{" "}
            and, where needed, advice from a qualified professional.
          </p>
        </aside>
      </Container>

      {related.length > 0 ? (
        <Container className="mt-16">
          <h2 className="font-display text-2xl text-[var(--navy)]">Related guides</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
