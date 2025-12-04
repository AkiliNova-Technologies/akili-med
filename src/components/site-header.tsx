import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  MessageSquareText, 
  MoreVertical,
  LogOut,
  
} from "lucide-react";
import { type ReactNode } from "react";
import { useReduxAuth } from "@/hooks/useReduxAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  rightActions?: ReactNode;
  label?: string;
}

export function SiteHeader({ rightActions, label }: SiteHeaderProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useReduxAuth();

  const getPageTitle = (pathname: string) => {
    const pathWithoutAdmin = pathname.replace(/^\/admin\/?/, "");

    if (!pathWithoutAdmin) return "Dashboard";

    if (
      pathname === "/admin" ||
      pathname === "/admin/" ||
      pathname === "/seller" ||
      pathname === "/seller/"
    )
      return "Dashboard";

    const segments = pathname
      .split("/")
      .filter((segment) => segment.trim() !== "");
    const lastSegment = segments[segments.length - 1];

    const words = lastSegment.split("-");
    const formattedTitle = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedTitle;
  };

  const pageTitle = getPageTitle(location.pathname);

  const getInitials = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0).toUpperCase()}${user.lastName
        .charAt(0)
        .toUpperCase()}`;
    }

    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }

    if (user?.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }

    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }

    return "A";
  };

  // Mobile Popover Menu - Minimal version
  const MobilePopoverMenu = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 relative"
          aria-label="Open menu"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="absolute top-0 -right-0 bg-destructive text-destructive-foreground text-[10px] rounded-full h-2 w-2 flex items-center justify-center">
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-1.5" 
        align="end" 
        sideOffset={10}
        side="bottom"
      >
        {/* User Info - Minimal */}
        <div className="flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-md hover:bg-muted/50 transition-colors">
          <Avatar className="h-7 w-7 rounded-sm">
            <AvatarImage src="/avatars/user.jpg" alt="User" />
            <AvatarFallback className="rounded-sm bg-primary/10 text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName || user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <div className="border-t my-1.5" />

        {/* Messages */}
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start gap-2 h-8 text-sm px-2"
          onClick={() => console.log("Messages")}
        >
          <MessageSquareText className="h-3.5 w-3.5" />
          <span>Messages</span>
          <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start gap-2 h-8 text-sm px-2"
          onClick={() => console.log("Notifications")}
        >
          <Bell className="h-3.5 w-3.5" />
          <span>Notifications</span>
          <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </Button>


        {/* Custom Actions */}
        {rightActions && (
          <>
            <div className="border-t my-1.5" />
            <div className="px-1">
              {rightActions}
            </div>
          </>
        )}

        <div className="border-t my-1.5" />


        {/* Logout */}
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start gap-2 h-8 text-sm px-2 text-destructive hover:text-destructive"
          onClick={() => console.log("Logout")}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log Out</span>
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <header className="sticky top-0 z-50 flex h-14 md:h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex w-full items-center justify-between px-3 md:px-4">
        {/* Left side - Page title and sidebar trigger */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className={cn(
            "h-8 w-8 md:h-9 md:w-9",
            "hover:bg-accent hover:text-accent-foreground"
          )} />
          
          <Separator
            orientation="vertical"
            className="h-4 mx-1.5 hidden sm:block"
          />
          
          <h1 className={cn(
            "text-base md:text-lg font-medium truncate max-w-[140px] sm:max-w-[200px] md:max-w-none",
            !isMobile && "ml-1"
          )}>
            {label ? label : pageTitle}
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {isMobile ? (
            // Mobile: Single menu button + avatar
            <>
            <div className="flex flex-row items-center gap-5">

              <MobilePopoverMenu />
              <Avatar className="h-8 w-8 rounded-sm border">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="rounded-sm bg-primary/10 text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            </>
          ) : (
            // Desktop: All buttons visible
            <>
              {/* Custom right actions */}
              {rightActions && (
                <div className="flex items-center gap-1">
                  {rightActions}
                  <Separator orientation="vertical" className="h-4 mx-1" />
                </div>
              )}

              {/* Messages button - smaller on tablet */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 md:h-9 md:w-9 relative"
                aria-label="Messages"
              >
                <MessageSquareText className="h-4 w-4 md:h-[18px] md:w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>

              {/* Notifications button - smaller on tablet */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 md:h-9 md:w-9 relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 md:h-[18px] md:w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User avatar - smaller on tablet */}
              <Avatar className="h-8 w-8 md:h-9 md:w-9 rounded-sm border">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="rounded-sm bg-primary/10 text-xs md:text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* User info - only on larger screens */}
              <div className="hidden lg:block ml-2">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName || user?.username || "User"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.roles || "Medical Staff"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}