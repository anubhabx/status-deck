"use client";

import UISidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sidebar p-2 w-full">
        <UISidebar />
        <div className="w-full h-full rounded-md bg-background shadow-lg p-4">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
