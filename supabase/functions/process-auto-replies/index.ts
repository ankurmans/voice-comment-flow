
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Get auto-reply settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('auto_reply_settings')
      .single();
    
    if (settingsError) {
      throw new Error(`Failed to fetch auto-reply settings: ${settingsError.message}`);
    }
    
    const settings = settingsData.auto_reply_settings;
    
    // Exit if auto-reply is not enabled
    if (!settings || !settings.enabled) {
      return new Response(
        JSON.stringify({ message: "Auto-reply is disabled", processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Check if within working hours if that setting is enabled
    if (settings.workingHoursOnly && !isWithinWorkingHours()) {
      return new Response(
        JSON.stringify({ message: "Outside of configured working hours", processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Get auto-reply count for today to check against daily limit
    const today = new Date().toISOString().split('T')[0];
    const { count: dailyCount, error: countError } = await supabase
      .from('replies')
      .select('*', { count: 'exact' })
      .eq('is_auto_reply', true)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);
    
    if (countError) {
      throw new Error(`Failed to fetch daily auto-reply count: ${countError.message}`);
    }
    
    // Check if we've exceeded the daily limit
    const maxDailyReplies = parseInt(settings.maxDailyAutoReplies);
    if (maxDailyReplies > 0 && dailyCount >= maxDailyReplies) {
      return new Response(
        JSON.stringify({ message: "Daily auto-reply limit reached", processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Get pending comments
    const { data: pendingComments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      throw new Error(`Failed to fetch pending comments: ${commentsError.message}`);
    }
    
    let processedCount = 0;
    const remainingAllowed = maxDailyReplies > 0 ? maxDailyReplies - dailyCount : 999;
    
    for (const comment of pendingComments) {
      if (processedCount >= remainingAllowed) {
        break;
      }
      
      try {
        // Calculate comment age in milliseconds
        const commentDate = new Date(comment.created_at);
        const now = new Date();
        const commentAge = now.getTime() - commentDate.getTime();
        const maxTimeInQueue = parseInt(settings.maxTimeInQueue) * 60 * 1000; // Convert to ms
        
        // Skip if comment is too new
        if (commentAge < maxTimeInQueue) {
          continue;
        }
        
        // Check if comment category matches auto-reply settings
        const category = detectCommentCategory(comment.content);
        if (!category || !settings.autoReplyCategories.includes(category)) {
          continue;
        }
        
        // Generate reply with OpenAI
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: `You are a helpful social media manager. Generate a professional and friendly response to this comment: "${comment.content}". Your response should be brief (max 280 characters) and end with a confidence score between 0-1 (where 1 is highest confidence) in this format: [CONFIDENCE: 0.X]` 
              },
              { role: 'user', content: `Generate a response to: "${comment.content}"` }
            ],
            temperature: 0.7,
            max_tokens: 350
          })
        });
        
        const openaiData = await openaiResponse.json();
        
        if (!openaiResponse.ok) {
          console.error('OpenAI API error:', openaiData);
          continue;
        }
        
        const generatedText = openaiData.choices[0].message.content;
        
        // Parse confidence score
        const confidenceMatch = generatedText.match(/\[CONFIDENCE:\s*(0\.\d+)\]/i);
        const confidenceScore = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7;
        
        // Remove confidence score from response text
        let responseText = generatedText.replace(/\[CONFIDENCE:\s*0\.\d+\]/i, '').trim();
        
        // Check if confidence threshold is met
        if (confidenceScore < parseFloat(settings.confidenceThreshold)) {
          continue;
        }
        
        // Save and post the reply
        const { data: newReply, error: replyError } = await supabase
          .from('replies')
          .insert({
            comment_id: comment.id,
            content: responseText,
            is_auto_reply: true,
            confidence_score: confidenceScore
          })
          .select()
          .single();
        
        if (replyError) {
          console.error('Error saving reply:', replyError);
          continue;
        }
        
        // Update comment status
        const { error: updateError } = await supabase
          .from('comments')
          .update({ status: 'replied' })
          .eq('id', comment.id);
        
        if (updateError) {
          console.error('Error updating comment status:', updateError);
          continue;
        }
        
        processedCount++;
      } catch (commentError) {
        console.error('Error processing comment:', commentError);
        continue;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Auto-reply processing complete. ${processedCount} comments processed.`,
        processed: processedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error in process-auto-replies function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process auto-replies',
        status: 'error',
        processed: 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
