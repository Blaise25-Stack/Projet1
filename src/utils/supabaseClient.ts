

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnelbiddzzxipmxoohim.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for database tables
export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'parent';
  name: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
  assigned_classes?: string[];
  children_ids?: string[];
  permissions?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStudent {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  class_id: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  address: string;
  enrollment_date: string;
  profile_photo?: string;
  student_number: string;
  is_active: boolean;
  medical_info?: string;
  created_at: string;
  updated_at: string;
}

// Add other database types as needed...
