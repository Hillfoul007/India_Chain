import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  did_address: string;
  wallet_balance: number;
  kyc_status: 'pending' | 'verified' | 'rejected';
  kyc_verified_at?: string;
  created_at: string;
};

export type KYCVerification = {
  id: string;
  user_id: string;
  verification_type: string;
  status: 'pending' | 'verified' | 'rejected';
  proof_hash?: string;
  verified_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export type Shipment = {
  id: string;
  user_id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  weight_kg: number;
  description: string;
  estimated_delivery: string;
  delivered_at?: string;
  proof_hash?: string;
  created_at: string;
};

export type CreditScore = {
  id: string;
  user_id: string;
  score: number;
  factors?: Record<string, any>;
  ai_analysis?: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};
