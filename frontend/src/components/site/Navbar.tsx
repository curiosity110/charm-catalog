import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CartSheet } from "./CartSheet";
import { Input } from "@/components/ui/input";

import VitaCallLogo from "@/assets/Vita_Call_Logo.png";

const navigation = [
  { name: "ПОЧЕТНА", href: "/" },
  { name: "ПРОИЗВОДИ", href: "/products" },
  { name: "ЗА НАС", href: "/about" },
  { name: "ПРАШАЊА И ОДГОВОРИ", href: "/faq" },
  { name: "КОНТАКТ", href: "/contact" },
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
                <img className="w-12 img-contain" src={VitaCallLogo} alt="" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center relative"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Пребарувај производи"
                className="pl-9 w-56"
              />
            </form>

            <CartSheet />

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
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
                      placeholder="Пребарувај производи"
                      className="pl-9"
                    />
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
