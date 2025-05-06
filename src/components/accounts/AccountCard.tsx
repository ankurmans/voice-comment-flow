
import { SocialAccount, BrandVoice } from "@/types";
import { Link2, Link2Off } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  account: SocialAccount;
  onDisconnect: (account: SocialAccount) => void;
  onBrandVoiceUpdate: (account: SocialAccount) => void;
  getBrandVoiceName: (id?: string) => string;
}

export function AccountCard({ account, onDisconnect, onBrandVoiceUpdate, getBrandVoiceName }: AccountCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'facebook':
        return (
          <svg
            className="h-6 w-6 social-icon social-icon-facebook"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            className="h-6 w-6 social-icon social-icon-instagram"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10 5.5 0 10-4.5 10-10 0-5.5-4.5-10-10-10Zm3 15.5h-6a2.5 2.5 0 0 1-2.5-2.5v-6a2.5 2.5 0 0 1 2.5-2.5h6a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5ZM16.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
        );
      case 'google':
        return (
          <svg
            className="h-6 w-6 social-icon social-icon-google"
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
      default:
        return null;
    }
  };

  return (
    <Card key={account.id}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          {getPlatformIcon(account.platform)}
          <div>
            <CardTitle>{account.accountName}</CardTitle>
            <CardDescription>
              {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            {account.isConnected ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Disconnected
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Brand Voice:</span>
            <span className="text-sm">{getBrandVoiceName(account.brandVoiceId)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Added:</span>
            <span className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onBrandVoiceUpdate(account)}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Brand Voice
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive"
          onClick={() => onDisconnect(account)}
        >
          <Link2Off className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
}
