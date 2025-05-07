import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarSocialItem } from "./SidebarSocialItem";
import { socialAccountsApi, userDataApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SidebarConnectSection() {
  const { toast } = useToast();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Check for successful connection on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get("connected");
    const error = params.get("error");
    
    if (connected === "instagram") {
      toast({
        title: "Instagram Connected",
        description: "Your Instagram account was successfully connected.",
      });
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error || "Failed to connect Instagram account.",
      });
    }
  }, [location.search, toast]);

  // Google/Yelp icon
  const GoogleIcon = (
    <svg
      className="h-5 w-5 social-icon social-icon-google"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );
  
  // TikTok icon
  const TikTokIcon = (
    <svg 
      className="h-5 w-5 social-icon social-icon-tiktok"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 008.86 5.88c.92-.74 2.12-1.13 3.3-1.13 1.8 0 3.46.88 4.45 2.33v-1.26zm-4.3-2.96a5.715 5.715 0 012.79.73V2.83h-2.79zM6.33 8.6v-2h.7c-.1-.23-.19-.46-.25-.7h-3.4v7.57c0 2.77 2.24 5.02 5.02 5.02v-2.62c-1.33 0-2.41-1.08-2.41-2.4V8.6h.34z" />
      <path d="M9.38 17.45a2.4 2.4 0 01-2.39-2.25v-4.7a5.996 5.996 0 01-1.39.17h-.47v2.36c0 2.5 2.03 4.53 4.53 4.53s4.53-2.03 4.53-4.53v-2.4C12 11.57 9.62 14.27 9.38 17.45zm10.8-13.28V2.53h-2.1v1.64h-.03a4.278 4.278 0 00-4.44-2.35c-1.18 0-2.38.39-3.3 1.13a4.26 4.26 0 107.77 2.35v4.47s2.31-.14 2.31-.14c0-1.6 0-5.07 0-5.07l-.21.01z" />
      <path d="M17.22 10.08h-.01v-.69a4.249 4.249 0 01-2.32-7.57 4.25 4.25 0 00-5.96 3.96 4.271 4.271 0 007 3.27v1.14c-.52-.17-1.08-.26-1.66-.26-3.09 0-5.59 2.5-5.59 5.59 0 3.09 2.5 5.59 5.59 5.59 3.09 0 5.59-2.5 5.59-5.59 0-1.88-.93-3.55-2.34-4.57h-.3v-.87z" />
    </svg>
  );
  
  // WhatsApp icon
  const WhatsAppIcon = (
    <svg 
      className="h-5 w-5 social-icon social-icon-whatsapp"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
  
  // Yelp icon
  const YelpIcon = (
    <svg 
      className="h-5 w-5 social-icon social-icon-yelp"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M17.703 13.188l4.025.653c.812.132 1.109.385.906.935a10.819 10.819 0 01-2.203 3.08c-.531.547-1.04.559-1.672.123l-3.525-2.426c-.467-.322-.55-.834-.247-1.187.402-.467.905-.467 1.378-.252l1.338.677zm-2.976 1.09l3.934 2.713c.496.342.539.875.137 1.389-.944 1.208-2.087 2.097-3.465 2.676-.629.261-1.057.103-1.286-.595l-1.36-4.127c-.202-.607.006-.979.531-1.175.506-.19.908.006 1.33.355l.179.764zm-2.842 1.673l.227 4.765c.023.539-.279.868-.824.926a10.834 10.834 0 01-3.854-.433c-.77-.242-.909-.737-.639-1.451l1.513-3.998c.197-.521.652-.741 1.058-.552.542.253.724.685.627 1.203l-1.108.54zM8.75 7.98l-3.792-.067a1.33 1.33 0 00-.354-.05c-.387.001-.698.295-.72.708-.075 1.309.108 2.586.553 3.824.197.547.625.697 1.264.46l3.96-1.457c.524-.194.759-.58.623-1.055-.164-.566-.626-.645-1.193-.29a5.09 5.09 0 01-.341-.073zm1.257-2.897c.089.533.267.987.472 1.427.26.557-.056.99-.58 1.127-.537.14-.897-.092-1.137-.609l-2.33-3.534c-.315-.478-.271-.96.152-1.353a10.758 10.758 0 013.12-2.091c.652-.284 1.023-.031 1.165.673l.384 4.115c-.792.102-1.304.004-1.246.245z" />
    </svg>
  );

  const handleFacebookClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to connect Facebook",
      });
      return;
    }
    
    toast({
      title: "Facebook integration",
      description: "This is a demo. Facebook integration would require a Facebook Developer account.",
    });
  };

  const handleInstagramClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to connect Instagram",
      });
      return;
    }
    
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to connect Instagram",
      });
      return;
    }
    
    toast({
      title: "Connecting Instagram",
      description: "Redirecting to Instagram authentication...",
    });
    
    try {
      socialAccountsApi.connect("instagram");
    } catch (error) {
      console.error("Instagram connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to Instagram. Please try again later.",
      });
    }
  };

  const handleDemoIntegration = (platform: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: `You must be logged in to connect ${platform}`,
      });
      return;
    }
    
    toast({
      title: `${platform} integration`,
      description: `This is a demo. ${platform} integration would require a ${platform} Developer account.`,
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Connect</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={<Facebook className="h-5 w-5 social-icon social-icon-facebook" />}
            label="Facebook"
            onClick={handleFacebookClick}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={<Instagram className="h-5 w-5 social-icon social-icon-instagram" />}
            label="Instagram"
            onClick={handleInstagramClick}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={<Youtube className="h-5 w-5 social-icon social-icon-youtube" />}
            label="YouTube"
            onClick={() => handleDemoIntegration("YouTube")}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={TikTokIcon}
            label="TikTok"
            onClick={() => handleDemoIntegration("TikTok")}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={<Linkedin className="h-5 w-5 social-icon social-icon-linkedin" />}
            label="LinkedIn"
            onClick={() => handleDemoIntegration("LinkedIn")}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={YelpIcon}
            label="Yelp"
            onClick={() => handleDemoIntegration("Yelp")}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={GoogleIcon}
            label="Google"
            onClick={() => handleDemoIntegration("Google")}
          />
          <SidebarSocialItem
            to="/accounts?tab=connect"
            icon={WhatsAppIcon}
            label="WhatsApp"
            onClick={() => handleDemoIntegration("WhatsApp")}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
