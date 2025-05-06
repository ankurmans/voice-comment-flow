
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandVoiceApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { BrandVoice } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export const useBrandVoices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Query brand voices
  const { data: brandVoices, isLoading } = useQuery({
    queryKey: ["brand-voices"],
    queryFn: async () => {
      const response = await brandVoiceApi.getAll();
      if (response.status === "error") {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: isAuthenticated,
  });

  // Create mutation
  const createVoiceMutation = useMutation({
    mutationFn: (data: Omit<BrandVoice, "id" | "userId" | "createdAt" | "updatedAt">) => {
      return brandVoiceApi.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice created",
        description: "Your new brand voice has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
    },
    onError: (error) => {
      console.error("Create voice error:", error);
      toast({
        variant: "destructive",
        title: "Failed to create",
        description: "There was an error creating your brand voice",
      });
    },
  });

  // Update mutation
  const updateVoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandVoice> }) => {
      return brandVoiceApi.update(id, data);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice updated",
        description: "Your brand voice has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
    },
    onError: (error) => {
      console.error("Update voice error:", error);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "There was an error updating your brand voice",
      });
    },
  });

  // Delete mutation
  const deleteVoiceMutation = useMutation({
    mutationFn: (id: string) => {
      return brandVoiceApi.delete(id);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice deleted",
        description: "The brand voice has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
    },
    onError: (error) => {
      console.error("Delete voice error:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "There was an error deleting the brand voice",
      });
    },
  });

  return {
    brandVoices,
    isLoading,
    createVoiceMutation,
    updateVoiceMutation,
    deleteVoiceMutation,
  };
};
