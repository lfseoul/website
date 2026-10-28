import { getTranslations } from "next-intl/server";
import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import NewsAndEvents from "../../../components/NewsAndEvents";
import { client } from "../../../sanity/client";

const NEWS_QUERY =
  defineQuery(`*[_type == "newsArticle" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  "title": select($locale == "en" => title.en, $locale == "fr" => title.fr, title.kr),
  "excerpt": select($locale == "en" => excerpt.en, $locale == "fr" => excerpt.fr, excerpt.kr),
  category,
  publishedAt,
  mainImage
}`);

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NewsAndEvents" });
  const { isEnabled } = await draftMode();
  const articles = await client.fetch(
    NEWS_QUERY,
    { locale },
    {
      token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
      perspective: isEnabled ? "drafts" : "published",
      useCdn: !isEnabled,
      stega: isEnabled,
      next: { revalidate: isEnabled ? 0 : 60 },
    },
  );

  return (
    <NewsAndEvents
      articles={articles ?? []}
      locale={locale}
      labels={{
        heading: t("archiveHeading"),
        description: t("archiveDescription"),
        viewAllNews: t("viewAllNews"),
        emptyMessage: t("emptyMessage"),
        categories: {
          academic: t("categories.academic"),
          admissions: t("categories.admissions"),
          campusLife: t("categories.campusLife"),
        },
      }}
    />
  );
}
