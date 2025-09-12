"use client";

import React, { useEffect } from "react";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronUpIcon,
  Layers2Icon,
  LayoutDashboardIcon,
  User2Icon
} from "lucide-react";
import { useMonitorStore } from "@/store/monitor-store";
import AddMonitorForm from "./add-monitor-form";

const UISidebar = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const { getToken } = useAuth();

  const { monitors, initialized, initialize } = useMonitorStore();

  useEffect(() => {
    if (isLoaded && !initialized) {
      getToken().then((token) => {
        initialize(token!);
      });
    }
  }, [isLoaded, initialized, initialize]);

  return (
    <Sidebar className="border-none px-2">
      <SidebarHeader className="pt-6 px-2 border-b">
        <SidebarMenuItem className="flex items-center space-x-2">
          <Link href={"/dashboard"} className="w-full">
            <SidebarMenuButton className="cursor-pointer">
              <div className="font-semibold">StatusDeck</div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton
                    className="w-full justify-start cursor-pointer"
                    isActive={pathname === "/dashboard"}
                  >
                    <LayoutDashboardIcon className="w-4 h-4" />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/monitors">
                  <SidebarMenuButton
                    className="w-full justify-start cursor-pointer"
                    isActive={pathname === "/dashboard/monitors"}
                  >
                    <Layers2Icon className="w-4 h-4" />
                    Monitors
                    <SidebarMenuBadge>{monitors.length || 0}</SidebarMenuBadge>
                  </SidebarMenuButton>
                </Link>
                <SidebarMenuSub>
                  {monitors.slice(0, 3).map((project) => (
                    <SidebarMenuSubItem key={project.id}>
                      <SidebarMenuSubButton
                        className="w-full justify-start cursor-pointer"
                        isActive={
                          pathname === `/dashboard/monitors/${project.id}`
                        }
                        href={`/dashboard/monitors/${project.id}`}
                      >
                        {project.name}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  <SidebarMenuSubItem>
                    <AddMonitorForm style="ghost" />
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2Icon /> {user?.firstName || "Account"}
                <ChevronUpIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[200px]">
              <Link href="/dashboard/account">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem asChild className="w-full">
                <SignOutButton redirectUrl="/sign-in" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UISidebar;
