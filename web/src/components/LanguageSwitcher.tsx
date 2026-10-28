import { Link } from "../i18n/navigation";

export default function LanguageSwitcher({
  currentLocale,
  variant = "floating",
  isScrolled = false,
}: {
  currentLocale: string;
  variant?: "floating" | "navbar";
  isScrolled?: boolean;
}) {
  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "kr", label: "한국어" },
  ];

  const isNavbar = variant === "navbar";

  return (
    <div
      className={
        isNavbar
          ? "flex shrink-0 items-center gap-0.5"
          : "fixed right-6 top-6 z-50 flex gap-1 rounded-full border border-white/10 bg-black/50 p-1.5 shadow-2xl backdrop-blur-md"
      }
    >
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        const navbarClass = isActive
          ? isScrolled
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-900"
          : isScrolled
            ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            : "text-white/75 hover:bg-white/15 hover:text-white";

        return (
          <Link
            key={lang.code}
            href="/"
            locale={lang.code}
            className={`rounded-full font-bold transition-colors ${
              isNavbar
                ? `px-2 py-1.5 text-xs ${navbarClass}`
                : `px-4 py-2 text-sm ${
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "text-white/60 hover:bg-white/20 hover:text-white"
                  }`
            }`}
          >
            {lang.label}
          </Link>
        );
      })}
    </div>
  );
}
