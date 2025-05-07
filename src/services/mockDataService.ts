
// Mock data provider for demo purposes
import { SocialAccount, Comment, Analytics } from "@/types";

export const mockDataService = {
  getSocialAccounts: (): SocialAccount[] => {
    return [
      {
        id: "1",
        userId: "user-1",
        platform: "instagram",
        accountId: "insta_business",
        accountName: "Driply Business",
        accessToken: "mock-token",
        isConnected: true,
        profileImageUrl: "https://i.pravatar.cc/150?img=32",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        userId: "user-1",
        platform: "facebook",
        accountId: "fb_page",
        accountName: "Driply Official",
        accessToken: "mock-token",
        isConnected: true,
        profileImageUrl: "https://i.pravatar.cc/150?img=12",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        userId: "user-1",
        platform: "google",
        accountId: "google_business",
        accountName: "Driply Store",
        accessToken: "mock-token",
        isConnected: true,
        profileImageUrl: "https://i.pravatar.cc/150?img=53",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  },

  getPendingComments: (): Comment[] => {
    return [
      {
        id: "c1",
        socialAccountId: "1",
        platform: "instagram",
        commentId: "comment-1",
        commentAuthor: "customer_satisfaction",
        commentAuthorId: "user-customer",
        commentContent: "Love your products! How long does shipping usually take?",
        commentTimestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: "pending",
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        id: "c2",
        socialAccountId: "2",
        platform: "facebook",
        commentId: "comment-2",
        commentAuthor: "tech_enthusiast",
        commentAuthorId: "user-tech",
        commentContent: "Does this work with the latest iPhone model?",
        commentTimestamp: new Date(Date.now() - 7200000), // 2 hours ago
        status: "pending",
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000)
      },
      {
        id: "c3",
        socialAccountId: "3",
        platform: "google",
        commentId: "comment-3",
        commentAuthor: "new_customer22",
        commentAuthorId: "user-new",
        commentContent: "Great service! Will definitely recommend to friends.",
        commentTimestamp: new Date(Date.now() - 10800000), // 3 hours ago
        status: "pending",
        createdAt: new Date(Date.now() - 10800000),
        updatedAt: new Date(Date.now() - 10800000)
      },
      {
        id: "c4",
        socialAccountId: "1",
        platform: "instagram",
        commentId: "comment-4",
        commentAuthor: "fashion_forward",
        commentAuthorId: "user-fashion",
        commentContent: "Do you have this in blue? The red one is sold out everywhere!",
        commentTimestamp: new Date(Date.now() - 14400000), // 4 hours ago
        status: "pending",
        createdAt: new Date(Date.now() - 14400000),
        updatedAt: new Date(Date.now() - 14400000)
      },
      {
        id: "c5",
        socialAccountId: "2",
        platform: "facebook",
        commentId: "comment-5",
        commentAuthor: "bargain_hunter",
        commentAuthorId: "user-bargain",
        commentContent: "When is your next sale happening? I missed the last one!",
        commentTimestamp: new Date(Date.now() - 18000000), // 5 hours ago
        status: "pending",
        createdAt: new Date(Date.now() - 18000000),
        updatedAt: new Date(Date.now() - 18000000)
      }
    ];
  },

  getAnalyticsSummary: (period: string): any => {
    const summaries = {
      day: {
        totalComments: 24,
        repliedComments: 20,
        skippedComments: 4,
        averageLikes: 8,
        engagementDelta: 12
      },
      week: {
        totalComments: 85,
        repliedComments: 78,
        skippedComments: 7,
        averageLikes: 12,
        engagementDelta: 23
      },
      month: {
        totalComments: 342,
        repliedComments: 315,
        skippedComments: 27,
        averageLikes: 15,
        engagementDelta: 31
      },
      all: {
        totalComments: 1245,
        repliedComments: 1102,
        skippedComments: 143,
        averageLikes: 18,
        engagementDelta: 42
      }
    };
    
    return summaries[period as keyof typeof summaries] || summaries.week;
  },

  getCommentsByPlatform: (period: string): any[] => {
    const platformData = {
      day: [
        { name: "Instagram", value: 12 },
        { name: "Facebook", value: 8 },
        { name: "Google", value: 4 }
      ],
      week: [
        { name: "Instagram", value: 42 },
        { name: "Facebook", value: 28 },
        { name: "Google", value: 15 }
      ],
      month: [
        { name: "Instagram", value: 186 },
        { name: "Facebook", value: 112 },
        { name: "Google", value: 44 }
      ],
      all: [
        { name: "Instagram", value: 685 },
        { name: "Facebook", value: 412 },
        { name: "Google", value: 148 }
      ]
    };
    
    return platformData[period as keyof typeof platformData] || platformData.week;
  },

  getEngagementMetrics: (period: string): any[] => {
    const engagementData = {
      day: [
        { date: "8AM", before: 5, after: 7 },
        { date: "10AM", before: 6, after: 9 },
        { date: "12PM", before: 8, after: 12 },
        { date: "2PM", before: 7, after: 11 },
        { date: "4PM", before: 6, after: 10 },
        { date: "6PM", before: 8, after: 13 }
      ],
      week: [
        { date: "Mon", before: 15, after: 22 },
        { date: "Tue", before: 18, after: 26 },
        { date: "Wed", before: 20, after: 32 },
        { date: "Thu", before: 22, after: 36 },
        { date: "Fri", before: 16, after: 28 },
        { date: "Sat", before: 14, after: 24 },
        { date: "Sun", before: 16, after: 30 }
      ],
      month: [
        { date: "Week 1", before: 68, after: 92 },
        { date: "Week 2", before: 75, after: 103 },
        { date: "Week 3", before: 82, after: 116 },
        { date: "Week 4", before: 78, after: 108 }
      ],
      all: [
        { date: "Jan", before: 45, after: 62 },
        { date: "Feb", before: 52, after: 74 },
        { date: "Mar", before: 58, after: 85 },
        { date: "Apr", before: 63, after: 92 },
        { date: "May", before: 70, after: 105 },
        { date: "Jun", before: 76, after: 118 }
      ]
    };
    
    return engagementData[period as keyof typeof engagementData] || engagementData.week;
  }
};
