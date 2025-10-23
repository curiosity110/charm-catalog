import { useId, useMemo, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { submitOrderRequest } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatEUR } from "@/lib/utils";

interface QuickOrderDialogProps {
  product: Product;
  trigger: ReactNode;
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
}

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
};

export function QuickOrderDialog({ product, trigger }: QuickOrderDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const primaryImage = useMemo(() => {
    return (
      product.primary_image_url || product.image || product.image_url || null
    );
  }, [product]);
  const instanceId = useId();
  const firstNameId = `${instanceId}-first-name`;
  const lastNameId = `${instanceId}-last-name`;
  const phoneId = `${instanceId}-phone`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting) {
      return;
    }
    if (!nextOpen) {
      setFormData(initialFormState);
    }
    setOpen(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const phone = formData.phone.trim();

    if (!firstName || !lastName || !phone) {
      toast({
        position: "center",
        title: "Недостасуваат податоци",
        description: "Внесете име, презиме и телефон за да ја потврдите нарачката.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitOrderRequest({
        customerName: `${firstName} ${lastName}`.trim(),
        customerPhone: phone,
        items: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      });

      toast({
        position: "center",
        title: "Нарачката е примена",
        description: "Ќе ве контактираме наскоро за потврда на вашата нарачка.",
      });

      setFormData(initialFormState);
      setOpen(false);
    } catch (error: any) {
      toast({
        position: "center",
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Нарачај {product.title}</DialogTitle>
          <DialogDescription>
            Пополнете ги податоците за да ја потврдите нарачката. Ќе ве
            контактираме телефонски за финални детали.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4 py-1">
            <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
              {primaryImage ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-background">
                  <img
                    src={primaryImage}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-background text-2xl">
                  🌿
                </div>
              )}

              <div className="min-w-0">
                <p className="font-semibold text-foreground line-clamp-2">
                  {product.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatEUR(Number(product.price) || 0)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor={firstNameId}>Име *</Label>
                <Input
                  id={firstNameId}
                  autoComplete="given-name"
                  placeholder="Пример: Ана"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={lastNameId}>Презиме *</Label>
                <Input
                  id={lastNameId}
                  autoComplete="family-name"
                  placeholder="Пример: Анастасова"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={phoneId}>Телефон *</Label>
                <Input
                  id={phoneId}
                  autoComplete="tel"
                  placeholder="07X XXX XXX"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: event.target.value,
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
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Испраќање...
                  </>
                ) : (
                  "Потврди нарачка"
                )}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
