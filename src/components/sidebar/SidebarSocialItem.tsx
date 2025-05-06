
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarSocialItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isExternal?: boolean;
  onClick?: () => void;
}

export function SidebarSocialItem({ to, icon, label, isExternal, onClick }: SidebarSocialItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isExternal) {
      window.location.href = to;
    }
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
