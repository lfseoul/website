"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import { PortableText, type PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Navbar from "./Navbar";
import ChapterDots from "./ChapterDots";
import Footer from "./Footer";
import type { FooterSettings } from "./Footer";
import NewsAndEvents, {
  type NewsAndEventsLabels,
  type NewsArticle,
} from "./NewsAndEvents";
import BarrelFeatureSection, {
  type SchoolFeature,
} from "./BarrelFeatureSection";
import { urlFor } from "../sanity/image";

type PortableTextValue = PortableTextProps["value"];
type SanityImage = {
  asset?: { _ref: string; _type: "reference" } | null;
} | null;
type ScrollytellingSection = {
  title?: string | null;
  text?: PortableTextValue;
  image?: SanityImage;
  youtubeId?: string | null;
  videoUrl?: string | null;
};
type ScrollytellingContent = {
  featureLayout?: "barrel" | "helix" | null;
  title?: string | null;
  description?: PortableTextValue;
  heroImage?: SanityImage;
  sections?: ScrollytellingSection[] | null;
  newsArticles?: Array<NewsArticle | null> | null;
};

const sectionChapterIds = [
  "enseignement",
  "nos-specificites",
  "vie-au-lycee",
  "rejoignez-nous",
];

// Helper to extract the 11-character YouTube ID from a full URL or raw ID
function extractYouTubeId(urlOrId: string) {
  if (!urlOrId) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return match && match[2].length === 11 ? match[2] : urlOrId;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Create a reusable component to isolate the scroll tracking for each section
function ParallaxSection({
  image,
  videoUrl,
  youtubeId,
  id,
  children,
  className,
}: {
  image?: SanityImage;
  videoUrl?: string;
  youtubeId?: string | null;
  id?: string;
  children: React.ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const y = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);

  // Extract the clean ID before rendering
  const cleanVideoId = youtubeId ? extractYouTubeId(youtubeId) : null;

  return (
    <section
      id={id}
      ref={ref}
      className={`relative h-screen flex flex-col justify-center overflow-hidden ${className}`}
    >
      {/* LAYER 1: Background Video OR YouTube OR Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[140%] -top-[20%] pointer-events-none"
      >
        {videoUrl ? (
          // Native HTML5 Video (0 console errors, instant load, perfect looping)
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : cleanVideoId ? (
          // YouTube Fallback
          <iframe
            src={`https://www.youtubeeducation.com/embed/${cleanVideoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playsinline=1&playlist=${cleanVideoId}`}
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
            title="LFS Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : image ? (
          <Image
            src={urlFor(image).url()}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        ) : null}
      </motion.div>

      {/* LAYER 2 & 3: Overlay and Text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />
      <div className="relative z-10 w-full drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
        {children}
      </div>
    </section>
  );
}

export default function ScrollytellingView({
  content,
  features,
  featureLayout,
  settings,
  locale,
  featureHeading,
  newsLabels,
}: {
  content: ScrollytellingContent;
  features: Array<SchoolFeature | null>;
  featureLayout: "barrel" | "helix";
  settings: FooterSettings;
  locale: string;
  featureHeading: string;
  newsLabels: NewsAndEventsLabels;
}) {
  const newsArticles = content.newsArticles ?? [];
  const chapters = [
    ...(content.title ? [{ id: "le-lfs", label: content.title }] : []),
    ...(content.sections ?? [])
      .slice(0, sectionChapterIds.length)
      .flatMap((section, index) =>
        section.title
          ? [{ id: sectionChapterIds[index], label: section.title }]
          : [],
      ),
    ...(features.length > 0
      ? [{ id: "school-features", label: featureHeading }]
      : []),
    { id: "latest-news-and-events", label: newsLabels.heading },
  ];

  return (
    <main className="bg-black text-white selection:bg-white selection:text-black overflow-x-clip">
      <Navbar currentLocale={locale} />
      <ChapterDots chapters={chapters} />

      {/* HERO SECTION (Static) */}
      <ParallaxSection
        id="le-lfs"
        image={content.heroImage}
        className="items-center p-8 text-center"
      >
        <div className="mx-auto flex w-full flex-col items-center text-center">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="mx-auto mb-6 w-full text-center text-5xl font-bold tracking-tight drop-shadow-lg md:text-7xl"
          >
            {content.title}
          </motion.h1>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="mx-auto max-w-3xl space-y-4 text-xl text-gray-200 drop-shadow-md md:text-3xl"
          >
            <PortableText value={content.description} />
          </motion.div>
        </div>
      </ParallaxSection>

      {/* DYNAMIC SECTIONS */}
      {content.sections?.map((section, index) => {
        // Alternate left/right alignment based on whether the index is even or odd
        const isEven = index % 2 === 0;
        const alignmentClass = isEven
          ? "items-start text-left"
          : "items-end text-right";
        const marginClass = isEven ? "" : "ml-auto";
        const accentClass = isEven ? "bg-red-600" : "bg-blue-500";

        return (
          <ParallaxSection
            key={index}
            id={sectionChapterIds[index]}
            image={section.image}
            youtubeId={section.youtubeId}
            className={`p-8 md:p-24 ${alignmentClass}`}
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.5 }}
              className={`max-w-2xl ${marginClass}`}
            >
              <div
                aria-hidden="true"
                className={`mb-5 h-1 w-9 ${accentClass} ${isEven ? "" : "ml-auto"}`}
              />
              <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">
                {section.title}
              </h2>
              <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
                <PortableText value={section.text} />
              </div>
            </motion.div>
          </ParallaxSection>
        );
      })}

      <BarrelFeatureSection
        features={features}
        heading={featureHeading}
        layout={featureLayout}
      />

      <NewsAndEvents
        id="latest-news-and-events"
        articles={newsArticles}
        locale={locale}
        labels={newsLabels}
        viewAllHref={`/${locale}/news`}
      />
      <Footer settings={settings} />
    </main>
  );
}
