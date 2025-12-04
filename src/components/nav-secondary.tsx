"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if a menu item is active
  const isActive = (url: string) => {
    // Exact match
    if (currentPath === url) return true;

    // For nested routes, check if current path starts with the url
    // if (url !== "/" && currentPath.startsWith(url)) return true;

    return false;
  };
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "text-white h-11 font-medium rounded-none px-4 hover:bg-[#083344] hover:text-white border-[#e11d48] group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center",
                      active
                        ? "bg-[#083344] border-l-3 border-[#e11d48] text-white"
                        : " hover:bg-[#083344]"
                    )}
                  >
                    {item.icon && (
                      <item.icon className="text-gray-300 group-data-[collapsible=icon]:mx-auto" />
                    )}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
