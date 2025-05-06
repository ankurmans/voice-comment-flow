
import { Reply } from "@/types";
import { fetchWithAuth } from "../../fetchUtils";

/**
 * Posts a saved reply to the social platform
 * @param replyId ID of the reply to post
 * @returns Response containing the updated reply data
 */
export const postReply = async (replyId: string) => {
  return fetchWithAuth<Reply>(`/replies/${replyId}/post`, {
    method: "POST",
  });
};
