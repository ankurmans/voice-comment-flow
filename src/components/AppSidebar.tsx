
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarMainSection } from "./sidebar/SidebarMainSection";
import { SidebarAccountsSection } from "./sidebar/SidebarAccountsSection";
import { SidebarConnectSection } from "./sidebar/SidebarConnectSection";
import { SidebarFooterSection } from "./sidebar/SidebarFooterSection";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          {expanded ? (
            <span className="text-xl font-bold tracking-tight text-primary">
              Driply
            </span>
          ) : (
            <span className="text-xl font-bold tracking-tight text-primary">DP</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMainSection />
        <SidebarAccountsSection />
        <SidebarConnectSection />
      </SidebarContent>

      <SidebarFooter className="py-2">
        <SidebarFooterSection />
        {expanded && user && <SidebarUserProfile />}
      </SidebarFooter>
    </Sidebar>
  );
}
