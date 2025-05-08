
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  username: string;
  avatar: string;
  comment: string;
  platform: "instagram" | "facebook" | "youtube" | "tiktok";
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
        return <span className="social-icon social-icon-instagram">Instagram</span>;
      case "facebook":
        return <span className="social-icon social-icon-facebook">Facebook</span>;
      case "youtube":
        return <span className="social-icon">YouTube</span>;
      case "tiktok":
        return <span className="social-icon">TikTok</span>;
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
              {getPlatformIcon()}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700">{comment}</p>
      </CardContent>
    </Card>
  );
};
