
import { Activity, MessageSquareText } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";

export function SidebarMainSection() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItemComponent 
            to="/dashboard" 
            icon={Activity} 
            label="Dashboard & Analytics" 
            isActive={isActive("/dashboard")}
          />
          <SidebarMenuItemComponent 
            to="/comments" 
            icon={MessageSquareText} 
            label="Comments" 
            isActive={isActive("/comments")}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
