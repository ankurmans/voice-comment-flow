
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccountSupabase {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram' | 'google';
  account_name: string;
  account_id: string;
  is_connected: boolean;
  brand_voice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends SupabaseUser {
  profile?: Profile;
}
