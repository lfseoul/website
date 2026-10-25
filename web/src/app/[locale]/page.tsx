import { PortableText } from "@portabletext/react";
import { setRequestLocale } from "next-intl/server";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { draftMode } from "next/headers"; // 1. Added this import
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/image";

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 2. Check if draft mode is active
  const { isEnabled } = await draftMode();

  // 3. Fetch data conditionally based on draft mode status
  const content = await client.fetch(
    HOME_PAGE_QUERY, 
    { locale }, 
    { 
      token: isEnabled ? process.env.SANITY_API_READ_TOKEN : undefined,
      perspective: isEnabled ? "drafts" : "published",
      useCdn: !isEnabled,
      stega: isEnabled,
      next: { revalidate: isEnabled ? 0 : 60 } // Never cache drafts!
    }
  );

  if (!content) return <div>No content found.</div>;

  return (
    <main className="bg-black text-white selection:bg-white selection:text-black">
      <LanguageSwitcher currentLocale={locale} />

      {/* SECTION 1 */}
      <section className="h-screen flex flex-col items-center justify-center p-8 text-center sticky top-0 overflow-hidden">
        {content.heroImage && (
          <div className="absolute inset-0 -z-10">
            <Image 
              src={urlFor(content.heroImage).url()} 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-80" 
              priority 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-black/60 pointer-events-none -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 z-10 drop-shadow-lg">
          {content.title}
        </h1>
        <div className="text-xl md:text-3xl text-gray-200 z-10 max-w-3xl drop-shadow-md space-y-4">
          <PortableText value={content.description} />
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="h-screen flex flex-col items-start justify-center p-8 md:p-24 sticky top-0 overflow-hidden bg-black">
        {content.scroll1Image && (
          <div className="absolute inset-0 -z-10">
            <Image 
              src={urlFor(content.scroll1Image).url()} 
              alt="Scroll 1" 
              fill 
              className="object-cover opacity-70" 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none -z-10" />
        <div className="max-w-2xl z-10">
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">
            {content.scroll1_title}
          </h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll1_text} />
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="h-screen flex flex-col items-end justify-center p-8 md:p-24 sticky top-0 overflow-hidden bg-zinc-950 text-right">
        {content.scroll2Image && (
          <div className="absolute inset-0 -z-10">
            <Image 
              src={urlFor(content.scroll2Image).url()} 
              alt="Scroll 2" 
              fill 
              className="object-cover opacity-70" 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none -z-10" />
        <div className="max-w-2xl z-10">
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">
            {content.scroll2_title}
          </h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll2_text} />
          </div>
        </div>
      </section>
      
      <div className="h-screen bg-transparent pointer-events-none" />
    </main>
  );
}