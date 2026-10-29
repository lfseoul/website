import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../sanity/image";

export type NewsArticle = {
  _id: string;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  mainImage?: { asset?: { _ref: string; _type: "reference" } | null } | null;
};

export type NewsAndEventsLabels = {
  heading: string;
  description: string;
  viewAllNews: string;
  emptyMessage: string;
  categories: {
    academic: string;
    admissions: string;
    campusLife: string;
  };
};

const categoryStyles: Record<string, string> = {
  academic: "text-blue-800",
  admissions: "text-red-700",
  campusLife: "text-emerald-700",
};

const dateLocales: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  kr: "ko-KR",
};

export default function NewsAndEvents({
  id,
  articles,
  locale,
  labels,
  viewAllHref,
}: {
  id?: string;
  articles: Array<NewsArticle | null>;
  locale: string;
  labels: NewsAndEventsLabels;
  viewAllHref?: string;
}) {
  const visibleArticles = articles.filter((article): article is NewsArticle =>
    Boolean(article?.title),
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(dateLocales[locale] ?? locale, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));

  return (
    <section
      id={id}
      className="relative z-20 bg-white px-6 py-20 text-slate-900 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {labels.heading}
            </h2>
            <p className="mt-3 text-base leading-6 text-slate-600">
              {labels.description}
            </p>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"
            >
              {labels.viewAllNews}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </header>

        {visibleArticles.length === 0 ? (
          <p className="text-sm text-slate-600">{labels.emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {visibleArticles.map((article) => {
              const category = article.category ?? "";
              const categoryLabel =
                labels.categories[
                  category as keyof NewsAndEventsLabels["categories"]
                ] ?? category;

              return (
                <article
                  key={article._id}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition-[border-color,box-shadow] hover:border-slate-200 hover:shadow-lg"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
                    {article.mainImage?.asset && (
                      <Image
                        src={urlFor(article.mainImage)
                          .width(720)
                          .height(480)
                          .fit("crop")
                          .url()}
                        alt={article.title ?? ""}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 320px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {categoryLabel && (
                      <span
                        className={`absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase ${categoryStyles[category] ?? "text-slate-700"}`}
                      >
                        {categoryLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-800">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 text-sm leading-5 text-slate-600">
                        {article.excerpt}
                      </p>
                    )}
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt}
                        className="mt-auto pt-5 text-[11px] font-medium uppercase text-slate-400"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
