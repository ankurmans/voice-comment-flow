
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
          <button type="button">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ) : (
          <Link to={to}>
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}
