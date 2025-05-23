
import { GenerationRequest, GenerationResponse } from "@/types";
import { fetchWithAuth } from "../../fetchUtils";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates AI reply suggestions for a comment
 * @param data Request containing comment ID and generation options
 * @returns Response with AI-generated reply suggestions
 */
export const generateReplies = async (data: GenerationRequest) => {
  try {
    const { commentId, options } = data;
    
    // First, get the comment details to provide context to the AI
    const commentResponse = await fetchWithAuth(`/comments/${commentId}`);
    
    if (commentResponse.status === "error" || !commentResponse.data) {
      return commentResponse;
    }
    
    // Type assertion to ensure comment has the expected properties
    const comment = commentResponse.data as {
      commentContent: string;
      postContent?: string;
      commentIntent?: string;
    };
    
    // Call the Supabase Edge Function
    const { data: functionData, error } = await supabase.functions.invoke("generate-replies", {
      body: {
        commentId,
        commentContent: comment.commentContent,
        postContent: comment.postContent || "",
        commentIntent: comment.commentIntent || "",
        options
      }
    });
    
    if (error) {
      console.error("Error calling generate-replies function:", error);
      return {
        error: error.message || "Failed to generate replies",
        status: "error"
      };
    }
    
    return {
      data: functionData as GenerationResponse,
      status: "success"
    };
  } catch (error) {
    console.error("Error in generateReplies:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    };
  }
};
