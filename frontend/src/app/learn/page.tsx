import type { Metadata } from "next";

import AdSlot from "@/components/ads/AdSlot";
import ArticleCard from "@/components/learn/ArticleCard";
import Container from "@/components/layout/Container";
import { learnArticles } from "@/data/learn-articles";
import { siteUrl } from "@/lib/site-url";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Civic awareness guide · ${siteConfig.name}`,
  description:
    "Long-form articles on civic rights in India, how municipal budgets work, and how citizens can escalate stalled complaints to local authorities.",
  alternates: { canonical: "/learn" },
};

export default function LearnIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Civic awareness guide",
    description:
      "Guides on civic rights, municipal finance and escalating complaints in Indian cities.",
    url: `${siteUrl()}/learn`,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteUrl() },
    hasPart: learnArticles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: `${siteUrl()}/learn/${article.slug}`,
      datePublished: article.publishedAt,
    })),
  };

  return (
    <section className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
          Civic awareness
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl text-[var(--navy)] md:text-5xl">
          A practical guide to civic rights, city budgets and escalation
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          These articles are written for residents who want more than a ten-line
          complaint form. They explain how urban local bodies spend money, which
          office owns a street, and how to move a stalled file without starting
          from zero. CivicConnect India is not a government website; it is a
          citizen routing service with public explainers.
        </p>

        <AdSlot slotKey="learnIndex" />

        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learnArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
