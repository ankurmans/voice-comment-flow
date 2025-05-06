
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarMenuItemComponent({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: SidebarMenuItemProps) {
  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton 
        asChild={!onClick}
        isActive={isActive}
        onClick={onClick}
      >
        {onClick ? (
          <button type="button" className="flex items-center gap-2 w-full">
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ) : (
          <Link to={to} className="flex items-center gap-2 w-full">
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
