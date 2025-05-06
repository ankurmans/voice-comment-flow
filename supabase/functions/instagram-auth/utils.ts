
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants for Instagram API
export const INSTAGRAM_AUTH_URL = "https://api.instagram.com/oauth/authorize";
export const INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
export const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com";

// Get environment variables
export const INSTAGRAM_CLIENT_ID = Deno.env.get("INSTAGRAM_CLIENT_ID") || "";
export const INSTAGRAM_CLIENT_SECRET = Deno.env.get("INSTAGRAM_CLIENT_SECRET") || "";
export const SUPABASE_URL = "https://dedialilbuseilgqgmeh.supabase.co";
export const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
export const APP_URL = Deno.env.get("APP_URL") || "http://localhost:3000";

// CORS headers
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client with service role key (for admin operations)
export const getSupabaseClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
};
