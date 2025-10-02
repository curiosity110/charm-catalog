import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper to check if user is staff (will be implemented after DB types are generated)
export async function checkIsStaff() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // This will work once the types are generated
    const { data: staffUser } = await supabase
      .from('staff_users' as any)
      .select('*')
      .eq('user_id', user.id)
      .single();

    return !!staffUser;
  } catch (error) {
    console.error('Error checking staff status:', error);
    return false;
  }
}

// Types
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

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: 'new' | 'contacted' | 'scheduled' | 'fulfilled' | 'canceled';
  payment_method: string;
  total_cents: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  order_items?: OrderItem[];
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

export interface StaffUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}