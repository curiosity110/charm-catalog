import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting (Macedonian Denar)
export function formatMKD(amount: number): string {
  return new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency: "MKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Slug generation
export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Phone number formatting
export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}