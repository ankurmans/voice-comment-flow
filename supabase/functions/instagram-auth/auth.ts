
import { 
  corsHeaders, 
  INSTAGRAM_AUTH_URL, 
  INSTAGRAM_TOKEN_URL, 
  INSTAGRAM_GRAPH_URL, 
  INSTAGRAM_CLIENT_ID, 
  INSTAGRAM_CLIENT_SECRET, 
  APP_URL, 
  getSupabaseClient 
} from "./utils.ts";

// Handle the Instagram OAuth flow (authorize and callback)
export async function handleAuthFlow(req: Request, path: string) {
  const url = new URL(req.url);
  
  if (path === "authorize") {
    return handleAuthorize(req, url);
  } else if (path === "callback") {
    return handleCallback(req, url);
  }
  
  throw new Error("Invalid auth flow path");
}

// Handle the authorize step of the OAuth flow
function handleAuthorize(req: Request, url: URL) {
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
async function handleCallback(req: Request, url: URL) {
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
  
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authentication session expired" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Get Supabase client
  const supabase = getSupabaseClient();
  
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
  
  try {
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
        JSON.stringify({ error: "Failed to save account information", details: saveError }),
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
  } catch (error) {
    console.error("Error in Instagram OAuth flow:", error);
    return new Response(
      JSON.stringify({ error: "Instagram OAuth process failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
