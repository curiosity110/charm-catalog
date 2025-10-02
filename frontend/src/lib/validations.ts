import { z } from "zod";

export const productInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  active: z.boolean().default(true),
});

export const createRequestSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100, "Name too long"),
  customerPhone: z.string().min(8, "Valid phone required").max(20, "Phone too long"),
  customerEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  customerAddress: z.string().max(500, "Address too long").optional(),
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(99, "Quantity too high"),
  notes: z.string().max(1000, "Notes too long").optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  status: z.enum(['new', 'contacted', 'scheduled', 'fulfilled', 'canceled']),
  notes: z.string().max(1000, "Notes too long").optional(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;