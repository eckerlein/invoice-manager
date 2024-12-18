import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Link,
  ReactNode,
  ToOptions,
  useRouterState,
} from "@tanstack/react-router";
import { Contact, File, Home } from "lucide-react";

type Item = {
  title: string;
  icon: ReactNode;
  to: ToOptions["to"];
};

const items: Item[] = [
  {
    title: "Dashboard",
    icon: Home,
    to: "/",
  },
  {
    title: "Invoices",
    icon: File,
    to: "/invoices",
  },
  {
    title: "Contacts",
    icon: Contact,
    to: "/contacts",
  },
];

export function AppSidebar() {
  const active = useRouterState().matches.at(-1)?.fullPath;
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger
          className={`ml-auto transition-all duration-300 ${open ? "w-10 h-10" : "mt-2"}`}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      (active
                        ?.split("/")
                        .filter((part) => part !== "")
                        .at(0) ?? "") === item.to?.replace("/", "")
                    }
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
