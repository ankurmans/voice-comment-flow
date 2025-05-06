
import { corsHeaders, getSupabaseClient } from "./utils.ts";

// Handle data deletion requests (for Facebook compliance)
export async function handleDataDeletion(req: Request) {
  // For signed requests from Facebook
  if (req.method === "POST") {
    try {
      const body = await req.json();
      
      // Log the deletion request
      console.log("Data deletion request received:", body);
      
      // Here you would implement actual user data deletion logic
      const instagramUserId = body.user_id;
      if (instagramUserId) {
        const supabase = getSupabaseClient();
        
        // Find and mark accounts for deletion
        // In a real implementation, you'd properly delete or anonymize the data
        console.log(`Would delete data for Instagram user: ${instagramUserId}`);
        
        // Example deletion logic (uncommented for demonstration)
        // const { error } = await supabase
        //   .from('social_accounts')
        //   .delete()
        //   .eq('account_id', instagramUserId);
        //
        // if (error) {
        //   console.error("Error deleting account data:", error);
        // }
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
