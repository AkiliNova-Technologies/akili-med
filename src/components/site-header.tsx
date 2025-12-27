// src/components/site-header.tsx (updated with enhanced theme)
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  MoreVertical,
  UserCircle,
  Sun,
  Moon,
  Monitor,
  Check
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
import { useTheme } from "@/providers/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SiteHeaderProps {
  rightActions?: ReactNode;
  label?: string;
}

export function SiteHeader({ rightActions, label }: SiteHeaderProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, getUserName, getInitials, getUserRoleDisplay } = useReduxAuth();
  const { theme, actualTheme, setTheme } = useTheme();

  const getPageTitle = (pathname: string) => {
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return "Dashboard";
    }

    const segments = pathname
      .split("/")
      .filter((segment) => segment.trim() !== "" && segment !== "dashboard");
    
    if (segments.length === 0) return "Dashboard";
    
    const lastSegment = segments[segments.length - 1];
    const words = lastSegment.split("-");
    const formattedTitle = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedTitle;
  };

  const pageTitle = getPageTitle(location.pathname);


  // Theme dropdown component
  const ThemeDropdown = () => (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-9 md:w-9"
          aria-label="Theme settings"
        >
          {actualTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-3 w-3xs">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
          {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
          {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
          {theme === "system" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Mobile Popover Menu
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
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-1.5" 
        align="end" 
        sideOffset={10}
        side="bottom"
      >
        {/* User Info */}
        <div className="flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-md hover:bg-muted/50 transition-colors">
          <Avatar className="h-7 w-7 rounded-sm">
            <AvatarFallback className="rounded-sm bg-primary/10 text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {getUserName()}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <div className="border-t my-1.5" />

        {/* Theme Options in Mobile Menu */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground mb-1">Theme</p>
          <div className="flex gap-1">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8"
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="border-t my-1.5" />

        {/* Account Links */}
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start gap-2 h-8 text-sm px-2"
          onClick={() => window.location.href = "/dashboard/profile"}
        >
          <UserCircle className="h-3.5 w-3.5" />
          <span>Profile</span>
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          className="w-full justify-start gap-2 h-8 text-sm px-2"
          onClick={() => window.location.href = "/dashboard/account"}
        >
          <UserCircle className="h-3.5 w-3.5" />
          <span>Account</span>
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
              <MobilePopoverMenu />
              <Avatar className="h-8 w-8 rounded-sm border">
                <AvatarFallback className="rounded-sm bg-primary/10 text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
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

              {/* Theme Dropdown */}
              <ThemeDropdown />

              {/* Notifications button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 md:h-9 md:w-9 relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 md:h-[18px] md:w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center dark:text-white text-white">
                  3
                </span>
              </Button>

              {/* User avatar */}
              <Avatar className="h-8 w-8 md:h-9 md:w-9 md:ml-2 rounded-sm border">
                <AvatarFallback className="rounded-sm bg-primary/10 text-xs md:text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* User info */}
              <div className="hidden lg:block ml-2">
                <p className="text-sm font-medium leading-none">
                  {getUserName()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getUserRoleDisplay()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}