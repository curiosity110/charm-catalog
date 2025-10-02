import { Link } from "react-router-dom";

const footerLinks = {
  useful: [
    { name: "Почетна", href: "/" },
    { name: "Производи", href: "/products" },
    { name: "За нас", href: "/about" },
    { name: "Контакт", href: "/contact" },
  ],
  additional: [
    { name: "Прашања и одговори", href: "/faq" },
    { name: "Услови за користење", href: "/terms" },
    { name: "Политика на приватност", href: "/privacy" },
    { name: "Враќање на производи", href: "/returns" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-primary mb-4 font-[var(--font-script)]">
              Vita Call
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Природни решенија за вашето здравје и убавина. Сертифицирани
              производи од најквалитетни состојки.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Корисни линкови
            </h3>
            <ul className="space-y-3">
              {footerLinks.useful.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Додатни информации
            </h3>
            <ul className="space-y-3">
              {footerLinks.additional.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vita Call. Сите права задржани.
          </p>
        </div>
      </div>
    </footer>
  );
}
