import Link from "next/link";

import ArticleCard from "@/components/learn/ArticleCard";
import Container from "@/components/layout/Container";
import { type Article, getLearnArticle } from "@/data/learn-articles";

const featuredSlugs = [
  "how-municipal-budgets-work-in-india",
  "how-to-escalate-a-stalled-civic-complaint",
  "74th-amendment-and-your-city-government",
];

export default function CivicGuide() {
  const featured = featuredSlugs
    .map((slug) => getLearnArticle(slug))
    .filter((article): article is Article => article !== null);

  return (
    <section className="py-24">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
          Civic awareness
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-[var(--navy)] md:text-4xl">
              Guides on civic rights, city budgets and how to escalate
            </h2>
            <p className="mt-3 text-slate-600">
              Long-form explainers for residents — not ten-line complaint dumps.
              Read how municipal money is spent, which office owns your street,
              and how to climb from a local desk to a State portal.
            </p>
          </div>
          <Link
            href="/learn"
            className="shrink-0 text-sm font-semibold text-[var(--saffron)] hover:underline"
          >
            All civic guides →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
