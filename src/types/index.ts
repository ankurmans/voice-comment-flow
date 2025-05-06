
// User model
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Social account model
export interface SocialAccount {
  id: string;
  userId: string;
  platform: 'facebook' | 'instagram' | 'google';
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  profileImageUrl?: string;
  isConnected: boolean;
  brandVoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Brand voice model
export interface BrandVoice {
  id: string;
  userId: string;
  name: string;
  description: string;
  toneStyle: 'cheeky' | 'grateful' | 'funny' | 'professional' | 'custom';
  examples: string[];
  customInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Comment model
export interface Comment {
  id: string;
  socialAccountId: string;
  platform: 'facebook' | 'instagram' | 'google';
  postId?: string;
  postContent?: string;
  postImageUrl?: string;
  postHashtags?: string[];
  commentId: string;
  commentAuthor: string;
  commentAuthorId: string;
  commentContent: string;
  commentTimestamp: Date;
  commentIntent?: 'compliment' | 'question' | 'tag' | 'emoji' | 'negative' | 'spam' | 'other';
  status: 'pending' | 'replied' | 'skipped' | 'flagged';
  createdAt: Date;
  updatedAt: Date;
}

// Reply model
export interface Reply {
  id: string;
  commentId: string;
  content: string;
  source: 'ai' | 'human';
  status: 'draft' | 'approved' | 'posted' | 'rejected';
  aiModel?: string;
  socialPostId?: string;
  socialReplyId?: string;
  metrics?: {
    likes?: number;
    engagement?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Analytics model
export interface Analytics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'all';
  metrics: {
    totalComments: number;
    repliedComments: number;
    skippedComments: number;
    averageLikes: number;
    engagementDelta: number;
  };
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

// AI Generation types
export interface GenerationRequest {
  commentId: string;
  options?: {
    count?: number;
    maxLength?: number;
    temperature?: number;
  };
}

export interface GenerationResponse {
  commentId: string;
  suggestions: string[];
}
