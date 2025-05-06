
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarSocialItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export function SidebarSocialItem({ to, icon, label }: SidebarSocialItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to}>
          <div className="flex items-center space-x-3">
            {icon}
            <span>{label}</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
