import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-transparent data-[state=open]:text-sidebar-accent-foreground rounded-none hover:bg-transparent gap-3"
            >
              <Avatar className="h-8 w-8 rounded-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-sm bg-[#0891b2] text-white">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight text-white">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-white">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <Link to="/dashboard/account">
                <DropdownMenuItem className="h-11 rounded-none">
                  <UserCircleIcon />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link to="/">
              <DropdownMenuItem className="h-11 rounded-none">
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
