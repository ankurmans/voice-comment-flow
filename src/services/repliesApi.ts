
import { Reply, GenerationRequest, GenerationResponse } from "../types";
import { fetchWithAuth } from "./fetchUtils";

export const repliesApi = {
  generateReplies: async (data: GenerationRequest) => {
    return fetchWithAuth<GenerationResponse>("/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  saveReply: async (commentId: string, content: string) => {
    return fetchWithAuth<Reply>(`/comments/${commentId}/replies`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
  
  postReply: async (replyId: string) => {
    return fetchWithAuth<Reply>(`/replies/${replyId}/post`, {
      method: "POST",
    });
  },
};
