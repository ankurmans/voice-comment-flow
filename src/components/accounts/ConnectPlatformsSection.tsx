
import { Facebook, Instagram } from "lucide-react";
import { ConnectPlatformCard } from "./ConnectPlatformCard";

interface ConnectPlatformsSectionProps {
  onConnectPlatform: (platform: string) => void;
}

export function ConnectPlatformsSection({ onConnectPlatform }: ConnectPlatformsSectionProps) {
  const GoogleIcon = (
    <svg
      className="h-8 w-8 social-icon social-icon-google"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <ConnectPlatformCard
        title="Facebook"
        icon={<Facebook className="h-8 w-8 social-icon social-icon-facebook" />}
        description="Connect your Facebook Business account to monitor and respond to comments on your posts."
        features={[
          "Monitor comments on Page posts",
          "Auto-generate personalized replies",
          "Track engagement metrics"
        ]}
        bgClass="bg-blue-50"
        onConnect={() => onConnectPlatform("facebook")}
      />
      
      <ConnectPlatformCard
        title="Instagram"
        icon={<Instagram className="h-8 w-8 social-icon social-icon-instagram" />}
        description="Connect your Instagram Business account to monitor and respond to comments on your posts."
        features={[
          "Reply to comments on posts and reels",
          "Generate context-aware responses",
          "Boost engagement with timely replies"
        ]}
        bgClass="bg-pink-50"
        onConnect={() => onConnectPlatform("instagram")}
      />
      
      <ConnectPlatformCard
        title="Google Reviews"
        icon={GoogleIcon}
        description="Connect your Google Business Profile to monitor and respond to customer reviews."
        features={[
          "Respond to Google Business reviews",
          "Create personalized review responses",
          "Improve your local SEO with engagement"
        ]}
        bgClass="bg-red-50"
        onConnect={() => onConnectPlatform("google")}
      />
    </div>
  );
}
