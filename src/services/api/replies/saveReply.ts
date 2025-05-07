
import { Reply } from "@/types";
import { fetchWithAuth } from "../../fetchUtils";

/**
 * Saves a reply to a comment
 * @param data Object containing commentId and reply content
 * @returns Response containing the saved reply data
 */
export const saveReply = async (data: { commentId: string; content: string; isAutoReply?: boolean }) => {
  return fetchWithAuth<Reply>("/replies", {
    method: "POST",
    body: JSON.stringify({
      commentId: data.commentId,
      content: data.content,
      isAutoReply: data.isAutoReply || false
    }),
  });
};
