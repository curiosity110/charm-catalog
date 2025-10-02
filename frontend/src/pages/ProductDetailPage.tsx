import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Shield, Truck, Phone } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase, type Product, type ProductImage } from "@/lib/supabase";
import { formatEUR } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    quantity: 1,
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products' as any)
        .select(`
          *,
          product_images (
            id,
            url,
            is_primary,
            sort_order
          )
        `)
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) throw error;

      // Sort images
      if (data?.product_images) {
        data.product_images.sort((a: any, b: any) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return a.sort_order - b.sort_order;
        });
        
        setSelectedImage(data.product_images[0]?.url || null);
      }

      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    try {
      // Create customer
      const { data: customer, error: customerError } = await (supabase as any)
        .from('customers')
        .insert({
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || null,
          address: formData.customerAddress || null
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create order
      const totalCents = product.price_cents * formData.quantity;
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          customer_id: customer?.id,
          status: 'new',
          payment_method: 'cod',
          total_cents: totalCents,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await (supabase as any)
        .from('order_items')
        .insert({
          order_id: order?.id,
          product_id: product.id,
          quantity: formData.quantity,
          price_cents_at_purchase: product.price_cents
        });

      if (itemError) throw itemError;

      toast({
        title: "Нарачката е успешно испратена!",
        description: "Ќе ве контактираме наскоро за потврда на нарачката."
      });

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: "",
        quantity: 1,
        notes: ""
      });

    } catch (error: any) {
      toast({
        title: "Грешка",
        description: "Се случи грешка при испраќање на нарачката. Обидете се повторно.",
        variant: "destructive"
      });
      console.error('Error creating request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Производот не е најден</h1>
            <Button asChild>
              <Link to="/products">Назад кон производи</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const images = product.product_images || [];
  const primaryImage = selectedImage || images[0]?.url;

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
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary-light/10">
            {primaryImage ? (
              <img src={primaryImage} alt={product.title} className="w-full h-full object-cover" />
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
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">{formatEUR(product.price_cents)}</span>
                <Badge variant="secondary">Природно</Badge>
              </div>
              {product.description && (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Нарачај сега - Плати при достава</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Име и презиме *"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Телефон *"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Е-пошта"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                  <Button type="submit" className="w-full" disabled={submitting}>
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