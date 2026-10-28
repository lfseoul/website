"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "../i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/LFS_logo_couleur_transparent-64x100.png";

const navigationLinks = [
  { label: "Admissions", href: "#admissions" },
  { label: "Academics", href: "#academics" },
  { label: "Campus Life", href: "#campus-life" },
  { label: "About Us", href: "#about-us" },
  { label: "Parent Portal", href: "#parent-portal" },
];

export default function Navbar({ currentLocale }: { currentLocale: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY >= 50);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const textColor = isScrolled ? "text-slate-900" : "text-white";
  const linkColor = isScrolled
    ? "text-slate-700 hover:text-blue-800"
    : "text-white/90 hover:text-white";
  const applyButtonColor = isScrolled
    ? "bg-red-700 text-white hover:bg-red-800"
    : "bg-white text-slate-900 hover:bg-slate-100";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          : "bg-transparent"
      } ${textColor}`}
    >
      <div className="relative mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-4 px-5 sm:px-8 xl:h-24">
        <Link
          href="/"
          locale={currentLocale}
          aria-label="LFS home"
          className="shrink-0"
        >
          <Image
            src={logo}
            alt="Lycée Français de Séoul"
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 xl:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-5">
            {navigationLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap text-[13px] font-semibold transition-colors ${linkColor}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#apply-now"
            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${applyButtonColor}`}
          >
            Apply Now
          </a>
        </div>

        <div className="hidden shrink-0 xl:flex">
          <LanguageSwitcher
            currentLocale={currentLocale}
            variant="navbar"
            isScrolled={isScrolled}
          />
        </div>

        <div className="ml-auto flex items-center gap-3 xl:hidden">
          <LanguageSwitcher
            currentLocale={currentLocale}
            variant="navbar"
            isScrolled={isScrolled}
          />
          <button
            type="button"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex size-10 flex-col items-center justify-center gap-1.5 rounded-sm transition-colors ${
              isScrolled ? "hover:bg-slate-100" : "hover:bg-white/15"
            }`}
          >
            <span
              className={`h-0.5 w-5 transition-transform ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              } ${isScrolled ? "bg-slate-900" : "bg-white"}`}
            />
            <span
              className={`h-0.5 w-5 transition-opacity ${
                isMenuOpen ? "opacity-0" : ""
              } ${isScrolled ? "bg-slate-900" : "bg-white"}`}
            />
            <span
              className={`h-0.5 w-5 transition-transform ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              } ${isScrolled ? "bg-slate-900" : "bg-white"}`}
            />
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute left-0 top-full w-full border-t border-slate-200 bg-white px-5 pb-5 pt-3 text-slate-900 shadow-lg xl:hidden`}
      >
        <div className="mx-auto flex max-w-7xl flex-col">
          {navigationLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-slate-100 py-3 text-sm font-semibold text-slate-700 hover:text-blue-800"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#apply-now"
            onClick={closeMenu}
            className="mt-4 w-fit rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-800"
          >
            Apply Now
          </a>
        </div>
      </nav>
    </header>
  );
}
