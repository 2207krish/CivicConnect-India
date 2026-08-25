import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/data/learn-articles";
import { formatArticleDate } from "@/data/learn-articles";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group overflow-hidden rounded-[28px] border border-[#e5dccb] bg-white shadow-[0_16px_40px_rgba(20,32,51,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(20,32,51,0.10)]"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--saffron)]">
          {article.category}
        </p>
        <h2 className="font-display mt-2 text-xl leading-snug text-[var(--navy)] group-hover:text-[var(--saffron)]">
          {article.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
        <p className="mt-4 text-xs text-slate-500">
          {formatArticleDate(article.publishedAt)} · {article.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
