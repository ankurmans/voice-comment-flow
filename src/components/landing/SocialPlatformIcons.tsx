
import { Facebook, Instagram, YoutubeIcon } from "lucide-react";

export const SocialPlatformIcons = () => {
  return (
    <div className="flex justify-center items-center gap-6 py-8">
      <div className="flex flex-col items-center">
        <Instagram className="h-8 w-8 text-pink-600" />
        <span className="text-xs mt-1 text-gray-600">Instagram</span>
      </div>
      <div className="flex flex-col items-center">
        <Facebook className="h-8 w-8 text-blue-600" />
        <span className="text-xs mt-1 text-gray-600">Facebook</span>
      </div>
      <div className="flex flex-col items-center">
        <YoutubeIcon className="h-8 w-8 text-red-600" />
        <span className="text-xs mt-1 text-gray-600">YouTube</span>
      </div>
      <div className="flex flex-col items-center">
        <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .594.044.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <span className="text-xs mt-1 text-gray-600">TikTok</span>
      </div>
    </div>
  );
};
