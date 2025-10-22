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
        description: `Број на барање: ${order.id}. Ќе ве контактираме за потврда.`,
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
      <SheetContent side="right" className="sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Ваша кошничка</SheetTitle>
          <SheetDescription>
            Плаќањето е при достава. Проверете ги артиклите и потврдете ја
            нарачката.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
              <ShoppingCart className="h-10 w-10" />
              <p>
                Вашата кошничка е празна. Додајте производи за да продолжите.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const primaryImage =
                    item.product.primary_image_url ||
                    item.product.image ||
                    item.product.image_url ||
                    null;
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 rounded-lg border border-border/50 p-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-transparent">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={item.product.title}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🌿
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium leading-tight text-foreground">
                              {item.product.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatEUR(Number(item.product.price) || 0)}
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

                        <div className="flex items-center justify-between">
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
          <div className="border-t border-border/50 pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Вкупно ({itemCount} артикли)</span>
              <span className="text-lg font-semibold text-primary">
                {formatEUR(totalPrice)}
              </span>
            </div>

            <Badge
              variant="outline"
              className="w-full justify-center border-primary text-primary bg-primary/5"
            >
              Плати при достава
            </Badge>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-3">
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

              <Button
                type="submit"
                className="w-full
               bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold
              "
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
