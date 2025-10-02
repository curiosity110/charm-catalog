export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string | null;
  image_url: string;
  primary_image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  status: "new" | "contacted" | "scheduled" | "fulfilled" | "canceled";
  payment_method: string;
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface StaffUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}
