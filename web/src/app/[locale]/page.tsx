import { setRequestLocale } from "next-intl/server";
import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "../../sanity/client";
import ScrollytellingView from "../../components/ScrollytellingView";

const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
  "title": select($locale == "en" => heroTitle.en, $locale == "fr" => heroTitle.fr, heroTitle.kr),
  "description": select($locale == "en" => heroDescription.en, $locale == "fr" => heroDescription.fr, heroDescription.kr),
  "scroll1_title": select($locale == "en" => scroll1Title.en, $locale == "fr" => scroll1Title.fr, scroll1Title.kr),
  "scroll1_text": select($locale == "en" => scroll1Text.en, $locale == "fr" => scroll1Text.fr, scroll1Text.kr),
  "scroll2_title": select($locale == "en" => scroll2Title.en, $locale == "fr" => scroll2Title.fr, scroll2Title.kr),
  "scroll2_text": select($locale == "en" => scroll2Text.en, $locale == "fr" => scroll2Text.fr, scroll2Text.kr),
  heroImage,
  scroll1Image,
  scroll2Image
}`);

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled } = await draftMode();

  const content = await client.fetch(
    HOME_PAGE_QUERY, 
    { locale }, 
    { 
      token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
      perspective: isEnabled ? "drafts" : "published",
      useCdn: !isEnabled,
      stega: isEnabled,
      next: { revalidate: isEnabled ? 0 : 60 } 
    }
  );

  if (!content) return <div>No content found.</div>;

  // Pass the fetched data directly to the animated client component
  return <ScrollytellingView content={content} locale={locale} />;
}