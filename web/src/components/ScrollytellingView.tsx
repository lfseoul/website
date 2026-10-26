"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { urlFor } from "../sanity/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// 1. Create a reusable component to isolate the scroll tracking for each section
function ParallaxSection({ image, children, className }: { image: any; children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null);
  
  // Track when this specific section enters and leaves the screen
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], 
  });

  // Wrap the raw scroll progress in a physics-based spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, // Higher = tighter, more responsive. Lower = looser, more delayed.
    damping: 30,    // Higher = less bounciness. Lower = more rubber-band effect.
    restDelta: 0.001
  });

  // Pass the smoothed spring value into useTransform instead of the raw progress
  // Map the scroll progress (0 to 1) to vertical movement (-20% to 20%)
  const y = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className={`relative h-screen flex flex-col justify-center overflow-hidden ${className}`}>
      {image && (
        // 2. We make the image 140% tall and shift it up by 20%. 
        // This gives it extra hidden room at the top and bottom so it doesn't show empty edges when moving!
        <motion.div 
          style={{ y }}  // This now receives the beautifully smoothed spring values!
          className="absolute inset-0 -z-10 h-[140%] -top-[20%] w-full"
        >
          <Image src={urlFor(image).url()} alt="Background" fill className="object-cover opacity-60" priority />
        </motion.div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none -z-10" />
      
      {/* The text content stays static while the image behind it moves */}
      <div className="z-10 w-full">
        {children}
      </div>
    </section>
  );
}

// 3. Keep your main component clean by composing the sections
export default function ScrollytellingView({ content, locale }: { content: any, locale: string }) {
  return (
    <main className="bg-black text-white selection:bg-white selection:text-black overflow-hidden">
      <LanguageSwitcher currentLocale={locale} />

      {/* SECTION 1: HERO */}
      <ParallaxSection image={content.heroImage} className="items-center p-8 text-center">
        <motion.h1 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg"
        >
          {content.title}
        </motion.h1>
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }}
          className="mx-auto text-xl md:text-3xl text-gray-200 max-w-3xl drop-shadow-md space-y-4"
        >
          <PortableText value={content.description} />
        </motion.div>
      </ParallaxSection>

      {/* SECTION 2 */}
      <ParallaxSection image={content.scroll1Image} className="items-start p-8 md:p-24">
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">{content.scroll1_title}</h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll1_text} />
          </div>
        </motion.div>
      </ParallaxSection>

      {/* SECTION 3 */}
      <ParallaxSection image={content.scroll2Image} className="items-end p-8 md:p-24 text-right">
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }}
          className="max-w-2xl ml-auto"
        >
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">{content.scroll2_title}</h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll2_text} />
          </div>
        </motion.div>
      </ParallaxSection>
    </main>
  );
}