
import { Reply } from "@/types";
import { fetchWithAuth } from "../../fetchUtils";

/**
 * Saves a reply to a comment
 * @param commentId ID of the comment being replied to
 * @param content Content of the reply
 * @returns Response containing the saved reply data
 */
export const saveReply = async (commentId: string, content: string) => {
  return fetchWithAuth<Reply>(`/comments/${commentId}/replies`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};
