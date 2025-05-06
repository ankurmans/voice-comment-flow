
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleAuthFlow } from "./auth.ts";
import { handleDataDeletion } from "./data-deletion.ts";
import { handlePrivacyPolicy } from "./privacy-policy.ts";
import { handleDeauthorization } from "./deauthorization.ts";
import { corsHeaders } from "./utils.ts";

// Main handler for all routes
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    switch(path) {
      case "data-deletion":
        return await handleDataDeletion(req);
      
      case "privacy-policy":
        return handlePrivacyPolicy();
      
      case "deauthorize":
        return await handleDeauthorization(req);
      
      case "authorize":
      case "callback":
        return await handleAuthFlow(req, path);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid endpoint" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Instagram auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
