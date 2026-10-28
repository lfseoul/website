import Link from "next/link";

const defaultQuickLinks = [
  { label: "Admissions", href: "https://lfseoul.org/admission/" },
  { label: "Academics", href: "https://lfseoul.org/notre-enseignement/" },
  { label: "Campus Life", href: "https://lfseoul.org/vie-au-lycee/" },
  { label: "About Us", href: "https://lfseoul.org/a-propos-du-lfs/" },
  { label: "Parent Portal", href: "https://lfseoul.org/espace-parents/" },
];

export type FooterSettings = {
  siteTitle?: string | null;
  footerDescription?: string | null;
  quickLinks?: Array<{
    _key?: string | null;
    label?: string | null;
    url?: string | null;
  }> | null;
  contactInfo?: {
    address?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    website?: string | null;
  } | null;
} | null;

export default function Footer({ settings }: { settings: FooterSettings }) {
  const quickLinks = settings
    ? (settings.quickLinks ?? [])
    : defaultQuickLinks.map((item, index) => ({
        _key: `default-${index}`,
        label: item.label,
        url: item.href,
      }));

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div>
          <h2 className="text-lg font-bold">
            {settings?.siteTitle ?? "Lycée Français de Séoul"}
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-300">
            {settings?.footerDescription ??
              "French and international education in Seoul, from preschool through high school."}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-300">
            {quickLinks.map((item, index) =>
              item.label && item.url ? (
                <li key={item._key ?? `${item.label}-${index}`}>
                  <a
                    href={item.url}
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noreferrer" : undefined}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase">Contact Us</h2>
          <address className="mt-4 space-y-3 text-sm not-italic leading-6 text-gray-300">
            {(settings?.contactInfo?.address ??
              "7, Seorae-ro, Seocho-gu, Seoul 06581, Republic of Korea") && (
              <p>
                {settings?.contactInfo?.address ??
                  "7, Seorae-ro, Seocho-gu, Seoul 06581, Republic of Korea"}
              </p>
            )}
            {settings?.contactInfo?.phoneNumber && (
              <p>
                <a href={`tel:${settings.contactInfo.phoneNumber}`}>
                  {settings.contactInfo.phoneNumber}
                </a>
              </p>
            )}
            {settings?.contactInfo?.email && (
              <p>
                <a href={`mailto:${settings.contactInfo.email}`}>
                  {settings.contactInfo.email}
                </a>
              </p>
            )}
            <p>
              <a
                href={settings?.contactInfo?.website ?? "https://lfseoul.org/"}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                {settings?.contactInfo?.website ?? "lfseoul.org"}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase">Admissions</h2>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            Find out how to join the LFS community.
          </p>
          <Link
            href="https://lfseoul.org/admission/"
            className="mt-5 inline-flex rounded-md bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-800"
          >
            Explore Admissions
          </Link>
        </div>
      </div>
    </footer>
  );
}
