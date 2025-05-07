
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commentId, commentContent, postContent, commentIntent, options } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    if (!commentContent) {
      throw new Error('Comment content is required');
    }

    const count = options?.count || 3;
    const maxLength = options?.maxLength || 280; // Twitter-like length limit
    const temperature = options?.temperature || 0.7;

    // Prepare system prompt based on comment intent
    let intentGuidance = '';
    if (commentIntent) {
      switch (commentIntent) {
        case 'question':
          intentGuidance = 'This comment is asking a question. Provide helpful and informative answers.';
          break;
        case 'compliment':
          intentGuidance = 'This comment is a compliment. Express gratitude and be friendly.';
          break;
        case 'negative':
          intentGuidance = 'This comment contains criticism. Respond professionally and constructively.';
          break;
        case 'spam':
          intentGuidance = 'This may be spam. Provide a neutral, professional response.';
          break;
        default:
          intentGuidance = 'Respond in a friendly and professional manner.';
      }
    }

    // Build the context for the OpenAI prompt
    const contextInfo = [];
    if (postContent) {
      contextInfo.push(`Original post: "${postContent}"`);
    }
    contextInfo.push(`Comment by user: "${commentContent}"`);

    // Construct the system message - enhanced for confidence scoring
    const systemMessage = `You are a social media manager helping to respond to comments. 
${intentGuidance}

Generate ${count} different response options that are:
1. Professional and appropriate for social media
2. Thoughtful and engaging
3. Brief (maximum ${maxLength} characters)
4. Each with a slightly different tone or approach
5. No hashtags unless specifically responding to a comment with hashtags

For each response, also include a confidence score between 0-1 (where 1 is highest confidence) 
indicating how appropriate and effective this response is for this specific comment.

Format each response as: "Response (confidence_score): [your response text]"`;

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a cost-effective model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: contextInfo.join('\n') }
        ],
        temperature: temperature,
        max_tokens: maxLength * count * 1.5, // Ensure enough tokens for all responses
        n: 1 // We'll parse multiple responses from single output
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate replies');
    }

    // Parse the response into separate suggestions
    const content = data.choices[0].message.content;
    
    // Parse the responses with their confidence scores
    const regex = /Response\s*\((\d+\.?\d*)\):\s*(.*?)(?=Response|$)/gis;
    const matches = [...content.matchAll(regex)];
    
    let suggestions = [];
    let confidenceScores = [];
    
    if (matches.length > 0) {
      for (const match of matches) {
        const confidence = parseFloat(match[1]);
        const text = match[2].trim();
        
        if (text) {
          suggestions.push(text);
          confidenceScores.push(confidence);
        }
      }
    } else {
      // Fallback parsing method
      const lines = content.split(/\n+/);
      for (const line of lines) {
        const confidenceMatch = line.match(/\((\d+\.?\d*)\)/);
        if (confidenceMatch) {
          const confidence = parseFloat(confidenceMatch[1]);
          const text = line.replace(/.*?\):\s*/, '').trim();
          
          if (text) {
            suggestions.push(text);
            confidenceScores.push(confidence);
          }
        } else if (line.trim() && !line.startsWith('Response')) {
          suggestions.push(line.trim());
          confidenceScores.push(0.75); // Default confidence
        }
      }
    }
    
    // Take only the requested number of suggestions
    suggestions = suggestions.slice(0, count);
    confidenceScores = confidenceScores.slice(0, count);
    
    // If we still don't have enough responses, generate simple ones
    while (suggestions.length < count) {
      suggestions.push(`Thank you for your comment!`);
      confidenceScores.push(0.5); // Low confidence for default responses
    }
    
    return new Response(
      JSON.stringify({ 
        commentId, 
        suggestions,
        confidenceScores
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('Error in generate-replies function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate replies',
        status: 'error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
