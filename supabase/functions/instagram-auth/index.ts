
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

    // Handle data deletion requests (for Facebook compliance)
    if (path === "data-deletion") {
      // This endpoint handles Facebook's Data Deletion Callback
      // Reference: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
      
      // For signed requests from Facebook
      if (req.method === "POST") {
        try {
          const body = await req.json();
          
          // Log the deletion request
          console.log("Data deletion request received:", body);
          
          // Here you would implement actual user data deletion logic
          // This might include removing user records, preferences, etc.
          
          // For user_id, you'd typically use the Instagram user ID
          const instagramUserId = body.user_id;
          if (instagramUserId) {
            // Example: Find and delete user data in your database
            // const { error } = await supabase
            //   .from('social_accounts')
            //   .delete()
            //   .eq('account_id', instagramUserId);
            
            // For now just log this - implement actual deletion as needed
            console.log(`Would delete data for Instagram user: ${instagramUserId}`);
          }
          
          // Facebook expects a JSON response with a confirmation_code
          return new Response(
            JSON.stringify({
              confirmation_code: crypto.randomUUID(),
              url: req.url, // Echo back the URL that was hit
            }),
            {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
              }
            }
          );
        } catch (error) {
          console.error("Error processing deletion request:", error);
          return new Response(
            JSON.stringify({ error: "Invalid request format" }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
              }
            }
          );
        }
      }
      
      // For GET requests (Facebook checking if the endpoint is valid)
      return new Response(
        JSON.stringify({ 
          message: "This endpoint handles user data deletion requests from Facebook",
          status: "active"
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Route to initiate the Instagram OAuth flow
    if (path === "authorize") {
      const requestUrl = new URL(INSTAGRAM_AUTH_URL);
      
      // Get auth token from URL query parameter
      const token = url.searchParams.get("token");
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Authentication token is required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Store token in session for later use during callback
      const sessionCookie = `instagram_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
      
      // For debugging
      console.log("Starting Instagram auth flow, token stored in cookie");
      
      // Build Instagram authorization URL
      requestUrl.searchParams.append("client_id", INSTAGRAM_CLIENT_ID);
      requestUrl.searchParams.append("redirect_uri", `${req.url.split("/authorize")[0]}/callback`);
      requestUrl.searchParams.append("scope", "user_profile,user_media");
      requestUrl.searchParams.append("response_type", "code");
      
      // Log the Instagram authorization URL (for debugging)
      console.log("Redirecting to Instagram auth URL:", requestUrl.toString());
      
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
      console.log("Callback received from Instagram");
      
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      
      if (error) {
        console.error("Instagram auth error:", error);
        return new Response(
          JSON.stringify({ error: "Instagram authorization failed", details: error }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (!code) {
        console.error("No auth code provided by Instagram");
        return new Response(
          JSON.stringify({ error: "Authorization code is missing" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get the token from cookies
      const cookies = req.headers.get("cookie") || "";
      const tokenMatch = cookies.match(/instagram_auth_token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      
      console.log("Token retrieved from cookie:", token ? "Found" : "Not found");
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Authentication session expired" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verify the JWT token to get the user ID
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        console.error("Invalid auth token:", userError);
        return new Response(
          JSON.stringify({ error: "Invalid authentication token", details: userError }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const userId = userData.user.id;
      console.log("Verified user ID:", userId);
      
      try {
        // Exchange the code for an access token
        console.log("Exchanging code for access token");
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
            JSON.stringify({ 
              error: "Failed to obtain access token", 
              details: tokenData,
              instagram_client_id_exists: !!INSTAGRAM_CLIENT_ID,
              instagram_client_secret_exists: !!INSTAGRAM_CLIENT_SECRET
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Get user profile info
        console.log("Getting Instagram profile info");
        const profileResponse = await fetch(
          `${INSTAGRAM_GRAPH_URL}/me?fields=id,username&access_token=${tokenData.access_token}`
        );
        
        const profileData = await profileResponse.json();
        
        if (!profileResponse.ok) {
          console.error("Error fetching profile:", profileData);
          return new Response(
            JSON.stringify({ error: "Failed to fetch Instagram profile", details: profileData }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Successfully retrieved Instagram profile:", profileData.username);
        
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
          console.log("Updating existing Instagram account");
          const { error } = await supabase
            .from("social_accounts")
            .update(accountData)
            .eq("id", existingAccount.id);
          
          saveError = error;
        } else {
          // Create new account
          console.log("Creating new Instagram account");
          const { error } = await supabase
            .from("social_accounts")
            .insert(accountData);
          
          saveError = error;
        }
        
        if (saveError) {
          console.error("Error saving account:", saveError);
          return new Response(
            JSON.stringify({ error: "Failed to save account information", details: saveError }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Clear the session cookie and redirect back to the app
        const clearCookie = "instagram_auth_token=; Path=/; Max-Age=0";
        
        console.log("Instagram connection successful, redirecting back to app");
        return new Response(null, {
          status: 302,
          headers: {
            ...corsHeaders,
            "Set-Cookie": clearCookie,
            "Location": `${APP_URL}/accounts?connected=instagram`,
          },
        });
      } catch (error) {
        console.error("Error in Instagram OAuth flow:", error);
        return new Response(
          JSON.stringify({ error: "Instagram OAuth process failed", details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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
