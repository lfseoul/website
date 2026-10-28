import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "../../sanity/client";
import ScrollytellingView from "../../components/ScrollytellingView";

const PAGE_QUERY = defineQuery(`{
  "home": *[_type == "homePage" && !(_id in path("drafts.**"))][0] {
  "title": select($locale == "en" => heroTitle.en, $locale == "fr" => heroTitle.fr, heroTitle.kr),
  "description": select($locale == "en" => heroDescription.en, $locale == "fr" => heroDescription.fr, heroDescription.kr),
  heroImage,
  "sections": sections[] {
    "title": select($locale == "en" => title.en, $locale == "fr" => title.fr, title.kr),
    "text": select($locale == "en" => text.en, $locale == "fr" => text.fr, text.kr),
    image,
    youtubeId,
    "videoUrl": backgroundVideo.asset->url // <-- Added this line!
  },
  "newsArticles": newsArticles[0...3]-> {
    _id,
    "title": select($locale == "en" => title.en, $locale == "fr" => title.fr, title.kr),
    "excerpt": select($locale == "en" => excerpt.en, $locale == "fr" => excerpt.fr, excerpt.kr),
    category,
    publishedAt,
    mainImage
  }
  },
  "settings": *[_type == "siteSettings" && !(_id in path("drafts.**"))][0] {
    siteTitle,
    "footerDescription": select(
      $locale == "en" => pt::text(footerDescription.en),
      $locale == "fr" => pt::text(footerDescription.fr),
      pt::text(footerDescription.kr)
    ),
    "quickLinks": quickLinks[]{
      _key,
      "label": select($locale == "en" => label.en, $locale == "fr" => label.fr, label.kr),
      url
    },
    "contactInfo": {
      "address": select(
        $locale == "en" => contactInfo.address.en,
        $locale == "fr" => contactInfo.address.fr,
        contactInfo.address.kr
      ),
      phoneNumber,
      email,
      website
    }
  }
}`);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "NewsAndEvents" });
  const newsLabels = {
    heading: t("heading"),
    description: t("description"),
    viewAllNews: t("viewAllNews"),
    emptyMessage: t("emptyMessage"),
    categories: {
      academic: t("categories.academic"),
      admissions: t("categories.admissions"),
      campusLife: t("categories.campusLife"),
    },
  };

  const { isEnabled } = await draftMode();

  const pageData = await client.fetch(
    PAGE_QUERY,
    { locale },
    {
      token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
      perspective: isEnabled ? "drafts" : "published",
      useCdn: !isEnabled,
      stega: isEnabled,
      next: { revalidate: isEnabled ? 0 : 60 },
    },
  );

  if (!pageData?.home) return <div>No content found.</div>;

  // Pass the fetched data directly to the animated client component
  return (
    <ScrollytellingView
      content={pageData.home}
      settings={pageData.settings}
      locale={locale}
      newsLabels={newsLabels}
    />
  );
}
