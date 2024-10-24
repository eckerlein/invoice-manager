import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sections/AppSidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
      </main>
    </SidebarProvider>
  );
}
