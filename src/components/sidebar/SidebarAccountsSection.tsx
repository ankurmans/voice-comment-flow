
import { Users, PlusCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";

export function SidebarAccountsSection() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Accounts</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItemComponent 
            to="/accounts" 
            icon={Users} 
            label="Social Accounts" 
            isActive={isActive("/accounts")}
          />
          <SidebarMenuItemComponent 
            to="/brand-voice" 
            icon={PlusCircle} 
            label="Brand Voice" 
            isActive={isActive("/brand-voice")}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
