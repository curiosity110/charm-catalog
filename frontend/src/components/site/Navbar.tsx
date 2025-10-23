import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CartSheet } from "./CartSheet";
import { Input } from "@/components/ui/input";
import VitaCall_Logo from "@/assets/vita-call-logo.png";

const navigation = [
  { name: "Почетна", href: "/" },
  { name: "Производи", href: "/products" },
  { name: "За нас", href: "/about" },
  { name: "ЧПП", href: "/faq" },
  { name: "Контакт", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    setSearchTerm(trimmed);
    const basePath = "/products";
    const target = trimmed
      ? `${basePath}?search=${encodeURIComponent(trimmed)}`
      : basePath;

    if (location.pathname + location.search !== target) {
      navigate(target);
    } else if (location.pathname !== basePath) {
      navigate(target);
    } else {
      navigate(target, { replace: true });
    }

    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary font-[var(--font-script)]">
                <Link to="/" className="relative flex items-center justify-center group">
                  <img
                    src={VitaCall_Logo}
                    alt="VitaCall Logo"
                    className="h-14 sm:h-14 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110 transform-gpu will-change-transform"
                  />
                </Link>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (only from >=1000px width) */}
          <nav className="hidden show-desktop-1000 items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary",
                  "text-muted-foreground hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Пребарај производи"
                className="pl-9 pr-8 w-56"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-primary hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <CartSheet />

            {/* Mobile menu (visible below 1000px) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="hide-desktop-1000">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <form onSubmit={handleSearch} className="mt-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      type="search"
                      placeholder="Пребарај производи"
                      className="pl-9 pr-9"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-primary hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium uppercase tracking-wide py-2 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
