
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants for Instagram API
const INSTAGRAM_AUTH_URL = "https://api.instagram.com/oauth/authorize";
const INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com";

// Get environment variables
const INSTAGRAM_CLIENT_ID = Deno.env.get("INSTAGRAM_CLIENT_ID") || "";
const INSTAGRAM_CLIENT_SECRET = Deno.env.get("INSTAGRAM_CLIENT_SECRET") || "";
const SUPABASE_URL = "https://dedialilbuseilgqgmeh.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const APP_URL = Deno.env.get("APP_URL") || "http://localhost:3000";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Initialize Supabase client with service role key (for admin operations)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Route to initiate the Instagram OAuth flow
    if (path === "authorize") {
      const requestUrl = new URL(INSTAGRAM_AUTH_URL);
      
      // Get auth token from request to identify user
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.split("Bearer ")[1];
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Authentication token is required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Store token in session for later use during callback
      const sessionCookie = `instagram_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
      
      // Build Instagram authorization URL
      requestUrl.searchParams.append("client_id", INSTAGRAM_CLIENT_ID);
      requestUrl.searchParams.append("redirect_uri", `${req.url.split("/authorize")[0]}/callback`);
      requestUrl.searchParams.append("scope", "user_profile,user_media");
      requestUrl.searchParams.append("response_type", "code");
      
      // Redirect to Instagram authorization page
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Set-Cookie": sessionCookie,
          "Location": requestUrl.toString(),
        },
      });
    }
    
    // Handle the callback from Instagram
    if (path === "callback") {
      const code = url.searchParams.get("code");
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Authorization code is missing" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get the token from cookies
      const cookies = req.headers.get("cookie") || "";
      const tokenMatch = cookies.match(/instagram_auth_token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Authentication session expired" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verify the JWT token to get the user ID
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ error: "Invalid authentication token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const userId = userData.user.id;
      
      // Exchange the code for an access token
      const tokenResponse = await fetch(INSTAGRAM_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: INSTAGRAM_CLIENT_ID,
          client_secret: INSTAGRAM_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: `${req.url.split("/callback")[0]}/callback`,
          code: code,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error("Error exchanging code for token:", tokenData);
        return new Response(
          JSON.stringify({ error: "Failed to obtain access token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get user profile info
      const profileResponse = await fetch(
        `${INSTAGRAM_GRAPH_URL}/me?fields=id,username&access_token=${tokenData.access_token}`
      );
      
      const profileData = await profileResponse.json();
      
      if (!profileResponse.ok) {
        console.error("Error fetching profile:", profileData);
        return new Response(
          JSON.stringify({ error: "Failed to fetch Instagram profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Save the account to the database
      const { data: existingAccount, error: fetchError } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("platform", "instagram")
        .eq("account_id", profileData.id)
        .single();
      
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking for existing account:", fetchError);
      }
      
      const accountData = {
        user_id: userId,
        platform: "instagram",
        account_id: profileData.id,
        account_name: profileData.username,
        is_connected: true,
        // We don't store access_token in the database for security reasons
        // In a production app, you'd encrypt it or use a secure vault
      };
      
      let saveError;
      
      if (existingAccount) {
        // Update existing account
        const { error } = await supabase
          .from("social_accounts")
          .update(accountData)
          .eq("id", existingAccount.id);
        
        saveError = error;
      } else {
        // Create new account
        const { error } = await supabase
          .from("social_accounts")
          .insert(accountData);
        
        saveError = error;
      }
      
      if (saveError) {
        console.error("Error saving account:", saveError);
        return new Response(
          JSON.stringify({ error: "Failed to save account information" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Clear the session cookie and redirect back to the app
      const clearCookie = "instagram_auth_token=; Path=/; Max-Age=0";
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Set-Cookie": clearCookie,
          "Location": `${APP_URL}/accounts?connected=instagram`,
        },
      });
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid endpoint" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Instagram auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
