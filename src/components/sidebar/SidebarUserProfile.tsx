
import { useAuth } from "@/contexts/AuthContext";

export function SidebarUserProfile() {
  const { user } = useAuth();

  if (!user || !user.profile) return null;

  return (
    <div className="mt-2 px-4 py-2">
      <div className="flex items-center space-x-3 rounded-md border p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
          <span className="text-sm font-medium text-primary-foreground">
            {user.profile.name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{user.profile.name || user.email?.split('@')[0]}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
