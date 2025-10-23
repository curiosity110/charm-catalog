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
      toast({ position: "center",
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

      toast({ position: "center",
        title: "Нарачката е испратена",
        description: `Број на барање: ${order.id}. Ќе ве контактираме за потврда.`,
      });

      clearCart();
      setFormData(initialFormState);
      setOpen(false);
    } catch (error: any) {
      toast({ position: "center",
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

      {/* Full-height sheet; inner layout is a column with min-h-0 to allow child scroll */}
      <SheetContent
        side="right"
        className="
          flex flex-col p-0
          w-[95vw] sm:w-[440px] md:w-[580px] lg:w-[720px]
          h-[100dvh] max-h-[100dvh]
        "
      >
        {/* Header (compact) */}
        <div className="border-b border-border/50 p-4 sm:p-5">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-xl md:text-2xl">
              Ваша кошничка
            </SheetTitle>
            <SheetDescription className="hidden sm:block">
              Плаќањето е при достава. Проверете ги артиклите и потврдете ја
              нарачката.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Body: make this the only scrollable area */}
        <div className="flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2 p-6">
              <ShoppingCart className="h-10 w-10" />
              <p>
                Вашата кошничка е празна. Додајте производи за да продолжите.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-5 space-y-4 pr-2">
                {items.map((item) => {
                  const primaryImage =
                    item.product.primary_image_url ||
                    item.product.image ||
                    item.product.image_url ||
                    null;

                  const unitPrice = Number(item.product.price) || 0;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="
                        grid gap-4 rounded-lg border border-border/50 p-4
                        grid-cols-[84px,1fr,auto]
                        md:grid-cols-[100px,minmax(0,1fr),auto]
                        bg-card
                      "
                    >
                      {/* Image (moderate size, clear) */}
                      <div className="relative h-[84px] w-[84px] md:h-[100px] md:w-[100px] overflow-hidden rounded-md bg-white ring-1 ring-border">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={item.product.title}
                            className="absolute inset-0 h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🌿
                          </div>
                        )}
                      </div>

                      {/* Title / unit price / qty */}
                      <div className="min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[15px] md:text-base font-medium leading-tight text-foreground break-words">
                              {item.product.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatEUR(unitPrice)}{" "}
                              <span className="opacity-70">/ ед.</span>
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Отстрани"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() =>
                                handleQuantityChange(item.product.id, -1)
                              }
                              aria-label="Намали количина"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center text-sm md:text-base font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() =>
                                handleQuantityChange(item.product.id, 1)
                              }
                              aria-label="Зголеми количина"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <span className="text-sm md:text-base font-semibold text-foreground">
                            {formatEUR(lineTotal)}
                          </span>
                        </div>
                      </div>

                      {/* spacer for 3rd col alignment */}
                      <div className="hidden md:block" />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer: separated, not inside the scroller */}
        {items.length > 0 && (
          <div className="border-t border-border/50 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm md:text-base text-muted-foreground">
              <span>Вкупно ({itemCount} артикли)</span>
              <span className="text-lg md:text-xl font-semibold text-primary">
                {formatEUR(totalPrice)}
              </span>
            </div>

            <Badge
              variant="outline"
              className="mt-3 w-full justify-center border-primary text-primary bg-primary/5"
            >
              Плати при достава
            </Badge>

            <Separator className="my-4" />

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="cart-name">Име и презиме *</Label>
                <Input
                  id="cart-name"
                  className="h-11"
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
                  className="h-11"
                  placeholder="07X XXX XXX"
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

              <Button
                type="submit"
                className="w-full h-12 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold"
                disabled={submitting}
              >
                {submitting ? "Испраќање..." : "Потврди нарачка"}
              </Button>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
