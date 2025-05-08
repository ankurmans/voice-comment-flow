
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, YoutubeIcon, Linkedin, Trophy, DollarSign } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  username: string;
  avatar: string;
  comment: string;
  platform: "instagram" | "facebook" | "youtube" | "tiktok" | "twitter" | "linkedin" | "gaming" | "monetize";
  verified?: boolean;
}

export const TestimonialCard = ({
  name,
  username,
  avatar,
  comment,
  platform,
  verified = true,
}: TestimonialCardProps) => {
  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case "youtube":
        return <YoutubeIcon className="h-4 w-4 text-red-600" />;
      case "tiktok":
        return (
          <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .594.044.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      case "gaming":
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case "monetize":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="comment-card-hover w-[300px] border shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <img
              src={avatar}
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
              {verified && (
                <svg
                  className="ml-1 h-4 w-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>@{username}</span>
              <span className="mx-1">•</span>
              <div className="flex items-center">
                {getPlatformIcon()}
                <span className="ml-1">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700">{comment}</p>
      </CardContent>
    </Card>
  );
};
