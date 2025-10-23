import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  style,
  ...rest
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return undefined;
    }

    if (typeof window === "undefined") {
      return undefined;
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      node.classList.add("reveal-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("reveal-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  return (
    <div
      ref={elementRef}
      className={cn("reveal-init", className)}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </div>
  );
}
