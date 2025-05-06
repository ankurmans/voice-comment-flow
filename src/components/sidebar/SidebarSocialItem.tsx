
import { useNavigate } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarSocialItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export function SidebarSocialItem({ to, icon, label }: SidebarSocialItemProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
  };
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={handleClick}>
        <div className="flex items-center space-x-3">
          {icon}
          <span>{label}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
