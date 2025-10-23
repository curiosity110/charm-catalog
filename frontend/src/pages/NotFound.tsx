import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Грешка 404</p>
            <h1 className="mt-2 text-4xl font-bold">Страницата не беше пронајдена</h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Страницата <span className="font-medium">{location.pathname}</span> не постои или е преместена.
            Проверете ја URL адресата или вратете се на почетната страница.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary-light"
            >
              Назад на почетна
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Прегледај производи
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
