"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "../i18n/navigation";
import { urlFor } from "../sanity/image";

export type SchoolFeature = {
  _id: string;
  title?: string | null;
  description?: string | null;
  badge?: string | null;
  cardType?: "standard" | "centered" | null;
  image?: { asset?: { _ref: string; _type: "reference" } | null } | null;
  linkUrl?: string | null;
};

function FeatureCardFace({
  feature,
  back = false,
}: {
  feature: SchoolFeature;
  back?: boolean;
}) {
  const isCentered = feature.cardType === "centered";

  return (
    <div
      aria-hidden={back || undefined}
      className={`${back ? "absolute inset-0" : "relative"} flex flex-col overflow-hidden rounded-lg bg-white text-slate-950 shadow-xl [backface-visibility:hidden] ${back ? "[transform:rotateY(180deg)]" : ""}`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-200">
        {feature.image?.asset && (
          <Image
            src={urlFor(feature.image).width(720).url()}
            alt={back ? "" : (feature.title ?? "")}
            fill
            sizes="(max-width: 767px) 40vw, 12vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className={`flex flex-col p-3 ${isCentered ? "text-center" : ""}`}>
        {!isCentered && feature.badge && (
          <span className="mb-1 block max-w-full truncate text-[10px] font-bold uppercase text-red-700">
            {feature.badge}
          </span>
        )}
        <h3
          className={`text-base font-bold leading-5 transition-colors ${isCentered ? "text-red-700" : "group-hover:text-red-700"}`}
        >
          {feature.title}
        </h3>
        {feature.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-slate-700">
            {feature.description}
          </p>
        )}
        {isCentered && feature.badge && (
          <span className="mt-4 ml-auto max-w-full truncate text-right text-[10px] font-bold uppercase text-slate-700">
            {feature.badge}
          </span>
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  className,
  style,
}: {
  feature: SchoolFeature;
  className: string;
  style?: React.CSSProperties;
}) {
  if (!feature.title || !feature.linkUrl) return null;

  return (
    <Link
      href={feature.linkUrl}
      className={`group relative block [transform-style:preserve-3d] ${className}`}
      style={style}
    >
      <FeatureCardFace feature={feature} />
      <FeatureCardFace feature={feature} back />
    </Link>
  );
}

function HelixCard({
  feature,
  index,
  total,
  rotationY,
  pitch,
}: {
  feature: SchoolFeature;
  index: number;
  total: number;
  rotationY: MotionValue<number>;
  pitch: number;
}) {
  const angle = (index / total) * 360;
  const rawY = useTransform(rotationY, (rotation) => {
    const shift = (rotation / 360) * (total * pitch);
    return index * pitch + shift;
  });
  const wrappedY = useTransform(rawY, (y) => {
    const totalHeight = total * pitch;
    const halfHeight = totalHeight / 2;
    return (
      ((((y + halfHeight) % totalHeight) + totalHeight) % totalHeight) -
      halfHeight
    );
  });
  const positionedY = useTransform(wrappedY, (y) => y + 64);
  const transform = useTransform(
    positionedY,
    (y) =>
      `translateY(${y}px) rotateY(${angle}deg) translateZ(clamp(90px, 15vw, 180px))`,
  );
  const opacity = useTransform(positionedY, (y) => {
    const halfHeight = (total * pitch) / 2;
    const distanceToEdge = halfHeight - Math.abs(y);
    return Math.min(1, Math.max(0, distanceToEdge / pitch));
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
      style={{ transform, opacity }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
        <FeatureCard
          feature={feature}
          className="[backface-visibility:hidden]"
          style={{ width: "clamp(9rem, 12vw, 13rem)" }}
        />
      </div>
    </motion.div>
  );
}

export default function BarrelFeatureSection({
  features,
  heading,
  layout = "barrel",
}: {
  features: Array<SchoolFeature | null>;
  heading: string;
  layout?: "barrel" | "helix";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const prefersReducedMotion = useReducedMotion();
  const scrollRotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : -360],
  );
  const dragRotation = useMotionValue(0);
  const rotationY = useTransform(
    () => scrollRotation.get() + dragRotation.get(),
  );
  const barrelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const barrel = barrelRef.current;
    if (!barrel) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      dragRotation.stop();
      dragRotation.set(
        dragRotation.get() + (event.deltaY || event.deltaX) * 0.25,
      );
    };

    barrel.addEventListener("wheel", handleWheel, { passive: false });
    return () => barrel.removeEventListener("wheel", handleWheel);
  }, [dragRotation]);

  const visibleFeatures = features.filter((feature): feature is SchoolFeature =>
    Boolean(feature?.title && feature.linkUrl),
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    dragRotation.stop();
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false,
    };
    suppressClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.lastX;
    const elapsed = Math.max(event.timeStamp - drag.lastTime, 1);
    if (Math.abs(event.clientX - drag.lastX) > 2) drag.moved = true;
    dragRotation.set(dragRotation.get() + deltaX * 1.0);
    drag.velocity = (deltaX * 1.0) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    suppressClickRef.current = drag.moved;
    if (!prefersReducedMotion && Math.abs(drag.velocity) > 0.05) {
      const momentum = drag.velocity * 500;
      const duration = Math.min(1 + Math.abs(drag.velocity) * 1.5, 3.5);
      animate(dragRotation, dragRotation.get() + momentum, {
        type: "tween",
        ease: "easeOut",
        duration,
      });
    }
  };

  const handleCardClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  if (visibleFeatures.length === 0) return null;

  return (
    <section
      id="school-features"
      ref={sectionRef}
      className="relative z-20 bg-[#eef4f3] px-6 py-20 text-slate-950 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-9">
          <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
        </header>

        <div className="hidden h-[min(31rem,55vh)] items-center justify-center [perspective:1600px] md:flex">
          <motion.div
            ref={barrelRef}
            style={{ rotateY: rotationY }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClickCapture={handleCardClickCapture}
            className="relative flex h-full w-full touch-pan-y items-center justify-center [transform-style:preserve-3d] md:cursor-grab md:active:cursor-grabbing"
          >
            {visibleFeatures.map((feature, index) => {
              if (layout === "helix") {
                return (
                  <HelixCard
                    key={feature._id}
                    feature={feature}
                    index={index}
                    total={visibleFeatures.length}
                    rotationY={rotationY}
                    pitch={80}
                  />
                );
              }

              const angle = (index / visibleFeatures.length) * 360;

              return (
                // 1. The Anchor Point: a 0x0 dot perfectly centered in the parent.
                // This completely bypasses the flexbox layout, ensuring every card shares the exact same origin.
                <div
                  key={feature._id}
                  className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{
                    // Rotate the anchor, then push it outward by the halved 30vw radius
                    // with min (200px) and max (350px) bounds
                    transform: `rotateY(${angle}deg) translateZ(clamp(200px, 30vw, 350px))`,
                  }}
                >
                  {/* 2. The Centering Wrapper: Pulls the card back so its dead-center sits on the anchor */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
                    <FeatureCard
                      feature={feature}
                      className="[backface-visibility:hidden]"
                      style={{
                        width: "clamp(12rem, 15vw, 16rem)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex min-h-[14.7rem] snap-x snap-mandatory items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {visibleFeatures.map((feature) => (
            <FeatureCard
              key={feature._id}
              feature={feature}
              className="w-[min(40vw,9.8rem)] shrink-0 snap-center"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
