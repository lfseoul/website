import { Link } from "../i18n/navigation";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "kr", label: "한국어" },
  ];

  return (
    // 1. Dark frosted glass container with a subtle border and shadow
    <div className="fixed top-6 right-6 z-50 flex gap-1 p-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        
        return (
            <Link
            key={lang.code}
            href="/"
            locale={lang.code}
            // 2. High contrast text classes depending on active state
            className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                isActive
                ? "bg-white text-black shadow-md" // Active: Solid white pill, black text
                : "text-white/60 hover:text-white hover:bg-white/20" // Inactive: Light grey text that turns bright white on hover
            }`}
            >
            {lang.label}
            </Link>
        );
        })}
    </div>
    );
}