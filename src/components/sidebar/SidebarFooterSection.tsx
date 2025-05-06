
import { Settings, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { useAuth } from "@/contexts/AuthContext";

export function SidebarFooterSection() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItemComponent 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={isActive("/settings")}
          />
          <SidebarMenuItemComponent 
            to="#" 
            icon={LogOut} 
            label="Logout" 
            onClick={logout}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
