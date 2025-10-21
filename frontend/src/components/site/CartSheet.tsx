import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { submitOrderRequest } from "@/lib/api";
import { formatEUR } from "@/lib/utils";

const initialFormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  notes: "",
};

export function CartSheet() {
  const {
    items,
    itemCount,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setOpen,
  } = useCart();
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
        description:
          "Внесете ги вашето име и телефон за да ја потврдите нарачката.",
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
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      toast({
        title: "Нарачката е испратена",
        description: `Број на барање: ${order.id}. Ви благодариме за довербата! Ќе ве контактираме за потврда.`,
      });

      clearCart();
      setFormData(initialFormState);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description:
          error?.message ||
          "Не успеавме да ја испратиме вашата нарачка. Обидете се повторно.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground px-1">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl lg:max-w-2xl flex flex-col gap-4 p-0 sm:p-6"
      >
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            Ваша кошничка
          </SheetTitle>
          <SheetDescription className="text-sm leading-relaxed">
            Плаќањето е при достава. Проверете ги артиклите и потврдете ја
            нарачката.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden px-0 sm:px-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
              <ShoppingCart className="h-10 w-10" />
              <p>
                Вашата кошничка е празна. Додајте производи за да продолжите.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-5 pb-2">
                {items.map((item) => {
                  const primaryImage =
                    item.product.primary_image_url ||
                    item.product.image ||
                    item.product.image_url ||
                    null;
                  return (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border/60 bg-background/70 p-4 shadow-sm"
                    >
                      <div className="h-24 w-full sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl">
                            🌿
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-semibold leading-tight text-foreground text-base sm:text-lg">
                              {item.product.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatEUR(Number(item.product.price) || 0)} по
                              артикл
                            </p>
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

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item.product.id, -1)
                              }
                              aria-label="Намали количина"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item.product.id, 1)
                              }
                              aria-label="Зголеми количина"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {formatEUR(
                              (Number(item.product.price) || 0) * item.quantity
                            )}
                          </span>
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
          <div className="border-t border-border/60 bg-muted/20 px-6 py-5 space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
              <span>Вкупно ({itemCount} артикли)</span>
              <span className="text-xl font-semibold text-primary">
                {formatEUR(totalPrice)}
              </span>
            </div>

            <Badge
              variant="outline"
              className="w-full justify-center border-primary text-primary bg-primary/10 py-2"
            >
              Плаќање при достава
            </Badge>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cart-name">Име и презиме *</Label>
                <Input
                  id="cart-name"
                  placeholder="Пример: Ана Анастасова"
                  value={formData.customerName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-phone">Телефон *</Label>
                <Input
                  id="cart-phone"
                  placeholder="Пример: 070 123 456"
                  value={formData.customerPhone}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerPhone: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerEmail: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-address">Адреса за достава</Label>
                <Input
                  id="cart-address"
                  placeholder="Ул. Пример бр. 1, Скопје"
                  value={formData.customerAddress}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerAddress: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cart-notes">Забелешка</Label>
                <Textarea
                  id="cart-notes"
                  placeholder="Дополнителни информации за доставата"
                  value={formData.notes}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Се испраќа..." : "Испрати барање за нарачка"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Ви благодариме што ја избирате Charm Catalog. Ќе ве контактираме
              веднаш по разгледувањето на вашата нарачка.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
