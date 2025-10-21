import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { submitOrderRequest } from "@/lib/api";
import { formatMKD } from "@/lib/utils";

const initialFormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  notes: "",
};

export function CartSheet() {
  const { items, itemCount, totalPrice, removeItem, updateQuantity, clearCart, isOpen, setOpen } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleQuantityChange = (productId: string, delta: number) => {
    const current = items.find((item) => item.product.id === productId);
    if (!current) return;
    const nextQuantity = current.quantity + delta;
    if (nextQuantity <= 0) {
      removeItem(productId);
      return;
    }
    updateQuantity(productId, nextQuantity);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!items.length) return;

    if (!formData.customerName || !formData.customerPhone) {
      toast({
        title: "Недостасуваат податоци",
        description: "Внесете ги вашето име и телефон за да ја потврдите нарачката.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const order = await submitOrderRequest({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        customerAddress: formData.customerAddress || undefined,
        notes: formData.notes || undefined,
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });

      toast({
        title: "Нарачката е испратена",
        description: `Број на барање: ${order.id}. Ќе ве контактираме за потврда.`,
      });

      clearCart();
      setFormData(initialFormState);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error?.message || "Не успеавме да ја испратиме вашата нарачка. Обидете се повторно.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="relative gap-2 px-4">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden font-semibold sm:inline-block">Кошничка</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground shadow">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full flex-col bg-gradient-to-br from-background via-background to-primary/10 p-0 sm:max-w-xl md:max-w-2xl"
      >
        <div className="border-b border-border/40 bg-primary/5 p-6">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold">Ваша кошничка</SheetTitle>
            <SheetDescription className="max-w-lg">
              Плаќањето е при достава. Проверете ги артиклите и потврдете ја нарачката.
            </SheetDescription>
          </SheetHeader>
          {itemCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                {itemCount} артикли
              </Badge>
              <span>
                Вкупно: <span className="font-semibold text-foreground">{formatMKD(totalPrice)}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShoppingCart className="h-10 w-10" />
              <p>Вашата кошничка е празна. Додајте производи за да продолжите.</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-5">
                {items.map((item) => {
                  const primaryImage =
                    item.product.primary_image_url || item.product.image || item.product.image_url || null;
                  const originalPriceRaw =
                    (item.product as { original_price?: number | string }).original_price ??
                    (item.product as { compare_at_price?: number | string }).compare_at_price ??
                    null;
                  const originalPrice = Number(originalPriceRaw) || 0;
                  const itemPrice = Number(item.product.price) || 2400;
                  const hasDiscount = originalPrice > itemPrice;
                  return (
                    <div
                      key={item.product.id}
                      className="flex flex-col gap-4 rounded-xl border border-border/50 bg-background/80 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          {primaryImage ? (
                            <img src={primaryImage} alt={item.product.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">🌿</div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-semibold leading-tight text-foreground">{item.product.title}</p>
                              {item.product.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{item.product.description}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.product.id)}
                              aria-label="Отстрани"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => handleQuantityChange(item.product.id, -1)}
                                aria-label="Намали количина"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-base font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => handleQuantityChange(item.product.id, 1)}
                                aria-label="Зголеми количина"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right text-sm text-foreground">
                              <p className="text-lg font-semibold">{formatMKD(itemPrice * item.quantity)}</p>
                              {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatMKD(originalPrice * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-5 border-t border-border/40 bg-background/95 p-6 shadow-inner">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Вкупно ({itemCount} артикли)</span>
              <span className="text-xl font-semibold text-primary">{formatMKD(totalPrice)}</span>
            </div>

            <Badge variant="outline" className="w-full justify-center border-primary/60 bg-primary/10 text-primary">
              Плати при достава
            </Badge>

            <Separator />

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cart-name">Име и презиме *</Label>
                <Input
                  id="cart-name"
                  placeholder="Пример: Ана Анастасова"
                  value={formData.customerName}
                  onChange={(event) => setFormData((prev) => ({ ...prev, customerName: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-phone">Телефон *</Label>
                <Input
                  id="cart-phone"
                  placeholder="07X XXX XXX"
                  value={formData.customerPhone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, customerPhone: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-email">Е-пошта</Label>
                <Input
                  id="cart-email"
                  type="email"
                  placeholder="optional@example.com"
                  value={formData.customerEmail}
                  onChange={(event) => setFormData((prev) => ({ ...prev, customerEmail: event.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-address">Адреса за достава</Label>
                <Input
                  id="cart-address"
                  placeholder="Ул. Пример бр. 1, Скопје"
                  value={formData.customerAddress}
                  onChange={(event) => setFormData((prev) => ({ ...prev, customerAddress: event.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-notes">Забелешка</Label>
                <Textarea
                  id="cart-notes"
                  placeholder="Дополнителни информации за доставата"
                  value={formData.notes}
                  onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={3}
                />
              </div>

              <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={submitting}>
                {submitting ? "Испраќање..." : "Потврди нарачка"}
              </Button>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
