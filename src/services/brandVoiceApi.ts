
import { BrandVoice } from "../types";
import { fetchWithAuth } from "./fetchUtils";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Helper function to convert Supabase data to our BrandVoice type
const mapToBrandVoice = (data: any): BrandVoice => ({
  id: data.id,
  userId: data.user_id,
  name: data.name,
  description: data.description,
  toneStyle: data.tone_style,
  examples: data.examples || [],
  customInstructions: data.custom_instructions,
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at)
});

// Helper function to convert our BrandVoice type to Supabase format
const mapToSupabaseFormat = (data: Partial<BrandVoice>) => {
  const result: any = {};
  if (data.name !== undefined) result.name = data.name;
  if (data.description !== undefined) result.description = data.description;
  if (data.toneStyle !== undefined) result.tone_style = data.toneStyle;
  if (data.examples !== undefined) result.examples = data.examples;
  if (data.customInstructions !== undefined) result.custom_instructions = data.customInstructions;
  
  return result;
};

export const brandVoiceApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return { data: data.map(mapToBrandVoice), status: 'success' };
    } catch (error) {
      console.error("Error fetching brand voices:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data: mapToBrandVoice(data), status: 'success' };
    } catch (error) {
      console.error("Error fetching brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  create: async (data: Omit<BrandVoice, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const supabaseData = {
        name: data.name,
        description: data.description,
        tone_style: data.toneStyle,
        examples: data.examples,
        custom_instructions: data.customInstructions,
        user_id: user.id
      };
      
      const { data: newBrandVoice, error } = await supabase
        .from('brand_voices')
        .insert(supabaseData)
        .select()
        .single();
        
      if (error) throw error;
      return { data: mapToBrandVoice(newBrandVoice), status: 'success' };
    } catch (error) {
      console.error("Error creating brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  update: async (id: string, data: Partial<BrandVoice>) => {
    try {
      const supabaseData = mapToSupabaseFormat(data);
      
      const { data: updatedBrandVoice, error } = await supabase
        .from('brand_voices')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data: mapToBrandVoice(updatedBrandVoice), status: 'success' };
    } catch (error) {
      console.error("Error updating brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_voices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { data: { success: true }, status: 'success' };
    } catch (error) {
      console.error("Error deleting brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
};
