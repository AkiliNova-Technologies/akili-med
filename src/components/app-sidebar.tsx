import * as React from "react";
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  Package,
  TrendingDown,
  BarChart3,
  Settings,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { images } from "@/assets/images";
import { cn } from "@/lib/utils";

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview and analytics",
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
      description: "Schedule and manage appointments",
    },
    {
      title: "Patients",
      url: "/dashboard/patients",
      icon: Users,
      description: "Patient records and profiles",
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
      description: "Billing and invoices",
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: CreditCard,
      description: "Payment processing and tracking",
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
      description: "Medical supplies and products",
    },
    {
      title: "Expenses",
      url: "/dashboard/expenses",
      icon: TrendingDown,
      description: "Expense tracking and management",
    },
    {
      title: "Contacts",
      url: "/dashboard/contacts",
      icon: Users,
      description: "Staff and external contacts",
    },
    {
      title: "Communications",
      url: "/dashboard/communications",
      icon: MessageSquare,
      description: "Messages and communication logs",
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
      description: "Analytics and reports",
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      description: "System and account settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* logo section */}
      <SidebarHeader className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "h-16 hover:bg-transparent text-white hover:text-white",
                "group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:px-2"
              )}
            >
              <Link to="#">
                {/* Logo container that adapts to sidebar state */}
                <div className="flex items-center gap-3 w-full">
                  {/* Logo image that scales with sidebar */}
                  <div className={cn(
                    "relative flex items-center justify-center",
                    "transition-all duration-200 ease-in-out",
                    "group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
                  )}>
                    <img 
                      src={images.Logo} 
                      alt="Akili Med Logo" 
                      className={cn(
                        "h-8 w-auto min-w-8 object-contain",
                        "group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:min-w-6",
                        "transition-all duration-200 ease-in-out"
                      )}
                    />
                  </div>
                  
                  {/* Text that hides when sidebar is collapsed */}
                  <span className={cn(
                    "text-xl font-bold tracking-tight transition-all duration-200",
                    "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden",
                    "bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
                  )}>
                    AkiliMed
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto px-0" />
      </SidebarContent>
      <SidebarFooter className="px-0 bg-[#083344]">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
