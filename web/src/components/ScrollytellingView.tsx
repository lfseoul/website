"use client";

import { motion, Variants } from "framer-motion";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { urlFor } from "../sanity/image";

export default function ScrollytellingView({ content, locale }: { content: any, locale: string }) {
  // Reusable animation configuration
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="bg-black text-white selection:bg-white selection:text-black">
      <LanguageSwitcher currentLocale={locale} />

      {/* SECTION 1 */}
      <section className="h-screen flex flex-col items-center justify-center p-8 text-center sticky top-0 overflow-hidden">
        {content.heroImage && (
          <motion.div 
            initial={{ scale: 1.1 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 1.5 }}
            className="absolute inset-0 -z-10"
          >
            <Image src={urlFor(content.heroImage).url()} alt="Hero" fill className="object-cover opacity-80" priority />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-black/60 pointer-events-none -z-10" />
        
        <motion.h1 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 z-10 drop-shadow-lg"
        >
          {content.title}
        </motion.h1>
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }}
          className="text-xl md:text-3xl text-gray-200 z-10 max-w-3xl drop-shadow-md space-y-4"
        >
          <PortableText value={content.description} />
        </motion.div>
      </section>

      {/* SECTION 2 */}
      <section className="h-screen flex flex-col items-start justify-center p-8 md:p-24 sticky top-0 overflow-hidden bg-black">
        {content.scroll1Image && (
          <div className="absolute inset-0 -z-10">
            <Image src={urlFor(content.scroll1Image).url()} alt="Scroll 1" fill className="object-cover opacity-70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none -z-10" />
        
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }}
          className="max-w-2xl z-10"
        >
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">{content.scroll1_title}</h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll1_text} />
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 */}
      <section className="h-screen flex flex-col items-end justify-center p-8 md:p-24 sticky top-0 overflow-hidden bg-zinc-950 text-right">
        {content.scroll2Image && (
          <div className="absolute inset-0 -z-10">
            <Image src={urlFor(content.scroll2Image).url()} alt="Scroll 2" fill className="object-cover opacity-70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none -z-10" />
        
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }}
          className="max-w-2xl z-10"
        >
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-lg">{content.scroll2_title}</h2>
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-md space-y-4">
            <PortableText value={content.scroll2_text} />
          </div>
        </motion.div>
      </section>
      
      <div className="h-screen bg-transparent pointer-events-none" />
    </main>
  );
}