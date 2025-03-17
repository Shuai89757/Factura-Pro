import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Invoice = {
  id: string;
  invoice_number: string;
  date: string;
  issuer_data: {
    name: string;
    taxId: string;
    address: string;
    contact: string;
  };
  client_data: {
    name: string;
    taxId: string;
    address: string;
    contact: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  tax_rate: number;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  tax_id: string;
  address: string;
  contact: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: string;
};