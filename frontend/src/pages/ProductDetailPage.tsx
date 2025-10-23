import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  fetchProductBySlug,
  submitOrderRequest,
  type Product,
} from "@/lib/api";
import { formatEUR } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    quantity: 1,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useQuery<Product | null, Error>({
    queryKey: ["product", slug],
    queryFn: ({ signal }) => fetchProductBySlug(slug!, signal),
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!product) {
      if (!isLoading && !isFetching && slug && !error) {
        toast({ position: "center",
          title: "Производот не е достапен",
          description: "Производот што го барате не постои или е неактивен.",
          variant: "destructive",
        });
      }
      return;
    }

    setSelectedImage((current) => {
      const availableImages = [
        product.primary_image_url,
        product.image,
        product.image_url,
      ].filter(Boolean) as string[];
      if (current && availableImages.includes(current)) {
        return current;
      }
      return availableImages[0] ?? null;
    });
  }, [product, isLoading, isFetching, slug, error, toast]);

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error("Error loading product:", error);
    toast({ position: "center",
      title: "Грешка",
      description:
        error.message || "Не можеме да ги вчитаме деталите за овој производ.",
      variant: "destructive",
    });
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (formData.quantity < 1) {
      setFormData((prev) => ({ ...prev, quantity: 1 }));
    }

    setSubmitting(true);
    try {
      await submitOrderRequest({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        customerAddress: formData.customerAddress || undefined,
        notes: formData.notes || undefined,
        items: [
          {
            productId: product.id,
            quantity: Math.max(1, formData.quantity),
          },
        ],
      });

      toast({ position: "center",
        title: "Ќе ве контактире Аѓент за 15 минути",
        description: "Ќе ве контактираме наскоро за потврда на нарачката.",
      });

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: "",
        quantity: 1,
        notes: "",
      });
    } catch (error: any) {
      toast({ position: "center",
        title: "Грешка",
        description:
          error?.message ||
          "Се случи грешка при испраќање на нарачката. Обидете се повторно.",
        variant: "destructive",
      });
      console.error("Error creating request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, Math.max(1, formData.quantity));
    toast({ position: "center",
      title: "Додадено во кошничка",
      description: `${product.title} е додаден во вашата кошничка.`,
    });
    openCart();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  if (error && !isLoading && !isFetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Се појави грешка
            </h1>
            <p className="text-muted-foreground">
              {error.message ||
                "Не можеме да ги вчитаме деталите за овој производ во моментов."}
            </p>
            <Button asChild>
              <Link to="/products">Назад кон производи</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!product && !isFetching && !error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Производот не е најден
            </h1>
            <Button asChild>
              <Link to="/products">Назад кон производи</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const images = product
    ? ([product.primary_image_url, product.image, product.image_url].filter(
        Boolean
      ) as string[])
    : [];
  const primaryImage = selectedImage || images[0] || null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад кон производи
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-transparent p-2 sm:p-4 md:p-6">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌿</div>
                  <p className="text-muted-foreground">{product.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Product info & form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatEUR(Number(product.price) || 0)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatEUR(Number((product as any).original_price) || 4800)}
                </span>
                {/* <Badge variant="secondary">Природно</Badge> */}
              </div>
              {product.description && (
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  className="bg-primary hover:bg-primary-light"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Додади во кошничка
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Брза достава и плаќање при прием.</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Нарачај сега - Плати при достава</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-name">Име и презиме *</Label>
                    <Input
                      id="order-name"
                      placeholder="Пример: Ана Анастасова"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order-phone">Телефон *</Label>
                    <Input
                      id="order-phone"
                      placeholder="07X XXX XXX"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full flex-1 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Се испраќа..." : "Нарачај сега"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
