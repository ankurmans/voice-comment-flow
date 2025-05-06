
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarSocialItemProps {
  to: string;
  icon: LucideIcon | React.ReactNode;
  label: string;
}

export function SidebarSocialItem({ to, icon, label }: SidebarSocialItemProps) {
  // If icon is a component (like Google SVG), render it directly
  const isLucideIcon = typeof icon !== 'string' && 'type' in (icon as any);
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to}>
          {isLucideIcon ? (
            <>
              {icon}
              <span>{label}</span>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              {icon}
              <span>{label}</span>
            </div>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
