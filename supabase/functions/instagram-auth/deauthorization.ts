
import { corsHeaders, getSupabaseClient } from "./utils.ts";

// Handle deauthorization callback from Instagram/Facebook
export async function handleDeauthorization(req: Request) {
  console.log("Deauthorization callback received from Instagram");
  
  try {
    // Parse the request body
    const body = await req.json();
    
    // Log the deauthorization data
    console.log("Deauthorization data:", body);
    
    // The request includes a signed_request that contains user_id
    // For real implementation, you'd verify the signature and extract user info
    
    if (body.user_id) {
      // Get Supabase client
      const supabase = getSupabaseClient();
      
      // Find and update the user's account connection status
      const { error } = await supabase
        .from("social_accounts")
        .update({ is_connected: false })
        .eq("account_id", body.user_id);
      
      if (error) {
        console.error("Error updating account connection status:", error);
      }
    }
    
    // Meta/Facebook expects a 200 OK response for successful deauthorization
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error processing deauthorization:", error);
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
