
import { AutoReplySettings } from "./userDataApi";
import { repliesApi } from "./api";
import { commentsApi } from "./api";
import { useToast } from "@/hooks/use-toast";

// Comment categories for auto-reply matching
const COMMENT_CATEGORIES = {
  THANK_YOU: "thank_you",
  SIMPLE_QUESTION: "simple_question",
  COMPLIMENT: "compliment",
  AVAILABILITY: "availability",
};

// Helper function to check if current time is within working hours (9am-5pm)
const isWithinWorkingHours = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 17;
};

// Helper function to detect comment type/category
const detectCommentCategory = (commentContent: string): string | null => {
  const lowerContent = commentContent.toLowerCase();
  
  // Simple pattern matching for comment categorization
  if (lowerContent.includes("thank you") || 
      lowerContent.includes("thanks") || 
      lowerContent.includes("thx")) {
    return COMMENT_CATEGORIES.THANK_YOU;
  }
  
  if (lowerContent.includes("love") || 
      lowerContent.includes("awesome") || 
      lowerContent.includes("great") || 
      lowerContent.includes("amazing")) {
    return COMMENT_CATEGORIES.COMPLIMENT;
  }
  
  if (lowerContent.includes("where") || 
      lowerContent.includes("when") || 
      lowerContent.includes("hours") || 
      lowerContent.includes("open") || 
      lowerContent.includes("close") || 
      lowerContent.includes("available")) {
    return COMMENT_CATEGORIES.AVAILABILITY;
  }
  
  if (lowerContent.includes("how") || 
      lowerContent.includes("what") || 
      lowerContent.includes("?")) {
    return COMMENT_CATEGORIES.SIMPLE_QUESTION;
  }
  
  return null;
};

// Helper to check if a comment qualifies for auto-reply based on settings
const qualifiesForAutoReply = (
  commentContent: string,
  settings: AutoReplySettings,
  confidenceScore: number,
  commentAge: number
): boolean => {
  // If auto-reply is disabled, don't proceed
  if (!settings.enabled) {
    return false;
  }

  // Check if the current time is within working hours (if that setting is enabled)
  if (settings.workingHoursOnly && !isWithinWorkingHours()) {
    return false;
  }

  // Check confidence threshold
  if (confidenceScore < parseFloat(settings.confidenceThreshold)) {
    return false;
  }

  // Check comment category
  const category = detectCommentCategory(commentContent);
  if (!category || !settings.autoReplyCategories.includes(category)) {
    return false;
  }

  // Check if the comment has been in the queue long enough
  const maxTimeInQueue = parseInt(settings.maxTimeInQueue);
  if (commentAge < maxTimeInQueue * 60 * 1000) { // Convert minutes to milliseconds
    return false;
  }

  return true;
};

// Process comments for auto-replies
export const processCommentsForAutoReply = async (
  comments: any[],
  settings: AutoReplySettings
): Promise<number> => {
  if (!settings.enabled) return 0;
  
  let autoRepliedCount = 0;
  const maxDailyReplies = parseInt(settings.maxDailyAutoReplies);
  
  // Don't proceed if we've reached the daily limit
  if (autoRepliedCount >= maxDailyReplies && maxDailyReplies > 0) {
    return 0;
  }

  for (const comment of comments) {
    try {
      // Skip comments that already have replies
      if (comment.hasReplies) continue;
      
      // Calculate comment age in milliseconds
      const commentDate = new Date(comment.createdAt);
      const now = new Date();
      const commentAge = now.getTime() - commentDate.getTime();
      
      // Generate reply suggestions
      const replyResponse = await repliesApi.generateReplies({
        commentId: comment.id,
        options: {
          count: 1,
          maxLength: 280,
          temperature: 0.7
        }
      });
      
      if (replyResponse.status !== "success" || !replyResponse.data?.suggestions?.length) {
        continue;
      }
      
      // Use the first suggestion and estimate its confidence
      const bestSuggestion = replyResponse.data.suggestions[0];
      
      // In a real system, you'd have a confidence score from the AI
      // For now we'll simulate with a random score between 0.7 and 1.0
      const confidenceScore = 0.7 + Math.random() * 0.3;
      
      // Check if this comment qualifies for auto-reply
      if (qualifiesForAutoReply(comment.commentContent, settings, confidenceScore, commentAge)) {
        // Save the reply
        const saveResponse = await repliesApi.saveReply({
          commentId: comment.id,
          content: bestSuggestion,
          isAutoReply: true
        });
        
        if (saveResponse.status !== "success") {
          continue;
        }
        
        // Post the reply to the social platform
        const postResponse = await repliesApi.postReply(saveResponse.data.id);
        
        if (postResponse.status === "success") {
          autoRepliedCount++;
          
          // Update comment status to "replied"
          await commentsApi.changeStatus(comment.id, "replied");
          
          // Stop if we've reached the daily limit
          if (autoRepliedCount >= maxDailyReplies && maxDailyReplies > 0) {
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error processing comment for auto-reply:", error);
      continue;
    }
  }
  
  return autoRepliedCount;
};
