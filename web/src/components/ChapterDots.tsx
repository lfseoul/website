"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type Chapter = {
  id: string;
  label: string;
};

export default function ChapterDots({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observedSections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) setActiveId(visibleSection.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Page chapters"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex"
    >
      {chapters.map((chapter) => {
        const isActive = chapter.id === activeId;
        const isTooltipVisible = hoveredId === chapter.id;

        return (
          <motion.button
            key={chapter.id}
            type="button"
            aria-label={`Go to ${chapter.label}`}
            aria-current={isActive ? "location" : undefined}
            onClick={() =>
              document
                .getElementById(chapter.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            onMouseEnter={() => setHoveredId(chapter.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(chapter.id)}
            onBlur={() => setHoveredId(null)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex size-9 items-center justify-center rounded-full"
          >
            <span
              className={`size-3 rounded-full shadow-md transition-colors ${
                isActive
                  ? "bg-gray-800 ring-2 ring-white"
                  : "bg-white/80 ring-1 ring-slate-900/20 hover:bg-red-600"
              }`}
            />
            <AnimatePresence>
              {isTooltipVisible && (
                <motion.span
                  key="tooltip"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg"
                >
                  {chapter.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </nav>
  );
}
