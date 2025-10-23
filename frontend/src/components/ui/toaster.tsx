import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();
  const isCentered = toasts.some((t) => (t as any).position === "center");

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport
        className={cn(
          isCentered
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 right-auto bottom-auto items-center md:max-w-[640px]"
            : ""
        )}
      />
    </ToastProvider>
  );
}
