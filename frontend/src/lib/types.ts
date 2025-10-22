export type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number | string;
  primary_image_url?: string;
  image?: string;
  image_url?: string;
  created_at?: string;
};

export type OrderItem = {
  product_id: string;
  quantity: number;
  product?: Product;
};

export type Order = {
  id: string;
  status?: string;
  created_at?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  customer_address?: string | null;
  notes?: string | null;
  items?: OrderItem[];
};
