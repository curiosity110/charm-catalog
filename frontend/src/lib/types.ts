export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_cents: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_cents_at_purchase: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string;
  status: "new" | "contacted" | "scheduled" | "fulfilled" | "canceled";
  payment_method: string;
  total_cents: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  order_items?: OrderItem[];
}

export interface StaffUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}
